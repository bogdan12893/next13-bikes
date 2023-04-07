import { getServerSession } from "next-auth";
import prisma from "../../../prisma/index";
import { NextResponse } from "next/server";
// import { authOptions } from "../auth/[...nextauth]/route";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";

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

export async function PATCH(request: Request) {
  const requestBody = await request.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Login to edit a comment", { status: 401 });
  }

  if (!requestBody.text.length) {
    return new NextResponse("Comment cannot be empty", {
      status: 403,
    });
  }

  try {
    const findComment = await prisma.comment.findUnique({
      where: {
        id: requestBody.id,
      },
    });

    console.log(findComment);

    if (findComment?.userId !== session.user.id) {
      return new NextResponse(
        "This is not your comment. You can't edit this comment.",
        { status: 401 }
      );
    }

    await prisma.comment.update({
      where: {
        id: requestBody.id,
      },
      data: {
        text: requestBody.text,
      },
    });

    return NextResponse.json(requestBody);
  } catch (error) {
    return new NextResponse("Error has occured while editing a bike", {
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
  const requestBody = await request.json();

  console.log(requestBody);

  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Login to delete a comment", { status: 401 });
  }

  try {
    const { id, userId } = requestBody;

    if (userId !== session.user.id) {
      return new NextResponse(
        "This is not your comment. You can't delete this comment.",
        { status: 401 }
      );
    }

    const data = await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return new NextResponse("Error has occured while deleting this bike", {
      status: 403,
    });
  }
}
