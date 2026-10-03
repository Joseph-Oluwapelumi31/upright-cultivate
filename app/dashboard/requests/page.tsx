import { requireCustomer } from "@/lib/auth/authorization";
import { getSupplyRequestsForUser } from "@/actions/supply-request-queries";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Search } from "lucide-react";
import { RequestStatus } from "@/lib/generated/prisma/client";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default async function DashboardRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await requireCustomer();
  const params = await searchParams;
  
  const search = typeof params.search === 'string' ? params.search : undefined;
  const status = typeof params.status === 'string' ? params.status as RequestStatus | 'ALL' : 'ALL';
  const sort = typeof params.sort === 'string' ? params.sort as 'newest' | 'oldest' : 'newest';
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;

  const { items: requests, total, totalPages } = await getSupplyRequestsForUser(user.id, {
    search,
    status,
    sort,
    page,
    limit: 10
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-display font-medium text-foreground mb-1">Supply Requests</h1>
          <p className="text-muted-foreground text-body">Manage and track your supply request history.</p>
        </div>
        <div className="shrink-0">
          <Button href="/supply" variant="primary">New Request</Button>
        </div>
      </div>

      <Card className="p-4 flex flex-col md:flex-row gap-4">
        <form className="flex-1 flex flex-col sm:flex-row gap-4" method="GET" action="/dashboard/requests">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
            <Input 
              name="search" 
              placeholder="Search by reference, business, or location..." 
              defaultValue={search}
              className="pl-9"
              aria-label="Search requests"
            />
          </div>
          <div className="flex gap-4 sm:w-auto w-full">
            <Select name="status" defaultValue={status} className="w-full sm:w-40" aria-label="Filter by Status">
              <option value="ALL">All Statuses</option>
              {Object.keys(RequestStatus).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
            <Select name="sort" defaultValue={sort} className="w-full sm:w-36" aria-label="Sort Order">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </Select>
            <Button type="submit" variant="secondary" className="shrink-0">Filter</Button>
          </div>
        </form>
      </Card>

      {requests.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2 text-foreground">No Requests Found</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            {search || status !== 'ALL' 
              ? "Try adjusting your search or filters to find what you're looking for."
              : "You haven't submitted any supply requests yet. Create a supply plan to get started."}
          </p>
          {(search || status !== 'ALL') ? (
            <Button href="/dashboard/requests" variant="secondary">Clear Filters</Button>
          ) : (
            <Button href="/supply" variant="primary">Create Supply Plan</Button>
          )}
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="hidden md:block overflow-hidden rounded-card border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/30 border-b border-border text-xs uppercase tracking-wider">
                <tr>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Reference</th>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Business</th>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Location</th>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Status</th>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Date</th>
                  <th scope="col" className="p-4 text-right"><span className="sr-only">Action</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium text-foreground">{req.referenceNumber}</td>
                    <td className="p-4 text-muted-foreground">{req.business.name}</td>
                    <td className="p-4 text-muted-foreground">{req.location.name}</td>
                    <td className="p-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/dashboard/requests/${req.id}`} className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-4">
            {requests.map(req => (
              <Card key={req.id} className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-foreground">{req.referenceNumber}</div>
                    <div className="text-sm text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</div>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
                <div className="text-sm">
                  <div className="text-foreground">{req.business.name}</div>
                  <div className="text-muted-foreground">{req.location.name}</div>
                </div>
                <div className="pt-2 border-t border-border flex justify-end">
                  <Link href={`/dashboard/requests/${req.id}`} className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1">
                    View Details &rarr;
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4">
              <p className="text-sm text-muted-foreground">
                Showing page {page} of {totalPages} ({total} total requests)
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Button href={`/dashboard/requests?page=${page - 1}${search ? `&search=${search}` : ''}${status !== 'ALL' ? `&status=${status}` : ''}${sort !== 'newest' ? `&sort=${sort}` : ''}`} variant="secondary">
                    Previous
                  </Button>
                )}
                {page < totalPages && (
                  <Button href={`/dashboard/requests?page=${page + 1}${search ? `&search=${search}` : ''}${status !== 'ALL' ? `&status=${status}` : ''}${sort !== 'newest' ? `&sort=${sort}` : ''}`} variant="secondary">
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
