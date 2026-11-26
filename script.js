// =========================================================================
// THE SALVATION BRACELET - STORE & NOTIFICATION CONFIGURATION
// =========================================================================
const STORE_CONFIG = {
  itemName: "The Salvation Story Bracelet",
  itemPrice: 10.00,             // Default price per unit
  currencySymbol: "$",
  
  // Package bundle prices
  bundles: {
    1: 10.00,
    3: 27.00,
    5: 45.00
  },

  // WEBHOOK OR GOOGLE APPS SCRIPT URL:
  // Paste your Google Apps Script Web App URL (recommended!) OR Zapier Webhook URL here:
  // Example: "https://script.google.com/macros/s/AKfycb.../exec"
  webhookUrl: "",

  // Mother-in-law's contact phone number (for SMS quick orders)
  notificationPhone: "555-123-4567",
  
  // Mother-in-law's payment handles displayed to buyers:
  venmoHandle: "@Mom-Bracelet",
  cashAppHandle: "$MomBracelet",
  zelleInfo: "mom@example.com or 555-123-4567"
};

// =========================================================================
// APPLICATION LOGIC
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const qtyInput = document.getElementById("qty-input");
  const qtyMinus = document.getElementById("qty-minus");
  const qtyPlus = document.getElementById("qty-plus");
  const calculatedTotal = document.getElementById("calculated-total");
  const btnTotalLabel = document.getElementById("btn-total-label");
  const mobileStickyPrice = document.getElementById("mobile-sticky-price");
  const bundleCards = document.querySelectorAll(".bundle-card");

  // Modals & Triggers
  const checkoutModal = document.getElementById("checkout-modal");
  const successModal = document.getElementById("success-modal");
  const btnOpenOrder = document.getElementById("btn-open-order");
  const btnStickyOrder = document.getElementById("btn-sticky-order");
  const btnCloseModal = document.getElementById("btn-close-modal");
  const btnDone = document.getElementById("btn-done");
  const scrollButtons = document.querySelectorAll(".btn-scroll-top");
  
  // Form elements
  const customerOrderForm = document.getElementById("customer-order-form");
  const submitBtnText = document.getElementById("submit-btn-text");
  const submitBtnSpinner = document.getElementById("submit-btn-spinner");
  const btnSmsOrder = document.getElementById("btn-sms-order");
  
  // Modal Summary Elements
  const modalQty = document.getElementById("modal-qty");
  const modalTotalPrice = document.getElementById("modal-total-price");
  const confirmPayAmount = document.getElementById("confirm-pay-amount");

  // Payment Display Elements
  const displayVenmo = document.getElementById("display-venmo");
  const displayCashApp = document.getElementById("display-cashapp");
  const displayZelle = document.getElementById("display-zelle");

  if (displayVenmo) displayVenmo.textContent = STORE_CONFIG.venmoHandle;
  if (displayCashApp) displayCashApp.textContent = STORE_CONFIG.cashAppHandle;
  if (displayZelle) displayZelle.textContent = STORE_CONFIG.zelleInfo;

  // Calculate Price with Bundles
  function calculatePrice(qty) {
    if (STORE_CONFIG.bundles[qty]) {
      return STORE_CONFIG.bundles[qty];
    }
    return qty * STORE_CONFIG.itemPrice;
  }

  // Update UI totals and active bundle cards
  function updateOrderDisplay() {
    let qty = parseInt(qtyInput.value, 10);
    if (isNaN(qty) || qty < 1) qty = 1;
    if (qty > 50) qty = 50;
    qtyInput.value = qty;

    const totalPrice = calculatePrice(qty);
    const formattedTotal = `${STORE_CONFIG.currencySymbol}${totalPrice.toFixed(2)}`;

    if (calculatedTotal) calculatedTotal.textContent = formattedTotal;
    if (btnTotalLabel) btnTotalLabel.textContent = formattedTotal;
    if (mobileStickyPrice) mobileStickyPrice.textContent = formattedTotal;
    if (modalQty) modalQty.textContent = qty;
    if (modalTotalPrice) modalTotalPrice.textContent = formattedTotal;
    if (confirmPayAmount) confirmPayAmount.textContent = formattedTotal;

    // Highlight matching bundle card if quantity matches
    bundleCards.forEach((card) => {
      const cardQty = parseInt(card.getAttribute("data-qty"), 10);
      if (cardQty === qty) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });

    // Update Quick SMS Order link
    if (btnSmsOrder) {
      const smsBody = encodeURIComponent(
        `Hi! I'd like to order ${qty} Salvation Story Bracelet(s) for ${formattedTotal}. My name is [Name] and my shipping address is: [Address].`
      );
      btnSmsOrder.href = `sms:${STORE_CONFIG.notificationPhone}?body=${smsBody}`;
    }
  }

  // Bundle Card Click
  bundleCards.forEach((card) => {
    card.addEventListener("click", () => {
      const selectedQty = parseInt(card.getAttribute("data-qty"), 10);
      qtyInput.value = selectedQty;
      updateOrderDisplay();
    });
  });

  // Quantity Stepper Controls
  if (qtyMinus) {
    qtyMinus.addEventListener("click", () => {
      let current = parseInt(qtyInput.value, 10) || 1;
      if (current > 1) {
        qtyInput.value = current - 1;
        updateOrderDisplay();
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener("click", () => {
      let current = parseInt(qtyInput.value, 10) || 1;
      if (current < 50) {
        qtyInput.value = current + 1;
        updateOrderDisplay();
      }
    });
  }

  if (qtyInput) {
    qtyInput.addEventListener("input", updateOrderDisplay);
  }

  // Modal Open Handler
  function openCheckoutModal() {
    updateOrderDisplay();
    if (checkoutModal) {
      checkoutModal.showModal();
    }
  }

  if (btnOpenOrder) btnOpenOrder.addEventListener("click", openCheckoutModal);
  if (btnStickyOrder) btnStickyOrder.addEventListener("click", openCheckoutModal);

  // Scroll to purchase on bottom CTA
  scrollButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Close Modal Handler
  if (btnCloseModal && checkoutModal) {
    btnCloseModal.addEventListener("click", () => {
      checkoutModal.close();
    });
  }

  // Backdrop click dismiss for dialogs
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

  // Order Submission Handler
  if (customerOrderForm) {
    customerOrderForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(customerOrderForm);
      const qty = parseInt(qtyInput.value, 10) || 1;
      const totalNumber = calculatePrice(qty);
      const totalFormatted = `${STORE_CONFIG.currencySymbol}${totalNumber.toFixed(2)}`;

      const orderPayload = {
        orderId: "ORD-" + Date.now().toString(36).toUpperCase(),
        timestamp: new Date().toISOString(),
        orderDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        buyerName: formData.get("name")?.trim(),
        phone: formData.get("phone")?.trim(),
        shippingAddress: `${formData.get("address")?.trim()}, ${formData.get("city")?.trim()}, ${formData.get("zip")?.trim()}`,
        streetAddress: formData.get("address")?.trim(),
        city: formData.get("city")?.trim(),
        zip: formData.get("zip")?.trim(),
        numberOfBracelets: qty,
        totalPaid: totalFormatted,
        totalRaw: totalNumber,
        paymentMethod: formData.get("payment_method"),
        specialNotes: formData.get("notes")?.trim() || "None",
        fulfillmentStatus: "Pending Shipment"
      };

      // Show loading indicator
      if (submitBtnText) submitBtnText.textContent = "Recording Order...";
      if (submitBtnSpinner) submitBtnSpinner.classList.remove("hidden");

      // Post to Google Apps Script or Zapier / n8n Webhook
      if (STORE_CONFIG.webhookUrl && STORE_CONFIG.webhookUrl.startsWith("http")) {
        try {
          const isGoogleScript = STORE_CONFIG.webhookUrl.includes("script.google.com");
          
          await fetch(STORE_CONFIG.webhookUrl, {
            method: "POST",
            headers: isGoogleScript ? { "Content-Type": "text/plain;charset=utf-8" } : { "Content-Type": "application/json" },
            mode: isGoogleScript ? "no-cors" : "cors",
            body: JSON.stringify(orderPayload)
          });
        } catch (webhookErr) {
          console.warn("Webhook post issue (order safely preserved locally):", webhookErr);
        }
      }

      // Save order to LocalStorage backup
      try {
        const savedOrders = JSON.parse(localStorage.getItem("salvation_bracelet_orders") || "[]");
        savedOrders.push(orderPayload);
        localStorage.setItem("salvation_bracelet_orders", JSON.stringify(savedOrders));
      } catch (storageErr) {
        console.error("Local storage error:", storageErr);
      }

      // Reset loading state
      if (submitBtnText) submitBtnText.textContent = "COMPLETE ORDER REQUEST";
      if (submitBtnSpinner) submitBtnSpinner.classList.add("hidden");

      // Switch to confirmation modal
      checkoutModal.close();
      customerOrderForm.reset();
      updateOrderDisplay();

      if (successModal) {
        successModal.showModal();
      }
    });
  }

  // Close Success Modal
  if (btnDone && successModal) {
    btnDone.addEventListener("click", () => {
      successModal.close();
    });
  }

  // Initial display setup
  updateOrderDisplay();
});
