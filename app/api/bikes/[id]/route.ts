import prisma from "../../../../prisma/index";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

type ParamsType = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: ParamsType) {
  try {
    const { id } = params;
    const data = await prisma.bike.findUnique({
      where: {
        id: id,
      },
      include: { categories: { include: { category: true } } },
    });

    const formatData = {
      ...data,
      categories: data.categories.map((categ) => categ.category),
    };

    if (!data) {
      throw new Error();
    }
    return NextResponse.json(formatData);
  } catch (error: any) {
    return new NextResponse("Error has occured while fetching this bike", {
      status: 403,
    });
  }
}

export async function DELETE(request: Request, { params }: ParamsType) {
  try {
    const { id } = params;

    const data = await prisma.bike.delete({
      where: {
        id: id,
      },
    });

    if (!data) {
      throw new Error();
    }
    return NextResponse.json(data);
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("aici", error);
    }
    return new NextResponse("Error has occured while deleting this bike", {
      status: 403,
    });
  }
}

export async function PATCH(request: Request, { params }: ParamsType) {
  const res = await request.json();
  const { id } = params;

  if (!res.brand.length) {
    return new NextResponse("Please add a brand name", {
      status: 403,
    });
  }

  console.log(res);

  try {
    await prisma.bike.update({
      where: {
        id: id,
      },
      data: {
        brand: res.brand,
        categories: {
          createMany: {
            data: [{ categoryId: "clfi6t17a000ww7kygidb5zqo" }],
          },
          deleteMany: {
            OR: [{ categoryId: { equals: "clfi1u2ku0002w7kyc1hqij5f" } }],
          },
        },
      },
      include: { categories: { include: { category: true } } },
    });

    return NextResponse.json(res);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("aici", error);
    }
    return new NextResponse("Error has occured while editing a bike", {
      status: 500,
    });
  }
}
