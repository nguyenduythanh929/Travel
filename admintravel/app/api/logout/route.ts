// app/api/logout/route.ts
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  // Delete cookies - must match the same options used when setting
  cookieStore.delete("sessionToken");
  cookieStore.delete("userId");

  return Response.json({ message: "Đã logout" }, { status: 200 });
}
