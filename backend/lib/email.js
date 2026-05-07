// lib/nodemailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter with IPv4 fix
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Email configuration error:", error.message);
  } else {
    console.log("Email server is ready to send messages");
    console.log(`   Using: ${process.env.EMAIL_USER}`);
  }
});

// Format currency with proper Arabic numbers
const formatPrice = (price) => {
  return new Intl.NumberFormat("ar-EG").format(price);
};

// Format date with proper Arabic numbers
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Send order notification email to admin
export const sendOrderNotificationEmail = async (order) => {
  try {
    const frontendUrl =
      process.env.FRONTEND_URL || "https://your-app.vercel.app";
    const orderId = order._id.toString();

    const itemsHtml = order.items
      .map(
        (item, index) => `
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 12px 8px; text-align: right;">${index + 1}</td>
        <td style="padding: 12px 8px; text-align: right;">${item.name}</td>
        <td style="padding: 12px 8px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 8px; text-align: left;">${formatPrice(
          item.price
        )} دج</td>
        <td style="padding: 12px 8px; text-align: left; font-weight: bold;">${formatPrice(
          item.price * item.quantity
        )} دج</td>
      </tr>
    `
      )
      .join("");

    const mailOptions = {
      from: `"Restaurant App" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order #${orderId}`,
      html: `
<!DOCTYPE html>
<html dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order</title>
</head>
<body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
<div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">New Order</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">A new order has been received</p>
  </div>

  <div style="background-color: #f8f9fa; padding: 20px; border-bottom: 1px solid #e0e0e0;">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
      <div>
        <span style="font-size: 14px; color: #666;">Order Number</span>
        <h2 style="margin: 5px 0 0 0; color: #667eea;">#${orderId}</h2>
      </div>
      <div>
        <span style="font-size: 14px; color: #666;">Order Date</span>
        <p style="margin: 5px 0 0 0; font-weight: bold;">${formatDate(
          order.createdAt
        )}</p>
      </div>
    </div>
  </div>

  <div style="padding: 20px; border-bottom: 1px solid #e0e0e0;">
    <h3 style="margin: 0 0 15px 0; color: #333; border-right: 4px solid #667eea; padding-right: 12px;">Customer Information</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; width: 120px; color: #666;">Full Name:</td>
        <td style="padding: 8px 0; font-weight: bold;">${
          order.customer.fullName
        }</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">Phone:</td>
        <td style="padding: 8px 0; font-weight: bold; direction: ltr; text-align: left;">${
          order.customer.phone
        }</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">Delivery Location:</td>
        <td style="padding: 8px 0; font-weight: bold;">${
          order.shippingPlace
        }</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">Delivery Fee:</td>
        <td style="padding: 8px 0; font-weight: bold;">${formatPrice(
          order.shippingPrice
        )} DZD</td>
      </tr>
    </table>
  </div>

  <div style="padding: 20px; border-bottom: 1px solid #e0e0e0;">
    <h3 style="margin: 0 0 15px 0; color: #333; border-right: 4px solid #667eea; padding-right: 12px;">Order Details</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f8f9fa; border-bottom: 2px solid #e0e0e0;">
          <th style="padding: 10px 8px; text-align: right;">#</th>
          <th style="padding: 10px 8px; text-align: right;">Item</th>
          <th style="padding: 10px 8px; text-align: center;">Qty</th>
          <th style="padding: 10px 8px; text-align: left;">Price</th>
          <th style="padding: 10px 8px; text-align: left;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
  </div>

  <div style="padding: 20px; background-color: #f8f9fa;">
    <div style="max-width: 300px; margin-right: auto;">
      <div style="display: flex; justify-content: space-between; padding: 8px 0;">
        <span style="color: #666;">Subtotal:</span>
        <span style="font-weight: bold;">${formatPrice(
          order.itemsPrice
        )} DZD</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0;">
        <span style="color: #666;">Delivery Fee:</span>
        <span style="font-weight: bold;">${formatPrice(
          order.shippingPrice
        )} DZD</span>
      </div>
      <div style="border-top: 2px dashed #ccc; margin: 10px 0;"></div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0;">
        <span style="font-size: 18px; font-weight: bold; color: #333;">Total:</span>
        <span style="font-size: 20px; font-weight: bold; color: #667eea;">${formatPrice(
          order.totalPrice
        )} DZD</span>
      </div>
    </div>
  </div>

  <div style="padding: 20px; text-align: center;">
    <a href="${frontendUrl}/dashboard/orders" 
       style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 32px; text-decoration: none; border-radius: 30px; font-weight: bold;">
      View Order in Dashboard
    </a>
  </div>

  <div style="background-color: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;">
    <p style="margin: 0;">This is an automated message, please do not reply</p>
    <p style="margin: 10px 0 0 0;">© ${new Date().getFullYear()} Restaurant App - All rights reserved</p>
  </div>
</div>
</body>
</html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Order notification email sent for order ${order._id}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending error:", error.message);
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

    const statusColors = {
      pending: "#f59e0b",
      confirmed: "#10b981",
      preparing: "#3b82f6",
      delivered: "#059669",
      cancelled: "#ef4444",
    };

    const mailOptions = {
      from: `"Restaurant App" <${process.env.EMAIL_USER}>`,
      to: order.customer.phone.includes("@") ? order.customer.phone : undefined,
      subject: `Order Status Update #${order._id}`,
      html: `
<!DOCTYPE html>
<html dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>Order Status Update</title>
</head>
<body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
<div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Order Status Update</h1>
  </div>

  <div style="padding: 30px 20px; text-align: center;">
    <p style="font-size: 18px; margin: 0 0 10px 0;">Hello <strong>${
      order.customer.fullName
    }</strong>,</p>
    <p style="color: #666; margin: 0 0 20px 0;">Your order <strong style="color: #667eea;">#${
      order._id
    }</strong></p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0;">
      <span style="font-size: 14px; color: #666;">Current Status</span>
      <h2 style="margin: 10px 0 0 0; color: ${statusColors[order.status]};">${
        statusMessages[order.status]
      }</h2>
    </div>
    
    <p style="color: #666; line-height: 1.6;">
      ${
        order.status === "delivered"
          ? "Your order has been delivered successfully. Thank you for your trust!"
          : order.status === "cancelled"
          ? "Your order has been cancelled. Please contact us for more information."
          : "You will be updated with any new developments regarding your order."
      }
    </p>
  </div>

  <div style="background-color: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;">
    <p style="margin: 0;">Thank you for shopping with us</p>
    <p style="margin: 10px 0 0 0;">© ${new Date().getFullYear()} Restaurant App</p>
  </div>
</div>
</body>
</html>
      `,
    };

    if (mailOptions.to) {
      await transporter.sendMail(mailOptions);
      console.log(`Status update email sent for order ${order._id}`);
    }
  } catch (error) {
    console.error("Status email sending error:", error.message);
  }
};

export default transporter;
