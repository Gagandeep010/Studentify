document.addEventListener('DOMContentLoaded', function () {
    var registerForm = document.getElementById("registerForm");
    var loginForm = document.getElementById("loginForm");

    if (registerForm) {
        registerForm.addEventListener("submit", registerUser);
    }

    if (loginForm) {
        loginForm.addEventListener("submit", loginUser);
    }
});

function registerUser(e) {
    e.preventDefault();
    var email = document.querySelector("#email").value;
    var username = document.querySelector("#username").value;
    var userType = document.querySelector('input[name="userType"]:checked').value;
    var password = document.querySelector("#password").value;

    // Check if user already exists
    var existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    var existingUser = existingUsers.find(u => u.username === username);

    if (existingUser) {
        alert("Username already exists. Please choose a different username.");
    } else {
        var userObj = {
            email: email,
            username: username,
            userType: userType,
            password: password
        };

        existingUsers.push(userObj);
        localStorage.setItem("users", JSON.stringify(existingUsers));
        alert("Registration successful!");

        if (userType === "student") {
            window.location.href = './Student/index.html'; 
        } else if (userType === "teacher") {
            window.location.href = './Teacher/index.html';
        }
    }
}

function loginUser(e) {
    e.preventDefault();
    var username = document.querySelector("#loginUsername").value;
    var password = document.querySelector("#loginPassword").value;

    var users = JSON.parse(localStorage.getItem("users")) || [];
    var user = users.find(u => u.username === username && u.password === password);

    if (user) {
        alert("Login successful!");
        // Save the current user's information in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Redirect to the index page after successful login
        if (user.userType === 'student') {
            window.location.href = './Student/index.html';
        } else if (user.userType === 'teacher') {
            window.location.href = './Teacher/index.html';
        }
    } else {
        alert("Login failed! Incorrect username or password.");
    }
}
