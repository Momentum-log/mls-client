import React from "react";
import { FiChevronRight, FiPackage } from "react-icons/fi";
import { Shipment } from "@/types/shipping";
import { formatStatus, getShipmentDisplayName } from "@/utils/shipment-helper";

interface RecentShipmentsProps {
  shipments: Shipment[];
  onTrack: (id: string) => void;
}

/**
 * RecentShipments Component
 * Displays a list of recent shipments for quick access when the search page is empty.
 */
const RecentShipments: React.FC<RecentShipmentsProps> = ({
  shipments,
  onTrack,
}) => {
  if (shipments.length === 0) return null;

  return (
    <div className="">
      <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
        <span className="h-px bg-gray-100 flex-1"></span>
        Recent Shipments
        <span className="h-px bg-gray-100 flex-1"></span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shipments.map((s) => (
          <button
            key={s.id}
            onClick={() => onTrack(s.id)}
            className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl text-left hover:border-brand-blue hover:shadow-md transition-all group"
          >
            <div className="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-brand-blue/5 group-hover:text-brand-blue transition-colors">
              <FiPackage className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-gray-900 truncate">
                {getShipmentDisplayName(s)}
              </p>
              <p className="text-xs text-brand-blue font-bold uppercase tracking-wider mt-0.5">
                {formatStatus(s.shipmentStatus)}
              </p>
            </div>
            <FiChevronRight className="text-gray-300 group-hover:text-brand-blue transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentShipments;
