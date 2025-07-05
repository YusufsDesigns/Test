// lib/emailTemplates.ts

interface EmailTemplateData {
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: any;
  items: any[];
  totals: {
    subtotal: number;
    delivery: number;
    total: number;
  };
  deliveryMethod?: any;
  paymentReference?: string;
  paymentMethod?: string;
  orderDate: string;
}

// Professional Business Email Template - For Completed Orders
export const generateBusinessEmailTemplate = (data: EmailTemplateData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>New Order - ${data.orderNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #1a1a1a;
          color: #ffffff;
          line-height: 1.5;
          padding: 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: #2a2a2a;
          border-radius: 12px;
          overflow: hidden;
        }
        .header { 
          background: #1a1a1a;
          padding: 40px 30px 30px;
          text-align: left;
        }
        .sender-info {
          display: flex;
          align-items: center;
          margin-bottom: 30px;
        }
        .avatar {
          width: 48px;
          height: 48px;
          background: #f59e0b;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          color: #000;
          margin-right: 15px;
        }
        .sender-details h3 {
          font-size: 16px;
          font-weight: 500;
          color: #ffffff;
          margin-bottom: 2px;
        }
        .sender-details p {
          font-size: 14px;
          color: #999999;
        }
        .company-name {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 15px;
        }
        .main-title {
          font-size: 32px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 20px;
          line-height: 1.2;
        }
        .subtitle {
          font-size: 16px;
          color: #cccccc;
          margin-bottom: 0;
        }
        .content {
          padding: 40px 30px;
          background: #2a2a2a;
        }
        .section {
          margin-bottom: 35px;
        }
        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 20px;
        }
        .order-header {
          background: #1a1a1a;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }
        .order-number {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 5px;
        }
        .order-date {
          font-size: 14px;
          color: #999999;
        }
        .product-item {
          display: flex;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid #3a3a3a;
        }
        .product-item:last-child {
          border-bottom: none;
        }
        .product-image {
          width: 60px;
          height: 60px;
          background: #3a3a3a;
          border-radius: 8px;
          margin-right: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #999999;
        }
        .product-details {
          flex: 1;
        }
        .product-name {
          font-size: 16px;
          font-weight: 500;
          color: #ffffff;
          margin-bottom: 5px;
        }
        .product-variant {
          font-size: 14px;
          color: #999999;
        }
        .product-quantity {
          font-size: 16px;
          color: #ffffff;
          margin: 0 20px;
          min-width: 30px;
          text-align: center;
        }
        .product-price {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          text-align: right;
          min-width: 100px;
        }
        .totals-section {
          background: #1a1a1a;
          border-radius: 8px;
          padding: 25px;
          margin-top: 20px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 16px;
        }
        .total-row .label {
          color: #cccccc;
        }
        .total-row .value {
          color: #ffffff;
          font-weight: 500;
        }
        .total-final {
          border-top: 1px solid #3a3a3a;
          padding-top: 15px;
          margin-top: 15px;
          font-size: 18px;
          font-weight: 700;
        }
        .payment-status {
          background: #065f46;
          color: #d1fae5;
          padding: 12px 20px;
          border-radius: 6px;
          text-align: center;
          font-size: 14px;
          font-weight: 600;
          margin-top: 15px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
          margin-bottom: 25px;
        }
        .info-card {
          background: #1a1a1a;
          border-radius: 8px;
          padding: 20px;
        }
        .info-card h4 {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 15px;
        }
        .info-row {
          margin-bottom: 8px;
          font-size: 14px;
        }
        .info-label {
          color: #999999;
          display: inline-block;
          width: 100px;
        }
        .info-value {
          color: #ffffff;
        }
        .address-text {
          color: #cccccc;
          line-height: 1.6;
          font-size: 14px;
        }
        .status-success {
          background: #d1fae5;
          border: 1px solid #10b981;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
        }
        .status-success h4 {
          color: #065f46;
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 10px;
        }
        .status-success p {
          color: #065f46;
          font-size: 14px;
          margin-bottom: 5px;
        }
        .footer {
          background: #1a1a1a;
          padding: 25px 30px;
          text-align: center;
          border-top: 1px solid #3a3a3a;
        }
        .footer p {
          color: #999999;
          font-size: 12px;
          margin-bottom: 5px;
        }
        @media (max-width: 600px) {
          .info-grid { grid-template-columns: 1fr; }
          .product-item { flex-direction: column; align-items: flex-start; }
          .product-quantity, .product-price { margin: 10px 0; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="sender-info">
            <div class="avatar">A</div>
            <div class="sender-details">
              <h3>Aleebansparks</h3>
              <p>Order Management</p>
            </div>
          </div>
          
          <div class="company-name">Aleebansparks</div>
          <h1 class="main-title">New Order Received: #${data.orderNumber}</h1>
          <p class="subtitle">Payment confirmed - Ready to process order from ${data.customerName}</p>
        </div>

        <!-- Content -->
        <div class="content">
          <!-- Order Summary Section -->
          <div class="section">
            <h2 class="section-title">Order Summary</h2>
            
            <div class="order-header">
              <div class="order-number">Order #${data.orderNumber}</div>
              <div class="order-date">(${new Date(data.orderDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })})</div>
            </div>

            <!-- Product Items -->
            ${data.items.map(item => `
              <div class="product-item">
                <div class="product-image">
                  ${item.mainImage?.asset?.url ? 
                    `<img src="${item.mainImage.asset.url}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">` :
                    'IMG'
                  }
                </div>
                <div class="product-details">
                  <div class="product-name">${item.name}</div>
                  ${item.size || item.color ? `
                    <div class="product-variant">
                      ${item.size ? `Size: ${item.size}` : ''}
                      ${item.size && item.color ? ' • ' : ''}
                      ${item.color ? `Color: ${item.color}` : ''}
                    </div>
                  ` : ''}
                </div>
                <div class="product-quantity">×${item.quantity}</div>
                <div class="product-price">₦${(item.price * item.quantity)?.toLocaleString()}</div>
              </div>
            `).join('')}

            <!-- Totals -->
            <div class="totals-section">
              <div class="total-row">
                <span class="label">Subtotal:</span>
                <span class="value">₦${data.totals.subtotal?.toLocaleString()}</span>
              </div>
              <div class="total-row">
                <span class="label">Shipping: ${data.deliveryMethod?.name || 'Standard delivery'}</span>
                <span class="value">₦${data.totals.delivery?.toLocaleString()}</span>
              </div>
              <div class="total-row total-final">
                <span class="label">Total:</span>
                <span class="value">₦${data.totals.total?.toLocaleString()}</span>
              </div>
              
              <div class="payment-status">
                ✅ Payment Confirmed - ${data.paymentMethod || 'Paystack'}
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div class="section">
            <h2 class="section-title">Customer & Shipping Details</h2>
            
            <div class="info-grid">
              <div class="info-card">
                <h4>Customer Information</h4>
                <div class="info-row">
                  <span class="info-label">Name:</span>
                  <span class="info-value">${data.customerName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${data.customerEmail}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${data.customerPhone}</span>
                </div>
              </div>
              
              <div class="info-card">
                <h4>Shipping Address</h4>
                <div class="address-text">
                  ${data.customerName}<br>
                  ${data.shippingAddress?.address}<br>
                  ${data.shippingAddress?.apartment ? data.shippingAddress.apartment + '<br>' : ''}
                  ${data.shippingAddress?.city}, ${data.shippingAddress?.state}<br>
                  ${data.shippingAddress?.postalCode ? data.shippingAddress.postalCode + '<br>' : ''}
                  ${data.shippingAddress?.country || 'Nigeria'}
                </div>
              </div>
            </div>
          </div>

          <!-- Delivery Information -->
          <div class="section">
            <div class="info-card">
              <h4>Delivery Information</h4>
              <div class="info-row">
                <span class="info-label">Method:</span>
                <span class="info-value">${data.deliveryMethod?.name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Estimated:</span>
                <span class="info-value">${data.deliveryMethod?.estimatedDays}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Coverage:</span>
                <span class="info-value">${data.deliveryMethod?.coverage}</span>
              </div>
            </div>
          </div>

          <!-- Payment Confirmation -->
          <div class="status-success">
            <h4>✅ Payment Confirmed</h4>
            <p><strong>Method:</strong> ${data.paymentMethod || 'Paystack'}</p>
            <p><strong>Amount:</strong> ₦${data.totals.total?.toLocaleString()}</p>
            ${data.paymentReference ? `<p><strong>Reference:</strong> ${data.paymentReference}</p>` : ''}
            <p><strong>Status:</strong> Payment successfully processed</p>
            <p><strong>Action Required:</strong> Process and ship order immediately</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>Aleebansparks Order Management System</p>
          <p>This notification was generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Professional Customer Email Template - For Completed Orders
export const generateCustomerEmailTemplate = (data: EmailTemplateData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Order Confirmation - ${data.orderNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f8fafc;
          color: #1a1a1a;
          line-height: 1.5;
          padding: 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 30px;
          text-align: center;
          color: white;
        }
        .company-name {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .header-subtitle {
          font-size: 16px;
          opacity: 0.9;
        }
        .content {
          padding: 40px 30px;
        }
        .confirmation-section {
          text-align: center;
          margin-bottom: 40px;
        }
        .success-icon {
          width: 60px;
          height: 60px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
          font-size: 24px;
        }
        .main-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 20px;
        }
        .order-info {
          background: #f3f4f6;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin-bottom: 30px;
        }
        .order-number {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 5px;
        }
        .order-date {
          color: #6b7280;
          font-size: 14px;
        }
        .section {
          margin-bottom: 35px;
        }
        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 8px;
        }
        .payment-confirmation {
          background: #d1fae5;
          border: 2px solid #10b981;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
          text-align: center;
        }
        .payment-title {
          color: #065f46;
          font-weight: 700;
          font-size: 18px;
          margin-bottom: 15px;
        }
        .payment-details {
          background: white;
          border: 1px solid #10b981;
          border-radius: 8px;
          padding: 20px;
          text-align: left;
        }
        .payment-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px dotted #d1d5db;
          font-size: 14px;
        }
        .payment-row:last-child {
          border-bottom: none;
          font-weight: 700;
          color: #059669;
          font-size: 16px;
          margin-top: 8px;
          padding-top: 12px;
          border-top: 1px solid #10b981;
        }
        .payment-label {
          color: #6b7280;
          font-weight: 500;
        }
        .payment-value {
          color: #1a1a1a;
          font-weight: 600;
        }
        .product-item {
          display: flex;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .product-item:last-child {
          border-bottom: none;
        }
        .product-image {
          width: 60px;
          height: 60px;
          background: #f3f4f6;
          border-radius: 8px;
          margin-right: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #9ca3af;
        }
        .product-details {
          flex: 1;
        }
        .product-name {
          font-size: 16px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 5px;
        }
        .product-variant {
          font-size: 14px;
          color: #6b7280;
        }
        .product-quantity {
          font-size: 16px;
          color: #1a1a1a;
          margin: 0 20px;
          min-width: 30px;
          text-align: center;
        }
        .product-price {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          text-align: right;
          min-width: 100px;
        }
        .totals-section {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 25px;
          margin-top: 20px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 16px;
        }
        .total-row .label {
          color: #6b7280;
        }
        .total-row .value {
          color: #1a1a1a;
          font-weight: 500;
        }
        .total-final {
          border-top: 2px solid #1a1a1a;
          padding-top: 15px;
          margin-top: 15px;
          font-size: 18px;
          font-weight: 700;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
        }
        .info-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
        }
        .info-card h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 15px;
        }
        .address-text {
          color: #4b5563;
          line-height: 1.6;
          font-size: 14px;
        }
        .next-steps {
          background: #eff6ff;
          border: 1px solid #3b82f6;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
        }
        .next-steps h4 {
          color: #1e40af;
          font-weight: 600;
          margin-bottom: 15px;
        }
        .step {
          color: #1e40af;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .support-section {
          background: #f3f4f6;
          border-radius: 12px;
          padding: 25px;
          text-align: center;
          margin-top: 30px;
        }
        .support-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          color: #1a1a1a;
        }
        .contact-info {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-bottom: 15px;
        }
        .contact-item {
          display: flex;
          align-items: center;
          color: #4b5563;
          font-size: 14px;
        }
        .footer {
          background: #1a1a1a;
          color: white;
          padding: 25px 30px;
          text-align: center;
        }
        .footer p {
          margin-bottom: 5px;
          opacity: 0.9;
          font-size: 14px;
        }
        @media (max-width: 600px) {
          .info-grid { grid-template-columns: 1fr; }
          .contact-info { flex-direction: column; gap: 10px; }
          .product-item { flex-direction: column; align-items: flex-start; }
          .product-quantity, .product-price { margin: 10px 0; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="company-name">ALEEBANSPARKS</div>
          <div class="header-subtitle">Order Confirmation</div>
        </div>

        <!-- Content -->
        <div class="content">
          <!-- Confirmation Section -->
          <div class="confirmation-section">
            <div class="success-icon">✓</div>
            <h1 class="main-title">Payment Successful!</h1>
            <p class="subtitle">Hi ${data.customerName.split(' ')[0]}, your order has been confirmed and we're preparing it for shipment!</p>
            
            <div class="order-info">
              <div class="order-number">Order #${data.orderNumber}</div>
              <div class="order-date">Placed on ${data.orderDate}</div>
            </div>
          </div>

          <!-- Payment Confirmation -->
          <div class="payment-confirmation">
            <div class="payment-title">✅ Payment Confirmed</div>
            
            <div class="payment-details">
              <div class="payment-row">
                <span class="payment-label">Payment Method:</span>
                <span class="payment-value">${data.paymentMethod || 'Paystack'}</span>
              </div>
              ${data.paymentReference ? `
              <div class="payment-row">
                <span class="payment-label">Reference:</span>
                <span class="payment-value" style="font-family: monospace;">${data.paymentReference}</span>
              </div>
              ` : ''}
              <div class="payment-row">
                <span class="payment-label">Amount Paid:</span>
                <span class="payment-value">₦${data.totals.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="section">
            <h2 class="section-title">Your Order</h2>
            
            ${data.items.map(item => `
              <div class="product-item">
                <div class="product-image">
                  ${item.mainImage?.asset?.url ? 
                    `<img src="${item.mainImage.asset.url}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">` :
                    'IMG'
                  }
                </div>
                <div class="product-details">
                  <div class="product-name">${item.name}</div>
                  ${item.size || item.color ? `
                    <div class="product-variant">
                      ${item.size ? `Size: ${item.size}` : ''}
                      ${item.size && item.color ? ' • ' : ''}
                      ${item.color ? `Color: ${item.color}` : ''}
                    </div>
                  ` : ''}
                </div>
                <div class="product-quantity">×${item.quantity}</div>
                <div class="product-price">₦${(item.price * item.quantity)?.toLocaleString()}</div>
              </div>
            `).join('')}

            <!-- Order Totals -->
            <div class="totals-section">
              <div class="total-row">
                <span class="label">Subtotal:</span>
                <span class="value">₦${data.totals.subtotal?.toLocaleString()}</span>
              </div>
              <div class="total-row">
                <span class="label">Shipping (${data.deliveryMethod?.name}):</span>
                <span class="value">₦${data.totals.delivery?.toLocaleString()}</span>
              </div>
              <div class="total-row total-final">
                <span class="label">Total Paid:</span>
                <span class="value">₦${data.totals.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <!-- Shipping Information -->
          <div class="section">
            <h2 class="section-title">Shipping Details</h2>
            <div class="info-grid">
              <div class="info-card">
                <h4>Delivery Address</h4>
                <div class="address-text">
                  ${data.customerName}<br>
                  ${data.shippingAddress?.address}<br>
                  ${data.shippingAddress?.apartment ? data.shippingAddress.apartment + '<br>' : ''}
                  ${data.shippingAddress?.city}, ${data.shippingAddress?.state}<br>
                  ${data.shippingAddress?.postalCode ? data.shippingAddress.postalCode + '<br>' : ''}
                  ${data.shippingAddress?.country || 'Nigeria'}
                </div>
              </div>
              
              <div class="info-card">
                <h4>Delivery Method</h4>
                <div style="color: #1a1a1a; line-height: 1.6;">
                  <div style="font-weight: 600; margin-bottom: 8px;">${data.deliveryMethod?.name}</div>
                  <div style="margin-bottom: 5px;">${data.deliveryMethod?.description}</div>
                  <div style="color: #6b7280; font-size: 14px;">
                    <strong>Estimated:</strong> ${data.deliveryMethod?.estimatedDays}<br>
                    <strong>Coverage:</strong> ${data.deliveryMethod?.coverage}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Next Steps -->
          <div class="next-steps">
            <h4>What happens next?</h4>
            <div class="step">1. ✅ Payment confirmed - Your order is now being processed</div>
            <div class="step">2. 📦 We'll prepare and package your items with care</div>
            <div class="step">3. 🚚 Your order will be shipped within 1-2 business days</div>
            <div class="step">4. 📱 You'll receive tracking information via email and SMS</div>
          </div>
        </div>

        <!-- Support Section -->
        <div class="support-section">
          <div class="support-title">Need Help?</div>
          <div class="contact-info">
            <div class="contact-item">
              <span style="margin-right: 8px;">📧</span>
              <span>Aleebansparks@gmail.com</span>
            </div>
            <div class="contact-item">
              <span style="margin-right: 8px;">📞</span>
              <span>+234 706 055 2126</span>
            </div>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Our customer service team is available Monday to Friday, 9AM - 6PM WAT
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p><strong>Thank you for choosing Aleebansparks!</strong></p>
          <p>This confirmation was sent to ${data.customerEmail}</p>
          <p>© ${new Date().getFullYear()} Aleebansparks. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// API endpoint for sending emails (example using nodemailer)
export const sendOrderEmails = async (orderData: EmailTemplateData) => {
  try {
    // Business email
    const businessEmailHtml = generateBusinessEmailTemplate(orderData);
    
    // Customer email  
    const customerEmailHtml = generateCustomerEmailTemplate(orderData);

    // Send business email
    const businessEmailRequest = {
      to: 'Aleebansparks@gmail.com',
      subject: `[Aleebansparks]: New Order Received - #${orderData.orderNumber}`,
      html: businessEmailHtml
    };

    // Send customer email
    const customerEmailRequest = {
      to: orderData.customerEmail,
      subject: `Payment Confirmed - Order #${orderData.orderNumber} | Aleebansparks`,
      html: customerEmailHtml
    };

    // You would integrate this with your email service provider
    // Examples: SendGrid, Mailgun, AWS SES, etc.
    console.log('Business Email:', businessEmailRequest);
    console.log('Customer Email:', customerEmailRequest);

    return { success: true, businessEmail: businessEmailRequest, customerEmail: customerEmailRequest };
  } catch (error) {
    console.error('Error generating emails:', error);
    throw error;
  }
};