import Stripe from "stripe";
import { buffer } from "micro";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { mailOptions, transporter } from "@/app/config/nodemailer";

export const config = { api: { bodyParser: false } };

const handler = async (req: NextRequest, res: NextResponse) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
  });
  const signature = req.headers["stripe-signature"];
  const signingSecret = process.env.STRIPE_SIGNING_SECRET;
  const reqBuffer = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);
  } catch (error: any) {
    console.log(error);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  const { metadata } = event.data.object;

  switch (event.type) {
    case "charge.succeeded":
      await prisma.user.update({
        where: {
          id: metadata?.userId,
        },
        data: {
          riderType: "PRO",
        },
      });

      const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}`;

      const emailData = {
        title: "You are now a PRO rider",
        description: "You can add unlimited bikes. Enjoy!",
      };

      await transporter.sendMail({
        ...mailOptions,
        to: metadata?.userEmail,
        subject: `Bike garage: Account upgraded to PRO, ${metadata?.userName}`,
        html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Email</title><style type="text/css">body{background-color:#4b5563;font-family:"Courier New",Courier,monospace}.content{color:#fff;background-color:#1f2937;padding:20px;border-radius:20px;text-align:center}h1{font-size:30px}h2{font-size:20px}p{margin-bottom:30px}.link{background-color:#0c9488;color:#fff!important;padding:10px 20px;border-radius:10px;text-decoration:none;display:inline-block}</style></head><body><div class="content"><h1>◀︎ Bike Garage ▶︎</h1><h2>${emailData.title}</h2><p><span>${emailData.description}</span></p><div class="button-wrapper"><a href="${verificationLink}" class="link">Here</a></div></div></body></html>`,
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  console.log({ event });

  res.send({ received: true });
};

export default handler;
