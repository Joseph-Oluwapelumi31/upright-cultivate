import { requireCustomer } from "@/lib/auth/authorization";
import { getSupplyRequestsForUser } from "@/actions/supply-request-queries";
import { getBusinessesAction } from "@/actions/business";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default async function DashboardOverviewPage() {
  const user = await requireCustomer();
  const [requestsResult, businessesResult] = await Promise.all([
    getSupplyRequestsForUser(user.id),
    getBusinessesAction()
  ]);

  const requests = requestsResult.slice(0, 5); // show recent 5
  const businesses = businessesResult.success ? businessesResult.businesses : [];
  
  return (
    <div>
      <h1 className="text-3xl font-bold font-display mb-8">Welcome back, {user.name}</h1>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl border p-6 shadow-sm flex flex-col items-start">
          <h2 className="text-xl font-semibold mb-2">Businesses</h2>
          <p className="text-gray-500 mb-6 flex-1">You have {businesses.length} registered business{businesses.length !== 1 ? 'es' : ''}.</p>
          <Button href="/dashboard/businesses" variant="secondary">Manage Businesses</Button>
        </div>
        <div className="bg-white rounded-xl border p-6 shadow-sm flex flex-col items-start">
          <h2 className="text-xl font-semibold mb-2">Supply Requests</h2>
          <p className="text-gray-500 mb-6 flex-1">You have {requestsResult.length} supply request{requestsResult.length !== 1 ? 's' : ''}.</p>
          <Button href="/dashboard/requests" variant="secondary">View All Requests</Button>
        </div>
      </div>

      <h2 className="text-2xl font-bold font-display mb-4">Recent Requests</h2>
      {requests.length === 0 ? (
        <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
          <p>No supply requests yet.</p>
          <Button href="/supply" variant="primary" className="mt-4">Create a Plan</Button>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Reference</th>
                <th className="p-4 font-semibold text-gray-600">Business</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{req.referenceNumber}</td>
                  <td className="p-4 text-gray-600">{req.business.name}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/dashboard/requests/${req.id}`} className="text-primary hover:underline font-medium">
                      View
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
