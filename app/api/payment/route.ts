import { mailOptions, transporter } from "@/app/config/nodemailer";
import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import Stripe from "stripe";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Login", { status: 401 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
  });

  const lineItems = [
    {
      price_data: {
        currency: "ron",
        product_data: {
          name: "Upgrade to PRO rider",
        },
        unit_amount: 2000,
      },
      quantity: 1,
    },
  ];
  try {
    const stripeSession = await stripe.checkout.sessions.create({
      customer: session.user.stripeId,
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancelled`,
      payment_intent_data: {
        metadata: {
          userId: session.user.id,
          userName: session.user.name,
        },
      },
    });
    console.log(stripeSession);
    return NextResponse.json(stripeSession);
  } catch (error: any) {
    return new NextResponse(
      `Error has occured while creating your account: ${error.message}`,
      {
        status: 500,
      }
    );
  }
}
