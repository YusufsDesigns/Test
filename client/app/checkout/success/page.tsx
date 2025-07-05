// app/checkout/success/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/CartProvider";
import {
  CheckCircle,
  Download,
  Package,
  Truck,
  Clock,
  CreditCard,
  Building2,
  Phone,
  Mail,
  Home,
  ShoppingBag,
} from "lucide-react";

// Import PDF generation libraries
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface OrderData {
  items: any[];
  customerInfo: any;
  totals: {
    subtotal: number;
    delivery: number;
    total: number;
  };
  deliveryDetails: any;
  orderNumber: string;
  paymentReference?: string;
  paymentStatus: string;
  paymentMethod: string;
}

const SuccessPage: React.FC = () => {
  const router = useRouter();
  const { clearCart } = useCart();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  useEffect(() => {
    // Get order data from localStorage
    const storedData = localStorage.getItem("successOrderData");

    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setOrderData(data);

        // Clear the cart since order is successful
        clearCart();

        // Clear the success order data
        // localStorage.removeItem("successOrderData");
      } catch (error) {
        console.error("Error parsing success order data:", error);
        router.push("/");
      }
    } else {
      // No order data found, redirect to home
      router.push("/");
    }

    setLoading(false);
  }, [router, clearCart]);

  const downloadPDFReceipt = async () => {
    if (!orderData) return;

    setDownloadingPDF(true);

    try {
      // Create a temporary div with the receipt content
      const receiptElement = document.createElement("div");
      receiptElement.innerHTML = generateReceiptHTML();
      receiptElement.style.width = "210mm"; // A4 width
      receiptElement.style.padding = "20mm";
      receiptElement.style.backgroundColor = "white";
      receiptElement.style.fontFamily = "Arial, sans-serif";
      receiptElement.style.position = "absolute";
      receiptElement.style.left = "-9999px";

      document.body.appendChild(receiptElement);

      // Generate canvas from HTML
      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      pdf.save(`Aleebansparks-Receipt-${orderData.orderNumber}.pdf`);

      // Clean up
      document.body.removeChild(receiptElement);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setDownloadingPDF(false);
    }
  };

  const generateReceiptHTML = () => {
    if (!orderData) return "";

    const isPaidOrder = orderData.paymentMethod === "paystack";

    return `
      <div style="max-width: 170mm; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
        <!-- Header -->
        <div style="text-align: center; border-bottom: 3px solid #1a202c; padding-bottom: 15px; margin-bottom: 25px;">
          <h1 style="font-size: 28px; font-weight: bold; color: #1a202c; margin: 0 0 5px 0;">ALEEBANSPARKS</h1>
          <p style="font-size: 16px; color: #666; margin: 0;">${isPaidOrder ? "Payment Receipt" : "Order Receipt"}</p>
        </div>

        <!-- Success Banner -->
        <div style="background: ${isPaidOrder ? "#c6f6d5" : "#fed7d7"}; border: 2px solid ${isPaidOrder ? "#38a169" : "#e53e3e"}; border-radius: 8px; padding: 15px; text-align: center; margin-bottom: 20px;">
          <h2 style="color: ${isPaidOrder ? "#276749" : "#742a2a"}; font-size: 20px; margin: 0 0 5px 0;">
            ${isPaidOrder ? "✅ Payment Successful!" : "⏳ Order Confirmed - Payment Pending"}
          </h2>
          <p style="color: ${isPaidOrder ? "#276749" : "#742a2a"}; font-size: 14px; margin: 0;">
            ${isPaidOrder ? "Your payment has been processed successfully." : "Please complete your bank transfer to proceed."}
          </p>
        </div>

        <!-- Order Info -->
        <div style="background: #f7fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3182ce;">
          <h2 style="font-size: 20px; font-weight: bold; color: #1a202c; margin: 0 0 5px 0;">Order #${orderData.orderNumber}</h2>
          <p style="color: #666; font-size: 14px; margin: 0 0 5px 0;">Date: ${new Date().toLocaleDateString(
            "en-GB",
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}</p>
          ${orderData.paymentReference ? `<p style="color: #666; font-size: 12px; margin: 0;">Payment Reference: ${orderData.paymentReference}</p>` : ""}
        </div>

        <!-- Payment Status -->
        <div style="background: ${isPaidOrder ? "#e6fffa" : "#fffbeb"}; border: 1px solid ${isPaidOrder ? "#38a169" : "#f6ad55"}; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
          <h3 style="font-size: 14px; font-weight: bold; color: ${isPaidOrder ? "#276749" : "#c05621"}; margin: 0 0 10px 0; border-bottom: 1px solid ${isPaidOrder ? "#38a169" : "#f6ad55"}; padding-bottom: 5px;">PAYMENT INFORMATION</h3>
          <div style="background: white; padding: 12px; border-radius: 6px;">
            <table style="width: 100%; font-size: 12px;">
              <tr>
                <td style="padding: 3px 0; color: #666;">Payment Method:</td>
                <td style="padding: 3px 0; font-weight: bold; text-align: right;">${isPaidOrder ? "Card Payment (Paystack)" : "Bank Transfer"}</td>
              </tr>
              <tr>
                <td style="padding: 3px 0; color: #666;">Status:</td>
                <td style="padding: 3px 0; font-weight: bold; text-align: right; color: ${isPaidOrder ? "#38a169" : "#f6ad55"};">${isPaidOrder ? "PAID" : "PENDING"}</td>
              </tr>
              <tr>
                <td style="padding: 3px 0; color: #666;">Amount:</td>
                <td style="padding: 3px 0; font-weight: bold; text-align: right;">₦${orderData.totals.total?.toLocaleString()}</td>
              </tr>
              ${
                orderData.paymentReference
                  ? `
              <tr>
                <td style="padding: 3px 0; color: #666;">Reference:</td>
                <td style="padding: 3px 0; font-weight: bold; text-align: right; font-family: monospace;">${orderData.paymentReference}</td>
              </tr>
              `
                  : ""
              }
            </table>
          </div>
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
              ${orderData.customerInfo.apartment ? orderData.customerInfo.apartment + "<br>" : ""}
              ${orderData.customerInfo.city}, ${orderData.customerInfo.state}<br>
              ${orderData.customerInfo.postalCode ? orderData.customerInfo.postalCode + "<br>" : ""}
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
              ${orderData.items
                .map(
                  (item, index) => `
                <tr style="background: ${index % 2 === 0 ? "#f7fafc" : "white"};">
                  <td style="padding: 10px; border: 1px solid #e2e8f0;">
                    <strong>${item.name}</strong>
                    ${item.size ? `<br><small style="color: #666;">Size: ${item.size}</small>` : ""}
                    ${item.color ? `<br><small style="color: #666;">Color: ${item.color}</small>` : ""}
                  </td>
                  <td style="padding: 10px; text-align: center; border: 1px solid #e2e8f0;">${item.quantity}</td>
                  <td style="padding: 10px; text-align: right; border: 1px solid #e2e8f0;">₦${item.price?.toLocaleString()}</td>
                  <td style="padding: 10px; text-align: right; border: 1px solid #e2e8f0; font-weight: bold;">₦${(item.price * item.quantity)?.toLocaleString()}</td>
                </tr>
              `
                )
                .join("")}
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

        <!-- Next Steps -->
        <div style="background: ${isPaidOrder ? "#c6f6d5" : "#fef5e7"}; border: 2px solid ${isPaidOrder ? "#38a169" : "#f6ad55"}; border-radius: 8px; padding: 15px;">
          <h3 style="font-weight: bold; color: ${isPaidOrder ? "#276749" : "#c05621"}; margin: 0 0 10px 0; font-size: 14px;">
            ${isPaidOrder ? "🎉 WHAT HAPPENS NEXT?" : "💳 PAYMENT PENDING"}
          </h3>
          
          ${
            isPaidOrder
              ? `
            <div style="color: #276749; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0 0 8px 0;">✅ <strong>Payment Confirmed:</strong> Your order is now being processed</p>
              <p style="margin: 0 0 8px 0;">📦 <strong>Preparation:</strong> Your items are being prepared for shipment</p>
              <p style="margin: 0 0 8px 0;">🚚 <strong>Shipping:</strong> You'll receive tracking information via email</p>
              <p style="margin: 0 0 8px 0;">📧 <strong>Updates:</strong> We'll keep you informed throughout the process</p>
              <p style="margin: 0;">📞 <strong>Support:</strong> Contact us anytime if you have questions</p>
            </div>
          `
              : `
            <div style="color: #c05621; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0 0 8px 0;">⏳ <strong>Payment Required:</strong> Please complete your bank transfer</p>
              <p style="margin: 0 0 8px 0;">📧 <strong>Details Sent:</strong> Check your email for transfer instructions</p>
              <p style="margin: 0 0 8px 0;">🏦 <strong>Reference:</strong> Include order #${orderData.orderNumber} in transfer description</p>
              <p style="margin: 0 0 8px 0;">📞 <strong>Confirmation:</strong> We'll notify you once payment is received</p>
              <p style="margin: 0;">🚀 <strong>Processing:</strong> Order fulfillment begins after payment confirmation</p>
            </div>
          `
          }
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; color: #666; font-size: 11px;">
          <p style="margin: 0 0 5px 0;"><strong>ALEEBANSPARKS</strong> - Thank you for your ${isPaidOrder ? "purchase" : "order"}!</p>
          <p style="margin: 0 0 5px 0;">Contact us: support@aleebansparks.com | +234 (0) 123 456 7890</p>
          <p style="margin: 0 0 5px 0;">
            ${isPaidOrder ? "Your order is being processed and will be shipped soon." : "Your order will be processed and shipped once payment is confirmed."}
          </p>
          <p style="margin: 0;">Generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Order not found
          </h1>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPaidOrder = orderData.paymentMethod === "paystack";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isPaidOrder ? "Payment Successful!" : "Order Confirmed!"}
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            {isPaidOrder
              ? "Your payment has been processed and your order is confirmed."
              : "Your order has been placed successfully and is awaiting payment."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.mainImage?.asset?.url || ""}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <div className="text-xs text-gray-500">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && <span> • </span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₦{orderData.totals.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery ({orderData.deliveryDetails.name}):</span>
                  <span>₦{orderData.totals.delivery.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span>₦{orderData.totals.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Information
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment Method:</span>
                  <div className="flex items-center">
                    {isPaidOrder ? (
                      <CreditCard className="w-4 h-4 text-green-600 mr-2" />
                    ) : (
                      <Building2 className="w-4 h-4 text-yellow-600 mr-2" />
                    )}
                    <span className="text-sm font-medium">
                      {isPaidOrder ? "Card Payment" : "Bank Transfer"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isPaidOrder
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {isPaidOrder ? "Paid" : "Pending Payment"}
                  </span>
                </div>

                {orderData.paymentReference && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Reference:</span>
                    <span className="text-sm font-mono text-gray-900">
                      {orderData.paymentReference}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ₦{orderData.totals.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Delivery & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delivery Information
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Shipping Address
                  </h4>
                  <div className="text-sm text-gray-600">
                    <p>
                      {orderData.customerInfo.firstName}{" "}
                      {orderData.customerInfo.lastName}
                    </p>
                    <p>{orderData.customerInfo.address}</p>
                    {orderData.customerInfo.apartment && (
                      <p>{orderData.customerInfo.apartment}</p>
                    )}
                    <p>
                      {orderData.customerInfo.city},{" "}
                      {orderData.customerInfo.state}
                    </p>
                    {orderData.customerInfo.postalCode && (
                      <p>{orderData.customerInfo.postalCode}</p>
                    )}
                    <p>{orderData.customerInfo.phone}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Delivery Method
                  </h4>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">
                      {orderData.deliveryDetails.name}
                    </p>
                    <p>{orderData.deliveryDetails.description}</p>
                    <div className="flex items-center mt-2">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <span>
                        Estimated: {orderData.deliveryDetails.estimatedDays}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={downloadPDFReceipt}
                disabled={downloadingPDF}
                variant="outline"
                className="flex-1 py-3 w-full"
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

              <div className="grid grid-cols-1">
                <Button
                  onClick={() => router.push("/")}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </div>
            </div>

            {/* Next Steps */}
            <div
              className={`rounded-lg p-4 ${
                isPaidOrder
                  ? "bg-green-50 border border-green-200"
                  : "bg-yellow-50 border border-yellow-200"
              }`}
            >
              <h4
                className={`font-medium mb-3 ${
                  isPaidOrder ? "text-green-900" : "text-yellow-900"
                }`}
              >
                {isPaidOrder ? "What happens next?" : "Complete your payment"}
              </h4>

              <div
                className={`text-sm space-y-2 ${
                  isPaidOrder ? "text-green-800" : "text-yellow-800"
                }`}
              >
                {isPaidOrder ? (
                  <>
                    <p>• Your order is being prepared for shipment</p>
                    <p>• You'll receive tracking information via email</p>
                    <p>
                      • Delivery will begin according to your selected method
                    </p>
                    <p>• Contact us if you have any questions</p>
                  </>
                ) : (
                  <>
                    <p>• Check your email for bank transfer details</p>
                    <p>
                      • Include order number #{orderData.orderNumber} in
                      transfer description
                    </p>
                    <p>• Processing begins after payment confirmation</p>
                    <p>• You'll receive updates via email and SMS</p>
                  </>
                )}
              </div>
            </div>

            {/* Support */}
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <h4 className="font-medium text-gray-900 mb-3">Need Help?</h4>
              <div className="flex justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+234 (0) 123 456 7890</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>support@aleebansparks.com</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
