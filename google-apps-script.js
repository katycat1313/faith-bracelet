// =========================================================================
// GOOGLE APPS SCRIPT FOR "THE SALVATION BRACELET"
// Paste this directly into: Extensions > Apps Script in your Google Sheet!
// =========================================================================

// 1. RECEIVE INCOMING ORDERS FROM THE LANDING PAGE
function doPost(e) {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName("Orders");
    
    // Fallback if sheet is named differently
    if (!sheet) {
      sheet = spreadsheet.getActiveSheet();
    }
    
    // Parse incoming data from the landing page
    var data = {};
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    }
    
    // Append the row to Google Sheets
    sheet.appendRow([
      data.orderId || ("ORD-" + new Date().getTime().toString(36).toUpperCase()),
      data.orderDate || new Date().toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
      }),
      data.buyerName || "Anonymous",
      data.shippingAddress || "No address provided",
      Number(data.numberOfBracelets || 1),
      data.totalPaid || "$5.00",
      data.paymentMethod || "PayPal",
      data.phone || "",
      data.specialNotes || "None",
      "Pending Shipment"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 2. DAILY 24-HOUR SALES REPORT (Fires every evening on a timer)
function sendDailySummary() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Orders") || spreadsheet.getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  
  if (rows.length <= 1) return; // Only header exists
  
  var now = new Date();
  var oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
  
  var totalBracelets = 0;
  var totalRevenue = 0;
  var orderLines = [];
  
  // Loop through all orders (skip row 0 which is headers)
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var orderDate = new Date(row[1]);
    
    // If the order date is within the last 24 hours
    if (isNaN(orderDate.getTime()) || orderDate >= oneDayAgo) {
      var qty = Number(row[4]) || 1;
      var revStr = String(row[5]).replace(/[^0-9.]/g, '');
      var revenue = parseFloat(revStr) || 0;
      
      totalBracelets += qty;
      totalRevenue += revenue;
      orderLines.push("• " + row[2] + " - " + qty + " bracelet(s) [$" + revenue.toFixed(2) + "] to " + row[3] + " (" + row[6] + ")");
    }
  }
  
  // REPLACE WITH HER REAL EMAIL ADDRESS:
  var recipientEmail = "mom@example.com";
  
  var subject = "🌸 Daily Bracelet Orders: " + totalBracelets + " sold in last 24 hours ($" + totalRevenue.toFixed(2) + ")";
  var body = "Good evening!\n\n" +
             "Here is your 24-hour summary for The Salvation Bracelet:\n\n" +
             "✨ Bracelets Sold in the Last 24 Hours: " + totalBracelets + "\n" +
             "💵 Total Amount: $" + totalRevenue.toFixed(2) + "\n\n" +
             (orderLines.length > 0 
               ? "📦 Orders to ship:\n" + orderLines.join("\n") 
               : "No new orders received in the past 24 hours.") +
             "\n\nView and manage orders in your Google Sheet:\n" + spreadsheet.getUrl();
             
  MailApp.sendEmail(recipientEmail, subject, body);
}
