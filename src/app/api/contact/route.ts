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

    // Send emails sequentially with delay to respect Resend free tier rate limit (2 req/sec)
    (async () => {
      try {
        await sendContactAcknowledgment(emailData);
        console.log('✅ User acknowledgment email sent successfully');
      } catch (error) {
        console.error('❌ User acknowledgment email failed:', error);
      }

      // Wait 1.5 seconds to stay within Resend free tier rate limit
      await new Promise((resolve) => setTimeout(resolve, 1500));

      try {
        await sendContactNotificationToAdmin(emailData);
        console.log('✅ Admin notification email sent successfully');
      } catch (error) {
        console.error('❌ Admin notification email failed:', error);
      }
    })().catch((error) => {
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
