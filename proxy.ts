import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("mls_access_token")?.value;

  // Define routes that should not be accessible when authenticated
  const authRoutes = ["/login", "/register", "/auth/forgot-password"];

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If user is authenticated and tries to access an auth route, redirect to dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/app/dashboard", request.url));
  }

  // If user is authenticated and visits a tracking URL with an ID, redirect to internal shipment details
  // Matches /track-shipment/ANYTHING but not just /track-shipment
  const trackShipmentMatch = request.nextUrl.pathname.match(
    /^\/track-shipment\/(.+)$/
  );
  if (token && trackShipmentMatch) {
    const trackingId = trackShipmentMatch[1];
    return NextResponse.redirect(
      new URL(`/app/shipments/${trackingId}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
