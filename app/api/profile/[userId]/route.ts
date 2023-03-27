import { getServerSession } from "next-auth";
import prisma from "../../../../prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: session?.user.id },
  });
  try {
    const data = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        bikes: {
          include: { categories: { include: { category: true } } },
        },
      },
    });

    const formatData = {
      ...data,
      bikes: data?.bikes.map((bike) => {
        return {
          ...bike,
          categories: bike.categories.map((categ) => categ.category),
        };
      }),
    };

    return NextResponse.json(formatData);
  } catch (error) {
    return new NextResponse("Error has occured while fetching your bikes", {
      status: 500,
    });
  }
}
