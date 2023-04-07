import { getServerSession } from "next-auth";
import prisma from "../../../prisma/index";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
// import { authOptions } from "../auth/[...nextauth]/route";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";

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
        OR: [
          {
            brand: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            model: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        _count: {
          select: { likes: true },
        },
        categories: { include: { category: true } },
        comments: true,
        likes: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const formatData = data.map((bike) => {
      return {
        ...bike,
        categories: bike.categories.map((categ) => categ.category),
        comments: bike.comments.length,
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

  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Login to create your bike! ", {
      status: 401,
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: session?.user.id },
  });

  if (!requestBody.brand.length) {
    return new NextResponse("Please add a brand name", {
      status: 403,
    });
  }

  try {
    await prisma.bike.create({
      data: {
        brand: requestBody.brand,
        model: requestBody.model,
        description: requestBody.description,
        userId: user.id,
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
