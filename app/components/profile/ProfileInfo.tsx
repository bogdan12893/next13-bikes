"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ComponentState from "../ComponentState";
import BikeItem from "../bike-page/BikeItem";

const fetchUserBikes = async (userId: string) => {
  const res = await axios.get(`/api/profile/${userId}`);
  return res.data;
};

export default function ProfileInfo({ session }) {
  const { data, error, isLoading } = useQuery({
    queryFn: () => fetchUserBikes(session.user.id),
    queryKey: ["userBikes"],
  });
  return (
    <div className="p-10 w-full">
      {error || isLoading ? (
        <ComponentState error={error} isLoading={isLoading} />
      ) : (
        <>
          <div className=" bg-teal-900 p-5 rounded-lg mb-5">
            <h1 className="text-xl font-bold">Profile Info:</h1>
            <p className="text-lg">{data?.name}</p>
            <p>{data?.email}</p>
          </div>
          <h2 className="font-bold text-xl mb-5 text-center">My bikes</h2>
          <div className="flex flex-col items-center">
            {data?.bikes.length < 1
              ? "You have no bikes added yet 🙃"
              : data?.bikes.map((bike) => {
                  return <BikeItem key={bike.id} {...bike} />;
                })}
          </div>
        </>
      )}
    </div>
  );
}
