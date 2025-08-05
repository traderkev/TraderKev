# EmailJS Setup Guide for TraderKev Contact Form

## 🚀 Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (100 emails/month free)
3. Verify your email address

### Step 2: Add Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider:
   - **Gmail** (recommended for personal)
   - **Outlook/Hotmail**
   - **Yahoo Mail**
   - Or any SMTP service
4. Follow the connection instructions
5. **Note the Service ID** (e.g., "service_abc123")

### Step 3: Create Email Template
1. Go to "Email Templates" in dashboard
2. Click "Create New Template"
3. Use this template content:

```
Subject: New Contact Form Message from {{from_name}}

Hi TraderKev,

You have received a new message through your website contact form:

From: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
This message was sent through your TraderKev website contact form.
Reply directly to this email to respond to {{from_name}}.
```

4. **Note the Template ID** (e.g., "template_xyz789")

### Step 4: Get Public Key
1. Go to "Account" → "General"
2. Find your **Public Key** (e.g., "user_abc123def456")

### Step 5: Configure Your Website
1. Open the `.env.local` file in your project root
2. Replace the placeholder values:

```env
REACT_APP_EMAILJS_SERVICE_ID=service_abc123
REACT_APP_EMAILJS_TEMPLATE_ID=template_xyz789
REACT_APP_EMAILJS_PUBLIC_KEY=user_abc123def456
```

### Step 6: Test the Form
1. Restart your development server: `npm start`
2. Go to your contact form
3. Fill out a test message
4. Check your email inbox!

## 🎯 Template Variables Available

In your EmailJS template, you can use these variables:
- `{{from_name}}` - User's name
- `{{from_email}}` - User's email
- `{{message}}` - User's message
- `{{to_name}}` - Will be "TraderKev"
- `{{reply_to}}` - User's email for replies

## 🔧 Customization Options

### Change Email Template
Edit your template in EmailJS dashboard to customize:
- Subject line
- Email format
- Auto-responder setup

### Add More Fields
To add phone number, company, etc.:
1. Add input fields to the contact form
2. Update the `templateParams` in the code
3. Add corresponding variables to your EmailJS template

### Multiple Recipients
In EmailJS template settings, you can:
- Add multiple "To" email addresses
- Set up CC/BCC recipients
- Create different templates for different purposes

## 🛡️ Security & Limits

### Free Plan Limits
- 200 emails/month
- EmailJS branding in emails
- Basic templates

### Paid Plans ($15+/month)
- Higher email limits
- Remove EmailJS branding
- Advanced features
- Better deliverability

### Security Notes
- Public key is safe to expose (client-side only)
- Service/Template IDs are not sensitive
- No server required - works with static hosting

## 🚀 Going Live

When deploying to production:
1. Add the same environment variables to your hosting platform
2. For Netlify: Site Settings → Environment Variables
3. For Vercel: Project Settings → Environment Variables
4. For GitHub Pages: Use repository secrets for build process

## 🔧 Alternative Solutions

If you need more control, consider:

### Option 2: Formspree
- Simple form endpoint service
- No JavaScript required
- Good for basic forms

### Option 3: Netlify Forms
- Built into Netlify hosting
- Easy setup if using Netlify
- No external service needed

### Option 4: Custom Backend
- Most control and customization
- Requires server setup
- Good for complex requirements

## 📧 What You'll Receive

When someone fills out your contact form, you'll get an email like:

```
Subject: New Contact Form Message from John Doe

Hi TraderKev,

You have received a new message through your website contact form:

From: John Doe
Email: john.doe@example.com

Message:
Hi, I'm interested in your trading course. Can you tell me more about the mentoring program?

---
This message was sent through your TraderKev website contact form.
Reply directly to this email to respond to John Doe.
```

## 🎯 Pro Tips

1. **Test First**: Always test with your own email before going live
2. **Check Spam**: Initial emails might go to spam folder
3. **Professional Email**: Use a professional email address as the sender
4. **Auto-Reply**: Set up an auto-reply template to confirm receipt
5. **Mobile Friendly**: The form already works great on mobile devices

Your contact form is now ready to receive emails! 🚀
