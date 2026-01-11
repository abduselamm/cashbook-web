import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { email, role, businessName, businessId } = await req.json();

        if (!email || !role || !businessId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Generate a simple token (in production this should be stored in a DB)
        const token = Buffer.from(JSON.stringify({ email, role, businessId, expires: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64');

        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${token}`;

        const { data, error } = await resend.emails.send({
            from: process.env.SMTP_FROM || 'onboarding@resend.dev',
            to: [email],
            subject: `Invitation to join ${businessName} on HISAB`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #4863D4;">You've been invited!</h2>
                    <p>Hello,</p>
                    <p><strong>${session.user?.name || 'Someone'}</strong> has invited you to join <strong>${businessName}</strong> as a <strong>${role}</strong> on HISAB.</p>
                    <div style="margin: 30px 0;">
                        <a href="${inviteLink}" style="background-color: #4863D4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Accept Invitation</a>
                    </div>
                    <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="color: #666; font-size: 14px; word-break: break-all;">${inviteLink}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="color: #999; font-size: 12px;">This invitation will expire in 7 days.</p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('Invite API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
