"use client";
import BikeFormEdit from "@/app/components/bike-page/BikeFormEdit";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ComponentState from "@/app/components/ComponentState";

type BikeType = {
  id?: string;
  brand: string;
  type: string;
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

export default function BikeEditPage({ params: { bikeId } }: URL) {
  const { data, error, isLoading } = useQuery<BikeType>({
    queryFn: () => fetchBike(bikeId),
    queryKey: ["bike"],
  });
  if (error || isLoading)
    return <ComponentState error={error} isLoading={isLoading} />;
  return (
    <div className="flex flex-col items-center h-screen">
      <BikeFormEdit editBike={data} bikeId={bikeId} />
    </div>
  );
}
