// app/checkout/bank-transfer/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Copy,
  CheckCircle,
  Building2,
  Clock,
  Phone,
  Mail,
  ArrowLeft,
  Download,
  AlertCircle,
} from "lucide-react";

// Import PDF generation libraries
// npm install jspdf html2canvas
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useCart } from "@/providers/CartProvider";

interface OrderData {
  items: any[];
  customerInfo: any;
  totals: {
    subtotal: number;
    delivery: number;
    total: number;
  };
  deliveryDetails: any;
  orderNumber?: string;
}

const BankTransferPage: React.FC = () => {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [copiedField, setCopiedField] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const { clearCart } = useCart();

  // Bank account details
  const bankDetails = {
    bankName: "Access Bank",
    accountName: "Aleebansparks Limited", 
    accountNumber: "0123456789",
    sortCode: "044150149"
  };

  useEffect(() => {
    // Get order data from localStorage without affecting cart
    const storedData = localStorage.getItem('checkoutData');
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        
        // Verify we have items
        if (!data.items || data.items.length === 0) {
          console.error('No items found in order data');
          router.push('/cart');
          return;
        }
        
        // Generate order number
        const orderNumber = `AS${Date.now().toString().slice(-8)}`;
        const orderWithNumber = { ...data, orderNumber };
        setOrderData(orderWithNumber);
        
        // Send emails
        sendEmails(orderWithNumber);
        
        // Clear checkout data from localStorage
        clearCart();
        // localStorage.removeItem('checkoutData');
      } catch (error) {
        console.error('Error parsing order data:', error);
        router.push('/cart');
      }
    } else {
      console.log('No checkout data found, redirecting to cart');
      router.push('/cart');
    }
    setLoading(false);
  }, [router]);

  const sendEmails = async (data: OrderData) => {
    try {
      // Send email to business
      await sendBusinessEmail(data);
      
      // Send confirmation email to customer
      await sendCustomerEmail(data);
      
      setEmailSent(true);
    } catch (error) {
      console.error('Error sending emails:', error);
    }
  };

  const sendBusinessEmail = async (data: OrderData) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: "Aleebansparks@gmail.com",
          subject: `[Aleebansparks]: You've got a new order: #${data.orderNumber}`,
          orderNumber: data.orderNumber,
          customerName: `${data.customerInfo.firstName} ${data.customerInfo.lastName}`,
          customerEmail: data.customerInfo.email,
          customerPhone: data.customerInfo.phone,
          shippingAddress: {
            address: data.customerInfo.address,
            apartment: data.customerInfo.apartment,
            city: data.customerInfo.city,
            state: data.customerInfo.state,
            postalCode: data.customerInfo.postalCode,
            country: data.customerInfo.country
          },
          items: data.items,
          totals: data.totals,
          deliveryMethod: data.deliveryDetails,
          paymentMethod: "Direct bank transfer",
          orderDate: new Date().toISOString(),
          template: 'business_order_notification'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send business email');
      }
      
      console.log('Business email sent successfully');
    } catch (error) {
      console.error('Error sending business email:', error);
    }
  };

  const sendCustomerEmail = async (data: OrderData) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: data.customerInfo.email,
          subject: `Order Confirmation - #${data.orderNumber} | Aleebansparks`,
          customerName: `${data.customerInfo.firstName} ${data.customerInfo.lastName}`,
          orderNumber: data.orderNumber,
          items: data.items,
          totals: data.totals,
          deliveryDetails: data.deliveryDetails,
          bankDetails: bankDetails,
          shippingAddress: {
            address: data.customerInfo.address,
            apartment: data.customerInfo.apartment,
            city: data.customerInfo.city,
            state: data.customerInfo.state,
            postalCode: data.customerInfo.postalCode,
            country: data.customerInfo.country
          },
          orderDate: new Date().toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          template: 'customer_order_confirmation'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send customer email');
      }
      
      console.log('Customer email sent successfully');
    } catch (error) {
      console.error('Error sending customer email:', error);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
  };

  const downloadPDFReceipt = async () => {
    if (!orderData) return;
    
    setDownloadingPDF(true);
    
    try {
      // Create a temporary div with the receipt content
      const receiptElement = document.createElement('div');
      receiptElement.innerHTML = generateReceiptHTML();
      receiptElement.style.width = '210mm'; // A4 width
      receiptElement.style.padding = '20mm';
      receiptElement.style.backgroundColor = 'white';
      receiptElement.style.fontFamily = 'Arial, sans-serif';
      receiptElement.style.position = 'absolute';
      receiptElement.style.left = '-9999px';
      
      document.body.appendChild(receiptElement);
      
      // Generate canvas from HTML
      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Download the PDF
      pdf.save(`Aleebansparks-Receipt-${orderData.orderNumber}.pdf`);
      
      // Clean up
      document.body.removeChild(receiptElement);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setDownloadingPDF(false);
    }
  };

  const generateReceiptHTML = () => {
    if (!orderData) return '';
    
    return `
      <div style="max-width: 170mm; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
        <!-- Header -->
        <div style="text-align: center; border-bottom: 3px solid #1a202c; padding-bottom: 15px; margin-bottom: 25px;">
          <h1 style="font-size: 28px; font-weight: bold; color: #1a202c; margin: 0 0 5px 0;">ALEEBANSPARKS</h1>
          <p style="font-size: 16px; color: #666; margin: 0;">Order Receipt</p>
        </div>

        <!-- Order Info -->
        <div style="background: #f7fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3182ce;">
          <h2 style="font-size: 20px; font-weight: bold; color: #1a202c; margin: 0 0 5px 0;">Order #${orderData.orderNumber}</h2>
          <p style="color: #666; font-size: 14px; margin: 0;">Date: ${new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
        </div>

        <!-- Customer & Shipping Info -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div>
            <h3 style="font-size: 14px; font-weight: bold; color: #1a202c; margin: 0 0 10px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">CUSTOMER INFORMATION</h3>
            <div style="background: #f7fafc; padding: 12px; border-radius: 6px; font-size: 12px;">
              <p style="margin: 0 0 5px 0;"><strong>Name:</strong> ${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}</p>
              <p style="margin: 0 0 5px 0;"><strong>Email:</strong> ${orderData.customerInfo.email}</p>
              <p style="margin: 0;"><strong>Phone:</strong> ${orderData.customerInfo.phone}</p>
            </div>
          </div>
          
          <div>
            <h3 style="font-size: 14px; font-weight: bold; color: #1a202c; margin: 0 0 10px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">SHIPPING ADDRESS</h3>
            <div style="background: #f7fafc; padding: 12px; border-radius: 6px; font-size: 12px; line-height: 1.4;">
              ${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}<br>
              ${orderData.customerInfo.address}<br>
              ${orderData.customerInfo.apartment ? orderData.customerInfo.apartment + '<br>' : ''}
              ${orderData.customerInfo.city}, ${orderData.customerInfo.state}<br>
              ${orderData.customerInfo.postalCode ? orderData.customerInfo.postalCode + '<br>' : ''}
              ${orderData.customerInfo.country}
            </div>
          </div>
        </div>

        <!-- Delivery Method -->
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 14px; font-weight: bold; color: #1a202c; margin: 0 0 10px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">DELIVERY METHOD</h3>
          <div style="background: #f7fafc; padding: 12px; border-radius: 6px; font-size: 12px;">
            <p style="margin: 0 0 5px 0;"><strong>Service:</strong> ${orderData.deliveryDetails.name}</p>
            <p style="margin: 0 0 5px 0;"><strong>Description:</strong> ${orderData.deliveryDetails.description}</p>
            <p style="margin: 0 0 5px 0;"><strong>Estimated:</strong> ${orderData.deliveryDetails.estimatedDays}</p>
            <p style="margin: 0;"><strong>Coverage:</strong> ${orderData.deliveryDetails.coverage}</p>
          </div>
        </div>

        <!-- Items Table -->
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 14px; font-weight: bold; color: #1a202c; margin: 0 0 10px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">ORDER ITEMS</h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; font-size: 12px;">
            <thead>
              <tr style="background: #1a202c; color: white;">
                <th style="padding: 10px; text-align: left; border: 1px solid #e2e8f0;">Item</th>
                <th style="padding: 10px; text-align: center; border: 1px solid #e2e8f0; width: 60px;">Qty</th>
                <th style="padding: 10px; text-align: right; border: 1px solid #e2e8f0; width: 80px;">Unit Price</th>
                <th style="padding: 10px; text-align: right; border: 1px solid #e2e8f0; width: 80px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.items.map((item, index) => `
                <tr style="background: ${index % 2 === 0 ? '#f7fafc' : 'white'};">
                  <td style="padding: 10px; border: 1px solid #e2e8f0;">
                    <strong>${item.name}</strong>
                    ${item.size ? `<br><small style="color: #666;">Size: ${item.size}</small>` : ''}
                    ${item.color ? `<br><small style="color: #666;">Color: ${item.color}</small>` : ''}
                  </td>
                  <td style="padding: 10px; text-align: center; border: 1px solid #e2e8f0;">${item.quantity}</td>
                  <td style="padding: 10px; text-align: right; border: 1px solid #e2e8f0;">₦${item.price?.toLocaleString()}</td>
                  <td style="padding: 10px; text-align: right; border: 1px solid #e2e8f0; font-weight: bold;">₦${(item.price * item.quantity)?.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div style="background: #f7fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px;">
            <span>Subtotal:</span>
            <span>₦${orderData.totals.subtotal?.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px;">
            <span>Shipping (${orderData.deliveryDetails.name}):</span>
            <span>₦${orderData.totals.delivery?.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; color: #1a202c; border-top: 2px solid #1a202c; padding-top: 8px; margin-top: 8px;">
            <span>Total Amount:</span>
            <span>₦${orderData.totals.total?.toLocaleString()}</span>
          </div>
        </div>

        <!-- Payment Instructions -->
        <div style="background: #fef5e7; border: 2px solid #f6ad55; border-radius: 8px; padding: 15px;">
          <h3 style="font-weight: bold; color: #c05621; margin: 0 0 10px 0; font-size: 14px;">💳 PAYMENT INSTRUCTIONS</h3>
          <p style="color: #c05621; margin: 0 0 15px 0; font-size: 12px;">
            Please transfer the exact amount to the bank account below to complete your order.
          </p>
          
          <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #f6ad55; margin-bottom: 10px;">
            <table style="width: 100%; font-size: 12px;">
              <tr>
                <td style="padding: 3px 0; color: #666;">Bank Name:</td>
                <td style="padding: 3px 0; font-weight: bold; text-align: right;">${bankDetails.bankName}</td>
              </tr>
              <tr>
                <td style="padding: 3px 0; color: #666;">Account Name:</td>
                <td style="padding: 3px 0; font-weight: bold; text-align: right;">${bankDetails.accountName}</td>
              </tr>
              <tr>
                <td style="padding: 3px 0; color: #666;">Account Number:</td>
                <td style="padding: 3px 0; font-weight: bold; text-align: right;">${bankDetails.accountNumber}</td>
              </tr>
              <tr style="border-top: 1px solid #f6ad55;">
                <td style="padding: 8px 0 3px 0; color: #666;">Amount to Transfer:</td>
                <td style="padding: 8px 0 3px 0; font-weight: bold; text-align: right; color: #38a169; font-size: 14px;">₦${orderData.totals.total?.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <div style="background: #c6f6d5; border: 1px solid #38a169; border-radius: 6px; padding: 8px; text-align: center;">
            <strong style="color: #276749;">Important:</strong> 
            <span style="color: #276749;"> Include "</span>
            <strong style="color: #276749;">#${orderData.orderNumber}</strong>
            <span style="color: #276749;">" in your transfer description/remark</span>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; color: #666; font-size: 11px;">
          <p style="margin: 0 0 5px 0;"><strong>ALEEBANSPARKS</strong> - Thank you for your order!</p>
          <p style="margin: 0 0 5px 0;">Contact us: support@aleebansparks.com | +234 (0) 123 456 7890</p>
          <p style="margin: 0 0 5px 0;">Your order will be processed and shipped once payment is confirmed.</p>
          <p style="margin: 0;">Generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
          <Link href="/cart">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Return to Cart
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Your order <span className="font-semibold">#{orderData.orderNumber}</span> has been placed successfully.
          </p>
          {emailSent && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Confirmation emails have been sent to you and our team.
              </p>
            </div>
          )}
        </motion.div>

        {/* Bank Transfer Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          <div className="flex items-center mb-4">
            <Building2 className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Complete Your Payment</h2>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Important:</p>
                <p>Please transfer the exact amount to the account below and include your order number <strong>#{orderData.orderNumber}</strong> in the transfer description/remark.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{bankDetails.bankName}</span>
                  <button
                    onClick={() => copyToClipboard(bankDetails.bankName, 'bankName')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    {copiedField === 'bankName' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{bankDetails.accountName}</span>
                  <button
                    onClick={() => copyToClipboard(bankDetails.accountName, 'accountName')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    {copiedField === 'accountName' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-lg">{bankDetails.accountNumber}</span>
                  <button
                    onClick={() => copyToClipboard(bankDetails.accountNumber, 'accountNumber')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    {copiedField === 'accountNumber' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Transfer</label>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="font-bold text-lg text-green-800">₦{orderData.totals.total?.toLocaleString()}</span>
                  <button
                    onClick={() => copyToClipboard(orderData.totals.total.toString(), 'amount')}
                    className="p-1 hover:bg-green-200 rounded transition-colors"
                  >
                    {copiedField === 'amount' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-green-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Transfer Description/Remark:</p>
                <div className="flex items-center justify-between bg-white p-2 rounded border">
                  <span className="font-mono font-medium">#{orderData.orderNumber}</span>
                  <button
                    onClick={() => copyToClipboard(orderData.orderNumber!, 'orderNumber')}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {copiedField === 'orderNumber' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-yellow-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          
          {/* Items */}
          <div className="space-y-3 mb-4">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.mainImage?.asset?.url || ""}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity} • ₦{item.price?.toLocaleString()} each
                  </p>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  ₦{(item.price * item.quantity)?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>₦{orderData.totals.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery ({orderData.deliveryDetails.name}):</span>
              <span>₦{orderData.totals.delivery?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
              <span>Total:</span>
              <span>₦{orderData.totals.total?.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Shipping Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
              <div className="text-sm text-gray-600">
                <p>{orderData.customerInfo.firstName} {orderData.customerInfo.lastName}</p>
                <p>{orderData.customerInfo.address}</p>
                {orderData.customerInfo.apartment && <p>{orderData.customerInfo.apartment}</p>}
                <p>{orderData.customerInfo.city}, {orderData.customerInfo.state}</p>
                {orderData.customerInfo.postalCode && <p>{orderData.customerInfo.postalCode}</p>}
                <p>{orderData.customerInfo.phone}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Delivery Method</h4>
              <div className="text-sm text-gray-600">
                <p className="font-medium">{orderData.deliveryDetails.name}</p>
                <p>{orderData.deliveryDetails.description}</p>
                <p>Estimated: {orderData.deliveryDetails.estimatedDays}</p>
                <p>Coverage: {orderData.deliveryDetails.coverage}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <Button
            onClick={downloadPDFReceipt}
            disabled={downloadingPDF}
            variant="outline"
            className="flex-1 py-3"
          >
            {downloadingPDF ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-2"></div>
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download Receipt (PDF)
              </>
            )}
          </Button>
          
          <Button
            onClick={() => router.push('/')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            Continue Shopping
          </Button>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-gray-100 rounded-lg p-6 text-center"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-center">
              <Mail className="w-5 h-5 text-gray-600 mr-2" />
              <span className="text-sm text-gray-600">support@aleebansparks.com</span>
            </div>
            <div className="flex items-center justify-center">
              <Phone className="w-5 h-5 text-gray-600 mr-2" />
              <span className="text-sm text-gray-600">+234 (0) 123 456 7890</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            We'll contact you within 24 hours after payment confirmation to update you on your order status. 
            Your order will be processed and shipped once payment is verified.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default BankTransferPage;
