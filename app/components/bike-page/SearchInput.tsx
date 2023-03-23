"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchInput() {
  const search = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string | null>(
    search ? search.get("q") : ""
  );
  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    if (typeof searchQuery !== "string") {
      return;
    }

    const encodedSearchQuery = encodeURI(searchQuery);
    router.push(`?q=${encodedSearchQuery}`);
  };
  return (
    <form onSubmit={onSearch} className="flex w-full lg:w-1/2 px-4">
      <input
        value={searchQuery || ""}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search for a bike"
      />
      <button className="w-40 ml-3" type="submit">
        search
      </button>
    </form>
  );
}
