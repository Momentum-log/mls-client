import Link from "next/link";
import Button from "@/components/ui/button";

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
          <Button variant="primary">Create Shipment</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-4xl font-bold text-brand-blue mb-2">0</h3>
          <p className="text-sm font-medium text-gray-600">Active Shipments</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-4xl font-bold text-green-600 mb-2">0</h3>
          <p className="text-sm font-medium text-gray-600">
            Completed Deliveries
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-4xl font-bold text-brand-yellow mb-2">
            0.00 PLN
          </h3>
          <p className="text-sm font-medium text-gray-600">Total Spend</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Recent Shipments</h2>
          <Link
            href="/app/shipments"
            className="text-sm text-brand-blue hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="p-12 text-center text-gray-500">
          <p>No shipment history available.</p>
          <p className="text-sm mt-1">Start by creating a new shipment.</p>
        </div>
      </div>
    </div>
  );
}
