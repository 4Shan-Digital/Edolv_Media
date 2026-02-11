import connectDB from '@/lib/db';
import Contact from '@/models/Contact';
import { createContactSchema } from '@/lib/validations';
import { sendContactAcknowledgment, sendContactNotificationToAdmin } from '@/lib/email';
import { apiSuccess, handleApiError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * POST /api/contact
 * Public endpoint - submit a contact form.
 */
export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = createContactSchema.parse(body);

    // Save to database
    const contact = await Contact.create(validatedData);

    // Send emails (non-blocking, fire-and-forget)
    const emailData = {
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      service: validatedData.service,
      message: validatedData.message,
    };

    // Send emails in the background with detailed logging
    Promise.allSettled([
      sendContactAcknowledgment(emailData),
      sendContactNotificationToAdmin(emailData),
    ]).then((results) => {
      results.forEach((result, index) => {
        const emailType = index === 0 ? 'User acknowledgment' : 'Admin notification';
        if (result.status === 'rejected') {
          console.error(`❌ ${emailType} email failed:`, result.reason);
        } else {
          console.log(`✅ ${emailType} email sent successfully`);
        }
      });
    }).catch((error) => {
      console.error('❌ Unexpected error sending emails:', error);
    });

    return apiSuccess(
      { id: contact._id, message: 'Message sent successfully! We\'ll get back to you soon.' },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
