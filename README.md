# Handcrafted Faith Story Bracelet - Landing Page

A simple, mobile-friendly landing page created to help sell handcrafted faith story bracelets through social media links (Instagram, Facebook, TikTok, text message).

## 🚀 Live Site
Once GitHub Pages finishes building, your page will be live at:
**`https://katycat1313.github.io/faith-bracelet/`**

---

## 💡 How She Takes Orders & Payments Easily

### Option 1: Venmo, Cash App, or Zelle (Easiest for friends/family & social media)
1. In `script.js`, replace `@Mom-Bracelet` and `$MomBracelet` with her actual Venmo and Cash App usernames, or her phone number for Zelle.
2. Customers fill in their name and shipping address in the order box on the page, select their payment method, and submit.
3. They see her Venmo/Cash App/Zelle details on screen right away to complete payment.

### Option 2: 1-Click Text Message Order (Fastest on Mobile)
When customers browse the link from a phone and tap **"💬 Quick Order via Text Message"**, it automatically opens a text message draft on their phone with their order details addressed directly to her cell phone.

### Option 3: Stripe Payment Link (Best for accepting Credit & Debit Cards automatically)
If she wants strangers on the internet to be able to pay with a regular credit card without needing Venmo/Cash App:
1. Create a free account at [Stripe.com](https://stripe.com).
2. Click **More** &rarr; **Payment Links** &rarr; **New**.
3. Set the price to `$10.00` (or whatever price she chooses), and check the box **"Collect customers' shipping address"**.
4. Copy the link (e.g. `https://buy.stripe.com/...`) and paste it into `script.js` under `stripePaymentLink: "..."`.
5. Now, whenever anyone taps **Order Now**, it goes directly to Stripe's checkout and deposits the funds straight into her bank account!

---

## 🛠️ File Structure
- `index.html`: Clean, accessible semantic webpage.
- `styles.css`: Mobile-first responsive styling.
- `script.js`: Price calculation, text order generator, and order handling.
- `salvation-bracelet.jpg`: The photo of her handcrafted bracelet and card.
- `.github/workflows/deploy.yml`: Automatic deployment to GitHub Pages.
