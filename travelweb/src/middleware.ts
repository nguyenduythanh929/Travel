import { NextResponse, NextRequest } from "next/server";

const privatePaths = ["/me"];
const publicPaths = ["/login", "/register"];
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sessionToken = request.cookies.get("sessionToken")?.value || null;
  console.log("Middleware Pathname:", sessionToken);

  if (publicPaths.some((path) => path.startsWith(path)) && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/me", "/login", "/register"],
};
