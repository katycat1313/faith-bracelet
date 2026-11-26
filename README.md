# The Salvation Story Bracelet — Landing Page & n8n Automation

A responsive, handcrafted landing page designed for selling faith story bracelets through social media links, integrated with **n8n** and **Google Sheets** for automatic order logging and daily sales summaries.

---

## 🌟 Live Site
- **Live URL:** [https://katycat1313.github.io/faith-bracelet/](https://katycat1313.github.io/faith-bracelet/)
- **Repository:** [https://github.com/katycat1313/faith-bracelet](https://github.com/katycat1313/faith-bracelet)

---

## 📊 Google Sheets Setup (Takes 2 Minutes)

We provided a template file in this folder: `orders-template.csv`.

1. Go to [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. Name it **"Faith Bracelet Orders"**.
3. Name the first tab **"Orders"**.
4. Set up the columns in row 1 (or click **File > Import > Upload** and select `orders-template.csv`):
   - **Column A:** `Order ID`
   - **Column B:** `Order Date`
   - **Column C:** `Buyer Name`
   - **Column D:** `Shipping Address`
   - **Column E:** `Number of Bracelets`
   - **Column F:** `Total Paid`
   - **Column G:** `Payment Method`
   - **Column H:** `Phone Number`
   - **Column I:** `Special Notes`
   - **Column J:** `Fulfillment Status`

---

## ⚡ n8n Automation Setup

We included a ready-to-import workflow: `n8n-bracelet-workflow.json`.

### Step 1: Import the Workflow into n8n
1. In your n8n workspace, click **Workflows** &rarr; **Add Workflow**.
2. Click the three dots in the top right &rarr; **Import from File...** and select `n8n-bracelet-workflow.json` (or copy/paste the JSON).

### Step 2: Connect the Webhook to the Landing Page
1. Double-click the **Order Webhook** node in n8n.
2. Copy the **Production Webhook URL** (e.g. `https://your-n8n.com/webhook/bracelet-orders`).
3. Open `script.js` on line 18 and paste it into:
   ```javascript
   n8nWebhookUrl: "https://your-n8n.com/webhook/bracelet-orders",
   ```
4. Commit and push the change to GitHub:
   ```bash
   git add script.js
   git commit -m "Add n8n webhook"
   git push
   ```

### Step 3: Connect Google Sheets in n8n
1. Double-click the **Save to Google Sheets** node.
2. Connect your Google account and select your **"Faith Bracelet Orders"** spreadsheet.
3. Do the same for the **Read Orders Sheet** node.

### Step 4: Daily 24-Hour Notification
The workflow includes a **Daily Schedule Trigger** (runs at 8:00 PM every evening):
1. It queries the orders placed in the last 24 hours.
2. It calculates the **total bracelets sold** and **total revenue**.
3. It sends her an email or notification summarizing:
   - Total bracelets sold in 24 hours
   - Total dollar amount
   - List of buyer names & shipping addresses to pack!

---

## 🎨 Customizing Details in `script.js`
Open `script.js` to change:
- `notificationPhone`: Her cell phone for 1-click text orders.
- `venmoHandle`: Her Venmo username.
- `cashAppHandle`: Her Cash App tag.
- `zelleInfo`: Her Zelle phone or email.
