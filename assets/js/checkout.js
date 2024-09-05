// Funkcija za učitavanje korpe iz `localStorage`
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
}

// Funkcija za prikaz narudžbine na checkout stranici
function displayOrderSummary() {
    const cart = loadCart();
    const orderSummaryElement = document.getElementById('orderSummary');

    if (cart.length === 0) {
        orderSummaryElement.innerHTML = "<p>Vaša korpa je prazna.</p>";
        return;
    }

    const orderSummaryContent = cart.map(item => `
        <div class="order-item mb-3">
            <h5>${item.name}</h5>
            <p><strong>Veličina:</strong> ${item.size}, <strong>Pol:</strong> ${item.gender}</p>
            <p><strong>Količina:</strong> ${item.quantity}</p>
            <p><strong>Cena po komadu:</strong> ${item.price} RSD</p>
            <p><strong>Ukupna cena za ovaj proizvod:</strong> ${item.price * item.quantity} RSD</p>
            <hr>
        </div>
    `).join('');

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    orderSummaryElement.innerHTML = `
        ${orderSummaryContent}
        <div class="total-price">
            <h4>Ukupno za plaćanje: ${totalPrice} RSD</h4>
        </div>
    `;
}

// Funkcija za generisanje jedinstvenog broja narudžbine
function generateOrderNumber() {
    const now = new Date();
    return `ORD-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getTime()}`;
}

// Funkcija za finalizaciju narudžbine sa validacijom i sprečavanjem duple narudžbine
function finalizeOrder() {
    const fullName = document.getElementById('fullName').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const orderButton = document.querySelector('button[onclick="finalizeOrder()"]');

    // Provera validnosti emaila
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailPattern.test(email);

    // Provera validnosti telefona (ovde možeš prilagoditi pravilo za telefon)
    const phonePattern = /^\d{10,15}$/; // Provera za brojeve od 10 do 15 cifara
    const isPhoneValid = phonePattern.test(phone);

    // Proveri da li su svi podaci uneti i validni
    if (!fullName || !address || !isPhoneValid || !isEmailValid) {
        let errorMessage = 'Molimo unesite ispravne podatke:\n';

        if (!fullName) {
            errorMessage += '- Ime i prezime je obavezno.\n';
        }
        if (!address) {
            errorMessage += '- Adresa je obavezna.\n';
        }
        if (!isPhoneValid) {
            errorMessage += '- Unesite važeći broj telefona (10-15 cifara).\n';
        }
        if (!isEmailValid) {
            errorMessage += '- Unesite važeću email adresu.\n';
        }

        alert(errorMessage);
        return;
    }

    // Onemogući dugme za slanje kako bi se izbegla duplirana narudžbina
    orderButton.disabled = true;
    orderButton.innerText = "Narudžbina je poslata";

    const cart = loadCart();
    const orderNumber = generateOrderNumber();
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // Prikaz obaveštenja o uspešnoj narudžbini
    const orderSummaryElement = document.getElementById('orderSummary');
    orderSummaryElement.innerHTML = `
        <div class="alert alert-success" role="alert">
            <h4 class="alert-heading">Narudžbina uspešno kreirana!</h4>
            <p>Hvala na kupovini, ${fullName}!</p>
            <hr>
            <p class="mb-0"><strong>Broj narudžbine:</strong> ${orderNumber}</p>
            <p class="mb-0"><strong>Ukupan iznos:</strong> ${totalPrice} RSD</p>
        </div>
        <button class="btn btn-primary mt-3" onclick="goToHome()">Vrati se na početnu stranicu</button>
    `;

    // Očisti samo `cart` iz `localStorage`, zadrži `loggedInUser` i `users`
    localStorage.removeItem('cart');
}

// Funkcija za preusmeravanje na početnu stranicu
// function goToHome() {
//     window.location.href = "../index.html"; // Relativna putanja iz `pages` direktorijuma do `index.html`
// }
function goToHome() {
    const params = window.location.search; // Ovo uzima sve parametre iz trenutnog URL-a
    window.location.href = `../index.html${params}`; // Dodaj ih na povratak
}


// Kada se stranica učita, prikaži narudžbinu
document.addEventListener("DOMContentLoaded", displayOrderSummary);
