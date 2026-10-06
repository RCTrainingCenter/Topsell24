import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { initializeApp, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as nodemailer from "nodemailer";

// Initialize Firebase Admin SDK
try {
  initializeApp();
} catch (e) {
  // Already initialized
}

const db = getFirestore();

/**
 * Helper to get SMTP transporter using environment variables or fallback values.
 * In production, configure these via Google Cloud secret manager or environment variables.
 */
function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";

  if (!user || !pass) {
    logger.warn("SMTP credentials (SMTP_USER or SMTP_PASS) not set. Email dispatch will operate in simulation logger mode.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Triggers when a new order is placed in the 'orders' Firestore collection.
 * Sends a gorgeous formatted HTML email confirmation receipt to the customer's registered email.
 */
export const sendOrderConfirmationReceipt = onDocumentCreated("orders/{orderId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.error("No data associated with the document creation event.");
    return;
  }

  const orderId = event.params.orderId;
  const orderData = snapshot.data();

  logger.info(`Processing order confirmation email for Order: ${orderId}`, { orderData });

  // Extract customer email
  const recipientEmail = orderData.email || (orderData.customerUid && orderData.customerUid.includes("@") ? orderData.customerUid : "");

  if (!recipientEmail) {
    logger.warn(`Skipping email dispatch for Order ${orderId}: No valid recipient email address found.`, {
      customerUid: orderData.customerUid,
      emailField: orderData.email,
    });
    return;
  }

  const clientName = orderData.clientName || "সম্মানিত গ্রাহক";
  const totalPrice = orderData.totalPrice || 0;
  const itemsCount = orderData.itemsCount || 0;
  const deliveryAddress = orderData.address || "প্রদান করা হয়নি";
  const phone = orderData.phone || "প্রদান করা হয়নি";
  const orderDate = orderData.date || new Date().toLocaleDateString("bn-BD");

  // Construct a premium HTML email template
  const emailHtmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }
        .header {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          color: #ffffff;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .header p {
          margin: 8px 0 0;
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 35px 30px;
          color: #334155;
        }
        .greeting {
          font-size: 18px;
          font-weight: 700;
          margin-top: 0;
          margin-bottom: 12px;
          color: #1e293b;
        }
        .thank-you {
          font-size: 14px;
          line-height: 1.6;
          color: #64748b;
          margin-bottom: 25px;
        }
        .order-summary-box {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 25px;
        }
        .order-title {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          color: #0284c7;
          letter-spacing: 1px;
          margin-top: 0;
          margin-bottom: 15px;
          border-b: 1px solid #e2e8f0;
          padding-bottom: 8px;
        }
        .row {
          display: flex;
          justify-content: space-between;
          font-size: 13.5px;
          margin-bottom: 10px;
        }
        .row-last {
          margin-bottom: 0;
        }
        .label {
          color: #64748b;
          font-weight: 500;
        }
        .value {
          color: #0f172a;
          font-weight: 600;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          font-weight: 800;
          color: #0284c7;
          margin-top: 15px;
          padding-top: 12px;
          border-top: 2px dashed #e2e8f0;
        }
        .delivery-details {
          background-color: #fffbeb;
          border: 1px solid #fef3c7;
          border-radius: 12px;
          padding: 20px;
          font-size: 13px;
          line-height: 1.6;
          color: #b45309;
        }
        .delivery-title {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          color: #d97706;
          letter-spacing: 1px;
          margin-top: 0;
          margin-bottom: 10px;
        }
        .footer {
          background-color: #f1f5f9;
          padding: 25px 30px;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
          border-top: 1px solid #e2e8f0;
        }
        .footer p {
          margin: 0 0 8px;
        }
        .footer p:last-child {
          margin-bottom: 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>রকমারি কেনাকাটা</h1>
          <p>অর্ডার নিশ্চিতকরণ ও রসিদ (Order Confirmation Receipt)</p>
        </div>
        <div class="content">
          <h2 class="greeting">প্রিয় ${clientName},</h2>
          <p class="thank-you">
            রকমারি কেনাকাটা থেকে অর্ডার করার জন্য আপনাকে অসংখ্য ধন্যবাদ! আপনার অর্ডারটি আমাদের সিস্টেমে সফলভাবে যুক্ত হয়েছে। আমাদের টিম খুব শীঘ্রই ডেলিভারির কার্যক্রম শুরু করবে।
          </p>

          <div class="order-summary-box">
            <h3 class="order-title">অর্ডারের বিবরণ (Order Details)</h3>
            <div class="row">
              <span class="label">অর্ডার আইডি:</span>
              <span class="value">${orderId}</span>
            </div>
            <div class="row">
              <span class="label">তারিখ:</span>
              <span class="value">${orderDate}</span>
            </div>
            <div class="row">
              <span class="label">বইয়ের সংখ্যা:</span>
              <span class="value">${itemsCount} টি</span>
            </div>
            <div class="row row-last">
              <span class="label">পেমেন্ট মেথড:</span>
              <span class="value">ক্যাশ অন ডেলিভারি (Cash on Delivery)</span>
            </div>
            <div class="total-row">
              <span>সর্বমোট পরিশোধযোগ্য মূল্য:</span>
              <span>TK. ${totalPrice}</span>
            </div>
          </div>

          <div class="delivery-details">
            <h3 class="delivery-title">ডেলিভারি ঠিকানা</h3>
            <strong>গ্রাহক:</strong> ${clientName}<br/>
            <strong>মোবাইল:</strong> ${phone}<br/>
            <strong>ঠিকানা:</strong> ${deliveryAddress}
          </div>
        </div>
        <div class="footer">
          <p>এই ইমেইলটি স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে, দয়া করে এখানে রিপ্লাই করবেন না।</p>
          <p>© ${new Date().getFullYear()} রকমারি কেনাকাটা। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const transporter = getTransporter();

  try {
    if (transporter) {
      // Send the actual email
      const mailOptions = {
        from: `"রকমারি কেনাকাটা" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: `অর্ডার নিশ্চিতকরণ রসিদ - ${orderId} (রকমারি কেনাকাটা)`,
        html: emailHtmlContent,
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info(`Email successfully dispatched via SMTP for order ${orderId}`, { messageId: info.messageId });

      // Update Firestore document with email dispatch status
      await db.collection("orders").doc(orderId).set({
        emailNotification: {
          sent: true,
          recipient: recipientEmail,
          timestamp: new Date().toISOString(),
          provider: "SMTP"
        }
      }, { merge: true });

    } else {
      // Log simulation payload when credentials are not configured
      logger.info("--- SIMULATED EMAIL CONFIRMATION RECEIPT (SMTP NOT CONFIGURED) ---");
      logger.info(`To: ${recipientEmail}`);
      logger.info(`Subject: Order Confirmation Receipt - ${orderId}`);
      logger.info(`Body Preview: HTML Receipt compiled successfully for ${clientName}`);
      logger.info("-----------------------------------------------------------------");

      // Update Firestore document with simulation metadata
      await db.collection("orders").doc(orderId).set({
        emailNotification: {
          sent: true,
          recipient: recipientEmail,
          timestamp: new Date().toISOString(),
          provider: "Simulation Logs (SMTP credentials missing)"
        }
      }, { merge: true });
    }
  } catch (error: any) {
    logger.error(`Error sending email confirmation receipt for order ${orderId}:`, error);
    
    // Write error metadata back to Firestore
    await db.collection("orders").doc(orderId).set({
      emailNotification: {
        sent: false,
        recipient: recipientEmail,
        timestamp: new Date().toISOString(),
        error: error.message || String(error)
      }
    }, { merge: true });
  }
});
