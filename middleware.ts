import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // const accessToken = localStorage.getItem("accessToken");
  // const { pathname } = req.nextUrl;

  // const publicRoutes = ["/login", "/sign-up"];

  // console.log(accessToken);
  

  // // not logged in → block protected routes
  // if (!accessToken && !publicRoutes.includes(pathname)) {

  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // // logged in → block auth pages
  // if (accessToken && publicRoutes.includes(pathname)) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
