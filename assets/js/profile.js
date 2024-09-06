document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        alert("Morate biti prijavljeni da biste pristupili ovoj stranici.");
        window.location.href = "../index.html";
        return;
    }

    document.getElementById('username').value = loggedInUser.username;
    document.getElementById('email').value = loggedInUser.email;
    document.getElementById('password').value = loggedInUser.password;
});

function updateProfile() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (!email || !password) {
        alert("Molimo unesite ispravne podatke.");
        return;
    }

    loggedInUser.email = email;
    loggedInUser.password = password;

    const userIndex = users.findIndex(user => user.username === loggedInUser.username);
    if (userIndex !== -1) {
        users[userIndex] = loggedInUser;
    }

    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    localStorage.setItem('users', JSON.stringify(users));

    alert("Podaci uspešno izmenjeni!");
}

function goToHome() {
    const params = window.location.search;
    window.location.href = `../index.html${params}`;
}

function goBack() {
    window.history.back();
}