import emailjs from '@emailjs/browser';

// EmailJS configuration
const SERVICE_ID = 'service_gfmqpy1';
const TEMPLATE_ID = 'mp_xtTbcr4Dcmw2l3';
const USER_ID = 'user_xtTbcr4Dcmw2l3';

// Initialize EmailJS
emailjs.init(USER_ID);

export interface EmailParams {
  to_email: string;
  subject: string;
  message: string;
  type: 'thumbnail' | 'short';
  content_url?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email: params.to_email,
      subject: params.subject,
      message: params.message,
      content_type: params.type === 'thumbnail' ? 'Thumbnail' : 'Short Video',
      content_url: params.content_url || 'Not available',
    });

    return response.status === 200;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}