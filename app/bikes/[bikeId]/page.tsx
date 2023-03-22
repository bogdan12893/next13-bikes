"use client";
import BikeFormEdit from "@/app/components/bike-page/BikeFormEdit";
import axios from "axios";
import { useEffect, useState } from "react";
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

export default function BikePage({ params: { bikeId } }: URL) {
  const { data, error, isLoading } = useQuery<BikeType>({
    queryFn: () => fetchBike(bikeId),
    queryKey: ["bike"],
  });
  if (error || isLoading)
    return <ComponentState error={error} isLoading={isLoading} />;
  return (
    <h1>
      <BikeFormEdit editBike={data} bikeId={bikeId} />
    </h1>
  );
}
