import { mailOptions, transporter } from "@/app/config/nodemailer";
import prisma from "@/prisma";
import jwt from "jsonwebtoken";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
  });

  if (!name.length || !email.length || !password.length) {
    return new NextResponse("All fields are required ⛔️", {
      status: 403,
    });
  }

  const hashed = await hash(password, 12);

  try {
    const customer: Stripe.Customer = await stripe.customers.create({ email });
    await prisma.user.create({
      data: {
        stripeId: customer.id,
        name,
        email,
        password: hashed,
      },
    });

    const token = jwt.sign({ email }, process.env.NEXTAUTH_SECRET, {
      expiresIn: "1d",
    });

    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;

    const emailData = {
      title: "Please verify your email!",
      description: "Confirm email by clicking",
    };

    await transporter.sendMail({
      ...mailOptions,
      to: email,
      subject: `Bike garage: Please verify your email, ${name}`,
      html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Email</title><style type="text/css">body{background-color:#4b5563;font-family:"Courier New",Courier,monospace}.content{color:#fff;background-color:#1f2937;padding:20px;border-radius:20px;text-align:center}h1{font-size:30px}h2{font-size:20px}p{margin-bottom:30px}.link{background-color:#0c9488;color:#fff!important;padding:10px 20px;border-radius:10px;text-decoration:none;display:inline-block}</style></head><body><div class="content"><h1>◀︎ Bike Garage ▶︎</h1><h2>${emailData.title}</h2><p><span>${emailData.description}</span></p><div class="button-wrapper"><a href="${verificationLink}" class="link">Here</a></div></div></body></html>`,
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
