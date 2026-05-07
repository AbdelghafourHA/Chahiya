// lib/nodemailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false, // false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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
    const itemsList = order.items
      .map(
        (item) =>
          `- ${item.name} x${item.quantity} = ${item.price * item.quantity} دج`
      )
      .join("\n");

    const mailOptions = {
      from: `"Restaurant App" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `طلب جديد #${order._id}`,
      html: `
        <div style="font-family: 'Tahoma', Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; margin: 0;">🛍️ طلب جديد!</h2>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0; border-right: 4px solid #667eea; padding-right: 10px;">📋 معلومات العميل</h3>
              <p style="margin: 8px 0;"><strong>👤 الاسم:</strong> ${
                order.customer.fullName
              }</p>
              <p style="margin: 8px 0;"><strong>📞 الهاتف:</strong> ${
                order.customer.phone
              }</p>
              <p style="margin: 8px 0;"><strong>📍 الموقع:</strong> ${
                order.shippingPlace
              }</p>
              <p style="margin: 8px 0;"><strong>🚚 سعر التوصيل:</strong> ${
                order.shippingPrice
              } دج</p>
              <p style="margin: 8px 0;"><strong>🕒 تاريخ الطلب:</strong> ${new Date(
                order.createdAt
              ).toLocaleString("ar-EG")}</p>
            </div>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0; border-right: 4px solid #667eea; padding-right: 10px;">🍕 الطلبات</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${order.items
                  .map(
                    (item) => `
                  <li style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between;">
                    <span>${item.name} x${item.quantity}</span>
                    <span style="font-weight: bold;">${
                      item.price * item.quantity
                    } دج</span>
                  </li>
                `
                  )
                  .join("")}
              </ul>
              <hr style="margin: 15px 0; border: none; border-top: 2px dashed #e0e0e0;">
              <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                <strong>المجموع الفرعي:</strong>
                <span>${order.itemsPrice} دج</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                <strong>التوصيل:</strong>
                <span>${order.shippingPrice} دج</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 18px; color: #667eea;">
                <strong>الإجمالي:</strong>
                <strong>${order.totalPrice} دج</strong>
              </div>
            </div>

            <div style="text-align: center; margin-top: 25px;">
              <a href="${
                process.env.FRONTEND_URL || "http://localhost:5173"
              }/dashboard/orders" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                عرض الطلب في لوحة التحكم
              </a>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #999; font-size: 12px;">
              <p>هذا بريد آلي، الرجاء عدم الرد عليه.</p>
              <p>© ${new Date().getFullYear()} Restaurant App</p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Order notification email sent for order ${order._id}`);
    console.log(`📧 Message sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email sending error:", error);
    // Don't throw error, just log it - order creation shouldn't fail if email fails
    return { success: false, error: error.message };
  }
};

// Send order status update email to customer (optional)
export const sendOrderStatusUpdateEmail = async (order) => {
  try {
    const statusMessages = {
      pending: "في انتظار المراجعة",
      confirmed: "تم تأكيد طلبك",
      preparing: "جاري تحضير طلبك",
      delivered: "تم توصيل طلبك",
      cancelled: "تم إلغاء طلبك",
    };

    const mailOptions = {
      from: `"Restaurant App" <${process.env.EMAIL_USER}>`,
      to: order.customer.phone.includes("@") ? order.customer.phone : undefined,
      subject: `تحديث حالة الطلب #${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl;">
          <h2 style="color: #667eea;">تحديث حالة طلبك</h2>
          <p>مرحباً ${order.customer.fullName}،</p>
          <p>طلبك رقم <strong>#${
            order._id
          }</strong> حالته الآن: <strong style="color: #667eea;">${
        statusMessages[order.status]
      }</strong></p>
          <p>شكراً لتسوقك معنا!</p>
        </div>
      `,
    };

    if (mailOptions.to) {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Status update email sent for order ${order._id}`);
    }
  } catch (error) {
    console.error("❌ Status email sending error:", error);
  }
};

export default transporter;
