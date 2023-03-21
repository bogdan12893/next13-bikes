"use client";
import axios from "axios";
import { useEffect, useState } from "react";

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
  const [bike, setBike] = useState<BikeType>({ brand: "", type: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBike(bikeId);
        setBike(response);
      } catch (error: any) {
        console.log(error.response);
      }
    };

    fetchData();
  }, [bikeId]);
  return (
    <h1>
      {bike?.brand} - {bike?.type}
    </h1>
  );
}
