export const dynamic = "force-dynamic";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const data = await request.json();
  console.log("Received data:", data);

  if (!data || !data.token || !data.userId) {
    return Response.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();

  // Delete old cookies first to ensure fresh token
  cookieStore.delete("sessionToken");
  cookieStore.delete("userId");

  cookieStore.set("sessionToken", data.token, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
  });

  cookieStore.set("userId", String(data.userId), {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
  });

  return Response.json(
    { message: "Authentication successful" },
    { status: 200 }
  );
}
