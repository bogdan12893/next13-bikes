"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import BikeForm from "./components/bike-page/BikeForm";
import { BikeType } from "./types/Bike";
import BikeItem from "./components/bike-page/BikeItem";
import ComponentState from "./components/ComponentState";

const fetchBikes = async () => {
  const res = await axios.get(`/api/bikes`);
  return res.data;
};

export default function Home() {
  const { data, error, isLoading } = useQuery<BikeType[]>({
    queryFn: fetchBikes,
    queryKey: ["bikes"],
  });

  if (error || isLoading)
    return <ComponentState error={error} isLoading={isLoading} />;
  return (
    <div className="flex flex-col items-center">
      <BikeForm />
      <div className="p-10 w-full">
        <h2 className="font-bold text-xl mb-5 text-center">Bike List</h2>
        <div className="flex flex-col items-center">
          {data?.length < 1
            ? "no bikes added"
            : data?.map((bike) => {
                return <BikeItem key={bike.id} {...bike} />;
              })}
        </div>
      </div>
    </div>
  );
}
