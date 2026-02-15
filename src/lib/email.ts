import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
}

/**
 * Send acknowledgment email to the user who submitted the contact form.
 */
export async function sendContactAcknowledgment(data: ContactEmailData): Promise<void> {
  try {
    const { name, email, service } = data;

    console.log('📧 Sending acknowledgment email to:', email);
    
    const result = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Edolv Media <onboarding@resend.dev>',
    to: email,
    subject: 'Thank you for reaching out to Edolv Media!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#0f0f14;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f14;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1a1a24;border-radius:16px;overflow:hidden;">
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#7c3aed,#6d28d9,#5b21b6);padding:40px 40px 30px;">
                    <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">Edolv Media</h1>
                    <p style="margin:8px 0 0;color:#e0d5f5;font-size:14px;">Premium Video Production</p>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px;">Hi ${name}! 👋</h2>
                    <p style="margin:0 0 20px;color:#a0a0b0;font-size:15px;line-height:1.7;">
                      Thank you for reaching out to us! We've received your inquiry about 
                      <strong style="color:#a78bfa;">${service}</strong> and our team is reviewing it.
                    </p>
                    <p style="margin:0 0 20px;color:#a0a0b0;font-size:15px;line-height:1.7;">
                      We typically respond within <strong style="color:#ffffff;">24 hours</strong>. 
                      In the meantime, feel free to explore our latest work on our website.
                    </p>
                    <div style="background-color:#252535;border-radius:12px;padding:20px;margin:24px 0;">
                      <p style="margin:0;color:#7c7c8a;font-size:13px;text-transform:uppercase;letter-spacing:1px;">What happens next?</p>
                      <ul style="margin:12px 0 0;padding-left:20px;color:#c0c0d0;font-size:14px;line-height:2;">
                        <li>Our team reviews your requirements</li>
                        <li>We'll schedule a discovery call</li>
                        <li>You'll receive a customized proposal</li>
                      </ul>
                    </div>
                    <p style="margin:24px 0 0;color:#7c7c8a;font-size:13px;">
                      Best regards,<br>
                      <strong style="color:#a78bfa;">The Edolv Media Team</strong>
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color:#12121a;padding:24px 40px;text-align:center;">
                    <p style="margin:0;color:#5c5c6a;font-size:12px;">
                      © ${new Date().getFullYear()} Edolv Media. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
    
    console.log('✅ Acknowledgment email sent successfully. Email ID:', result.data?.id);
  } catch (error) {
    console.error('❌ Failed to send acknowledgment email:', error);
    throw error;
  }
}

/**
 * Send notification email to admin about a new contact form submission.
 */
