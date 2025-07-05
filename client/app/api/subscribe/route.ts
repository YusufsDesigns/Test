// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const { email, source, timestamp } = await request.json();

        // Validate email
        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PW
            },
        });

        // Send welcome email to subscriber
        await sendWelcomeEmail(transporter, email);
        
        // Send notification email to business
        await sendBusinessNotification(transporter, {
            subscriberEmail: email,
            source: source || 'website',
            timestamp: timestamp || new Date().toISOString(),
            userAgent: request.headers.get('user-agent') || 'Unknown',
            ip: request.ip || request.headers.get('x-forwarded-for') || 'Unknown',
        });

        console.log('📧 Email subscription processed successfully:', {
            email,
            source,
            timestamp: new Date().toISOString(),
        });

        return NextResponse.json(
            {
                message: 'Successfully subscribed! Check your email for a welcome message.',
                email
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Email subscription error:', error);

        return NextResponse.json(
            { message: 'Failed to process subscription. Please try again.' },
            { status: 500 }
        );
    }
}

// Welcome email template for subscriber
function getWelcomeEmailTemplate(email: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Aleebansparks</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
            .header { background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 40px 20px; text-align: center; }
            .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .tagline { color: #d1d5db; font-size: 16px; }
            .content { padding: 40px 30px; }
            .welcome-badge { display: inline-block; background: linear-gradient(45deg, #10b981, #059669); color: white; padding: 8px 20px; border-radius: 25px; font-size: 14px; font-weight: 600; margin-bottom: 30px; }
            .title { font-size: 32px; font-weight: bold; color: #1f2937; margin-bottom: 20px; line-height: 1.2; }
            .subtitle { font-size: 18px; color: #6b7280; margin-bottom: 30px; }
            .benefits { background: #f9fafb; border-radius: 12px; padding: 30px; margin: 30px 0; }
            .benefit-item { display: flex; align-items: flex-start; margin-bottom: 20px; }
            .benefit-icon { width: 24px; height: 24px; background: linear-gradient(45deg, #3b82f6, #1d4ed8); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0; }
            .benefit-text { font-size: 16px; color: #374151; }
            .cta-section { text-align: center; margin: 40px 0; }
            .cta-button { display: inline-block; background: linear-gradient(45deg, #1f2937, #374151); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: transform 0.2s; }
            .cta-button:hover { transform: translateY(-2px); }
            .social-section { background: #f3f4f6; padding: 30px; text-align: center; border-radius: 12px; margin: 30px 0; }
            .social-links { display: flex; justify-content: center; gap: 20px; margin-top: 20px; }
            .social-link { display: inline-block; width: 40px; height: 40px; background: #1f2937; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: transform 0.2s; }
            .social-link:hover { transform: scale(1.1); }
            .footer { background: #1f2937; color: #d1d5db; padding: 30px; text-align: center; }
            .footer-links { margin: 20px 0; }
            .footer-link { color: #9ca3af; text-decoration: none; margin: 0 15px; font-size: 14px; }
            .footer-link:hover { color: #ffffff; }
            .unsubscribe { font-size: 12px; color: #6b7280; margin-top: 20px; }
            .sparkle { color: #fbbf24; }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <div class="logo">✨ Aleebansparks</div>
                <div class="tagline">Premium Fashion & Accessories</div>
            </div>

            <!-- Main Content -->
            <div class="content">
                <div class="welcome-badge">🎉 Welcome to Our Fashion Circle</div>
                
                <h1 class="title">Welcome aboard, fashion lover!</h1>
                <p class="subtitle">
                    Thank you for joining our exclusive community. You're now part of a select group that gets early access to our latest collections and insider fashion insights.
                </p>

                <!-- Benefits -->
                <div class="benefits">
                    <h3 style="color: #1f2937; margin-bottom: 20px; font-size: 20px;">What you can expect:</h3>
                    
                    <div class="benefit-item">
                        <div class="benefit-icon">🚀</div>
                        <div class="benefit-text">
                            <strong>Early Access:</strong> Be the first to shop new collections before they go public
                        </div>
                    </div>
                    
                    <div class="benefit-item">
                        <div class="benefit-icon">💎</div>
                        <div class="benefit-text">
                            <strong>Exclusive Offers:</strong> Member-only discounts and special promotions
                        </div>
                    </div>
                    
                    <div class="benefit-item">
                        <div class="benefit-icon">👗</div>
                        <div class="benefit-text">
                            <strong>Style Tips:</strong> Personal styling advice and fashion insights from our experts
                        </div>
                    </div>
                    
                    <div class="benefit-item" style="margin-bottom: 0;">
                        <div class="benefit-icon">🎪</div>
                        <div class="benefit-text">
                            <strong>VIP Events:</strong> Invitations to exclusive fashion shows and events
                        </div>
                    </div>
                </div>

                <!-- CTA -->
                <div class="cta-section">
                    <p style="color: #6b7280; margin-bottom: 20px;">Ready to explore our latest collection?</p>
                    <a href="https://aleebansparks.com" class="cta-button">
                        Start Shopping <span class="sparkle">✨</span>
                    </a>
                </div>

                <!-- Social -->
                <div class="social-section">
                    <h3 style="color: #1f2937; margin-bottom: 10px;">Follow us for daily inspiration</h3>
                    <p style="color: #6b7280; margin-bottom: 0;">Stay connected and never miss our latest fashion updates</p>
                    <div class="social-links">
                        <a href="https://www.instagram.com/aleebansparks_rtw" class="social-link" style="background: linear-gradient(45deg, #e1306c, #fd1d1d);">📷</a>
                        <a href="https://www.instagram.com/aleebansparks_wears" class="social-link" style="background: linear-gradient(45deg, #e1306c, #fd1d1d);">📸</a>
                        <a href="https://www.instagram.com/aleebansparks_" class="social-link" style="background: linear-gradient(45deg, #e1306c, #fd1d1d);">✨</a>
                        <a href="https://www.facebook.com/share/1YGwfLhSj3/" class="social-link" style="background: #1877f2;">👥</a>
                        <a href="https://www.tiktok.com/@aleebansparks_rtw" class="social-link" style="background: linear-gradient(45deg, #ff0050, #000000);">🎵</a>
                    </div>
                    <div style="margin-top: 15px; font-size: 14px; color: #6b7280;">
                        <p>@Aleebansparks_rtw • @Aleebansparks_wears • @Aleebansparks_</p>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <div class="footer-links">
                    <a href="https://aleebansparks.com" class="footer-link">Shop</a>
                    <a href="https://aleebansparks.com/about" class="footer-link">About Us</a>
                    <a href="https://aleebansparks.com/contact" class="footer-link">Contact</a>
                    <a href="https://aleebansparks.com/help" class="footer-link">Help</a>
                </div>
                
                <div style="border-top: 1px solid #374151; padding-top: 20px; margin-top: 20px;">
                    <p>&copy; 2025 Aleebansparks. All rights reserved.</p>
                    <p style="margin-top: 10px;">📍 Abuja, FCT, Nigeria | 📞 +234 (0) 123 456 7890</p>
                </div>
                
                <div class="unsubscribe">
                    <p>You received this email because you subscribed to our newsletter.</p>
                    <p>Don't want to receive these emails? <a href="#" style="color: #9ca3af;">Unsubscribe here</a></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Simplified business notification email template
function getBusinessNotificationTemplate(data: {
    subscriberEmail: string;
    source: string;
    timestamp: string;
    userAgent: string;
    ip: string;
}): string {
    const formattedDate = new Date(data.timestamp).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Subscriber - Aleebansparks</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f8fafc; }
            .container { max-width: 500px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 20px; text-align: center; color: white; }
            .header-icon { font-size: 60px; margin-bottom: 15px; }
            .header-title { font-size: 24px; font-weight: bold; margin-bottom: 8px; }
            .header-subtitle { font-size: 16px; opacity: 0.9; }
            .content { padding: 30px; text-align: center; }
            .subscriber-email { background: linear-gradient(45deg, #3b82f6, #1d4ed8); color: white; padding: 15px 25px; border-radius: 10px; font-size: 18px; font-weight: 600; margin: 20px 0; display: inline-block; }
            .info-card { background: #f8fafc; border-radius: 10px; padding: 20px; margin: 20px 0; }
            .info-item { margin: 10px 0; }
            .info-label { font-weight: 600; color: #374151; }
            .info-value { color: #6b7280; }
            .celebration { font-size: 20px; margin: 20px 0; }
            .footer { background: #1f2937; color: #d1d5db; padding: 25px; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <div class="header-icon">🎉</div>
                <div class="header-title">New Subscriber!</div>
                <div class="header-subtitle">Someone just joined your mailing list</div>
            </div>

            <!-- Content -->
            <div class="content">
                <div class="celebration">
                    🌟 Congratulations! Your community is growing! 🌟
                </div>

                <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                    You have a new fashion enthusiast who wants to hear from you:
                </p>

                <!-- New Subscriber Email -->
                <div class="subscriber-email">
                    📧 ${data.subscriberEmail}
                </div>

                <!-- Simple Info -->
                <div class="info-card">
                    <div class="info-item">
                        <span class="info-label">📅 When:</span>
                        <span class="info-value">${formattedDate}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📍 Where:</span>
                        <span class="info-value">${data.source === 'website' ? 'Your Website' : data.source}</span>
                    </div>
                </div>

                <!-- Encouragement -->
                <div style="background: linear-gradient(45deg, #eff6ff, #dbeafe); border-radius: 10px; padding: 20px; margin: 25px 0;">
                    <div style="font-size: 24px; margin-bottom: 10px;">💌</div>
                    <p style="color: #1e40af; margin: 0; font-size: 16px; font-weight: 500;">
                        Your fashion content is attracting the right audience. Keep up the amazing work!
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p style="margin-bottom: 10px;">
                    <strong>✨ Aleebansparks ✨</strong>
                </p>
                <p style="font-size: 14px; opacity: 0.8;">
                    This notification was sent automatically when someone subscribed to your newsletter.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Send welcome email to subscriber
async function sendWelcomeEmail(transporter: any, email: string): Promise<void> {
    try {
        await transporter.sendMail({
            from: `"Aleebansparks" <${process.env.NODEMAILER_USER}>`,
            to: email,
            subject: "🎉 Welcome to Aleebansparks - Your Fashion Journey Begins!",
            html: getWelcomeEmailTemplate(email),
        });
        
        console.log('✅ Welcome email sent to:', email);
    } catch (error) {
        console.error('❌ Failed to send welcome email:', error);
        throw error;
    }
}

// Send business notification
async function sendBusinessNotification(transporter: any, data: {
    subscriberEmail: string;
    source: string;
    timestamp: string;
    userAgent: string;
    ip: string;
}): Promise<void> {
    try {
        await transporter.sendMail({
            from: `"Aleebansparks Notifications" <${process.env.NODEMAILER_USER}>`,
            to: "Aleebansparks@gmail.com",
            subject: `🎉 New Subscriber Alert - ${data.subscriberEmail}`,
            html: getBusinessNotificationTemplate(data),
        });
        
        console.log('✅ Business notification sent for:', data.subscriberEmail);
    } catch (error) {
        console.error('❌ Failed to send business notification:', error);
        throw error;
    }
}