import React from "react";
import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";

interface TrackingSearchProps {
  trackingId: string;
  setTrackingId: (id: string) => void;
  handleTrack: () => void;
  isLoading: boolean;
}

/**
 * TrackingSearch Component
 * Handles the search input and submission for tracking a shipment.
 */
const TrackingSearch: React.FC<TrackingSearchProps> = ({
  trackingId,
  setTrackingId,
  handleTrack,
  isLoading,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Shipment</h1>
      <p className="text-gray-500 mb-8">
        Enter your MLS tracking ID to see real-time status updates.
      </p>

      <form
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          handleTrack();
        }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter MLS Tracking ID (e.g. MLS-TRK-F84B00...)"
            className="pl-12 h-14 text-lg border-gray-200 focus:border-brand-blue ring-0 font-bold font-work-sans uppercase"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          className="h-14 px-8 text-lg font-bold"
          disabled={isLoading}
        >
          {isLoading ? "Tracking..." : "Track"}
        </Button>
      </form>
    </div>
  );
};

export default TrackingSearch;
