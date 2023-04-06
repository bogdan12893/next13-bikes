"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import CategoryForm from "./CategoryForm";
import { CategoryType } from "../../types/Category";
import ComponentState from "../ComponentState";

const fetchCategories = async () => {
  const res = await axios.get(`/api/categories`);
  return res.data;
};

export default function Categories() {
  const { data, error, isLoading } = useQuery<CategoryType[]>({
    queryFn: fetchCategories,
    queryKey: ["categories"],
  });

  if (error || isLoading)
    return <ComponentState error={error} isLoading={isLoading} />;
  return (
    <div className="flex flex-col items-center">
      <CategoryForm />
      <div className="p-10 w-full">
        <h2 className="font-bold text-xl mb-5 text-center">Category List</h2>
        <div className="flex flex-wrap justify-center">
          {data?.length < 1
            ? "no categories added"
            : data?.map((category) => {
                return (
                  <div
                    key={category.id}
                    className="bg-gray-500 m-3 p-3 rounded-lg"
                  >
                    <p>{category.name}</p>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
