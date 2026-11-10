let cart = JSON.parse(localStorage.getItem("dashCart")) || [];
let orders = JSON.parse(localStorage.getItem("dashOrders")) || [];

function saveCart() {
    localStorage.setItem("dashCart", JSON.stringify(cart));
}

function showCart() {

    let cartItems = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total");

    if (!cartItems || !cartTotal) {
        return;
    }

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        cartItems.textContent = "Your cart is empty.";
    }

    for (let i = 0; i < cart.length; i++) {

        let item = cart[i];
        let subtotal = item.price * item.quantity;

        total += subtotal;

        let itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";

        let itemName = document.createElement("p");
        itemName.textContent = item.name + " - ₱" + item.price;

        let quantity = document.createElement("p");
        quantity.textContent = "Quantity: " + item.quantity;

        let subtotalText = document.createElement("p");
        subtotalText.textContent = "Subtotal: ₱" + subtotal;

        let minusButton = document.createElement("button");
        minusButton.textContent = "-";
        minusButton.dataset.action = "minus";
        minusButton.dataset.index = i;

        let plusButton = document.createElement("button");
        plusButton.textContent = "+";
        plusButton.dataset.action = "plus";
        plusButton.dataset.index = i;

        let removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.dataset.action = "remove";
        removeButton.dataset.index = i;

        itemDiv.appendChild(itemName);
        itemDiv.appendChild(quantity);
        itemDiv.appendChild(subtotalText);
        itemDiv.appendChild(minusButton);
        itemDiv.appendChild(plusButton);
        itemDiv.appendChild(removeButton);

        cartItems.appendChild(itemDiv);
    }

    cartTotal.textContent = "Total: ₱" + total;
}

document.addEventListener("click", function(event) {

    if (event.target.classList.contains("add-to-cart")) {

        let name = event.target.dataset.name;
        let price = Number(event.target.dataset.price);

        let found = false;

        for (let i = 0; i < cart.length; i++) {

            if (cart[i].name === name) {
                cart[i].quantity++;
                found = true;
                break;
            }
        }

        if (found === false) {
            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        saveCart();
        showCart();

        alert(name + " added to cart!");
    }

});

document.addEventListener("click", function(event) {

    let action = event.target.dataset.action;

    if (action) {

        let index = Number(event.target.dataset.index);

        if (action === "plus") {
            cart[index].quantity++;
        }

        else if (action === "minus") {
            cart[index].quantity--;

            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
        }

        else if (action === "remove") {
            cart.splice(index, 1);
        }

        saveCart();
        showCart();
    }

});

let clearButton = document.getElementById("clear-cart");

if (clearButton) {

    clearButton.addEventListener("click", function() {

        if (cart.length === 0) {
            alert("Your cart is already empty.");
            return;
        }

        if (confirm("Are you sure you want to clear your cart?")) {

            cart = [];

            saveCart();
            showCart();
        }

    });

}

let searchInput = document.getElementById("search-input");
let categoryButtons = document.querySelectorAll(".category-btn");
let productCards = document.querySelectorAll(".product-grid .product-card");

let selectedCategory = "all";

function filterProducts() {

    if (!searchInput) {
        return;
    }

    let searchText = searchInput.value.toLowerCase();
    let visibleProducts = 0;

    productCards.forEach(function(card) {

        let productName = card.querySelector("h3").textContent.toLowerCase();
        let category = card.dataset.category;

        let matchesSearch = productName.includes(searchText);

        let matchesCategory =
            selectedCategory === "all" ||
            category === selectedCategory;

        if (matchesSearch && matchesCategory) {
            card.style.display = "block";
            visibleProducts++;
        } else {
            card.style.display = "none";
        }

    });

    let noProducts = document.getElementById("no-products");

    if (noProducts) {
        noProducts.style.display =
            visibleProducts === 0 ? "block" : "none";
    }
}

if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
}

categoryButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        categoryButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        filterProducts();
    });

});

let checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {

    checkoutForm.addEventListener("submit", function(event) {

        event.preventDefault();

        if (cart.length === 0) {
            alert("Please add products to your cart first.");
            return;
        }

        let customerName =
            document.getElementById("customer-name").value.trim();

        let customerPhone =
            document.getElementById("customer-phone").value.trim();

        let orderType =
            document.getElementById("order-type").value;

        let paymentMethod =
            document.getElementById("payment-method").value;

        let total = 0;

        for (let i = 0; i < cart.length; i++) {
            total += cart[i].price * cart[i].quantity;
        }

        let newOrder = {
            orderNumber: Date.now(),
            customer: customerName,
            phone: customerPhone,
            orderType: orderType,
            payment: paymentMethod,
            items: cart.map(function(item) {
                return {
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                };
            }),
            total: total,
            date: new Date().toLocaleString()
        };

        orders.push(newOrder);

        localStorage.setItem("dashOrders", JSON.stringify(orders));

        cart = [];

        saveCart();
        showCart();
        showOrders();

        let orderMessage = document.getElementById("order-message");

        orderMessage.textContent =
            "Thank you, " + customerName +
            "! Your order has been placed successfully.";

        checkoutForm.reset();

        alert("Your order has been placed!");

    });

}

function showOrders() {

    let history = document.getElementById("order-history");

    if (!history) {
        return;
    }

    history.innerHTML = "";

    if (orders.length === 0) {
        history.textContent = "No orders yet.";
        return;
    }

    for (let i = orders.length - 1; i >= 0; i--) {

        let order = orders[i];

        let orderBox = document.createElement("div");
        orderBox.className = "order-card";

        let orderTitle = document.createElement("h3");
        orderTitle.textContent = "Order #" + order.orderNumber;

        let customer = document.createElement("p");
        customer.textContent = "Customer: " + order.customer;

        let phone = document.createElement("p");
        phone.textContent = "Contact Number: " + order.phone;

        let orderType = document.createElement("p");
        orderType.textContent = "Order Type: " + order.orderType;

        let payment = document.createElement("p");
        payment.textContent = "Payment Method: " + order.payment;

        let date = document.createElement("p");
        date.textContent = "Date: " + order.date;

        let itemsTitle = document.createElement("h4");
        itemsTitle.textContent = "Ordered Products:";

        let itemList = document.createElement("ul");

        for (let j = 0; j < order.items.length; j++) {

            let item = order.items[j];

            let listItem = document.createElement("li");

            listItem.textContent =
                item.name + " x " + item.quantity +
                " - ₱" + (item.price * item.quantity);

            itemList.appendChild(listItem);
        }

        let totalText = document.createElement("h3");
        totalText.textContent = "Total: ₱" + order.total;

        orderBox.appendChild(orderTitle);
        orderBox.appendChild(customer);
        orderBox.appendChild(phone);
        orderBox.appendChild(orderType);
        orderBox.appendChild(payment);
        orderBox.appendChild(date);
        orderBox.appendChild(itemsTitle);
        orderBox.appendChild(itemList);
        orderBox.appendChild(totalText);

        history.appendChild(orderBox);
    }

}

let messageForm = document.getElementById("message-form");

if (messageForm) {

    messageForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let name = document.getElementById("name").value;

        let response = document.getElementById("form-response");

        response.textContent =
            "Thank you, " + name + "! Your message has been received.";

        messageForm.reset();

    });

}

showCart();
showOrders();
filterProducts();