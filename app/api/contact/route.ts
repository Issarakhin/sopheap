import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, organization, email, service, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to Firebase
    const ref = await adminDb.collection('inquiries').add({
      name, organization, email, service, message,
      status: 'new',
      submittedAt: FieldValue.serverTimestamp(),
    });

    // Send email notification
    try {
      await resend.emails.send({
        from: 'sopheap.ai <noreply@sopheap.ai>',
        to: process.env.CONTACT_NOTIFICATION_EMAIL || 'sopheap.hin@gmail.com',
        subject: `New inquiry from ${name} — ${service}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0A0C10; color: #F5F0E8; padding: 32px; border-radius: 12px;">
            <h2 style="color: #C9A84C; font-size: 24px; margin-bottom: 24px;">New Inquiry — SOPHEAP.AI</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="color: #6B7280; padding: 8px 0; width: 140px;">Name</td><td style="color: #F5F0E8;">${name}</td></tr>
              <tr><td style="color: #6B7280; padding: 8px 0;">Organization</td><td style="color: #F5F0E8;">${organization || '—'}</td></tr>
              <tr><td style="color: #6B7280; padding: 8px 0;">Email</td><td style="color: #F5F0E8;"><a href="mailto:${email}" style="color: #C9A84C;">${email}</a></td></tr>
              <tr><td style="color: #6B7280; padding: 8px 0;">Service</td><td style="color: #F5F0E8;">${service || '—'}</td></tr>
            </table>
            <div style="margin-top: 24px; padding: 16px; background: #111318; border-radius: 8px; border-left: 3px solid #C9A84C;">
              <p style="color: #6B7280; font-size: 12px; margin-bottom: 8px;">MESSAGE</p>
              <p style="color: #F5F0E8; line-height: 1.6;">${message}</p>
            </div>
            <p style="margin-top: 24px; color: #6B7280; font-size: 12px;">
              View in admin: <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" style="color: #C9A84C;">Admin Panel</a>
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Email send failed (non-fatal):', emailErr);
    }

    return NextResponse.json({ success: true, id: ref.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
