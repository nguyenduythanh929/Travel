"use client";

import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  getTourTypeByTourId,
  getTourTypesTree,
  TourTypeResponse,
} from "@/app/api/tourTypeApi";
import { getTourDetail } from "@/app/api/tourApi";
import { flattenTourTypes, findTourTypeByValue } from "@/app/utils/tourTypeHelpers";

interface BreadcrumbItemData {
  label: string;
  href: string;
}

function buildParentChain(tourType: TourTypeResponse, all: TourTypeResponse[]) {
  const chain: TourTypeResponse[] = [];

  let current: TourTypeResponse | undefined = tourType;

  while (current) {
    chain.unshift(current);
    if (!current.parentId) break;
    current = all.find((t) => t.id === current!.parentId);
  }

  return chain;
}

export default function TourDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const place = segments[1]; // tourdetail / [place]
  const idTour = segments[2]; // tourdetail / place / [idTour]

  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItemData[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buildBreadcrumb = async () => {
      try {
        setLoading(true);

        const tourTypesTree = await getTourTypesTree();
        const allTourTypes = flattenTourTypes(tourTypesTree);
        const items: BreadcrumbItemData[] = [];

        let type: TourTypeResponse | undefined = undefined;

        // -------------------------------
        // 1️⃣ Nếu có idTour → lấy thông tin tour
        // -------------------------------
        if (idTour) {
          const tourType = await getTourTypeByTourId(Number(idTour)); // tourType đã là data
          const response = await getTourDetail(Number(idTour));
          console.log("Tìm tour theo id: ", tourType);

          // Tìm loại tour bằng tour.tourTypeId
          type = allTourTypes.find((t) => t.id === tourType.id);
          console.log("Tìm loại tour bằng tourType", type);

          if (type) {
            const parentChain = buildParentChain(type, allTourTypes);

            // Build các breadcrumb Place (parent → child)
            parentChain.forEach((p) => {
              items.push({
                label: p.name,
                href: `/tourdetail/${p.value}`,
              });
            });

            // Cuối cùng là Tour
            items.push({
              label: response.data.name,
              href: `/tourdetail/${type.value}/${idTour}`,
            });
          }
        }
        // -------------------------------
        // 2️⃣ Không có idTour → chỉ đang ở trang Place
        // -------------------------------
        else {
          type = findTourTypeByValue(allTourTypes, place);
          if (type) {
            const parentChain = buildParentChain(type, allTourTypes);

            parentChain.forEach((p) => {
              items.push({
                label: p.name,
                href: `/tourdetail/${p.value}`,
              });
            });
          } else {
            // Fallback
            items.push({
              label: place,
              href: `/tourdetail/${place}`,
            });
          }
        }

        setBreadcrumbItems(items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    buildBreadcrumb();
  }, [place, idTour]);

  return (
    <>
      <div className="relative w-full h-[250px] overflow-hidden">
        <Image
          src="/banner-detail.jpg"
          alt="Ảnh tour"
          fill
          className="object-cover"
        />

        <Breadcrumb className="absolute flex bottom-5 left-0 right-0 m-auto z-10 xl:w-[1280px]">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-lg text-white" href="/">
                Trang chủ
              </BreadcrumbLink>
            </BreadcrumbItem>

            {!loading &&
              breadcrumbItems.map((item, index) => (
                <div key={index} className="flex items-center">
                  <BreadcrumbSeparator className="text-white" />
                  <BreadcrumbItem>
                    {index === breadcrumbItems.length - 1 ? (
                      <BreadcrumbPage className="text-lg text-white font-semibold">
                        {item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        className="text-lg text-white"
                        href={item.href}
                      >
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}

            {loading && (
              <>
                <BreadcrumbSeparator className="text-white" />
                <BreadcrumbItem>
                  <span className="text-lg text-white">...</span>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="absolute inset-0 bg-gradient-to-t from-blue-800/90 via-blue-400/60 to-transparent"></div>
      </div>

      {children}
    </>
  );
}
