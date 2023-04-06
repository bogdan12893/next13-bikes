import { getServerSession } from "next-auth";
import prisma from "../../../prisma/index";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const data = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse("Error has occured while fetching the categories", {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  const res = await request.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Login to create a category! ", {
      status: 401,
    });
  }

  if (session.user.role !== "ADMIN") {
    return new NextResponse("Only admins can perform this action! ", {
      status: 401,
    });
  }

  if (!res.name.length) {
    return new NextResponse("Please add a name", {
      status: 403,
    });
  }
  try {
    await prisma.category.create({ data: res });
    return NextResponse.json(res);
  } catch (error) {
    return new NextResponse("Error has occured while creating a category", {
      status: 500,
    });
  }
}
