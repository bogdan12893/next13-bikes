import prisma from "../../../prisma/index";
import { NextResponse } from "next/server";
// import { redirect } from "next/navigation";

export async function GET() {
  try {
    const data = await prisma.bike.findMany();
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse("Error has occured while fetching the bikes", {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  const res = await request.json();

  if (!res.brand.length) {
    return new NextResponse("Please add a brand name", {
      status: 403,
    });
  }
  try {
    await prisma.bike.create({ data: res });
    return NextResponse.json(res);
  } catch (error) {
    return new NextResponse("Error has occured while creating a bike", {
      status: 500,
    });
  }
}
