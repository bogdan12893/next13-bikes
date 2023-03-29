import prisma from "../../../../prisma/index";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

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
      include: {
        categories: { include: { category: true } },
        comments: {
          select: {
            id: true,
            text: true,
            createdAt: true,
            user: { select: { name: true } },
          },
        },
      },
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
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Login to delete a bike", { status: 401 });
  }

  try {
    const { id } = params;

    const findBike = await prisma.bike.findUnique({
      where: {
        id: id,
      },
    });

    if (findBike?.userId !== session.user.id) {
      return new NextResponse(
        "This is not your bike. You can't delete this bike.",
        { status: 401 }
      );
    }

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
    return new NextResponse("Error has occured while deleting this bike", {
      status: 403,
    });
  }
}

export async function PATCH(request: Request, { params }: ParamsType) {
  const requestBody = await request.json();
  const { id } = params;

  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Login to edit a bike", { status: 401 });
  }

  if (!requestBody.brand.length) {
    return new NextResponse("Please add a brand name", {
      status: 403,
    });
  }

  const categoriesToConnect = requestBody.categoriesIds?.map((id: string) => ({
    category: { connect: { id: id } },
  }));

  const handleUpdateCategories = () => {
    if (categoriesToConnect) {
      return {
        deleteMany: {},
        create: categoriesToConnect || [],
      };
    } else {
      return {};
    }
  };

  try {
    const findBike = await prisma.bike.findUnique({
      where: {
        id: id,
      },
    });

    if (findBike?.userId !== session.user.id) {
      return new NextResponse(
        "This is not your bike. You can't edit this bike.",
        { status: 401 }
      );
    }

    await prisma.bike.update({
      where: {
        id: id,
      },
      data: {
        brand: requestBody.brand,
        model: requestBody.model,
        description: requestBody.description,
        categories: handleUpdateCategories(),
      },
      include: { categories: { include: { category: true } } },
    });

    return NextResponse.json(requestBody);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("aici", error);
    }
    return new NextResponse("Error has occured while editing a bike", {
      status: 500,
    });
  }
}
