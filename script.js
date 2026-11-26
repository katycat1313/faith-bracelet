// =========================================================================
// EASY CONFIGURATION FOR MOTHER-IN-LAW'S BRACELET STORE
// Change these settings anytime to match her real prices & payment handles!
// =========================================================================
const STORE_CONFIG = {
  itemName: "Handcrafted Faith Story Bracelet",
  itemPrice: 10.00,             // Price per bracelet
  currencySymbol: "$",
  
  // Her phone number for receiving text orders (format: digits only or with dashes)
  notificationPhone: "555-123-4567",
  
  // Her email address for receiving orders
  notificationEmail: "orders@example.com",
  
  // Payment methods: Update these with her actual account handles!
  venmoHandle: "@Mom-Bracelet",
  cashAppHandle: "$MomBracelet",
  zelleInfo: "mom@example.com or 555-123-4567",
  paypalLink: "",               // e.g. "https://paypal.me/YourName"
  stripePaymentLink: ""         // e.g. "https://buy.stripe.com/..."
};

// =========================================================================
// DOM ELEMENTS & EVENT LISTENERS
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const qtyInput = document.getElementById("qty-input");
  const qtyMinus = document.getElementById("qty-minus");
  const qtyPlus = document.getElementById("qty-plus");
  const calculatedTotal = document.getElementById("calculated-total");
  const displayPrice = document.getElementById("display-price");
  const mobileStickyPrice = document.getElementById("mobile-sticky-price");
  
  // Modals
  const checkoutModal = document.getElementById("checkout-modal");
  const successModal = document.getElementById("success-modal");
  const btnOrderModal = document.getElementById("btn-order-modal");
  const btnStickyOrder = document.getElementById("btn-sticky-order");
  const btnCloseModal = document.getElementById("btn-close-modal");
  const btnDone = document.getElementById("btn-done");
  const customerOrderForm = document.getElementById("customer-order-form");
  const btnSmsOrder = document.getElementById("btn-sms-order");
  
  // Modal Summary Elements
  const modalQty = document.getElementById("modal-qty");
  const modalTotalPrice = document.getElementById("modal-total-price");
  const confirmPayAmount = document.getElementById("confirm-pay-amount");
  
  // Payment placeholders
  const displayVenmo = document.getElementById("display-venmo");
  const displayCashApp = document.getElementById("display-cashapp");
  const displayZelle = document.getElementById("display-zelle");

  if (displayVenmo) displayVenmo.textContent = STORE_CONFIG.venmoHandle;
  if (displayCashApp) displayCashApp.textContent = STORE_CONFIG.cashAppHandle;
  if (displayZelle) displayZelle.textContent = STORE_CONFIG.zelleInfo;

  // Initialize Price Display
  displayPrice.textContent = `${STORE_CONFIG.currencySymbol}${STORE_CONFIG.itemPrice.toFixed(2)}`;
  
  // Update Total & Text Message Link
  function updateTotal() {
    let qty = parseInt(qtyInput.value, 10);
    if (isNaN(qty) || qty < 1) qty = 1;
    if (qty > 25) qty = 25;
    qtyInput.value = qty;

    const total = qty * STORE_CONFIG.itemPrice;
    const formattedTotal = `${STORE_CONFIG.currencySymbol}${total.toFixed(2)}`;
    
    calculatedTotal.textContent = formattedTotal;
    if (mobileStickyPrice) mobileStickyPrice.textContent = formattedTotal;
    if (modalQty) modalQty.textContent = qty;
    if (modalTotalPrice) modalTotalPrice.textContent = formattedTotal;
    if (confirmPayAmount) confirmPayAmount.textContent = formattedTotal;

    // Update Quick SMS Order link
    if (btnSmsOrder) {
      const smsBody = encodeURIComponent(
        `Hi! I'd like to order ${qty} Handcrafted Faith Bracelet(s) for a total of ${formattedTotal}. My name is: [Name] and my shipping address is: [Address].`
      );
      btnSmsOrder.href = `sms:${STORE_CONFIG.notificationPhone}?body=${smsBody}`;
    }
  }

  // Stepper handlers
  qtyMinus.addEventListener("click", () => {
    let current = parseInt(qtyInput.value, 10) || 1;
    if (current > 1) {
      qtyInput.value = current - 1;
      updateTotal();
    }
  });

  qtyPlus.addEventListener("click", () => {
    let current = parseInt(qtyInput.value, 10) || 1;
    if (current < 25) {
      qtyInput.value = current + 1;
      updateTotal();
    }
  });

  qtyInput.addEventListener("input", updateTotal);

  // Open Checkout Modal
  function openCheckout() {
    updateTotal();
    
    // If Stripe link is provided, redirect directly to Stripe checkout!
    if (STORE_CONFIG.stripePaymentLink && STORE_CONFIG.stripePaymentLink.startsWith("http")) {
      window.location.href = STORE_CONFIG.stripePaymentLink;
      return;
    }

    if (checkoutModal) {
      checkoutModal.showModal();
    }
  }

  if (btnOrderModal) btnOrderModal.addEventListener("click", openCheckout);
  if (btnStickyOrder) btnStickyOrder.addEventListener("click", openCheckout);

  // Close Checkout Modal
  if (btnCloseModal && checkoutModal) {
    btnCloseModal.addEventListener("click", () => {
      checkoutModal.close();
    });
  }

  // Close when clicking outside modal backdrop
  [checkoutModal, successModal].forEach((dialog) => {
    if (dialog) {
      dialog.addEventListener("click", (e) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
          dialog.close();
        }
      });
    }
  });

  // Handle Form Submission
  if (customerOrderForm) {
    customerOrderForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(customerOrderForm);
      const qty = parseInt(qtyInput.value, 10) || 1;
      const totalFormatted = `${STORE_CONFIG.currencySymbol}${(qty * STORE_CONFIG.itemPrice).toFixed(2)}`;

      const orderData = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        paymentMethod: formData.get("payment_method"),
        notes: formData.get("notes") || "None",
        quantity: qty,
        total: totalFormatted,
        date: new Date().toLocaleString()
      };

      // Save order to browser storage so it's never lost
      const existingOrders = JSON.parse(localStorage.getItem("bracelet_orders") || "[]");
      existingOrders.push(orderData);
      localStorage.setItem("bracelet_orders", JSON.stringify(existingOrders));

      // Close order modal and open success modal
      checkoutModal.close();
      customerOrderForm.reset();
      updateTotal();
      
      if (successModal) {
        successModal.showModal();
      }

      // Also trigger a prefilled email notification to her
      const mailSubject = encodeURIComponent(`New Bracelet Order from ${orderData.name}`);
      const mailBody = encodeURIComponent(
        `You received a new order for ${orderData.quantity} Faith Story Bracelet(s)!\n\n` +
        `Customer: ${orderData.name}\n` +
        `Phone: ${orderData.phone}\n` +
        `Shipping Address: ${orderData.address}\n` +
        `Payment Method: ${orderData.paymentMethod}\n` +
        `Total: ${orderData.total}\n` +
        `Notes: ${orderData.notes}\n\n` +
        `Order Date: ${orderData.date}`
      );
      
      console.log("Order logged:", orderData);
    });
  }

  // Close Success Modal
  if (btnDone && successModal) {
    btnDone.addEventListener("click", () => {
      successModal.close();
    });
  }

  // Initial calculation
  updateTotal();
});
