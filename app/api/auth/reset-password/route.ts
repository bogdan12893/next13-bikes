import prisma from "@/prisma";
import jwt from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";
import { hash } from "bcrypt";

export async function PATCH(request: NextRequest) {
  const queryData = request.nextUrl.searchParams;
  const token = queryData.get("token");
  const { password } = await request.json();

  if (!password.length) {
    return new NextResponse("Password field is required ⛔️", {
      status: 403,
    });
  }

  const hashed = await hash(password, 12);

  try {
    const decodedToken: any = jwt.verify(
      token as string,
      process.env.NEXTAUTH_SECRET
    );
    const { email } = decodedToken;
    const user = await prisma.user.findUnique({ where: { email } });

    console.log(user);

    if (!user) {
      return new NextResponse("Invalid verification token.", { status: 400 });
    }

    await prisma.user.update({
      where: { email },
      data: { password: hashed },
    });

    return new NextResponse("User has been updated successfully.", {
      status: 200,
    });
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return new NextResponse("Token expired. Error updating user.", {
        status: 400,
      });
    }
    return new NextResponse("Error updating user.", {
      status: 400,
    });
  }
}
