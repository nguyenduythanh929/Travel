import React from "react";
import { cookies } from "next/headers";
export default async function MeFrofile() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken");
  console.log("Session Token:", sessionToken?.value);
  return <div>page</div>;
}
