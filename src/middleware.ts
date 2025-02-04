import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const userAgent = req.headers.get("user-agent") || "";

  // Simple check for mobile devices
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  if (!isMobile) {
    // Redirect desktop users to error page
    return NextResponse.redirect(new URL("/error", req.url));
  }

  // Allow access for mobile users
  return NextResponse.next();
}

// Apply middleware to all routes except the error page
export const config = {
  matcher: "/((?!error).*)", // This applies to all pages except /error
};
