"use client";
import Chart from "@/components/Chart";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Homepage() {
  const [data, setData] = useState<any>();
  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:8088/api/dashboard", {
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