export async function sendContactNotificationToAdmin(data: ContactEmailData): Promise<void> {
  try {
    const { name, email, phone, service, message } = data;
    
    console.log('📧 Sending admin notification email');

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Edolv Media <onboarding@resend.dev>',
    to: process.env.ADMIN_NOTIFICATION_EMAIL || '',
    subject: `New Contact Inquiry: ${service} - ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                <tr>
                  <td style="background:linear-gradient(135deg,#7c3aed,#5b21b6);padding:30px 40px;">
                    <h1 style="margin:0;color:#ffffff;font-size:20px;">📩 New Contact Form Submission</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:30px 40px;">
                    <table width="100%" cellpadding="8" cellspacing="0" style="font-size:14px;">
                      <tr>
                        <td style="color:#666;font-weight:600;width:120px;vertical-align:top;">Name</td>
                        <td style="color:#333;">${name}</td>
                      </tr>
                      <tr>
                        <td style="color:#666;font-weight:600;vertical-align:top;">Email</td>
                        <td style="color:#333;"><a href="mailto:${email}" style="color:#7c3aed;">${email}</a></td>
                      </tr>
                      <tr>
                        <td style="color:#666;font-weight:600;vertical-align:top;">Phone</td>
                        <td style="color:#333;">${phone || 'Not provided'}</td>
                      </tr>
                      <tr>
                        <td style="color:#666;font-weight:600;vertical-align:top;">Service</td>
                        <td style="color:#333;">${service}</td>
                      </tr>
                      <tr>
                        <td style="color:#666;font-weight:600;vertical-align:top;">Message</td>
                        <td style="color:#333;line-height:1.6;">${message}</td>
                      </tr>
                    </table>
                    <div style="margin-top:24px;padding-top:24px;border-top:1px solid #eee;">
                      <a href="mailto:${email}" style="display:inline-block;background:#7c3aed;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:14px;">Reply to ${name}</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background-color:#f9f9fb;padding:16px 40px;text-align:center;">
                    <p style="margin:0;color:#999;font-size:12px;">Submitted on ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
    
    console.log('✅ Admin notification email sent successfully. Email ID:', result.data?.id);
  } catch (error) {
    console.error('❌ Failed to send admin notification email:', error);
    throw error;
  }
}

/**
 * Send application acknowledgment to the applicant.
 */
export async function sendApplicationAcknowledgment(
  applicantName: string,
  applicantEmail: string,
  jobTitle: string
): Promise<void> {
  await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Edolv Media <onboarding@resend.dev>',
    to: applicantEmail,
    subject: `Application Received: ${jobTitle} - Edolv Media`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#0f0f14;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f14;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1a1a24;border-radius:16px;overflow:hidden;">
                <tr>
                  <td style="background:linear-gradient(135deg,#7c3aed,#5b21b6);padding:40px;">
                    <h1 style="margin:0;color:#ffffff;font-size:28px;">Edolv Media</h1>
                    <p style="margin:8px 0 0;color:#e0d5f5;font-size:14px;">Careers</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:40px;">
                    <h2 style="margin:0 0 16px;color:#ffffff;font-size:20px;">Hi ${applicantName}! 🎬</h2>
                    <p style="margin:0 0 20px;color:#a0a0b0;font-size:15px;line-height:1.7;">
                      Thank you for applying for the <strong style="color:#a78bfa;">${jobTitle}</strong> position at Edolv Media!
                    </p>
                    <p style="margin:0 0 20px;color:#a0a0b0;font-size:15px;line-height:1.7;">
                      We've received your application and our HR team will review it carefully. 
                      If your profile matches our requirements, we'll reach out to you within 
                      <strong style="color:#ffffff;">5-7 business days</strong>.
                    </p>
                    <p style="margin:24px 0 0;color:#7c7c8a;font-size:13px;">
                      Best of luck!<br>
                      <strong style="color:#a78bfa;">The Edolv Media HR Team</strong>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color:#12121a;padding:24px 40px;text-align:center;">
                    <p style="margin:0;color:#5c5c6a;font-size:12px;">© ${new Date().getFullYear()} Edolv Media</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}

interface ApplicationNotificationData {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  jobTitle: string;
  jobDepartment?: string;
  coverLetter?: string;
  resumeUrl: string;
  portfolioUrl?: string;
}

/**
 * Send notification email to admin about a new job application.
 */
export async function sendApplicationNotificationToAdmin(data: ApplicationNotificationData): Promise<void> {
  try {
    const {
      applicantName,
      applicantEmail,
      applicantPhone,
      jobTitle,
      jobDepartment,
      coverLetter,
      resumeUrl,
      portfolioUrl,
    } = data;

    console.log('📧 Sending job application admin notification email');

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Edolv Media <onboarding@resend.dev>',
      to: process.env.ADMIN_NOTIFICATION_EMAIL || '',
      subject: `New Job Application: ${jobTitle} - ${applicantName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background:linear-gradient(135deg,#7c3aed,#5b21b6);padding:30px 40px;">
                      <h1 style="margin:0;color:#ffffff;font-size:20px;">🎬 New Job Application Received</h1>
                      <p style="margin:8px 0 0;color:#e0d5f5;font-size:14px;">Someone applied for a position at Edolv Media</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 40px;">
                      <div style="background-color:#f8f5ff;border-left:4px solid #7c3aed;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px;">
                        <p style="margin:0;color:#5b21b6;font-size:16px;font-weight:600;">Position: ${jobTitle}</p>
                        ${jobDepartment ? `<p style="margin:4px 0 0;color:#7c3aed;font-size:14px;">Department: ${jobDepartment}</p>` : ''}
                      </div>
                      <h3 style="margin:0 0 16px;color:#333;font-size:16px;border-bottom:2px solid #eee;padding-bottom:8px;">Candidate Details</h3>
                      <table width="100%" cellpadding="8" cellspacing="0" style="font-size:14px;">
                        <tr>
                          <td style="color:#666;font-weight:600;width:130px;vertical-align:top;">Name</td>
                          <td style="color:#333;">${applicantName}</td>
                        </tr>
                        <tr>
                          <td style="color:#666;font-weight:600;vertical-align:top;">Email</td>
                          <td style="color:#333;"><a href="mailto:${applicantEmail}" style="color:#7c3aed;">${applicantEmail}</a></td>
                        </tr>
                        <tr>
                          <td style="color:#666;font-weight:600;vertical-align:top;">Phone</td>
                          <td style="color:#333;">${applicantPhone}</td>
                        </tr>
                        ${portfolioUrl ? `
                        <tr>
                          <td style="color:#666;font-weight:600;vertical-align:top;">Portfolio</td>
                          <td style="color:#333;"><a href="${portfolioUrl}" style="color:#7c3aed;">${portfolioUrl}</a></td>
                        </tr>
                        ` : ''}
                        ${coverLetter ? `
                        <tr>
                          <td style="color:#666;font-weight:600;vertical-align:top;">Cover Letter</td>
                          <td style="color:#333;line-height:1.6;">${coverLetter}</td>
                        </tr>
                        ` : ''}
                      </table>
                      <div style="margin-top:24px;padding-top:24px;border-top:1px solid #eee;">
                        <a href="${resumeUrl}" style="display:inline-block;background:#7c3aed;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:14px;margin-right:12px;">📄 View Resume</a>
                        <a href="mailto:${applicantEmail}" style="display:inline-block;background:#059669;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:14px;">Reply to ${applicantName}</a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color:#f9f9fb;padding:16px 40px;text-align:center;">
                      <p style="margin:0;color:#999;font-size:12px;">Application submitted on ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log('✅ Application admin notification email sent. Email ID:', result.data?.id);
  } catch (error) {
    console.error('❌ Failed to send application admin notification email:', error);
    throw error;
  }
}
