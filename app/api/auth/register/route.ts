import { mailOptions, transporter } from "@/app/config/nodemailer";
import prisma from "@/prisma";
import jwt from "jsonwebtoken";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  if (!name.length || !email.length || !password.length) {
    return new NextResponse("All fields are required ⛔️", {
      status: 403,
    });
  }

  const hashed = await hash(password, 12);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });

    const token = jwt.sign({ email }, process.env.NEXTAUTH_SECRET, {
      expiresIn: "20000",
    });

    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/email-verification?token=${token}`;

    await transporter.sendMail({
      ...mailOptions,
      subject: `Please verify your email, ${name}`,
      html: `<p>Please verify your email address by clicking <a href="${verificationLink}">this link</a>.</p>`,
    });

    return NextResponse.json({
      user: { name, email, password },
      message: "User registered successfully.",
    });
  } catch (error: any) {
    return new NextResponse(
      `Error has occured while creating your account: ${error.message}`,
      {
        status: 500,
      }
    );
  }
}
