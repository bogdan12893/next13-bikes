import prisma from "@/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  if (!name.length || !email.length || !password.length) {
    return new NextResponse("All fields are required ⛔️", {
      status: 403,
    });
  }

  const hashed = await hash(password, 12);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });
    return NextResponse.json({ user: { name, email, password } });
  } catch (error: any) {
    console.log("doamneeee", error.message);
    return new NextResponse(
      `Error has occured while creating your account: ${error.message}`,
      {
        status: 500,
      }
    );
  }
}
