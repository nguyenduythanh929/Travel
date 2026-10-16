"use client";
import { BACKEND_URL } from "@/lib/backend";
import Chart from "@/components/Chart";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Homepage() {
  const [data, setData] = useState<any>();
  useEffect(() => {
    (async () => {
      const res = await fetch(`${BACKEND_URL}/api/dashboard`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setData(data);
      console.log("data fetch home", data.revenueByDate);
    })();
  }, []);
  return (
    <div>
      <Chart data={data} />
    </div>
  );
}
