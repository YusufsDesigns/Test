import { NextRequest, NextResponse } from 'next/server';
import { generateBusinessEmailTemplate, generateCustomerEmailTemplate } from '@/lib/emailTemplates';

// Example using nodemailer (you can replace with your email service)
import nodemailer from 'nodemailer';

// Configure your email transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PW
    },
});

export async function POST(request: NextRequest) {
    try {
        const emailData = await request.json();

        if (emailData.template === 'business_order_notification') {
            // Send business notification email for completed order
            const businessEmailHtml = generateBusinessEmailTemplate({
                orderNumber: emailData.orderNumber || emailData.paymentReference || 'N/A',
                customerName: emailData.customerName,
                customerEmail: emailData.customerEmail,
                customerPhone: emailData.customerPhone,
                shippingAddress: emailData.shippingAddress,
                items: emailData.items,
                totals: emailData.totals,
                deliveryMethod: emailData.deliveryMethod,
                paymentReference: emailData.paymentReference,
                paymentMethod: emailData.paymentMethod || 'Paystack',
                orderDate: new Date(emailData.orderDate).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
            });

            await transporter.sendMail({
                from: process.env.SMTP_FROM || 'noreply@aleebansparks.com',
                to: emailData.to,
                subject: emailData.subject,
                html: businessEmailHtml,
            });

            return NextResponse.json({ success: true, type: 'business' });

        } else if (emailData.template === 'customer_order_confirmation') {
            // Send customer confirmation email for completed order
            const customerEmailHtml = generateCustomerEmailTemplate({
                orderNumber: emailData.orderNumber || emailData.paymentReference || 'N/A',
                customerName: emailData.customerName,
                items: emailData.items,
                totals: emailData.totals,
                deliveryMethod: emailData.deliveryDetails,
                paymentReference: emailData.paymentReference,
                paymentMethod: emailData.paymentMethod || 'Paystack',
                shippingAddress: emailData.shippingAddress,
                orderDate: emailData.orderDate,
            });

            await transporter.sendMail({
                from: process.env.SMTP_FROM || 'noreply@aleebansparks.com',
                to: emailData.to,
                subject: emailData.subject,
                html: customerEmailHtml,
            });

            return NextResponse.json({ success: true, type: 'customer' });
        }

        return NextResponse.json({ error: 'Invalid email template' }, { status: 400 });

    } catch (error) {
        console.error('Email sending error:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}