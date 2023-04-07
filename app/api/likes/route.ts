import { getServerSession } from "next-auth";
import prisma from "../../../prisma/index";
import { NextResponse } from "next/server";
// import { authOptions } from "../auth/[...nextauth]/route";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";

export async function POST(request: Request) {
  const reqBody = await request.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Login to like a bike! ", {
      status: 401,
    });
  }

  const hasLike = await prisma.like.findFirst({
    where: {
      userId: session.user.id,
      bikeId: reqBody.id,
    },
  });

  try {
    if (!hasLike) {
      await prisma.like.create({
        data: {
          userId: session.user.id,
          bikeId: reqBody.id,
        },
      });
      return NextResponse.json(reqBody, { status: 200 });
    } else {
      await prisma.like.delete({
        where: { id: hasLike.id },
      });
      return NextResponse.json(reqBody, { status: 201 });
    }
  } catch (error) {
    return new NextResponse("Error has occured while liking a bike", {
      status: 500,
    });
  }
}
