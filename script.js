const continueBtn = document.getElementById("continueOrder");
const specialBanner = document.getElementById("openSpecialModal");
const orderModal = document.getElementById("orderModal");
const specialModal = document.getElementById("specialModal");
const closeOrderBtn = document.getElementById("closeOrderModal");
const closeSpecialBtn = document.getElementById("closeSpecialModal");
const addSpecialToOrderBtn = document.getElementById("addSpecialToOrder");
const selectedProductsDiv = document.getElementById("selectedProducts");
const fulfillmentButtons = document.querySelectorAll(".fulfil-btn");
const addressWrap = document.getElementById("addressWrap");
const deliveryAddressInput = document.getElementById("deliveryAddressInput");
const expectedDateInput = document.getElementById("expectedDate");

let normalOrderItems = [];
let specialOrderItems = [];
let selectedFulfillment = "pickup";

function renderOrderItems() {
    selectedProductsDiv.innerHTML = "";

    const combinedItems = [...specialOrderItems, ...normalOrderItems];

    combinedItems.forEach(item => {
        selectedProductsDiv.innerHTML += `
        <div class="product-form">
            <h3>${item.name}</h3>
            <input type="number" min="1" value="1" class="quantity" placeholder="Quantity">
            <input type="text" class="colour" placeholder="Colour">
            <input type="text" class="message" placeholder="Text on product">
            <textarea class="notes" placeholder="Special instructions"></textarea>
        </div>
        `;
    });
}

function gatherNormalOrderItems() {
    const selectedItems = document.querySelectorAll(".menu-item input:checked");

    const items = [];
    selectedItems.forEach(item => {
        const row = item.closest(".menu-item");
        const productName = row.querySelector("span").textContent;
        items.push({ name: productName });
    });

    normalOrderItems = items;
}

continueBtn.addEventListener("click", () => {
    gatherNormalOrderItems();

    if (normalOrderItems.length === 0 && specialOrderItems.length === 0) {
        alert("Please select at least one item.");
        return;
    }

    renderOrderItems();
    orderModal.style.display = "block";
});

specialBanner.addEventListener("click", () => {
    specialModal.style.display = "block";
});

closeOrderBtn.addEventListener("click", () => {
    orderModal.style.display = "none";
});

closeSpecialBtn.addEventListener("click", () => {
    specialModal.style.display = "none";
});

window.addEventListener("click", e => {
    if (e.target === orderModal) {
        orderModal.style.display = "none";
    }
    if (e.target === specialModal) {
        specialModal.style.display = "none";
    }
});

addSpecialToOrderBtn.addEventListener("click", () => {
    const selectedSpecialItems = document.querySelectorAll(".special-check:checked");

    if (selectedSpecialItems.length === 0) {
        alert("Please select at least one special cake.");
        return;
    }

    const items = [];
    selectedSpecialItems.forEach(item => {
        const row = item.closest(".special-item");
        const productName = row.querySelector(".special-name").textContent;
        items.push({ name: productName });
    });

    specialOrderItems = items;
    renderOrderItems();
    specialModal.style.display = "none";
    orderModal.style.display = "block";
});

fulfillmentButtons.forEach(button => {
    button.addEventListener("click", () => {
        fulfillmentButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        selectedFulfillment = button.dataset.type;
        addressWrap.style.display = selectedFulfillment === "delivery" ? "block" : "none";
    });
});

document.getElementById("sendWhatsapp").addEventListener("click", () => {
    const forms = document.querySelectorAll(".product-form");
    if (forms.length === 0) {
        alert("Please add at least one item to your order before sending.");
        return;
    }

    let message = "🍰 MUNTY DELIGHTS ORDER\n\n";
    message += `Fulfilment: ${selectedFulfillment === "delivery" ? "Delivery" : "Pickup"}\n`;
    if (selectedFulfillment === "delivery") {
        const address = deliveryAddressInput.value.trim();
        message += `Address: ${address || "(no address provided)"}\n`;
    }
    if (expectedDateInput.value) {
        message += `Expected Date: ${expectedDateInput.value}\n`;
    }
    message += "\n";

    forms.forEach(form => {
        const name = form.querySelector("h3").textContent;
        const quantity = form.querySelector(".quantity").value;
        const colour = form.querySelector(".colour").value;
        const text = form.querySelector(".message").value;
        const notes = form.querySelector(".notes").value;

        message += `Product: ${name}\nQuantity: ${quantity}\nColour: ${colour}\nText: ${text}\nNotes: ${notes}\n\n`;
    });

    const phone = "254708145341";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
});