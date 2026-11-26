// =========================================================================
// THE SALVATION BRACELET - STORE CONFIGURATION
// Two clean options: $5 for 1, or $12 for 3
// =========================================================================
const STORE_CONFIG = {
  itemName: "The Salvation Story Bracelet",
  
  // The two prices:
  priceSingle: 5.00,
  priceThreePack: 12.00,

  // Google Apps Script or Webhook URL:
  // Paste your Google Apps Script Web App URL here!
  webhookUrl: "",

  // PayPal Settings:
  paypalLink: "https://paypal.me/",
  paypalEmail: "mom-paypal@example.com",

  // Mother-in-law's contact phone number (for SMS quick orders)
  notificationPhone: "555-123-4567",
  
  // Other payment handles:
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
  const modalItemName = document.getElementById("modal-item-name");
  const modalTotalPrice = document.getElementById("modal-total-price");
  const confirmPayAmount = document.getElementById("confirm-pay-amount");
  const successMsg = document.getElementById("success-msg");

  // Payment Display Elements
  const displayPaypal = document.getElementById("display-paypal");
  const btnPaypalLink = document.getElementById("btn-paypal-link");
  const displayVenmo = document.getElementById("display-venmo");
  const displayCashApp = document.getElementById("display-cashapp");
  const displayZelle = document.getElementById("display-zelle");

  if (displayPaypal) displayPaypal.textContent = STORE_CONFIG.paypalEmail;
  if (btnPaypalLink) {
    if (STORE_CONFIG.paypalLink && STORE_CONFIG.paypalLink.length > 18) {
      btnPaypalLink.href = STORE_CONFIG.paypalLink;
    } else {
      btnPaypalLink.href = "https://www.paypal.com";
    }
  }

  if (displayVenmo) displayVenmo.textContent = STORE_CONFIG.venmoHandle;
  if (displayCashApp) displayCashApp.textContent = STORE_CONFIG.cashAppHandle;
  if (displayZelle) displayZelle.textContent = STORE_CONFIG.zelleInfo;

  // Selection Handler: Strictly 1 ($5) or 3 ($12)
  function selectOption(qty) {
    qty = (qty === 3) ? 3 : 1;
    if (qtyInput) qtyInput.value = qty;

    const priceText = (qty === 3) ? "$12" : "$5";
    const itemLabel = (qty === 3) ? "3-Pack ($12)" : "1 Bracelet ($5)";

    if (btnTotalLabel) btnTotalLabel.textContent = priceText;
    if (mobileStickyPrice) mobileStickyPrice.textContent = priceText;
    if (modalItemName) modalItemName.textContent = `The Salvation Story Bracelet (${itemLabel})`;
    if (modalTotalPrice) modalTotalPrice.textContent = priceText;
    if (confirmPayAmount) confirmPayAmount.textContent = priceText;

    if (successMsg) {
      successMsg.textContent = `Thank you so much! Your order for ${itemLabel} has been saved. She has received your shipping address and will prepare your package!`;
    }

    // Toggle active state on the two buttons
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
      const smsBody = (qty === 3)
        ? encodeURIComponent("Hi! I'd like to order a 3-Pack of The Salvation Story Bracelet for $12. My name is [Name] and my shipping address is: [Address].")
        : encodeURIComponent("Hi! I'd like to order 1 Salvation Story Bracelet for $5. My name is [Name] and my shipping address is: [Address].");
      btnSmsOrder.href = `sms:${STORE_CONFIG.notificationPhone}?body=${smsBody}`;
    }
  }

  // Bundle Card Click
  bundleCards.forEach((card) => {
    card.addEventListener("click", () => {
      const selectedQty = parseInt(card.getAttribute("data-qty"), 10);
      selectOption(selectedQty);
    });
  });

  // Modal Open Handler
  function openCheckoutModal() {
    const currentQty = parseInt(qtyInput ? qtyInput.value : "1", 10);
    selectOption(currentQty);
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
      const qty = parseInt(qtyInput ? qtyInput.value : "1", 10) === 3 ? 3 : 1;
      const totalFormatted = (qty === 3) ? "$12.00" : "$5.00";
      const totalRaw = (qty === 3) ? 12.00 : 5.00;

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
        pricingOption: (qty === 3) ? "3-Pack ($12)" : "1 Bracelet ($5)",
        totalPaid: totalFormatted,
        totalRaw: totalRaw,
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
      selectOption(1); // Reset to default 1

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

  // Initial selection (1 for $5)
  selectOption(1);
});
