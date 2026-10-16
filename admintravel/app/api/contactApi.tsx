const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088/api/contacts";

// Backend returns LocalDateTime as array: [year, month, day, hour, minute, second, nano]
export type DateArray = number[];

export interface ContactItem {
  id: number;
  email: string;
  created_at: DateArray;
  updated_at: DateArray;
  createdBy: string;
  updatedBy: string;
}

export interface ContactListResponse {
  data: ContactItem[];
  total_items: number;
  total_pages: number;
  current_page: number;
  page_size: number;
}

export interface ContactFilterParams {
  keyword?: string;
  start_date?: string;
  end_date?: string;
  offset?: number;
  limit?: number;
}

export const getContacts = async (
  params?: ContactFilterParams
): Promise<ContactListResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.keyword) searchParams.append("keyword", params.keyword);
  if (params?.start_date) searchParams.append("start_date", params.start_date);
  if (params?.end_date) searchParams.append("end_date", params.end_date);
  if (params?.offset !== undefined)
    searchParams.append("offset", params.offset.toString());
  if (params?.limit !== undefined)
    searchParams.append("limit", params.limit.toString());

  const queryString = searchParams.toString();
  const url = queryString ? `${API_BASE_URL}?${queryString}` : API_BASE_URL;

  const res = await fetch(url, { credentials: "include" });

  if (!res.ok) {
    throw new Error("Failed to get contacts!");
  }

  const data: ContactListResponse = await res.json();
  return data;
};

// Delete multiple contacts
export const deleteContacts = async (
  ids: number[]
): Promise<{ message: string }> => {
  if (ids.length === 0) {
    throw new Error("No IDs provided for deletion");
  }

  const res = await fetch(`${API_BASE_URL}/${ids.join(",")}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete contacts!");
  }

  return res.json();
};

// Add new contact
export const addContact = async (email: string): Promise<ContactItem> => {
  const res = await fetch(`${API_BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to add contact!");
  }

  const data: ContactItem = await res.json();
  return data;
};
