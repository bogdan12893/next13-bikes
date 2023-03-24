"use client";
import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BikeType } from "@/app/types/Bike";
import { Listbox } from "@headlessui/react";

const fetchCategories = async () => {
  const res = await axios.get(`/api/categories`);
  return res.data;
};

export default function BikeForm() {
  const [bike, setBike] = useState<BikeType>({ brand: "", categories: [] });
  const [selectedCategories, setSelectedCategories] = useState([]);
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
      setBike({ brand: "", categories: [] });
      setSelectedCategories([]);
      setIsDisabled(false);
    },
    onSuccess: (data) => {
      toast.success("Bike created successfully", { id: bikeToastId });
      queryCLient.invalidateQueries(["bikes"]);
      setBike({ brand: "", categories: [] });
      setSelectedCategories([]);
      setIsDisabled(false);
    },
  });

  const submitBike = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    toast.loading("Creating your bike", { id: bikeToastId });
    mutation.mutate(bike);
  };

  const handleCateg = (categ) => {
    const categoriesIds = categ.map((c) => c.id);
    setBike({ ...bike, categories: [...categoriesIds] });
    setSelectedCategories([...categ]);
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

        <Listbox value={selectedCategories} onChange={handleCateg} multiple>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-teal-700 h-10 mb-2 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              {selectedCategories.length < 1
                ? "select categories"
                : selectedCategories.map((categ) => categ.name).join(", ")}
            </Listbox.Button>
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-teal-600 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {categories?.map((categ) => (
                <Listbox.Option
                  key={categ.id}
                  value={categ}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? "bg-teal-400 text-black-900" : "text-gray-900"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {categ.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          ✅
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>

        <button disabled={isDisabled} className="mt-5">
          Add bike
        </button>
      </form>
    </div>
  );
}
