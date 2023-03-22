"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BikeType } from "@/app/types/Bike";

const fetchCategories = async () => {
  const res = await axios.get(`/api/categories`);
  return res.data;
};

export default function BikeForm({ editBike, bikeId }) {
  const [bike, setBike] = useState<BikeType>({ brand: "", categories: [] });
  const [isDisabled, setIsDisabled] = useState(false);
  const queryCLient = useQueryClient();
  let bikeToastId: string = "bikeToast";

  const {
    data: categories,
    error,
    isLoading,
  } = useQuery<BikeType[]>({
    queryFn: fetchCategories,
    queryKey: ["categories"],
  });

  const mutation = useMutation({
    mutationFn: (data: BikeType) => {
      return axios.patch(`/api/bikes/${bikeId}`, data);
    },
    onError: (error: Error | any) => {
      toast.error(error?.response?.data, { id: bikeToastId });
      setIsDisabled(false);
    },
    onSuccess: (data) => {
      toast.success("Bike updated successfully", { id: bikeToastId });
      queryCLient.invalidateQueries(["bike"]);
      setIsDisabled(false);
    },
  });
  const handleCategories = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (bike.categories.includes(e.target.value)) {
      return;
    }
    bike.categories.push(e.target.value);
    setBike({ ...bike, categories: bike.categories });
  };

  const submitBike = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    toast.loading("Updating your bike", { id: bikeToastId });
    mutation.mutate(bike);
  };

  useEffect(() => {
    setBike({ ...editBike });
  }, [editBike]);

  return (
    <div className="bg-gray-800 w-full p-10 mb-10 rounded-b-xl lg:w-1/2 lg:px-20">
      <h1 className="font-bold text-2xl mb-4 text-center">◀︎ Edit Bike ▶︎</h1>
      <form onSubmit={submitBike}>
        <input
          className="mb-3"
          type="text"
          value={bike.brand}
          placeholder="brand"
          onChange={(e) => setBike({ ...bike, brand: e.target.value })}
        />
        <select
          className="mb-3"
          name="categories"
          multiple
          onChange={(e) => handleCategories(e)}
        >
          {categories?.map((category) => {
            return (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            );
          })}
        </select>
        <button disabled={isDisabled}>Edit bike</button>
      </form>
    </div>
  );
}
