// app/api/send-consultation-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { productName, productPrice, selectedColor, customerEmail, customerName, customerPhone, customerMessage } = await request.json();

    // Create transporter (you'll need to add these environment variables)
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PW
        },
    });

    // Email content
    const emailContent = `
New Custom Order Consultation Request

Product Details:
- Product: ${productName}
- Price: ₦${productPrice?.toLocaleString()}
- Color: ${selectedColor || 'To be discussed'}

Customer Information:
- Name: ${customerName}
- Email: ${customerEmail}
- Phone: ${customerPhone || 'Not provided'}

Customer Message:
${customerMessage || 'No additional message provided.'}

Next Steps:
1. Contact the customer within 24 hours
2. Schedule measurement consultation
3. Discuss customization options
4. Provide timeline and final pricing

Contact Information:
- Email: ${customerEmail}
- Phone: ${customerPhone || 'Contact via email'}

---
This request was sent from your website product page.
Generated on: ${new Date().toLocaleString()}
    `;

    // Send email to business
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'Aleebansparks@gmail.com',
      subject: `Custom Order Request - ${productName}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            New Custom Order Consultation Request
          </h2>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Product Details</h3>
            <p><strong>Product:</strong> ${productName}</p>
            <p><strong>Price:</strong> ₦${productPrice?.toLocaleString()}</p>
            <p><strong>Color:</strong> ${selectedColor || 'To be discussed'}</p>
          </div>

          <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0277bd; margin-top: 0;">Customer Information</h3>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
            <p><strong>Phone:</strong> ${customerPhone ? `<a href="tel:${customerPhone}">${customerPhone}</a>` : 'Not provided'}</p>
          </div>

          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0369a1; margin-top: 0;">Customer Message</h3>
            <p style="white-space: pre-wrap;">${customerMessage || 'No additional message provided.'}</p>
          </div>

          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">Next Steps</h3>
            <ol style="color: #92400e;">
              <li>Contact the customer within 24 hours</li>
              <li>Schedule measurement consultation</li>
              <li>Discuss customization options</li>
              <li>Provide timeline and final pricing</li>
            </ol>
          </div>

          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6b7280;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              This request was sent from your website product page.<br>
              Generated on: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: `Consultation Request Received - ${productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            Thank You for Your Custom Order Request!
          </h2>
          
          <p>Dear ${customerName},</p>
          
          <p>We've received your consultation request for <strong>${productName}</strong> and we're excited to create something special just for you!</p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0369a1; margin-top: 0;">What's Next?</h3>
            <ul style="color: #0369a1;">
              <li>Our team will contact you within 24 hours</li>
              <li>We'll schedule a consultation to discuss your requirements</li>
              <li>Professional measurements will be taken</li>
              <li>We'll provide timeline and final pricing</li>
            </ul>
          </div>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Your Request Details</h3>
            <p><strong>Product:</strong> ${productName}</p>
            <p><strong>Base Price:</strong> ₦${productPrice?.toLocaleString()}</p>
            <p><strong>Color:</strong> ${selectedColor || 'To be discussed'}</p>
          </div>

          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">Contact Information</h3>
            <p><strong>Email:</strong> Aleebansparks@gmail.com</p>
            <p><strong>Phone:</strong> +234 706 055 2126</p>
          </div>

          <p>If you have any questions in the meantime, feel free to reach out to us directly.</p>
          
          <p>Best regards,<br>
          <strong>Aleebansparks Team</strong></p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}