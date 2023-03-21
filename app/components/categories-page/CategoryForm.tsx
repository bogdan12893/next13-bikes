"use client";
import axios from "axios";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CategoryType } from "@/app/types/Category";

export default function CategoryForm() {
  const [category, setCategory] = useState<CategoryType>({ name: "" });
  const [isDisabled, setIsDisabled] = useState(false);
  const queryCLient = useQueryClient();
  let categoryToastId: string = "categoryToast";

  const mutation = useMutation({
    mutationFn: (data: CategoryType) => {
      return axios.post(`/api/categories`, data);
    },
    onError: (error: Error | any) => {
      toast.error(error?.response?.data, { id: categoryToastId });
      setCategory({ name: "" });
      setIsDisabled(false);
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Category created successfully", { id: categoryToastId });
      queryCLient.invalidateQueries(["categories"]);
      setCategory({ name: "" });
      setIsDisabled(false);
    },
  });

  const submitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    toast.loading("Creating your catrgory", { id: categoryToastId });
    mutation.mutate(category);
  };

  return (
    <div className="bg-gray-800 w-full p-10 mb-10 rounded-b-xl lg:w-1/2 lg:px-20">
      <h1 className="font-bold text-2xl mb-4 text-center">Bike Categories</h1>
      <form onSubmit={submitCategory}>
        <input
          className="mb-3"
          type="text"
          value={category.name}
          placeholder="name"
          onChange={(e) => setCategory({ ...category, name: e.target.value })}
        />
        <button disabled={isDisabled}>Add category</button>
      </form>
    </div>
  );
}
