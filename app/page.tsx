"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import BikeForm from "./components/bike-page/BikeForm";
import { BikeType } from "./types/Bike";
import BikeItem from "./components/bike-page/BikeItem";
import ComponentState from "./components/ComponentState";
import SearchInput from "./components/bike-page/SearchInput";
import { useSearchParams } from "next/navigation";

const fetchBikes = async (query: string) => {
  const res = await axios.get(`/api/bikes?q=${query}`);
  return res.data;
};

export default function Home() {
  const search = useSearchParams();

  let searchQuery = search ? search.get("q") : "";
  const encodedSearchQuery = encodeURI(searchQuery || "");

  const { data, error, isLoading } = useQuery<BikeType[]>({
    queryFn: () => fetchBikes(encodedSearchQuery),
    queryKey: ["bikes", search.get("q")],
  });

  return (
    <div className="flex flex-col items-center">
      <BikeForm />
      <SearchInput />
      <div className="p-10 w-full">
        {error || isLoading ? (
          <ComponentState error={error} isLoading={isLoading} />
        ) : (
          <>
            <h2 className="font-bold text-xl mb-5 text-center">Bike List</h2>
            <div className="flex flex-col items-center">
              {data?.length < 1
                ? "no bikes found"
                : data?.map((bike) => {
                    return <BikeItem key={bike.id} {...bike} />;
                  })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
