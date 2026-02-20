import { useState, useEffect } from "react";

export type PermissionState = "granted" | "denied" | "prompt" | "loading";

export const useLocationPermission = () => {
  const [permission, setPermission] = useState<PermissionState>("loading");

  useEffect(() => {
    let isMounted = true;

    if (!("geolocation" in navigator)) {
      setTimeout(() => setPermission("denied"), 0);
      return;
    }

    const checkPermission = async () => {
      try {
        if (!("permissions" in navigator)) {
          // If Permissions API isn't supported (e.g., some older Safari versions), we don't know the state without prompting.
          setPermission("prompt");
          return;
        }

        const result = await navigator.permissions.query({
          name: "geolocation",
        });
        if (isMounted) {
          setPermission(result.state);
        }

        const handleChange = () => {
          if (isMounted) {
            setPermission(result.state);
          }
        };

        result.addEventListener("change", handleChange);

        return () => {
          result.removeEventListener("change", handleChange);
        };
      } catch {
        // Fallback for browsers that throw errors on Permissions API
        if (isMounted) {
          setPermission("prompt");
        }
      }
    };

    checkPermission();

    return () => {
      isMounted = false;
    };
  }, []);

  const requestPermission = () => {
    if (!("geolocation" in navigator)) return;

    // Trigger the native browser prompt
    navigator.geolocation.getCurrentPosition(
      () => setPermission("granted"),
      () => {
        // Keep it as denied, the user will see the overlay.
        setPermission("denied");
      },
      { timeout: 10000, maximumAge: 0 },
    );
  };

  return { permission, requestPermission, isLoading: permission === "loading" };
};
