import prisma from "@/prisma";
import jwt from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const queryData = request.nextUrl.searchParams;
  const token = queryData.get("token");

  try {
    const decodedToken: any = jwt.verify(
      token as string,
      process.env.NEXTAUTH_SECRET
    );
    const { email } = decodedToken;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return new NextResponse("Invalid verification token.", { status: 400 });
    }

    if (user.confirmed) {
      return new NextResponse("User has already been verified.", {
        status: 400,
      });
    }

    await prisma.user.update({ where: { email }, data: { confirmed: true } });

    return new NextResponse("User has been verified successfully.", {
      status: 200,
    });
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return new NextResponse("Token expired. Error verifying user.", {
        status: 400,
      });
    }
    return new NextResponse("Error verifying user.", {
      status: 400,
    });
  }
}
