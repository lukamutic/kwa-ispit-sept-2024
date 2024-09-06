 function loadCart() {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
}

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

function generateOrderNumber() {
    const now = new Date();
    return `ORD-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getTime()}`;
}

function finalizeOrder() {
    const fullName = document.getElementById('fullName').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const orderButton = document.querySelector('button[onclick="finalizeOrder()"]');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailPattern.test(email);
    const phonePattern = /^\d{10,15}$/;
    const isPhoneValid = phonePattern.test(phone);

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

    orderButton.disabled = true;
    orderButton.innerText = "Narudžbina je poslata";

    const cart = loadCart();
    const orderNumber = generateOrderNumber();
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

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

    localStorage.removeItem('cart');
}

function goToHome() {
    const params = window.location.search;
    window.location.href = `../index.html${params}`;
}

document.addEventListener("DOMContentLoaded", displayOrderSummary);
