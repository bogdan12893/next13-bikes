"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type BikeType = {
  id?: string;
  brand: string;
  type: string;
};

const createBike = async (data: BikeType) => {
  const res = await axios.post(`/api/bikes`, data);
  return res.data;
};

const fetchBikes = async () => {
  const res = await axios.get(`/api/bikes`);
  return res.data;
};

export default function Home() {
  const [bikes, setBikes] = useState<BikeType[]>([]);
  const [bike, setBike] = useState<BikeType>({ brand: "", type: "" });

  useEffect(() => {
    fetchBikes().then((data) => {
      setBikes(data);
    });
  }, []);

  const submitBike = async (e: React.FormEvent) => {
    e.preventDefault();
    await createBike(bike);
  };
  return (
    <main>
      <div>
        <h1>Create a bike</h1>
        <form onSubmit={submitBike}>
          <input
            type="text"
            value={bike.brand}
            placeholder="brand"
            onChange={(e) => setBike({ ...bike, brand: e.target.value })}
          />
          <input
            type="text"
            value={bike.type}
            placeholder="type"
            onChange={(e) => setBike({ ...bike, type: e.target.value })}
          />
          <button>submit</button>
        </form>
      </div>
      <div>
        <h2>Bike List</h2>
      </div>
      {bikes.map((bike) => {
        return (
          <Link key={bike.id} href={{ pathname: `/bike/${bike.id}` }}>
            <div>
              <h3>{bike.brand}</h3>
              <h4>{bike.type}</h4>
            </div>
          </Link>
        );
      })}
    </main>
  );
}
