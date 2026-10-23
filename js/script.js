const products = [
    {id: "sourdough", name: "Sourdough", category: "Breads", price: "Full: $8 | Half: $4"},
    {id: "whole-grain", name: "Whole Grain", category: "Breads", price: "Full: $12 | Half: $6"},
    {id: "rye", name: "Rye", category: "Breads", price: "Full: $10 | Half: $5"},
    {id: "baguette", name: "Baguette", category: "Breads", price: "Full: $12 | Half: $7"},
    {id: "butter-croissant", name: "Butter Croissant", category: "Pastries", price: "$4"},
    {id: "cinnamon-roll", name: "Cinnamon Roll", category: "Pastries", price: "$5"},
    {id: "seasonal-fruit-danish", name: "Seasonal Fruit Danish", category: "Pastries", price: "$4-$6"},
    {id: "eclair", name: "Eclair", category: "Pastries", price: "$4"},
    {id: "layer-cake", name: "Classic 4 Layer Cake (8-inch Diameter)", category: "Cakes", price: "$35-$45"},
    {id: "cupcakes", name: "Cupcakes (Dozen)", category: "Cakes", price: "$26-$31"},
    {id: "custom-celebration-cake", name: "Custom Celebration Cake", category: "Cakes", price: "$65-$120"}
];
let favorites = [];

function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function loadFavorites() {
    const saved = localStorage.getItem("favorites");
    if (saved !== null) {
        favorites = JSON.parse(saved);
    }
}

function toggleFavorite(productId) {
    if (favorites.includes(productId)) {
        const position = favorites.indexOf(productId);
        favorites.splice(position, 1);
    } else {
        favorites.push(productId);
    }
    saveFavorites();
    renderFavorites();
    renderProducts();
}

function renderFavorites() {
    const list = document.getElementById("favorites-list");
    list.innerHTML = "";

    for (const product of products) {
        if (favorites.includes(product.id)) {
            const item = document.createElement("li");
            item.textContent = product.name + " - " + product.price;
            list.appendChild(item);
        }
    }

    const emptyMessage = document.getElementById("favorites-empty");
    if (favorites.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }
}

function renderCategory(category, listId) {
    const list = document.getElementById(listId);
    list.innerHTML = "";

    for (const product of products) {
        if (product.category === category) {
            const item = document.createElement("li");
            item.textContent = product.name + " - " + product.price;
            
            const button = document.createElement("button");
            if (favorites.includes(product.id)) {
                button.textContent = "\u2665";
            } else {
                button.textContent = "\u2661";
            }
            button.className = "fav-button";
            button.addEventListener("click", function () {
                toggleFavorite(product.id);
            });
            item.appendChild(button);
                        
            list.appendChild(item);
        }
    }
}   

function renderProducts() {
    renderCategory("Breads", "breads-list");
    renderCategory("Pastries", "pastries-list");
    renderCategory("Cakes", "cakes-list");
}

function prefillOrderForm() {
    const details = document.getElementById("item-details");
    const names = [];

    for (const product of products) {
        if (favorites.includes(product.id)) {
            names.push(product.name);
        }
    }

    if (names.length > 0) {
        details.value = "Favorites: " + names.join(", ");
    }
}

function showError(fieldId, message) {
    const errorSpot = document.getElementById(fieldId + "-error");
    errorSpot.textContent = message;
}

function clearError(fieldId) {
    const errorSpot = document.getElementById(fieldId + "-error");
    errorSpot.textContent = "";
}
function validateForm() {
    let isValid = true;

    const name = document.getElementById("name").value.trim();
    if (name === "") {
        showError("name", "Please enter your name.");
        isValid = false;
    } else {
        clearError("name");
    }

    const email = document.getElementById("email").value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showError("email", "Please enter a valid email, like name@example.com");
        isValid = false;
    } else {
        clearError("email");
    }

    const details = document.getElementById("item-details").value.trim();
    if (details.length < 10) {
        showError("item-details", "Please describe your order or question (at least 10 characters).");
        isValid = false;
    } else {
        clearError("item-details");
    }
    
    return isValid;
}
function handleSubmit(event) {
    event.preventDefault();
    const successMessage = document.getElementById("form-sucess");

    if (validateForm()) {
        successMessage.textContent = "Thank you! We received your request and will get back to you within one business day.";
        document.getElementById("order-form").reset();
    } else {
        successMessage.textContent = "";
    }
}
loadFavorites();

if (document.getElementById("breads-list") !== null) {
    renderProducts();
    renderFavorites();
}

if (document.getElementById("item-details") !== null) {
    prefillOrderForm();
    document.getElementById("order-form").addEventListener("submit", handleSubmit);
}