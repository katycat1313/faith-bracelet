# The Salvation Story Bracelet — Landing Page & Google Sheets Automation

A beautiful, responsive landing page designed for selling handcrafted faith story bracelets through social media links.

---

## 🌟 Live Site
- **Live URL:** [https://katycat1313.github.io/faith-bracelet/](https://katycat1313.github.io/faith-bracelet/)
- **Repository:** [https://github.com/katycat1313/faith-bracelet](https://github.com/katycat1313/faith-bracelet)

---

## 💡 The Easiest Way: Google Sheets + Daily Note (No Zapier Needed!)

Google Sheets can receive orders **and** send her the daily 24-hour summary email automatically for 100% free!

### Step 1: Create your Google Sheet
1. Open [Google Sheets](https://sheets.new) and name it **"Faith Bracelet Orders"**.
2. Name the first tab **"Orders"**.
3. In Row 1, put these columns (or import `orders-template.csv`):
   `Order ID | Order Date | Buyer Name | Shipping Address | Number of Bracelets | Total Paid | Payment Method | Phone Number | Special Notes | Fulfillment Status`

### Step 2: Paste the Script (Takes 60 Seconds)
1. In your Google Sheet, click **Extensions > Apps Script**.
2. Delete any code in the editor, and paste the entire contents of [google-apps-script.js](file:///C:/Users/katyc/.gemini/antigravity/scratch/bracelet-landing-page/google-apps-script.js).
3. On line 67, change `mom@example.com` to her actual email address.
4. Click **Deploy > New Deployment**.
   - Select type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy** and copy your **Web App URL** (looks like `https://script.google.com/macros/s/AKfycb.../exec`).

### Step 3: Connect to the Landing Page
1. Open `script.js` and paste your URL on line 18:
   ```javascript
   webhookUrl: "https://script.google.com/macros/s/AKfycb.../exec",
   ```
2. Commit and push (`git add .`, `git commit -m "add sheet webhook"`, `git push`).
3. Now, whenever anyone places an order on the site, it instantly writes a new row to Google Sheets!

### Step 4: Set the Daily 24-Hour Timer (Automatic Note to Her)
1. Back in Google Apps Script, click the **Triggers (clock icon ⏰)** on the left sidebar.
2. Click **Add Trigger** (bottom right):
   - Choose which function to run: `sendDailySummary`
   - Select event source: **Time-driven**
   - Select type of time based trigger: **Day timer**
   - Select time of day: **8pm to 9pm** (or your preferred hour)
3. Click **Save**.
4. That's it! Every evening, Google Sheets will automatically calculate how many bracelets were sold in the prior 24 hours and email her a complete summary with the buyers' names and shipping addresses!

---

## ⚡ Alternative: Using Zapier

If you prefer using Zapier:
1. Create a Zap with trigger: **Webhooks by Zapier &rarr; Catch Hook**.
2. Paste the Zapier Webhook URL into `script.js` under `webhookUrl`.
3. In Zapier, add action: **Google Sheets &rarr; Create Spreadsheet Row**.
4. In Zapier, add a second Zap with trigger: **Schedule by Zapier &rarr; Every Day** &rarr; action: **Email by Zapier &rarr; Send Outbound Email**.
