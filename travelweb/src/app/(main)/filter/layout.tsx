"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export default function TourDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pivotfilter: string | undefined = pathname.split("/").pop();

  return (
    <>
      <div className="relative w-full h-[250px]  overflow-hidden">
        <Image
          src="/banner-detail.jpg"
          alt="Ảnh tour"
          fill // tự động chiếm toàn bộ container
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-blue-800/90 via-blue-400/60 to-transparent"></div>
      </div>
      {children}
    </>
  );
}
