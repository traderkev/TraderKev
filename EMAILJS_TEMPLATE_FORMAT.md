# EmailJS Template for TraderKev Contact Form

## Required Template Format

For the contact form to work properly, your EmailJS template should use exactly these variable names:

### Template Content:

```
Subject: New Contact Form Message from {{from_name}}

Hi {{to_name}},

You have received a new message through your website contact form:

From: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
This message was sent through your TraderKev website contact form.
```

### Template Variables Used:
- `{{to_name}}` - Will be "TraderKev"
- `{{from_name}}` - User's name from the form
- `{{from_email}}` - User's email from the form  
- `{{message}}` - User's message from the form

### Current Configuration:
- Service ID: `service_sbwdmq9`
- Template ID: `template_fxxzwsa`
- Public Key: `VigwdRl-HGU8A34Rg`

## Troubleshooting 422 Errors:

1. **Check Template Variables**: Make sure your EmailJS template uses exactly the variable names listed above
2. **Verify Service Status**: Ensure your EmailJS service is active and properly configured
3. **Template ID**: Double-check that `template_fxxzwsa` exists in your EmailJS dashboard
4. **Service ID**: Verify that `service_sbwdmq9` is the correct service ID

## Testing:
1. Save this template format in your EmailJS dashboard
2. Test the contact form on the live site
3. Check browser console for detailed error messages
