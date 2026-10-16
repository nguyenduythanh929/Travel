const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088/api";

const USERS_ENDPOINT = `${API_BASE_URL}/users`;

// Handle API response errors
const handleResponse = async (res: Response) => {
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }
  if (res.status === 403) {
    if (typeof window !== "undefined") {
      window.location.href = "/not-found";
    }
    throw new Error("Forbidden");
  }
};

export interface UserDetail {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  avatar?: string;
  status: number;
  roleName?: string;
  roleCode?: string;
}

export interface UserListResponse {
  users: UserDetail[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  roleCode: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type UpdateUserPayload = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  roleCode: string;
  status?: number;
};

export const deleteUsers = async (ids: number[]) => {
  const res = await fetch(USERS_ENDPOINT, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(ids),
  });

  await handleResponse(res);
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Delete users failed");
  }

  return res.status;
};

export const updateUser = async (id: number, payload: UpdateUserPayload) => {
  const res = await fetch(`${USERS_ENDPOINT}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  await handleResponse(res);
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Update user failed");
  }

  return res.json();
};

export const getUserById = async (id: number): Promise<UserDetail> => {
  const res = await fetch(`${USERS_ENDPOINT}/${id}`, {
    credentials: "include",
  });
  await handleResponse(res);
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Get user failed");
  }
  return res.json();
};

export const getCurrentUser = async (): Promise<UserDetail> => {
  // Get userId from cookie
  const userId = document.cookie
    .split("; ")
    .find((row) => row.startsWith("userId="))
    ?.split("=")[1];

  if (!userId) {
    throw new Error("User not logged in");
  }

  return getUserById(parseInt(userId));
};

export const changePassword = async (
  id: number,
  payload: ChangePasswordPayload
): Promise<string> => {
  const res = await fetch(`${USERS_ENDPOINT}/change-password/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  await handleResponse(res);
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Change password failed");
  }

  return res.text();
};

export const getUsersByRoleCode = async (
  roleCode: string,
  keyword?: string,
  offset: number = 0,
  limit: number = 10
): Promise<UserListResponse> => {
  const params = new URLSearchParams();
  if (keyword) params.append("keyword", keyword);
  params.append("offset", offset.toString());
  params.append("limit", limit.toString());

  const res = await fetch(
    `${USERS_ENDPOINT}/role/${roleCode}?${params.toString()}`,
    {
      credentials: "include",
    }
  );

  await handleResponse(res);
  if (!res.ok) {
    throw new Error("Failed to get users by role code");
  }

  return res.json();
};

export const createUser = async (
  payload: CreateUserPayload
): Promise<UserDetail> => {
  const res = await fetch(USERS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  await handleResponse(res);
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Create user failed");
  }

  return res.json();
};
