function validateForm() {
    let isValid = true;

    // Get form elements
    const Firstname = document.getElementById("Firstname");
    const Lastname = document.getElementById("Lastname");
    const Email = document.getElementById("Email");
    const Password = document.getElementById("Password");
    const confirmPassword = document.getElementById("confirm-password");
    const Address = document.getElementById("Address");
    const Contact = document.getElementById("Contact");

    // Clear previous error messages
    document.querySelectorAll(".error-text").forEach(el => el.innerText = "");

    // Validate First Name
    if (Firstname.value.trim() === "") {
        showError(Firstname, "First name is required");
        isValid = false;
    }

    // Validate Last Name
    if (Lastname.value.trim() === "") {
        showError(Lastname, "Last name is required");
        isValid = false;
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
        showError(Email, "Enter a valid email address");
        isValid = false;
    }

    // Validate Password
    if (Password.value.length < 6) {
        showError(Password, "Password must be at least 6 characters");
        isValid = false;
    }

    // Validate Confirm Password
    if (confirmPassword.value !== Password.value) {
        showError(confirmPassword, "Passwords do not match");
        isValid = false;
    }

    // Validate Address
    if (Address.value.trim() === "") {
        showError(Address, "Address is required");
        isValid = false;
    }

    // Validate Contact Number
    const contactPattern = /^[0-9]{10}$/;
    if (!contactPattern.test(contact.value.trim())) {
        showError(contact, "Enter a valid 10-digit contact number");
        isValid = false;
    }

    return isValid;
}

// Function to display error message
function showError(input, message) {
    let errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains("error-text")) {
        errorElement = document.createElement("p");
        errorElement.classList.add("error-text");
        input.parentElement.appendChild(errorElement);
    }
    errorElement.innerText = message;
}
