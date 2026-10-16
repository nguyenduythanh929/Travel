// utils/tourTypeHelpers.ts
import { TourTypeResponse } from "@/api/tourTypeApi";

/**
 * Flatten tour types tree structure to a single array
 * Includes both parent and children tour types
 *
 * @param tourTypes - Array of tour types with children
 * @returns Flattened array of all tour types
 *
 * @example
 * const tourTypes = [
 *   { id: 1, name: "Trong Nước", children: [
 *     { id: 3, name: "Miền Bắc" }
 *   ]}
 * ];
 * const flattened = flattenTourTypes(tourTypes);
 * // Returns: [{id: 1, ...}, {id: 3, ...}]
 */
export function flattenTourTypes(
  tourTypes: TourTypeResponse[]
): TourTypeResponse[] {
  const result: TourTypeResponse[] = [];

  tourTypes.forEach((parent) => {
    // Add parent
    result.push(parent);

    // Add children if exists
    if (parent.children && parent.children.length > 0) {
      result.push(...parent.children);
    }
  });

  return result;
}

/**
 * Find tour type by value (slug)
 *
 * @param tourTypes - Array of tour types
 * @param value - Value/slug to search for (e.g., "mienbac", "chaua")
 * @returns Tour type if found, undefined otherwise
 *
 * @example
 * const tourType = findTourTypeByValue(allTourTypes, "mienbac");
 * // Returns: {id: 3, name: "Miền Bắc", value: "mienbac"}
 */
export function findTourTypeByValue(
  tourTypes: TourTypeResponse[],
  value: string | undefined
): TourTypeResponse | undefined {
  if (!value) return undefined;
  return tourTypes.find((item) => item.value === value);
}

/**
 * Find tour type by ID
 *
 * @param tourTypes - Array of tour types
 * @param id - Tour type ID to search for
 * @returns Tour type if found, undefined otherwise
 */
export function findTourTypeById(
  tourTypes: TourTypeResponse[],
  id: number | undefined
): TourTypeResponse | undefined {
  if (!id) return undefined;
  return tourTypes.find((item) => item.id === id);
}

/**
 * Get all children tour types of a parent
 *
 * @param tourTypes - Array of tour types
 * @param parentValue - Parent value/slug (e.g., "trongnuoc")
 * @returns Array of children tour types
 *
 * @example
 * const children = getChildrenByParentValue(tourTypes, "trongnuoc");
 * // Returns: [{id: 3, name: "Miền Bắc"}, {id: 4, name: "Miền Trung"}, ...]
 */
export function getChildrenByParentValue(
  tourTypes: TourTypeResponse[],
  parentValue: string
): TourTypeResponse[] {
  const parent = tourTypes.find((item) => item.value === parentValue);
  return parent?.children || [];
}

/**
 * Check if tour type is a parent (has children)
 *
 * @param tourType - Tour type to check
 * @returns true if has children, false otherwise
 */
export function isParentTourType(tourType: TourTypeResponse): boolean {
  return Boolean(tourType.children && tourType.children.length > 0);
}

/**
 * Get parent tour type of a child
 *
 * @param tourTypes - Array of tour types with children
 * @param childId - Child tour type ID
 * @returns Parent tour type if found, undefined otherwise
 */
export function getParentOfChild(
  tourTypes: TourTypeResponse[],
  childId: number
): TourTypeResponse | undefined {
  for (const parent of tourTypes) {
    if (parent.children) {
      const found = parent.children.find((child) => child.id === childId);
      if (found) return parent;
    }
  }
  return undefined;
}

/**
 * Format tour type name for display
 * Children: "Tour {name}" (e.g., "Tour Miền Bắc")
 * Parents: "{name}" (e.g., "Trong Nước")
 *
 * @param tourType - Tour type to format
 * @returns Formatted name
 */
export function formatTourTypeName(tourType: TourTypeResponse): string {
  if (isParentTourType(tourType)) {
    return tourType.name;
  }
  return `Tour ${tourType.name}`;
}

/**
 * Get breadcrumb for tour type
 *
 * @param tourTypes - Array of tour types with children
 * @param currentTourType - Current tour type
 * @returns Array of breadcrumb items
 *
 * @example
 * const breadcrumb = getTourTypeBreadcrumb(tourTypes, mienBacTourType);
 * // Returns: ["Trang chủ", "Trong Nước", "Miền Bắc"]
 */
export function getTourTypeBreadcrumb(
  tourTypes: TourTypeResponse[],
  currentTourType: TourTypeResponse | undefined
): string[] {
  if (!currentTourType) return ["Trang chủ"];

  const breadcrumb = ["Trang chủ"];

  // If current is a child, find and add parent
  if (currentTourType.parentId) {
    const parent = tourTypes.find((t) => t.id === currentTourType.parentId);
    if (parent) {
      breadcrumb.push(parent.name);
    }
  }

  breadcrumb.push(currentTourType.name);
  return breadcrumb;
}
