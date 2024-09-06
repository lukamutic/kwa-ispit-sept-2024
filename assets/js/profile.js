document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        alert("Morate biti prijavljeni da biste pristupili ovoj stranici.");
        window.location.href = "../index.html";
        return;
    }

    // Popuni formu sa trenutnim podacima korisnika
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

    // Ažuriraj podatke u localStorage
    loggedInUser.email = email;
    loggedInUser.password = password;

    // Ažuriraj podatke i u listi korisnika
    const userIndex = users.findIndex(user => user.username === loggedInUser.username);
    if (userIndex !== -1) {
        users[userIndex] = loggedInUser;
    }

    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    localStorage.setItem('users', JSON.stringify(users));

    alert("Podaci uspešno izmenjeni!");
}

function goToHome() {
    const params = window.location.search; // Ovo uzima sve parametre iz trenutnog URL-a
    window.location.href = `../index.html${params}`; // Dodaj ih na povratak
}

function goBack() {
    window.history.back();
}