
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/providers/CartProvider";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Lock,
  CreditCard,
  Building2,
  Truck,
  Phone,
  Info,
  CheckCircle,
  AlertCircle,
  MapPin,
  Mail,
} from "lucide-react";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Nigerian states
const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Federal Capital Territory", "Gombe", "Imo", "Jigawa",
  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun",
  "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

// Delivery options
const DELIVERY_OPTIONS = [
  {
    id: 'gigl',
    name: 'GIGL Express',
    price: 5500,
    description: 'Nationwide delivery - Fast and reliable',
    coverage: 'All 36 states + FCT',
    estimatedDays: '2-4 business days',
    icon: <Truck className="w-5 h-5" />
  },
  {
    id: 'guo',
    name: 'GUO Transport',
    price: 4500,
    description: 'Limited coverage - Budget friendly',
    coverage: 'Selected major cities',
    estimatedDays: '3-7 business days',
    icon: <Truck className="w-5 h-5" />
  },
  {
    id: 'rider',
    name: 'Our Rider (Benin City)',
    price: 2000,
    description: 'Same day delivery within Benin City',
    coverage: 'Benin City only',
    estimatedDays: 'Same day',
    icon: <MapPin className="w-5 h-5" />
  }
];

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  country: string;
  deliveryMethod: string;
  paymentMethod: string;
  emailOffers: boolean;
  saveInfo: boolean;
}

// Cookie utilities
const setCookie = (name: string, value: string, days: number = 30) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return '';
};

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    country: 'Nigeria',
    deliveryMethod: 'gigl',
    paymentMethod: 'paystack',
    emailOffers: false,
    saveInfo: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  // Load saved information from cookies on component mount
  useEffect(() => {
    const savedInfo = getCookie('checkout_info');
    if (savedInfo) {
      try {
        const parsedInfo = JSON.parse(decodeURIComponent(savedInfo));
        setFormData(prev => ({ ...prev, ...parsedInfo }));
      } catch (error) {
        console.error('Error parsing saved checkout info:', error);
      }
    }
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  const selectedDelivery = DELIVERY_OPTIONS.find(option => option.id === formData.deliveryMethod);
  const deliveryFee = selectedDelivery?.price || 0;
  const finalTotal = totalPrice + deliveryFee;

  const handleInputChange = (field: keyof CheckoutFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    // Save information to cookies if user opted to save
    if (formData.saveInfo) {
      const infoToSave = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        phone: formData.phone,
        country: formData.country,
      };
      setCookie('checkout_info', encodeURIComponent(JSON.stringify(infoToSave)));
    }

    try {
      const orderData = {
        items,
        customerInfo: formData,
        totals: {
          subtotal: totalPrice,
          delivery: deliveryFee,
          total: finalTotal
        },
        deliveryDetails: selectedDelivery
      };

      localStorage.setItem('checkoutData', JSON.stringify(orderData));
      router.push('/checkout/payment');

    } catch (error) {
      console.error('Checkout error:', error);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <motion.div variants={sectionVariants} className="mb-8 px-4">
          <Link href="/cart" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:px-4">
          {/* Left Side - Forms */}
          <motion.div variants={sectionVariants} className="space-y-8">
            
            {/* Contact Information */}
            <div className="bg-white sm:rounded-lg p-5 sm:p-6 sm:shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact</h2>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email or mobile phone number"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.emailOffers}
                    onChange={(e) => handleInputChange('emailOffers', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Email me with news and offers</span>
                </label>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white sm:rounded-lg p-5 sm:p-6 sm:shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery</h2>
              
              <div className="space-y-4">
                <div className="mb-4">
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Nigeria">Nigeria</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="First name (optional)"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={formData.apartment}
                    onChange={(e) => handleInputChange('apartment', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select State</option>
                      {NIGERIAN_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Postal code (optional)"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.saveInfo}
                    onChange={(e) => handleInputChange('saveInfo', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Save this information for next time</span>
                </label>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white sm:rounded-lg p-5 sm:p-6 sm:shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping method</h2>
              
              <div className="space-y-3">
                {DELIVERY_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.deliveryMethod === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={option.id}
                      checked={formData.deliveryMethod === option.id}
                      onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                      className="sr-only"
                    />
                    
                    <div className="flex items-center flex-1">
                      <div className={`p-2 rounded-lg mr-3 ${
                        formData.deliveryMethod === option.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {option.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{option.name}</h4>
                            <p className="text-sm text-gray-600">{option.description}</p>
                            <p className="text-xs text-gray-500">
                              {option.coverage} • {option.estimatedDays}
                            </p>
                          </div>
                          <span className="font-bold text-gray-900 ml-4">
                            ₦{option.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`w-4 h-4 rounded-full border-2 ml-3 flex-shrink-0 ${
                      formData.deliveryMethod === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.deliveryMethod === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5"></div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              
              {/* Delivery Support Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium mb-2">Need Help with Delivery?</p>
                    <p className="text-xs text-blue-700 mb-3">
                      If you have questions about delivery options, coverage areas, or need assistance 
                      with your order, please contact our support team:
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-blue-700">
                        <Phone className="w-3 h-3 mr-2" />
                        <span>+234 (0) 123 456 7890</span>
                      </div>
                      <div className="flex items-center text-xs text-blue-700">
                        <Mail className="w-3 h-3 mr-2" />
                        <span>support@aleebansparks.com</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Delivery Note */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-amber-800 font-medium mb-1">Delivery Information</p>
                    <p className="text-xs text-amber-700">
                      The above fees are flat rates for items purchased. There are cases of increase 
                      in the fee and you will be notified. Delivery times may vary based on location 
                      and weather conditions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Order Summary & Payment */}
          <motion.div variants={sectionVariants} className="space-y-6">
            
            {/* Order Summary */}
            <div className="bg-white sm:rounded-lg p-5 sm:p-6 sm:shadow-sm border border-gray-200 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item._id}-${item.size}-${item.color}`} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.mainImage?.asset?.url || ""}
                        alt={item.mainImage?.alt || item.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
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
                  <span>₦{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping ({selectedDelivery?.name})</span>
                  <span>₦{deliveryFee.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex justify-between text-lg font-bold text-gray-900 mt-4">
                <span>Total</span>
                <span>NGN ₦{finalTotal.toLocaleString()}</span>
              </div>

              Payment Methods
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
                <p className="text-sm text-gray-600 mb-4">All transactions are secure and encrypted.</p>
                

                {/* Pay Now Button */}
                <form onSubmit={handleSubmit} className="mt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Lock className="w-5 h-5 mr-2" />
                          Proceed to Payment
                      </div>
                    )}
                  </Button>
                </form>

                {/* Security Notice */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Your payment information is secure and encrypted
                  </p>
                </div>
              </div>

              {/* Billing Address */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing address</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="billing"
                      defaultChecked
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-900">Same as shipping address</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="billing"
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-900">Use a different billing address</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;