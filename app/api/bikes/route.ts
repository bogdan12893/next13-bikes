import prisma from "../../../prisma/index";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.bike.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: { categories: { include: { category: true } } },
    });

    const formatData = data.map((bike) => {
      return {
        ...bike,
        categories: bike.categories.map((categ) => categ.category),
      };
    });

    return NextResponse.json(formatData);
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
    await prisma.bike.create({
      data: {
        brand: res.brand,
        categories: {
          create: res.categories.map((id: string) => ({
            category: { connect: { id } },
          })),
        },
      },
    });
    return NextResponse.json(res);
  } catch (error) {
    return new NextResponse("Error has occured while creating a bike", {
      status: 500,
    });
  }
}
