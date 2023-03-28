"use client";
import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BikeType } from "@/app/types/Bike";
import Multiselect from "./Multiselect";

const fetchCategories = async () => {
  const res = await axios.get(`/api/categories`);
  return res.data;
};

export default function BikeForm() {
  const [bike, setBike] = useState<BikeType>({
    brand: "",
    model: "",
    description: "",
    categories: [],
  });
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
      return axios.post(`/api/bikes`, data);
    },
    onError: (error: Error | any) => {
      toast.error(error?.response?.data, { id: bikeToastId });
      setBike({ brand: "", model: "", description: "", categories: [] });
      setIsDisabled(false);
    },
    onSuccess: (data) => {
      toast.success("Bike created successfully", { id: bikeToastId });
      queryCLient.invalidateQueries(["bikes"]);
      setBike({ brand: "", model: "", description: "", categories: [] });
      setIsDisabled(false);
    },
  });

  const submitBike = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    toast.loading("Creating your bike", { id: bikeToastId });
    mutation.mutate(bike);
  };

  const handleCateg = (selectedIds) => {
    const newSelectedCategories = categories.filter((c) =>
      selectedIds.includes(c.id)
    );
    setBike({
      ...bike,
      categories: newSelectedCategories,
    });
  };

  return (
    <div className="bg-gray-800 w-full p-10 mb-10 rounded-b-xl lg:w-1/2 lg:px-20">
      <h1 className="font-bold text-2xl mb-4 text-center">◀︎ Bike Garage ▶︎</h1>
      <form onSubmit={submitBike}>
        <input
          className="mb-3"
          type="text"
          value={bike.brand}
          placeholder="brand"
          onChange={(e) => setBike({ ...bike, brand: e.target.value })}
        />

        <input
          className="mb-3"
          type="text"
          value={bike.model}
          placeholder="model"
          onChange={(e) => setBike({ ...bike, model: e.target.value })}
        />

        <textarea
          className="mb-3"
          value={bike.description}
          placeholder="description"
          onChange={(e) => setBike({ ...bike, description: e.target.value })}
        />

        <Multiselect
          options={categories}
          selectedOptions={bike.categories.map((c) => c.id)}
          onChange={handleCateg}
        />

        <button disabled={isDisabled} className="mt-5">
          Add bike
        </button>
      </form>
    </div>
  );
}
