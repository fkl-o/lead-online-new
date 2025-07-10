import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

export const sendEmail = async (options) => {
  const transporter = createTransporter();

  const message = {
    from: `${process.env.EMAIL_FROM_NAME || 'lead.online'} <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  const info = await transporter.sendMail(message);
  console.log('Email sent:', info.messageId);
  return info;
};

// Template for welcome email
export const sendWelcomeEmail = async (user) => {
  const subject = 'Willkommen bei lead.online';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #be123c;">Willkommen bei lead.online!</h1>
      <p>Hallo ${user.name},</p>
      <p>vielen Dank für Ihr Interesse an unseren Dienstleistungen. Wir haben Ihr Konto erfolgreich erstellt.</p>
      <p>Sie können sich jetzt in Ihr Dashboard einloggen und Ihre Leads verwalten.</p>
      <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
      <br>
      <p>Beste Grüße,<br>Ihr lead.online Team</p>
    </div>
  `;

  return sendEmail({
    email: user.email,
    subject,
    html,
    message: `Willkommen bei lead.online, ${user.name}!`
  });
};

// Template for lead notification
export const sendLeadNotification = async (lead, adminEmail) => {
  const subject = `Neuer Lead: ${lead.name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #be123c;">Neuer Lead eingegangen</h1>
      <h2>Lead Details:</h2>
      <ul>
        <li><strong>Name:</strong> ${lead.fullName}</li>
        <li><strong>E-Mail:</strong> ${lead.email}</li>
        <li><strong>Quelle:</strong> ${lead.source}</li>
        <li><strong>Unternehmen:</strong> ${lead.company?.name || 'Nicht angegeben'}</li>
        <li><strong>Score:</strong> ${lead.score}/100</li>
      </ul>
      <p><a href="${process.env.FRONTEND_URL}/dashboard/leads/${lead._id}" 
            style="background-color: #be123c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Lead ansehen
         </a></p>
    </div>
  `;

  return sendEmail({
    email: adminEmail,
    subject,
    html,
    message: `Neuer Lead von ${lead.name} (${lead.email})`
  });
};
