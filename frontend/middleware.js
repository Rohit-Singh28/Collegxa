import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("jwttoken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/dashboard/:path*", "/counsellor/dashboard/:path*"], // Adjust to match your protected routes
};
