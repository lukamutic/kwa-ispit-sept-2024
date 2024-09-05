let products = []; // Globalna promenljiva za čuvanje proizvoda
let cart = []; // Globalna promenljiva za čuvanje proizvoda u korpi
let cartModal; // Globalna promenljiva za modalni prozor

document.addEventListener("DOMContentLoaded", function () {
    // Inicijalizuj modal samo jednom kada je DOM potpuno učitan
    cartModal = new bootstrap.Modal(document.getElementById('cartModal'));

    // Učitaj korpu iz Local Storage
    loadCart();

    // Učitaj proizvode iz JSON fajla
    fetch('data/products.json')
        .then(response => response.json())
        .then(data => {
            products = data; // Dodeli učitane proizvode globalnoj promenljivoj
            displayProducts(products); // Prikaži proizvode na stranici
        })
        .catch(error => console.error('Greška prilikom učitavanja proizvoda:', error));
});

function displayProducts(products) {
    const filterCategory = document.getElementById('filterCategory') ? document.getElementById('filterCategory').value : "";
    const filterPrice = document.getElementById('filterPrice') ? document.getElementById('filterPrice').value : "";
    const filterRating = document.getElementById('filterRating') ? document.getElementById('filterRating').value : "";

    let filteredProducts = products;

    if (filterCategory) {
        filteredProducts = filteredProducts.filter(product => product.type === filterCategory);
    }

    if (filterPrice) {
        filteredProducts = filteredProducts.filter(product => product.price <= parseFloat(filterPrice));
    }

    if (filterRating) {
        filteredProducts = filteredProducts.filter(product => product.rating >= parseFloat(filterRating));
    }

    const productList = document.getElementById('product-list');
    if (!productList) {
        console.error('Element sa ID-jem "product-list" nije pronađen.');
        return;
    }

    productList.innerHTML = '';

    filteredProducts.forEach(product => {
        const sizesOptions = product.sizes.map(size => `<option value="${size}">${size}</option>`).join('');
        const genderOptions = product.genders.map(gender => `<option value="${gender}">${gender}</option>`).join('');

        const productCard = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title" onclick="showProductDetail(${product.id})" style="cursor:pointer;">${product.name}</h5>
                        <p class="card-text">Vrsta: ${product.type}</p>
                        <p class="card-text">Proizvođač: ${product.manufacturer}</p>
                        <p class="card-text">Cena: ${product.price} RSD</p> 
                        <p class="card-text">Ocena: ${product.rating} / 5</p>
                        <p class="card-text">Status: ${product.status}</p>
                        <label for="sizeSelect-${product.id}">Veličina:</label>
                        <select id="sizeSelect-${product.id}" class="form-select mb-2">
                            ${sizesOptions}
                        </select>
                        <label for="genderSelect-${product.id}">Pol:</label>
                        <select id="genderSelect-${product.id}" class="form-select mb-2">
                            ${genderOptions}
                        </select>
                        <label for="quantity-${product.id}">Količina:</label>
                        <input type="number" id="quantity-${product.id}" class="form-control mb-3" value="1" min="1">
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">Dodaj u korpu</button>
                    </div>
                </div>
            </div>
        `;
        productList.innerHTML += productCard;
    });
}

function addToCart(productId) {
    const selectedSize = document.getElementById(`sizeSelect-${productId}`).value;
    const selectedGender = document.getElementById(`genderSelect-${productId}`).value;
    const quantity = parseInt(document.getElementById(`quantity-${productId}`).value, 10);

    const product = products.find(p => p.id === productId);

    const existingCartItem = cart.find(item => item.id === productId && item.size === selectedSize && item.gender === selectedGender);

    if (existingCartItem) {
        existingCartItem.quantity += quantity;
    } else {
        const cartItem = {
            id: product.id,
            name: product.name,
            size: selectedSize,
            gender: selectedGender,
            price: product.price,
            quantity: quantity
        };

        cart.push(cartItem);
    }

    saveCart(); // Sačuvaj stanje korpe u Local Storage
    alert(`${product.name} je dodat u korpu!`);
    updateCartDisplay(); // Ažuriraj prikaz korpe
}

function updateQuantity(index, newQuantity) {
    cart[index].quantity = parseInt(newQuantity, 10);
    saveCart(); // Sačuvaj ažuriranu korpu
    updateCartDisplay(); // Ažuriraj prikaz korpe nakon promene količine
}

function removeFromCart(index) {
    cart.splice(index, 1); // Ukloni proizvod iz korpe
    saveCart(); // Sačuvaj ažuriranu korpu
    updateCartDisplay(); // Ažuriraj prikaz korpe nakon brisanja proizvoda
}

function calculateTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function updateCartDisplay() {
    const cartContent = cart.map((item, index) => `
        <div class="cart-item mb-3">
            <p><strong>${item.name}</strong> - Veličina: ${item.size}, Pol: ${item.gender}</p>
            <p>Cena: ${item.price} RSD</p>
            <p>Količina: <input type="number" class="form-control quantity-input" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)"></p>
            <button class="btn btn-danger mt-2" onclick="removeFromCart(${index})">Ukloni</button>
            <hr>
        </div>
    `).join('');

    const totalPrice = calculateTotal();

    const cartContentElement = document.getElementById('cartContent');
    if (cartContentElement) {
        cartContentElement.innerHTML = cartContent + `
            <div class="total-price">
                <h5>Ukupno: ${totalPrice} RSD</h5>
            </div>
        `;
    } else {
        console.error('Element sa ID-jem "cartContent" nije pronađen.');
    }

    cartModal.show(); // Prikaži već inicijalizovan modal
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function proceedToCheckout() {
    // Preusmeravanje na checkout.html stranicu
    window.location.href = "checkout.html";
}

// Dodaj event listenere za filtriranje
const filterCategoryElement = document.getElementById('filterCategory');
const filterPriceElement = document.getElementById('filterPrice');
const filterRatingElement = document.getElementById('filterRating');

if (filterCategoryElement) {
    filterCategoryElement.addEventListener('change', () => displayProducts(products));
}
if (filterPriceElement) {
    filterPriceElement.addEventListener('input', () => displayProducts(products));
}
if (filterRatingElement) {
    filterRatingElement.addEventListener('change', () => displayProducts(products));
}


function searchProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchInput)
    );

    displayProducts(filteredProducts);
}

function showProductDetail(productId) {
    window.location.href = `./product.html?id=${productId}`;
}

let selectedProductId = null; // Globalna promenljiva za praćenje proizvoda

function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);

    if (!product) {
        console.error('Proizvod nije pronađen.');
        return;
    }

    // Sačuvaj ID proizvoda za dodavanje u korpu
    selectedProductId = productId;

    // Popuni modal detaljima o proizvodu
    const productDetailContent = document.getElementById('productDetailContent');
    productDetailContent.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${product.image}" class="img-fluid" alt="${product.name}">
            </div>
            <div class="col-md-6">
                <h2>${product.name}</h2>
                <p><strong>Vrsta:</strong> ${product.type}</p>
                <p><strong>Proizvođač:</strong> ${product.manufacturer}</p>
                <p><strong>Cena:</strong> ${product.price} RSD</p>
                <p><strong>Status:</strong> ${product.status}</p>
                <label for="modalQuantity">Količina:</label>
                <input type="number" id="modalQuantity" class="form-control mb-3" value="1" min="1">
                <h4>Komentari</h4>
                <div id="reviewsSection">${loadReviews(product.reviews)}</div>
            </div>
        </div>
    `;

    // Prikaži modal
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    productModal.show();
}

// Funkcija za prikaz recenzija (reviews)
function loadReviews(reviews) {
    if (!reviews || reviews.length === 0) {
        return "<p>Nema komentara za ovaj proizvod.</p>";
    }

    return reviews.map(review => `
        <div class="review mb-3">
            <p><strong>${review.user}</strong> (${review.rating}/5)</p>
            <p>${review.comment}</p>
            <hr>
        </div>
    `).join('');
}

// Funkcija za dodavanje proizvoda u korpu iz modala
document.getElementById('addToCartBtn').addEventListener('click', function () {
    const quantity = parseInt(document.getElementById('modalQuantity').value, 10);
    addToCart(selectedProductId, quantity);

    // Zatvori modal posle pola sekunde (500 ms)
    setTimeout(function () {
        const productModal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
        productModal.hide();
    }, 500);
});

function addToCart(productId, quantityFromModal = 1) {
    const selectedSize = document.getElementById(`sizeSelect-${productId}`) ? document.getElementById(`sizeSelect-${productId}`).value : null;
    const selectedGender = document.getElementById(`genderSelect-${productId}`) ? document.getElementById(`genderSelect-${productId}`).value : null;
    const quantity = quantityFromModal || parseInt(document.getElementById(`quantity-${productId}`).value, 10);

    const product = products.find(p => p.id === productId);

    const existingCartItem = cart.find(item => item.id === productId && item.size === selectedSize && item.gender === selectedGender);

    if (existingCartItem) {
        existingCartItem.quantity += quantity;
    } else {
        const cartItem = {
            id: product.id,
            name: product.name,
            size: selectedSize,
            gender: selectedGender,
            price: product.price,
            quantity: quantity
        };

        cart.push(cartItem);
    }

    saveCart(); // Sačuvaj stanje korpe u Local Storage
    alert(`${product.name} je dodat u korpu!`);
    updateCartDisplay(); // Ažuriraj prikaz korpe
}


// Provera statusa prijave (da li je korisnik prijavljen)
function checkSession() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const authMessageElement = document.getElementById('auth-message');
    const storeContentElement = document.getElementById('store-content');

    if (!user) {
        // Ako korisnik nije prijavljen, prikaži poruku i dugmad za login/registraciju
        authMessageElement.innerHTML = `
            <div class="alert alert-info text-center">
                <h4>Potrebno je da se ulogujete kako biste pristupili prodavnici</h4>
                <div class="mt-4">
                    <a href="./login.html" class="btn btn-primary me-3">Prijavi se</a>
                    <a href="./register.html" class="btn btn-secondary">Registruj se</a>
                </div>
            </div>
        `;
    } else {
        // Ako je korisnik prijavljen, ukloni poruku i prikaži sadržaj prodavnice
        authMessageElement.innerHTML = '';
        storeContentElement.style.display = 'block';
        loadProducts(); // Prikaži proizvode
    }
}

// Funkcija za prikaz proizvoda (koju već koristiš u main.js)
function loadProducts() {
    const productListElement = document.getElementById('product-list');
    // Ovde dolazi tvoja postojeća logika za dinamičko dodavanje proizvoda
    productListElement.innerHTML = `
        <div class="col-md-4 mb-4">
            <div class="card">
                <img src="path/to/image.jpg" class="card-img-top" alt="Proizvod 1">
                <div class="card-body">
                    <h5 class="card-title">Proizvod 1</h5>
                    <p class="card-text">Cena: 1000 RSD</p>
                    <button class="btn btn-primary" onclick="addToCart(1)">Dodaj u korpu</button>
                </div>
            </div>
        </div>
    `;
}

// Prikaz proizvoda će koristiti tvoju funkciju za dinamičko popunjavanje liste proizvoda.

