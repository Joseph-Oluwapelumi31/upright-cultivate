import { requireCustomer } from "@/lib/auth/authorization";
import { getSupplyRequestsForUser } from "@/actions/supply-request-queries";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default async function DashboardRequestsPage() {
  const user = await requireCustomer();
  const requests = await getSupplyRequestsForUser(user.id);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-display">Supply Requests</h1>
        <Button href="/supply" variant="primary">New Request</Button>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center shadow-sm">
          <h2 className="text-xl font-semibold mb-2">No Requests Found</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            You haven&apos;t submitted any supply requests yet. Create a supply plan to get started.
          </p>
          <Button href="/supply" variant="primary">Create Supply Plan</Button>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Reference</th>
                <th className="p-4 font-semibold text-gray-600">Business</th>
                <th className="p-4 font-semibold text-gray-600">Location</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{req.referenceNumber}</td>
                  <td className="p-4 text-gray-600">{req.business.name}</td>
                  <td className="p-4 text-gray-600">{req.location.name}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 whitespace-nowrap">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/dashboard/requests/${req.id}`} className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                      View <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
