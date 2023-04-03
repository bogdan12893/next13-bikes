import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

import { mailOptions, transporter } from "@/app/config/nodemailer";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email.length) {
    return new NextResponse("Mail field is required ⛔️", {
      status: 403,
    });
  }

  try {
    const token = jwt.sign({ email }, process.env.NEXTAUTH_SECRET, {
      expiresIn: "20000",
    });

    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/email-verification?token=${token}`;

    await transporter.sendMail({
      ...mailOptions,
      subject: "Please verify your email",
      html: `<p>Please verify your email address by clicking <a href="${verificationLink}">this link</a>.</p>`,
    });

    return new NextResponse(`Verificantion sent`, {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(
      `Error has occured while sending the verification email: ${error.message}`,
      {
        status: 500,
      }
    );
  }
}
