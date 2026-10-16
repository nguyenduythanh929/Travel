// app/api/logout/route.ts
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore =await cookies();

  // Xóa token
  cookieStore.set("sessionToken", "", {
    path: "/",
    maxAge: 0,
  });

  cookieStore.set("userId", "", {
    path: "/",
    maxAge: 0,
  });

  return Response.json({ message: "Đã logout" }, { status: 200 });
}
