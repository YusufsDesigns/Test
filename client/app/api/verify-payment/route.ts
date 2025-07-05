// app/api/verify-payment/route.ts
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

interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: {
      orderNumber: string;
      customerName: string;
      custom_fields: any[];
    };
    log: any;
    fees: number;
    fees_split: any;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string | null;
    };
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: any;
      risk_action: string;
      international_format_phone: string | null;
    };
    plan: any;
    split: any;
    order_id: any;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: any;
    source: any;
    fees_breakdown: any;
  };
}

async function verifyPaystackPayment(reference: string): Promise<PaystackVerificationResponse> {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Paystack API error: ${response.status}`);
  }

  return response.json();
}

async function sendOrderEmails(orderData: any, paymentData: any) {
  try {
    // Prepare email data
    const emailData = {
      orderNumber: orderData.orderNumber,
      customerName: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
      customerEmail: orderData.customerInfo.email,
      customerPhone: orderData.customerInfo.phone,
      shippingAddress: {
        address: orderData.customerInfo.address,
        apartment: orderData.customerInfo.apartment,
        city: orderData.customerInfo.city,
        state: orderData.customerInfo.state,
        postalCode: orderData.customerInfo.postalCode,
        country: orderData.customerInfo.country
      },
      items: orderData.items,
      totals: orderData.totals,
      deliveryMethod: orderData.deliveryDetails,
      orderDate: new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      paymentReference: paymentData.reference,
      paymentMethod: 'Card Payment (Paystack)',
      paymentStatus: 'Paid'
    };

    // Generate business email (updated for paid order)
    const businessEmailHtml = generateBusinessEmailTemplate({
      ...emailData,
      orderDate: new Date().toISOString()
    }).replace(
      '<span class="status-badge status-pending">Awaiting Payment</span>',
      '<span class="status-badge" style="background: #d1fae5; color: #065f46;">Payment Confirmed</span>'
    ).replace(
      '<div class="status-alert">',
      '<div style="background: #d1fae5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 25px 0;">'
    ).replace(
      '<h4>⚠️ Awaiting Payment</h4>',
      '<h4 style="color: #065f46;">✅ Payment Confirmed</h4>'
    ).replace(
      /color: #92400e/g,
      'color: #065f46'
    );

    // Generate customer email (updated for paid order)
    const customerEmailHtml = generateCustomerEmailTemplate(emailData)
      .replace(
        '<div class="payment-alert">',
        '<div style="background: #d1fae5; border: 2px solid #10b981; border-radius: 12px; padding: 25px; margin-bottom: 30px;">'
      )
      .replace(
        '<div class="payment-title">💳 Complete Your Payment</div>',
        '<div style="color: #065f46; font-weight: 700; font-size: 18px; margin-bottom: 15px;">✅ Payment Confirmed</div>'
      )
      .replace(
        'To process your order, please transfer the exact amount to our bank account using the details below.',
        `Your payment of ₦${orderData.totals.total.toLocaleString()} has been successfully processed. Your order is now being prepared for delivery.`
      )
      .replace(
        /<div class="bank-details">[\s\S]*?<\/div>/,
        `<div style="background: white; border: 1px solid #10b981; border-radius: 8px; padding: 20px;">
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dotted #d1d5db; font-size: 14px;">
            <span style="color: #6b7280; font-weight: 500;">Payment Method:</span>
            <span style="color: #1a1a1a; font-weight: 600;">Card Payment</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dotted #d1d5db; font-size: 14px;">
            <span style="color: #6b7280; font-weight: 500;">Reference:</span>
            <span style="color: #1a1a1a; font-weight: 600;">${paymentData.reference}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dotted #d1d5db; font-size: 14px;">
            <span style="color: #6b7280; font-weight: 500;">Transaction ID:</span>
            <span style="color: #1a1a1a; font-weight: 600;">${paymentData.id}</span>
          </div>
          <div style="border-bottom: none; font-weight: 700; color: #059669; font-size: 16px; margin-top: 8px; padding-top: 12px; border-top: 1px solid #10b981; display: flex; justify-content: space-between;">
            <span>Amount Paid:</span>
            <span>₦${orderData.totals.total.toLocaleString()}</span>
          </div>
        </div>`
      )
      .replace(
        'Please include "<strong>#${data.orderNumber}</strong>" in your transfer description/narration',
        'Your order is confirmed and will be processed immediately.'
      )
      .replace(
        'What happens next?',
        'What happens next?'
      )
      .replace(
        '1. Transfer the payment using the bank details above',
        '1. ✅ Payment confirmed and processed'
      )
      .replace(
        '2. Include your order number (#${data.orderNumber}) in the transfer description',
        '2. ✅ Order confirmed and being prepared'
      )
      .replace(
        '3. We\'ll verify your payment within 24 hours',
        '3. 📦 Your items are being packed for shipment'
      )
      .replace(
        '4. Your order will be processed and shipped immediately after confirmation',
        '4. 🚚 Delivery will begin according to your selected method'
      );

    // Send business email
    await transporter.sendMail({
      from: 'noreply@aleebansparks.com',
      to: 'Aleebansparks@gmail.com',
      subject: `[Aleebansparks]: Payment Confirmed - Order #${orderData.orderNumber}`,
      html: businessEmailHtml,
    });

    // Send customer email
    await transporter.sendMail({
      from: process.env.NODEMAILER_USER || 'noreply@aleebansparks.com',
      to: orderData.customerInfo.email,
      subject: `Payment Confirmed - Order #${orderData.orderNumber} | Aleebansparks`,
      html: customerEmailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending emails:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { reference, orderData } = await request.json();

    if (!reference || !orderData) {
      return NextResponse.json(
        { error: 'Missing reference or order data' },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    console.log('Verifying payment with reference:', reference);
    const verificationResult = await verifyPaystackPayment(reference);

    if (!verificationResult.status) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment verification failed',
          message: verificationResult.message 
        },
        { status: 400 }
      );
    }

    const paymentData = verificationResult.data;

    // Check if payment was successful
    if (paymentData.status !== 'success') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment was not successful',
          paymentStatus: paymentData.status 
        },
        { status: 400 }
      );
    }

    // Verify amount matches (Paystack returns amount in kobo)
    const expectedAmountInKobo = Math.round(orderData.totals.total * 100);
    if (paymentData.amount !== expectedAmountInKobo) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment amount mismatch',
          expected: expectedAmountInKobo,
          received: paymentData.amount 
        },
        { status: 400 }
      );
    }

    // Send confirmation emails
    try {
      await sendOrderEmails(orderData, paymentData);
      console.log('Order confirmation emails sent successfully');
    } catch (emailError) {
      console.error('Failed to send emails, but payment was successful:', emailError);
      // Don't fail the entire request if emails fail
    }

    // Log successful transaction
    console.log('Payment verified successfully:', {
      reference: paymentData.reference,
      orderNumber: orderData.orderNumber,
      amount: paymentData.amount / 100, // Convert back to naira
      customer: paymentData.customer.email,
      timestamp: paymentData.paid_at
    });

    return NextResponse.json({
      success: true,
      paymentStatus: 'success',
      transactionId: paymentData.id,
      reference: paymentData.reference,
      amount: paymentData.amount / 100, // Convert back to naira
      paidAt: paymentData.paid_at,
      channel: paymentData.channel,
      message: 'Payment verified successfully'
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error during payment verification',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}