import React from "react";
import { FaMapMarkerAlt, FaLock } from "react-icons/fa";
import Button from "@/components/ui/button";

interface LocationPermissionOverlayProps {
  onRetry: () => void;
}

export const LocationPermissionOverlay: React.FC<
  LocationPermissionOverlayProps
> = ({ onRetry }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-color/95 backdrop-blur-sm p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="mx-auto h-20 w-20 bg-brand-blue/10 rounded-full flex items-center justify-center mb-6 relative">
          <FaMapMarkerAlt className="h-8 w-8 text-brand-blue" />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
            <FaLock className="h-4 w-4 text-red-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Location Access Required
        </h2>

        <p className="text-gray-600 mb-6 leading-relaxed">
          To provide accurate shipping estimates and services in your region,
          Momentum Logistics Service requires access to your location.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 text-left mb-8 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            How to enable:
          </h3>
          <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
            <li>
              Click the{" "}
              <span className="font-semibold text-gray-900">padlock icon</span>{" "}
              (🔒) in your browser&apos;s address bar.
            </li>
            <li>
              Find <span className="font-semibold">Location</span> in the site
              settings.
            </li>
            <li>
              Change the permission from{" "}
              <span className="text-red-500 font-semibold">Block</span> to{" "}
              <span className="text-brand-blue font-semibold">Allow</span>.
            </li>
            <li>Refresh the page or click Retry below.</li>
          </ol>
        </div>

        <Button
          onClick={onRetry}
          className="w-full h-12 text-base font-semibold"
        >
          Check Permission Again
        </Button>
      </div>
    </div>
  );
};
