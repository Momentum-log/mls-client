import Link from "next/link";
import Button from "@/components/ui/button";
import { FiBox, FiCheckCircle, FiDollarSign } from "react-icons/fi";
import { FaFileCirclePlus, FaArrowRight } from "react-icons/fa6";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Overview of your logistics activities
          </p>
        </div>
        <Link href="/app/shipments/new">
          <Button variant="primary" className="gap-2">
            <FaFileCirclePlus className="w-5 h-5" />
            Create Shipment
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Shipments - Brand Blue */}
        <div className="bg-brand-blue p-6 rounded-xl shadow-sm text-white relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <FiBox className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">0</h3>
            <p className="text-lg font-medium">Active Shipments</p>
            <p className="text-sm text-white/70 mt-1">
              Packages currently in transit
            </p>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform"></div>
        </div>

        {/* Completed Deliveries - Brand Yellow */}
        <div className="bg-brand-yellow p-6 rounded-xl shadow-sm text-brand-blue relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-brand-blue/10 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-brand-blue" />
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">0</h3>
            <p className="text-lg font-medium">Completed</p>
            <p className="text-sm text-brand-blue/70 mt-1">
              Successfully delivered items
            </p>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-blue/5 rounded-full group-hover:scale-110 transition-transform"></div>
        </div>

        {/* Total Spend - Accent Light */}
        <div className="bg-accent-light p-6 rounded-xl shadow-sm text-brand-blue relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-brand-blue/10 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-brand-blue" />
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">
              0.00 <span className="text-xl">PLN</span>
            </h3>
            <p className="text-lg font-medium">Total Spend</p>
            <p className="text-sm text-brand-blue/70 mt-1">
              Expenses this month
            </p>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-blue/5 rounded-full group-hover:scale-110 transition-transform"></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Recent Shipments</h2>
          <Link href="/app/shipments">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-brand-blue hover:text-brand-yellow hover:bg-brand-blue/5"
            >
              View All <FaArrowRight />
            </Button>
          </Link>
        </div>

        {/* Colorful Empty State */}
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-brand-blue/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <FiBox className="w-10 h-10 text-brand-blue" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            No recent shipments found
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-8">
            You haven&apos;t created any shipments yet. Create your first
            shipment to see real-time updates and tracking details here.
          </p>
          <Link href="/app/shipments/new">
            <Button
              variant="outline"
              className="gap-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
            >
              <FaFileCirclePlus className="w-4 h-4" />
              Create New Shipment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
