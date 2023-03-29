"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ComponentState from "@/app/components/ComponentState";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import CommentForm from "@/app/components/bike-page/CommentForm";
import CommentsList from "@/app/components/bike-page/CommentsList";

type CategoryType = {
  id?: string;
  name: string;
};

type CommentType = {
  id?: string;
  text: string;
};

type BikeType = {
  id?: string;
  brand: string;
  type: string;
  model: string;
  description: string;
  userId?: string;
  categories: CategoryType[];
  comments: CommentType[];
};

type URL = {
  params: {
    bikeId: string;
  };
};

const fetchBike = async (bikeId: string) => {
  const res = await axios.get(`/api/bikes/${bikeId}`);
  return res.data;
};

export default function BikePage({ params: { bikeId } }: URL) {
  const { data, error, isLoading } = useQuery<BikeType>({
    queryFn: () => fetchBike(bikeId),
    queryKey: ["bike"],
  });
  const { data: session } = useSession();
  if (error || isLoading)
    return <ComponentState error={error} isLoading={isLoading} />;
  return (
    <div className="flex flex-col items-center h-screen">
      <div className="bg-teal-600 w-full p-5 lg:w-1/2 mt-5 rounded-t-lg relative">
        {data?.userId === session?.user.id && (
          <Link
            href={`/bikes/${bikeId}/edit`}
            className="absolute inline-block bg-teal-400 rounded-lg right-1 top-1 hover:shadow-md hover:bg-teal-300 transition-all duration-300"
          >
            <Image
              src="/svg/edit-pencil.svg"
              alt="edit pencil"
              width={30}
              height={30}
            />
          </Link>
        )}
        <h1 className="text-xl font-bold">{data?.model}</h1>
        <h2>Brand: {data?.brand}</h2>
        <p>Info: {data?.description}</p>
        <div className="flex flex-wrap my-4">
          {data?.categories.length > 0 ? (
            data?.categories.map((categ: CategoryType) => (
              <div
                key={categ.id}
                className=" bg-slate-500 py-1 px-2 mr-1 mb-1 rounded-md"
              >
                {categ.name}
              </div>
            ))
          ) : (
            <div>no categories added</div>
          )}
        </div>
      </div>
      <CommentsList comments={data?.comments} />
      <CommentForm bikeId={bikeId} />
    </div>
  );
}
