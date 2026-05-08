// lib/nodemailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter - SAME PATTERN as your working old project
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // false for 587, true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4, // Force IPv4 - THIS IS THE KEY FIX
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Email configuration error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Send order notification email to admin
export const sendOrderNotificationEmail = async (order) => {
  try {
    const frontendUrl =
      process.env.FRONTEND_URL || "https://chahiya.vercel.app";

    // Format items list for email
    const itemsList = order.items
      .map(
        (item) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 8px;">${item.name}</td>
        <td style="padding: 8px; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; text-align: left;">${item.price} DZD</td>
        <td style="padding: 8px; text-align: left; font-weight: bold;">${
          item.price * item.quantity
        } DZD</td>
      </tr>
    `
      )
      .join("");

    const mailOptions = {
      from: `"Restaurant App" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order #${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #667eea;">
            <h1 style="color: #667eea; margin: 0;">🍕🥤 New Order</h1>
            <p style="color: #666; margin: 5px 0 0;">Order #${order._id}</p>
          </div>
          
          <div style="padding: 20px 0;">
            <h3 style="color: #667eea;">Customer Information:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Name:</td>
                <td style="padding: 8px 0;">${order.customer.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                <td style="padding: 8px 0;">${order.customer.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Location:</td>
                <td style="padding: 8px 0;">${order.shippingPlace}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Delivery Fee:</td>
                <td style="padding: 8px 0;">${order.shippingPrice} DZD</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Date:</td>
                <td style="padding: 8px 0;">${new Date(
                  order.createdAt
                ).toLocaleString()}</td>
              </tr>
            </table>
            
            <h3 style="color: #667eea; margin-top: 20px;">Order Items:</h3>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 8px; text-align: left;">Item</th>
                  <th style="padding: 8px; text-align: center;">Qty</th>
                  <th style="padding: 8px; text-align: left;">Price</th>
                  <th style="padding: 8px; text-align: left;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
              <tfoot>
                <tr style="background-color: #f5f5f5;">
                  <td colspan="3" style="padding: 8px; text-align: left; font-weight: bold;">Subtotal:</td>
                  <td style="padding: 8px; text-align: left; font-weight: bold;">${
                    order.itemsPrice
                  } DZD</td>
                </tr>
                <tr style="background-color: #f5f5f5;">
                  <td colspan="3" style="padding: 8px; text-align: left; font-weight: bold;">Delivery Fee:</td>
                  <td style="padding: 8px; text-align: left; font-weight: bold;">${
                    order.shippingPrice
                  } DZD</td>
                </tr>
                <tr style="background-color: #f5f5f5;">
                  <td colspan="3" style="padding: 8px; text-align: left; font-weight: bold; color: #667eea;">Total:</td>
                  <td style="padding: 8px; text-align: left; font-weight: bold; color: #667eea;">${
                    order.totalPrice
                  } DZD</td>
                </tr>
              </tfoot>
            </table>
            
            <div style="margin-top: 20px; text-align: center;">
              <a href="${frontendUrl}/dashboard" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                View Order in Dashboard
              </a>
            </div>
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999;">
            <p>© ${new Date().getFullYear()} Restaurant App. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Order notification email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending order email:", error);
    return { success: false, error: error.message };
  }
};

// Send order status update email to customer
export const sendOrderStatusUpdateEmail = async (order) => {
  try {
    const statusMessages = {
      pending: "Pending",
      confirmed: "Confirmed",
      preparing: "Preparing",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };

    const mailOptions = {
      from: `"Restaurant App" <${process.env.EMAIL_USER}>`,
      to: order.customer.phone.includes("@") ? order.customer.phone : undefined,
      subject: `Order Status Update #${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #667eea;">
            <h1 style="color: #667eea; margin: 0;">📦 Order Update</h1>
          </div>
          
          <div style="padding: 20px 0; text-align: center;">
            <p style="font-size: 18px;">Hello <strong>${
              order.customer.fullName
            }</strong>,</p>
            <p>Your order <strong>#${order._id}</strong> status is now:</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #667eea; margin: 0;">${
                statusMessages[order.status]
              }</h2>
            </div>
            
            <p style="color: #666;">
              ${
                order.status === "delivered"
                  ? "Your order has been delivered successfully!"
                  : order.status === "cancelled"
                  ? "Your order has been cancelled."
                  : "Thank you for your patience!"
              }
            </p>
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999;">
            <p>© ${new Date().getFullYear()} Restaurant App</p>
          </div>
        </div>
      `,
    };

    if (mailOptions.to) {
      const info = await transporter.sendMail(mailOptions);
      console.log("Status update email sent:", info.messageId);
    }
  } catch (error) {
    console.error("Error sending status email:", error);
  }
};

export default transporter;
