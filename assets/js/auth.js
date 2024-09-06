function registerUser() {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !email || !password) {
        alert("Sva polja su obavezna.");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const userExists = users.some(user => user.username === username || user.email === email);
    if (userExists) {
        alert("Korisničko ime ili email već postoji.");
        return;
    }

    const newUser = {
        username: username,
        email: email,
        password: password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert("Registracija uspešna! Sada se možete prijaviti.");
    window.location.href = "./login.html";
}

function loginUser() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!username || !password) {
        alert("Unesite korisničko ime i lozinku.");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        alert("Uspešno ste prijavljeni!");
        window.location.href = "../index.html";
    } else {
        alert("Neispravno korisničko ime ili lozinka.");
    }
}

function checkSession() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
        window.location.href = "./login.html";
    } else {
        document.getElementById('welcomeMessage').innerText = `Dobrodošli, ${user.username}`;
    }
}

function logoutUser() {
    localStorage.removeItem('loggedInUser');
    window.location.href = "../index.html";
}
