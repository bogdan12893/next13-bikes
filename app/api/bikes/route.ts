import prisma from "../../../prisma/index";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const queryData = request.nextUrl.searchParams;
  const query = queryData.get("q");

  if (typeof query !== "string") {
    throw new Error("Invalid request");
  }

  try {
    const data = await prisma.bike.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        brand: {
          contains: query,
          mode: "insensitive",
        },
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
  const requestBody = await request.json();

  if (!requestBody.brand.length) {
    return new NextResponse("Please add a brand name", {
      status: 403,
    });
  }

  try {
    await prisma.bike.create({
      data: {
        brand: requestBody.brand,
        categories: {
          create: requestBody.categories.map((category) => ({
            category: { connect: { id: category.id } },
          })),
        },
      },
    });
    return NextResponse.json(requestBody);
  } catch (error) {
    return new NextResponse("Error has occured while creating a bike", {
      status: 500,
    });
  }
}
