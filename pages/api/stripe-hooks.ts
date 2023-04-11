import Stripe from "stripe";
import { buffer } from "micro";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";

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

  console.log(metadata);

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
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  console.log({ event });

  res.send({ received: true });
};

export default handler;

// const handler = async (req: NextRequest, res: NextResponse) => {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return res.status(401).send(`Login to perform this action.`);
//   }

//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//     apiVersion: "2022-11-15",
//   });
//   const signature = req.headers["stripe-signature"];
//   const signingSecret = process.env.STRIPE_SIGNING_SECRET;
//   const reqBuffer = await buffer(req);

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);
//   } catch (error: any) {
//     console.log(error);
//     return res.status(400).send(`Webhook error: ${error.message}`);
//   }

//   console.log(event);

//   switch (event.type) {
//     case "charge.succeeded":
//       await prisma.user.update({
//         where: {
//           id: session.user.id,
//         },
//         data: {
//           riderType: "PRO",
//         },
//       });
//       break;
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   res.send({ received: true });
// };

// export default handler;
