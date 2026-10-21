"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getTourTypesTree, TourTypeResponse } from "@/app/api/tourTypeApi";
import { cn } from "@/lib/utils";
const regions = [
  { id: 3, value: "bac", label: "Miền Bắc" },
  { id: 4, value: "trung", label: "Miền Trung" },
  { id: 5, value: "nam", label: "Miền Nam" },
  { id: 6, value: "chaua", label: "Châu á" },
  { id: 7, value: "chauau", label: "Châu âu" },
  { id: 8, value: "chauuc", label: "Châu úc" },
];


export default function NavBarHeader() {
  const [tourTypes, setTourTypes] = useState<TourTypeResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTourTypes = async () => {
      try {
        setIsLoading(true);
        const data = await getTourTypesTree();
        console.log("Tour types fetched:", data);
        setTourTypes(data);
      } catch (error) {
        console.error("Error loading tour types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourTypes();
  }, []);

  const getTourUrl = (tourType: TourTypeResponse): string => {

    const identifier = regions.find(x => tourType?.id === x.id )

    return `/tourdetail/${identifier?.value}`;
  };

  const renderTourTypeWithChildren = (tourType: TourTypeResponse) => {
    return (
      <NavigationMenuItem key={tourType.id}>
        <NavigationMenuTrigger className="text-base font-medium text-gray-700 bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
          {tourType.name}
        </NavigationMenuTrigger>

        <NavigationMenuContent className="!w-[320px] !left-0 -left-4">
          <ul className="p-2 rounded-lg shadow-lg">
            {tourType.children?.map((child, index) => (
              <li key={child.id}>
                <Link
                  href={getTourUrl(child)}
                  className={cn(
                    "block px-4 py-3 text-base rounded-md transition-colors",
                    "hover:bg-[#4502C7] hover:text-white",
                    "text-[#4502C7] font-medium",
                  )}
                >
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  };

  const renderTourTypeLink = (tourType: TourTypeResponse) => {
    return (
      <NavigationMenuItem key={tourType.id}>
        <Link href={getTourUrl(tourType)} >
          <NavigationMenuLink className="text-base font-medium text-gray-700 hover:text-purple-600 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors inline-flex items-center">
            {tourType.name}
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    );
  };

  if (isLoading) {
    return (
      <NavigationMenu>
        <NavigationMenuList className="gap-2">
          <NavigationMenuItem>
            <Link href="/" className="text-base font-medium text-gray-700 px-4 py-2" >
              
                Trang Chủ
            
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <span className="text-base text-gray-400 px-4">Đang tải...</span>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <Link href="/" className="text-base font-medium text-gray-700 hover:text-purple-600 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors inline-flex items-center">
              Trang Chủ
          </Link>
        </NavigationMenuItem>

        {tourTypes.map((tourType) => {
          if (tourType.children && tourType.children.length > 0) {
            return renderTourTypeWithChildren(tourType);
          } else {
            return renderTourTypeLink(tourType);
          }
        })}

        <NavigationMenuItem>
          
            <NavigationMenuLink asChild className="text-base font-medium text-gray-700 hover:text-purple-600 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors inline-flex items-center">
             <Link href="/news" >
              Tin tức
              </Link>
            </NavigationMenuLink>
          
        </NavigationMenuItem>

        <NavigationMenuItem>
            <NavigationMenuLink asChild className="text-base font-medium text-gray-700 hover:text-purple-600 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors inline-flex items-center">
          <Link href="/contact" >
              Liên hệ
          </Link>
            </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
