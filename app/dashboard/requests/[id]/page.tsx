import { requireCustomer } from "@/lib/auth/authorization";
import { getSupplyRequestForUser } from "@/actions/supply-request-queries";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function DashboardRequestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireCustomer();
  const { id } = await params;
  const request = await getSupplyRequestForUser(user.id, id);

  if (!request) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/requests" className="text-sm font-medium text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
          <span aria-hidden="true">&larr;</span> Back to Requests
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display">
            Request {request.referenceNumber}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Submitted on {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {request.status}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">Business Details</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="block text-gray-500 text-xs uppercase tracking-wider mb-0.5">Business Name</span>
              <span className="font-medium">{request.business.name}</span>
            </div>
            <div>
              <span className="block text-gray-500 text-xs uppercase tracking-wider mb-0.5">Business Type</span>
              <span>{request.business.type}</span>
            </div>
            {request.business.contactName && (
              <div>
                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-0.5">Contact</span>
                <span>{request.business.contactName} ({request.business.contactPhone})</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">Delivery Location</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="block text-gray-500 text-xs uppercase tracking-wider mb-0.5">Location Name</span>
              <span className="font-medium">{request.location.name}</span>
            </div>
            <div>
              <span className="block text-gray-500 text-xs uppercase tracking-wider mb-0.5">Address</span>
              <span>{request.location.address}, {request.location.city}</span>
            </div>
            <div>
              <span className="block text-gray-500 text-xs uppercase tracking-wider mb-0.5">Delivery Frequency</span>
              <span>{request.frequency}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm mb-8">
        <div className="p-6 border-b bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900">Requested Products</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Product</th>
              <th className="p-4 font-semibold text-gray-600">Quantity</th>
              <th className="p-4 font-semibold text-gray-600">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {request.items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{item.productNameSnapshot}</td>
                <td className="p-4 text-gray-600">{item.quantity.toString()} {item.unit}</td>
                <td className="p-4 text-gray-500">{item.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {request.notes && (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Additional Notes</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{request.notes}</p>
        </div>
      )}
    </div>
  );
}
