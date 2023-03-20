import prisma from "../../../../prisma/index";
import { NextResponse } from "next/server";

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
    });
    if (!data) {
      throw new Error();
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return new NextResponse("Error has occured while fetching this bike", {
      status: 403,
    });
  }
}
