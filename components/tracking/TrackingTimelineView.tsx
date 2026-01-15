import React from "react";
import { FiClock, FiMapPin, FiPackage } from "react-icons/fi";
import { TrackingResponse, TrackingTimeline } from "@/types/shipping";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  formatTrackingDate,
  formatTrackingTime,
} from "@/utils/format-tracking";

interface TrackingTimelineProps {
  trackingResponse: TrackingResponse;
}

/**
 * TrackingTimelineView Component
 * Renders a truncated timeline with efficient sorting and display logic.
 */
const TrackingTimelineView: React.FC<TrackingTimelineProps> = ({
  trackingResponse,
}) => {
  const router = useRouter();
  const { timeline, shipment } = trackingResponse;

  if (!timeline || timeline.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        <FiPackage className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p>
          Shipment details are being processed. Check back soon for updates.
        </p>
      </div>
    );
  }

  // Sort events by date descending (Newest first)
  const sortedEvents = [...timeline].sort(
    (a, b) =>
      new Date(b.timestamp || b.date || 0).getTime() -
      new Date(a.timestamp || a.date || 0).getTime()
  );

  const totalEvents = sortedEvents.length;
  const showGap = totalEvents > 3;

  // Prepare display events: [Latest, Second Latest, ...Gap..., Earliest]
  const displayEvents: (TrackingTimeline | { isGap: true })[] = [];

  if (showGap) {
    displayEvents.push(sortedEvents[0]);
    displayEvents.push(sortedEvents[1]);
    displayEvents.push({ isGap: true });
    displayEvents.push(sortedEvents[totalEvents - 1]);
  } else {
    displayEvents.push(...sortedEvents);
  }

  const shipmentId = shipment.customTrackingNumber || shipment.id;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <FiClock className="text-brand-blue" /> Shipment Timeline
      </h3>

      <div className="relative pl-8 space-y-10 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
        {displayEvents.map((event, index) => {
          if ("isGap" in event) {
            return (
              <div key="gap" className="relative py-4">
                <div className="absolute -left-[29px] top-0 bottom-0 w-1 border-l-2 border-dotted border-brand-blue" />
                <div className="flex items-center">
                  <Button
                    onClick={() => router.push(`/app/shipments/${shipmentId}`)}
                    className="block mx-auto text-brand-blue border-brand-blue hover:bg-brand-blue/5"
                  >
                    See full shipment information
                  </Button>
                </div>
              </div>
            );
          }

          const isLatest = index === 0;

          return (
            <div key={index} className="relative pb-2">
              <div
                className={`absolute -left-[37px] top-1.5 w-5 h-5 rounded-full border-4 border-brand-blue shadow-sm z-10 ${
                  isLatest ? "bg-brand-yellow scale-125" : "bg-gray-300"
                }`}
              />

              <div className="flex flex-col md:flex-row md:justify-between items-start gap-1 md:gap-4 group">
                <div>
                  <p
                    className={`font-bold transition-colors ${
                      isLatest ? "text-gray-900 text-lg" : "text-gray-700"
                    }`}
                  >
                    {event.status}
                  </p>
                  <p className="text-gray-400 text-sm mt-0.5 font-medium leading-relaxed">
                    {event.statusDescription || event.description}
                  </p>
                  <p className="text-gray-400 text-xs flex items-center gap-1.5 mt-2">
                    <FiMapPin className="w-3 h-3 shrink-0" />
                    {event.location && event.location !== "undefined, undefined"
                      ? event.location
                      : "Location could not be determined"}
                  </p>
                </div>
                <div className="shrink-0 text-left md:text-right pt-1 md:pt-0">
                  <p className="text-sm font-bold text-gray-900 capitalize">
                    {formatTrackingDate(event.timestamp || event.date)}
                  </p>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    {formatTrackingTime(event.timestamp || event.date)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackingTimelineView;
