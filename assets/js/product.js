document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

      fetch('../data/products.json')
        .then(response => response.json())
        .then(data => {
            const product = data.find(p => p.id === productId);
            if (product) {
                displayProductDetails(product);
                loadReviews(product.reviews);
            } else {
                document.getElementById('productDetail').innerHTML = "<p>Proizvod nije pronađen.</p>";
            }
        })
        .catch(error => console.error('Greška prilikom učitavanja proizvoda:', error));
});

function displayProductDetails(product) {
    const productDetailElement = document.getElementById('productDetail');
    productDetailElement.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${product.image}" class="img-fluid" alt="${product.name}">
            </div>
            <div class="col-md-6">
                <h2>${product.name}</h2>
                <p>Vrsta: ${product.type}</p>
                <p>Proizvođač: ${product.manufacturer}</p>
                <p>Cena: ${product.price} RSD</p>
                <p>Ocena: ${product.rating} / 5</p>
                <p>Status: ${product.status}</p>
                <label for="quantity">Količina:</label>
                <input type="number" id="quantity" class="form-control mb-3" value="1" min="1">
                <button class="btn btn-primary" onclick="addToCart(${product.id})">Dodaj u korpu</button>
            </div>
        </div>
    `;
}

function addToCart(productId) {
    const quantity = parseInt(document.getElementById('quantity').value, 10);
    fetch('../data/products.json')
        .then(response => response.json())
        .then(data => {
            const product = data.find(p => p.id === productId);
            if (product) {
                const cartItem = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                };

                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingProductIndex = cart.findIndex(item => item.id === productId);

                if (existingProductIndex >= 0) {
                    cart[existingProductIndex].quantity += quantity;
                } else {
                    cart.push(cartItem);
                }
                localStorage.setItem('cart', JSON.stringify(cart));

                alert(`${product.name} je dodat u korpu!`);
            }
        })
        .catch(error => console.error('Greška prilikom dodavanja u korpu:', error));
}

function loadReviews(reviews) {
    const commentsSection = document.getElementById('commentsSection');
    if (reviews && reviews.length > 0) {
        reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review mb-3';
            reviewElement.innerHTML = `
                <p><strong>${review.user}</strong> (${review.rating}/5)</p>
                <p>${review.comment}</p>
                <hr>
            `;
            commentsSection.appendChild(reviewElement);
        });
    } else {
        commentsSection.innerHTML = "<p>Trenutno nema recenzija za ovaj proizvod.</p>";
    }
}
