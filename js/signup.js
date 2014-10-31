/*
    Signup Form Script
    This script will load the state select list and validate the form before submission
*/

"use strict";

//Call onReady() when DOMContentLoaded event is raised
document.addEventListener('DOMContentLoaded', onReady);

//This function is called when the DOM is loaded
function onReady() {

	var signup = document.getElementById('signup');
	var occupation = signup.elements['occupation'];
	var occOther = signup.elements['occupationOther'];
	var stateSelect = signup.elements['state'];
	var count;
	var option;
	var state;
 
    //Loads the states options for the 'state' field of the form
	for (count = 0; count < usStates.length; count++) {
		option = document.createElement('option');
		state = usStates[count];
		option.value = state.code;
		option.innerHTML = state.name;
		stateSelect.appendChild(option);
	}

    //adds an event listener for 'change' event on the Occupation field that
    //displays the 'occupationOther' field if the person selects 'other'.
	occupation.addEventListener('change', function() {
		if (occupation.value == 'other') {
			occOther.style.display = 'block';
		} else {
			occOther.value = "";
			occOther.style.display = 'none';
		}
	});

    //adds an event listener for the 'click' event on the 'No Thanks' button.
    //Takes user to google.com after he/she confirms.
	var cancelButton = document.getElementById('cancelButton');
	cancelButton.addEventListener('click', function() {
		if (window.confirm('Are you sure you really want to leave the page and not subscribe?')) {
			window.location = 'http://google.com';
		}
	});

    //adds an event listener for the 'submit' event, passing onSubmit as the event handler function 
	signup.addEventListener('submit', onSubmit);
}

 //Called when the user attempts to submit the form
 //This happens when the user clicks the "submit" button
 //We want to make sure that the required fields
 //are filled out correctly before the form can be submit. Stops submitting if
 //form is invalid.
 //We also want to only allow the user to submit the form if he/she is 13+ years
 //Passes the event object (evt) as the parameter
function onSubmit(evt) {
    
    var valid = true;

    try {
        valid = validateForm(this);
    } catch (exception) {
        alert(exception);
        valid = false;
    }
    
    //if the form is invalid and the event object has a method called preventDefault,
    //calls it to stop the form from being submitted to the server if valid is false.
    if (!valid && evt.preventDefault) {
        evt.preventDefault();
    }

    //For older browswers. Also prevents the form from being submitted if not valid.
    evt.returnValue = valid;
    return valid;
} 

//checks if the birtdate field has a valid date. Throws error otherwise.
function validBirthday(age) {
    if (isNaN(age)) {
        throw new Error('Please enter a valid birthdate. Use the mm/dd/yyyy format.');
    } 
}

//This function validates the form's information and returns true if the form is valid or false if the form is invalid.
//It will also let the user know which fields are invalid.
//Takes the reference to the form that needs to be validated as the parameter.
function validateForm(form) {
    var requiredFields = ['firstName', 'lastName', 'address1', 'city', 'state', 'zip', 'birthdate'];
    var idx;
    var valid = true;

    for(idx = 0; idx < requiredFields.length; idx++) {
        if (!validateRequiredField(form.elements[requiredFields[idx]])) {
            valid = false;
        }
    }

    //checks if the occcupation other field is visible, if so, it becomes a required field.
    var occOther = form.elements['occupationOther'];
    if (occOther.style.display == 'block') {
        if(!validateRequiredField(occOther)) {
            valid = false;
        }
    }

    //Checks that the zip code is 5 digits.
    var zipRegExp = new RegExp('^\\d{5}$');
    var zip = signup.elements['zip'];
    var zipValue = zip.value;
    var result = zipRegExp.test(zipValue);

    if(!result) {
        valid = false;
        zip.className = 'form-control invalid-field';
        throw new Error("Please enter a valid 5 digit zip code");
    }

    //checks that the user is 13+ years old and that a valid birthdate is entered.
    var dob = form.elements['birthdate'].value;
    var age = calculateAge(dob);
    var msgElem = document.getElementById("birthdateMessage");
    validBirthday(age);
    if (age < 13) {
        msgElem.innerHTML = "You must be 13 or older to sign up.";
        valid = false;
    } else {
        msgElem.innerHTML = "";
    }

    return valid;
}


//This function validates a field that is required. If the field does not have a value, or has only spaces,
//it will mark the field as invalid and return false. Otherwise it will return true.
function validateRequiredField(field) {

    var value = field.value;
    value = value.trim();
    var valid = value.length > 0;

    if (valid) {
        field.className = 'form-control';
    } else {
        field.className = 'form-control invalid-field';
    }

    return valid;
}

//This function returns the age in years given a date of birth as a parameter.
function calculateAge(dob) {

    dob = new Date(dob);
    var today = new Date();

    var yearsDiff = today.getFullYear() - dob.getUTCFullYear();
    var monthsDiff = today.getMonth() - dob.getUTCMonth();
    var daysDiff = today.getDate() - dob.getUTCDate();

    if (monthsDiff < 0 || (0 == monthsDiff && daysDiff < 0)) {
        yearsDiff--;
    }
    return yearsDiff;
}
