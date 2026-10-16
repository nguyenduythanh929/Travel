// Mapping for tour types and regions
export interface RegionInfo {
  id: number;
  slug: string;
  label: string;
  parentId: number;
  parentSlug: string;
  parentLabel: string;
}

// Tour type mapping
export const tourRegions: { [key: number]: RegionInfo } = {
  1: {
    id: 1,
    slug: "trongnuoc",
    label: "Trong nước",
    parentId: 0,
    parentSlug: "",
    parentLabel: "Trang chủ",
  },
  2: {
    id: 2,
    slug: "nuocngoai",
    label: "Nước ngoài",
    parentId: 0,
    parentSlug: "",
    parentLabel: "Trang chủ",
  },
  3: {
    id: 3,
    slug: "bac",
    label: "Miền Bắc",
    parentId: 1,
    parentSlug: "trongnuoc",
    parentLabel: "Trong nước",
  },
  4: {
    id: 4,
    slug: "trung",
    label: "Miền Trung",
    parentId: 1,
    parentSlug: "trongnuoc",
    parentLabel: "Trong nước",
  },
  5: {
    id: 5,
    slug: "nam",
    label: "Miền Nam",
    parentId: 1,
    parentSlug: "trongnuoc",
    parentLabel: "Trong nước",
  },
  6: {
    id: 6,
    slug: "chaua",
    label: "Châu Á",
    parentId: 2,
    parentSlug: "nuocngoai",
    parentLabel: "Nước ngoài",
  },
  7: {
    id: 7,
    slug: "chauau",
    label: "Châu Âu",
    parentId: 2,
    parentSlug: "nuocngoai",
    parentLabel: "Nước ngoài",
  },
  8: {
    id: 8,
    slug: "chauuc",
    label: "Châu Úc",
    parentId: 2,
    parentSlug: "nuocngoai",
    parentLabel: "Nước ngoài",
  },
};

/**
 * Get region info by tour type ID
 */
export function getRegionByTypeId(typeId?: number): RegionInfo | null {
  if (!typeId) return null;
  return tourRegions[typeId] || null;
}

/**
 * Get breadcrumb path for a tour
 * @param tourTypeId - The tour type ID
 * @param tourName - The tour name
 * @returns Array of breadcrumb items
 */
export function getTourBreadcrumb(
  tourTypeId?: number,
  tourName?: string
): Array<{ label: string; href?: string }> {
  const breadcrumbs = [{ label: "Trang chủ", href: "/" }];

  if (!tourTypeId) {
    if (tourName) breadcrumbs.push({ label: tourName });
    return breadcrumbs;
  }

  const region = getRegionByTypeId(tourTypeId);

  if (!region) {
    if (tourName) breadcrumbs.push({ label: tourName });
    return breadcrumbs;
  }

  // Add parent if exists (Trong nước or Nước ngoài)
  if (region.parentId > 0) {
    const parent = tourRegions[region.parentId];
    if (parent) {
      breadcrumbs.push({
        label: parent.label,
        href: `/tourdetail/${parent.slug}`,
      });
    }
  }

  // Add current region (Miền Bắc, Châu Á, etc.)
  breadcrumbs.push({
    label: region.label,
    href: `/tourdetail/${region.slug}`,
  });

  // Add tour name
  if (tourName) {
    breadcrumbs.push({ label: tourName });
  }

  return breadcrumbs;
}

/**
 * Get the URL path for a tour detail page
 * @param tourId - The tour ID
 * @param tourTypeId - The tour type ID
 * @returns The URL path
 */
export function getTourDetailPath(tourId: number, tourTypeId?: number): string {
  if (!tourTypeId) {
    return `/tourdetail/trongnuoc/${tourId}`;
  }

  const region = getRegionByTypeId(tourTypeId);

  if (!region) {
    return `/tourdetail/trongnuoc/${tourId}`;
  }

  // Use the region's slug directly for the path
  return `/tourdetail/${region.slug}/${tourId}`;
}
