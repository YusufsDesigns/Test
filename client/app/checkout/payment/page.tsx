// app/checkout/paystack-payment/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePaystackPayment } from "react-paystack";
import { updateInventoryAfterPurchase, validateInventoryBeforePayment } from "@/lib/sanity";
import {
  ArrowLeft,
  Lock,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Loader2,
  XCircle,
  RefreshCw,
} from "lucide-react";

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

const PaystackPaymentPage: React.FC = () => {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentInitialized, setPaymentInitialized] = useState(false);
  const [inventoryValidated, setInventoryValidated] = useState(false);

  useEffect(() => {
    // Get order data from localStorage
    const storedData = localStorage.getItem("checkoutData");
    console.log("Stored data found:", storedData);

    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        console.log("Parsed order data:", data);

        // Verify we have items
        if (!data.items || data.items.length === 0) {
          console.error("No items found in order data");
          router.push("/cart");
          return;
        }

        // Generate order number
        const orderNumber = `AS${Date.now().toString().slice(-8)}`;
        const orderWithNumber = { ...data, orderNumber };
        setOrderData(orderWithNumber);
      } catch (error) {
        console.error("Error parsing order data:", error);
        router.push("/cart");
      }
    } else {
      console.log("No checkout data found, redirecting to cart");
      router.push("/cart");
    }
    setLoading(false);
  }, [router]);

  // Validate inventory when order data is loaded
  useEffect(() => {
    if (orderData && !inventoryValidated) {
      validateInventory();
    }
  }, [orderData, inventoryValidated]);

  const validateInventory = async () => {
    if (!orderData) return;

    try {
      const validation = await validateInventoryBeforePayment(orderData.items);
      
      if (!validation.valid) {
        setError(`Inventory Error: ${validation.errors.join(', ')}`);
        return;
      }
      
      setInventoryValidated(true);
      console.log('Inventory validation passed');
    } catch (error) {
      console.error('Error validating inventory:', error);
      setError('Unable to validate inventory. Please try again.');
    }
  };

  // Email sending is now handled by the verify-payment API
  const sendEmails = async (data: OrderData) => {
    console.log("Email sending is now handled by the verify-payment API");
  };

  // Paystack configuration
  const paystackConfig = orderData
    ? {
        reference: orderData.orderNumber || new Date().getTime().toString(),
        email: orderData.customerInfo.email,
        amount: Math.round(orderData.totals.total * 100), // Convert to kobo
        publicKey:
          process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
          "pk_test_your_public_key_here",
        currency: "NGN",
        channels: [
          "card",
          "bank",
          "ussd",
          "qr",
          "mobile_money",
          "bank_transfer",
        ],
        metadata: {
          orderNumber: orderData.orderNumber,
          customerName: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
          custom_fields: [
            {
              display_name: "Order Number",
              variable_name: "order_number",
              value: orderData.orderNumber,
            },
          ],
        },
      }
    : undefined;

  const initializePayment = paystackConfig
    ? usePaystackPayment(paystackConfig)
    : undefined;

  // Auto-trigger payment when page loads and inventory is validated
  useEffect(() => {
    if (orderData && paystackConfig && !paymentInitialized && !loading && inventoryValidated) {
      // Small delay to ensure UI is ready
      const timer = setTimeout(() => {
        handlePaystackPayment();
        setPaymentInitialized(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [orderData, paystackConfig, paymentInitialized, loading, inventoryValidated]);

  // Handle successful payment
  const onSuccess = async (reference: any) => {
    console.log("Payment successful:", reference);
    setProcessing(true);
    setError(null);

    try {
      // Call our API to verify the payment (which now handles emails automatically)
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reference: reference.reference,
          orderData: orderData,
        }),
      });

      const result = await response.json();

      if (result.success && result.paymentStatus === "success") {
        // Update inventory after successful payment verification
        console.log("Updating inventory after successful payment...");
        const inventoryUpdated = await updateInventoryAfterPurchase(orderData!.items);
        
        if (!inventoryUpdated) {
          console.error("Failed to update inventory, but payment was successful");
          // You might want to log this for manual inventory adjustment
        } else {
          console.log("Inventory successfully updated");
        }

        // Clear checkout data
        localStorage.removeItem("checkoutData");

        // Redirect to success page with order details
        localStorage.setItem(
          "successOrderData",
          JSON.stringify({
            ...orderData,
            paymentReference: reference.reference,
            paymentStatus: "success",
            paymentMethod: "paystack",
            inventoryUpdated,
            transactionId: result.transactionId,
            paidAt: result.paidAt,
            channel: result.channel,
          })
        );

        router.push("/checkout/success");
      } else {
        setError(
          result.error || "Payment verification failed. Please contact support with your payment reference."
        );
        setProcessing(false);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setError(
        "An error occurred while verifying payment. Please contact support."
      );
      setProcessing(false);
    }
  };

  // Handle payment errors
  const onError = (error: any) => {
    console.error("Payment error:", error);
    setProcessing(false);

    let errorMessage = "Payment failed. Please try again.";

    if (error.message) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    setError(errorMessage);
  };

  // Handle payment dialog close/cancellation
  const onClose = () => {
    console.log("Payment dialog closed");
    setProcessing(false);

    if (!processing) {
      setError(
        "Payment was cancelled. You can try again by clicking the payment button below."
      );
    }
  };

  const handlePaystackPayment = () => {
    if (!orderData || !paystackConfig || !initializePayment) {
      setError("Order data not available. Please try again.");
      return;
    }

    if (!inventoryValidated) {
      setError("Please wait for inventory validation to complete.");
      return;
    }

    setError(null);
    setProcessing(false);

    try {
      initializePayment({ onSuccess, onClose });
    } catch (error) {
      console.error("Error initializing payment:", error);
      setError("Failed to initialize payment. Please try again.");
    }
  };

  const retryPayment = () => {
    setError(null);
    setPaymentInitialized(false);
    setInventoryValidated(false);
    validateInventory();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
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
          className="mb-8"
        >
          <Link
            href="/checkout"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Checkout
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
          <p className="text-gray-600 mt-2">
            {!inventoryValidated
              ? "Validating inventory..."
              : !paymentInitialized
              ? "Initializing secure payment..."
              : "Review your order and complete payment securely with Paystack"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary - Same as before */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            {/* Order Number */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-blue-900">Order Number</p>
                  <p className="text-blue-700 font-mono">
                    #{orderData.orderNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
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

            {/* Totals */}
            <div className="space-y-3 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₦{orderData.totals.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping ({orderData.deliveryDetails?.name})</span>
                <span>₦{orderData.totals.delivery.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold text-gray-900 mt-4">
              <span>Total</span>
              <span>₦{orderData.totals.total.toLocaleString()}</span>
            </div>

            {/* Customer Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">
                Customer Information
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {orderData.customerInfo.firstName}{" "}
                  {orderData.customerInfo.lastName}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {orderData.customerInfo.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {orderData.customerInfo.phone}
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">
                Shipping Address
              </h3>
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
                  {orderData.customerInfo.city}, {orderData.customerInfo.state}
                </p>
                {orderData.customerInfo.postalCode && (
                  <p>{orderData.customerInfo.postalCode}</p>
                )}
                <p>{orderData.customerInfo.country}</p>
              </div>
            </div>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-blue-900">
                      Secure Payment with Paystack
                    </p>
                    <p className="text-sm text-blue-700">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-600">
                  Accepted payment methods:
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="px-3 py-2 bg-gray-100 rounded text-xs font-medium">
                    Visa
                  </div>
                  <div className="px-3 py-2 bg-gray-100 rounded text-xs font-medium">
                    Mastercard
                  </div>
                  <div className="px-3 py-2 bg-gray-100 rounded text-xs font-medium">
                    Verve
                  </div>
                  <div className="px-3 py-2 bg-gray-100 rounded text-xs font-medium">
                    Bank Transfer
                  </div>
                  <div className="px-3 py-2 bg-gray-100 rounded text-xs font-medium">
                    USSD
                  </div>
                </div>
              </div>

              {/* Processing Message */}
              {processing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <Loader2 className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0 animate-spin" />
                    <div>
                      <p className="font-medium text-blue-900">
                        Processing Payment
                      </p>
                      <p className="text-sm text-blue-700">
                        Please wait while we verify your payment and update inventory...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-red-900">Payment Error</p>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Inventory validation notice */}
              {!inventoryValidated && !error && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <Loader2 className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0 animate-spin" />
                    <div>
                      <p className="font-medium text-yellow-900">
                        Validating Inventory
                      </p>
                      <p className="text-sm text-yellow-700">
                        Checking product availability...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Auto-initialization notice */}
              {inventoryValidated && !paymentInitialized && !error && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <Loader2 className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0 animate-spin" />
                    <div>
                      <p className="font-medium text-yellow-900">
                        Initializing Payment
                      </p>
                      <p className="text-sm text-yellow-700">
                        The payment window will open automatically in a
                        moment...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pay/Retry Button */}
              <Button
                onClick={error ? retryPayment : handlePaystackPayment}
                disabled={processing || (!paystackConfig && !error) || !inventoryValidated}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing Payment...
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Retry Payment
                  </div>
                ) : !inventoryValidated ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Validating Inventory...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Pay ₦{orderData.totals.total.toLocaleString()} Securely
                  </div>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By clicking "Pay Securely", you agree to our terms and
                conditions
              </p>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-900">
                    Secure & Protected
                  </p>
                  <p className="text-sm text-green-700">
                    Your payment is processed securely by Paystack with
                    bank-level encryption. We never store your card details.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaystackPaymentPage;