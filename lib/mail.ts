import nodemailer from 'nodemailer';

export function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  projectType?: string;
  message: string;
}) {
  if (!process.env.SMTP_USER) return; // silently skip if email isn't configured yet

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_RECEIVER_EMAIL,
    replyTo: data.email,
    subject: `New inquiry from ${data.name}${data.projectType ? ` — ${data.projectType}` : ''}`,
    html: `
      <h2>New contact form submission</h2>
      <p><b>Name:</b> ${data.name}</p>
      <p><b>Email:</b> ${data.email}</p>
      ${data.company ? `<p><b>Company:</b> ${data.company}</p>` : ''}
      ${data.budget ? `<p><b>Budget:</b> ${data.budget}</p>` : ''}
      ${data.projectType ? `<p><b>Project type:</b> ${data.projectType}</p>` : ''}
      <p><b>Message:</b></p>
      <p>${data.message.replace(/\n/g, '<br/>')}</p>
    `,
  });
}
