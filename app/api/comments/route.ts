import { getServerSession } from "next-auth";
import prisma from "../../../prisma/index";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  const reqBody = await request.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Login to post a comment! ", {
      status: 401,
    });
  }

  if (!reqBody.text.length) {
    return new NextResponse("Comment can't be blank", {
      status: 403,
    });
  }

  try {
    await prisma.comment.create({
      data: {
        text: reqBody.text,
        userId: session.user.id,
        bikeId: reqBody.bikeId,
      },
    });
    return NextResponse.json(reqBody);
  } catch (error) {
    return new NextResponse("Error has occured while posting a comment", {
      status: 500,
    });
  }
}
