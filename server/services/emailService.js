// Mock Email Service
// In production, replace with Nodemailer + SMTP or SendGrid/Mailgun

const emailTemplates = {
  booking_confirmation: (data) => ({
    subject: `Booking Confirmed - ${data.serviceType}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden"><div style="background:linear-gradient(135deg,#3b82f6,#6366f1);padding:24px;color:white"><h1 style="margin:0">Alderly Healthcare</h1></div><div style="padding:24px"><h2>Booking Confirmation</h2><p>Hello <strong>${data.recipientName}</strong>,</p><p>Your booking for <strong>${data.serviceType}</strong> has been confirmed.</p><table style="width:100%;border-collapse:collapse;margin:16px 0"><tr><td style="padding:8px;border-bottom:1px solid #f0f0f0;color:#6b7280">Patient</td><td style="padding:8px;border-bottom:1px solid #f0f0f0;font-weight:bold">${data.patientName || 'N/A'}</td></tr><tr><td style="padding:8px;border-bottom:1px solid #f0f0f0;color:#6b7280">Date</td><td style="padding:8px;border-bottom:1px solid #f0f0f0;font-weight:bold">${data.startDate}</td></tr><tr><td style="padding:8px;color:#6b7280">Total</td><td style="padding:8px;font-weight:bold;color:#059669">$${data.totalAmount}</td></tr></table><p style="color:#6b7280;font-size:14px">Log in to your dashboard to view details.</p></div></div>`
  }),
  status_change: (data) => ({
    subject: `Booking ${data.status} - Alderly Healthcare`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden"><div style="background:linear-gradient(135deg,#3b82f6,#6366f1);padding:24px;color:white"><h1 style="margin:0">Alderly Healthcare</h1></div><div style="padding:24px"><h2>Booking Status Update</h2><p>Hello <strong>${data.recipientName}</strong>,</p><p>Your booking status has been updated to: <strong>${data.status}</strong></p><p style="color:#6b7280;font-size:14px">${data.message || ''}</p></div></div>`
  }),
  review_request: (data) => ({
    subject: 'How was your experience? - Alderly Healthcare',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden"><div style="background:linear-gradient(135deg,#f59e0b,#f97316);padding:24px;color:white"><h1 style="margin:0">Alderly Healthcare</h1></div><div style="padding:24px"><h2>Rate Your Experience</h2><p>Hello <strong>${data.recipientName}</strong>,</p><p>Your service with <strong>${data.caregiverName}</strong> has been completed. We would love to hear your feedback!</p><p style="color:#6b7280;font-size:14px">Log in to your dashboard to leave a review.</p></div></div>`
  })
};

export const sendEmail = async (to, templateName, data) => {
  const template = emailTemplates[templateName]?.(data);
  if (!template) {
    console.log(`[EMAIL] No template found for: ${templateName}`);
    return;
  }

  // Mock: Log to console instead of actually sending
  console.log(`\n========== MOCK EMAIL ==========`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${template.subject}`);
  console.log(`Template: ${templateName}`);
  console.log(`Data: ${JSON.stringify(data, null, 2)}`);
  console.log(`================================\n`);

  return { success: true, messageId: `mock-${Date.now()}` };
};

export default { sendEmail };
