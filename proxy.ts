import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SHIPMENT_CREATION_PREFIX = "/app/shipments/new";

const decodeCookieToken = (value?: string): string | null => {
  if (!value) return null;

  try {
    const payload = value.startsWith("b64:") ? value.slice(4) : value;
    // Cookies are base64-obfuscated in auth-helper.
    return decodeURIComponent(escape(atob(payload)));
  } catch {
    // Fallback for legacy/plain token values.
    return value;
  }
};



const getShipmentGuardState = async (
  token: string,
): Promise<{ blocked: boolean; reason: "email" }> => {
  const baseURL =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/api";

  try {
    const response = await fetch(`${baseURL}/auth/get-current-user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return { blocked: false, reason: "email" };
    }

    const data = (await response.json()) as {
      user?: { is_verified?: boolean };
      data?: { user?: { is_verified?: boolean } };
    };

    const user = data.user || data.data?.user;
    if (!user) return { blocked: false, reason: "email" };

    const emailVerified = user.is_verified === true;

    return { blocked: !emailVerified, reason: "email" };
  } catch {
    return { blocked: false, reason: "email" };
  }
};

export async function proxy(request: NextRequest) {
  const encodedToken = request.cookies.get("mls_access_token")?.value;
  const token = decodeCookieToken(encodedToken);

  // Define routes that should not be accessible when authenticated
  const authRoutes = ["/login", "/register", "/auth/forgot-password"];

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  // If user is authenticated and tries to access an auth route, redirect to dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/app/dashboard", request.url));
  }

  // Block shipment creation early if account is not verified or address is incomplete.
  if (token && request.nextUrl.pathname.startsWith(SHIPMENT_CREATION_PREFIX)) {
    const guardState = await getShipmentGuardState(token);
    const currentGuard = request.nextUrl.searchParams.get("guard");
    const currentRequired = request.nextUrl.searchParams.get(
      "verificationRequired",
    );

    if (guardState.blocked) {
      if (currentRequired === "1" && currentGuard === guardState.reason) {
        return NextResponse.next();
      }

      const redirectUrl = request.nextUrl.clone();
      redirectUrl.searchParams.set("verificationRequired", "1");
      redirectUrl.searchParams.set("guard", guardState.reason);
      return NextResponse.redirect(redirectUrl);
    }

    // Clear stale guard params after user is fully compliant.
    if (currentRequired === "1" || currentGuard) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.searchParams.delete("verificationRequired");
      redirectUrl.searchParams.delete("guard");
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If user is authenticated and visits a tracking URL with an ID, redirect to internal shipment details
  // Matches /track-shipment/ANYTHING but not just /track-shipment
  const trackShipmentMatch = request.nextUrl.pathname.match(
    /^\/track-shipment\/(.+)$/,
  );
  if (token && trackShipmentMatch) {
    const trackingId = trackShipmentMatch[1];
    return NextResponse.redirect(
      new URL(`/app/shipments/${trackingId}`, request.url),
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
