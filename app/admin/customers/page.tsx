import { requireAdmin } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Users, Mail, Building2, MapPin, Inbox, Calendar, Search } from "lucide-react";
import Button from "@/components/ui/Button";

export default async function AdminCustomersPage() {
  await requireAdmin();

  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          supplyRequests: true,
        },
      },
      businesses: {
        include: {
          _count: {
            select: { locations: true }
          }
        }
      }
    }
  });

  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground mb-1">
            Customers
          </h1>
          <p className="text-body text-muted-foreground">
            Overview of registered customers and their activity.
          </p>
        </div>
      </div>

      {customers.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center bg-muted/10 border-dashed">
          <Users className="size-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium text-foreground mb-2">No Customers Found</h2>
          <p className="text-muted-foreground">
            There are no customers registered in the system yet.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="py-3 px-4 font-semibold text-sm text-foreground">Customer</th>
                  <th className="py-3 px-4 font-semibold text-sm text-foreground text-center">Businesses</th>
                  <th className="py-3 px-4 font-semibold text-sm text-foreground text-center">Locations</th>
                  <th className="py-3 px-4 font-semibold text-sm text-foreground text-center">Requests</th>
                  <th className="py-3 px-4 font-semibold text-sm text-foreground">Status</th>
                  <th className="py-3 px-4 font-semibold text-sm text-foreground">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((customer) => {
                  const numBusinesses = customer.businesses.length;
                  const numLocations = customer.businesses.reduce((sum, b) => sum + b._count.locations, 0);
                  const numRequests = customer._count.supplyRequests;
                  const isVerified = customer.emailVerified !== null;
                  
                  return (
                    <tr key={customer.id} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{customer.name}</span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Mail className="size-3" />
                            {customer.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 text-sm">
                          <Building2 className="size-4 text-muted-foreground" />
                          {numBusinesses}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 text-sm">
                          <MapPin className="size-4 text-muted-foreground" />
                          {numLocations}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 text-sm">
                          <Inbox className="size-4 text-muted-foreground" />
                          {numRequests}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isVerified ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                          {isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="size-4" />
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
