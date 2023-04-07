import { mailOptions, transporter } from "@/app/config/nodemailer";
import prisma from "@/prisma";
import jwt from "jsonwebtoken";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email.length) {
    return new NextResponse("Email field is required ⛔️", {
      status: 403,
    });
  }

  const token = jwt.sign({ email }, process.env.NEXTAUTH_SECRET, {
    expiresIn: "1d",
  });

  const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

  const emailData = {
    title: "Forgot password",
    description: "Reset your password by clicking",
  };

  try {
    await transporter.sendMail({
      ...mailOptions,
      to: email,
      subject: `Bike garage: Reset your password`,
      html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Email</title><style type="text/css">body{background-color:#4b5563;font-family:"Courier New",Courier,monospace}.content{color:#fff;background-color:#1f2937;padding:20px;border-radius:20px;text-align:center}h1{font-size:30px}h2{font-size:20px}p{margin-bottom:30px}.link{background-color:#0c9488;color:#fff!important;padding:10px 20px;border-radius:10px;text-decoration:none;display:inline-block}</style></head><body><div class="content"><h1>◀︎ Bike Garage ▶︎</h1><h2>${emailData.title}</h2><p><span>${emailData.description}</span></p><div class="button-wrapper"><a href="${verificationLink}" class="link">Here</a></div></div></body></html>`,
    });

    return NextResponse.json({
      email: email,
      message: "Email was sent succesfully.",
    });
  } catch (error: any) {
    return new NextResponse(
      `Error has occured while sending reset password email: ${error.message}`,
      {
        status: 500,
      }
    );
  }
}
