import { requireCustomer } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MapPin, Store } from "lucide-react";
import Link from "next/link";

export default async function DashboardLocationsPage() {
  const user = await requireCustomer();
  
  const locations = await prisma.location.findMany({
    where: { business: { userId: user.id } },
    include: { business: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-display font-medium text-foreground mb-1">Locations</h1>
          <p className="text-muted-foreground text-body">Manage your delivery locations across all businesses.</p>
        </div>
        <div className="shrink-0 flex gap-2">
          <Button href="/dashboard/businesses" variant="secondary">
            Manage Businesses
          </Button>
          <Button href="/dashboard/locations/new" variant="primary">
            Add Location
          </Button>
        </div>
      </div>

      {locations.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center">
          <MapPin className="size-12 text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">No Locations Found</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            You don&apos;t have any locations set up yet.
          </p>
          <Button href="/dashboard/locations/new" variant="primary">Create Location</Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Card key={location.id} className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 text-primary rounded-md">
                    <MapPin className="size-5" />
                  </div>
                  <h3 className="font-semibold text-lg">{location.name}</h3>
                </div>
                {!location.isActive && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                    Inactive
                  </span>
                )}
              </div>
              
              <div className="space-y-3 flex-grow mb-6 text-sm">
                <div>
                  <span className="text-muted-foreground flex items-center gap-2 mb-1">
                    <Store className="size-4" /> Business
                  </span>
                  <Link href={`/dashboard/businesses/${location.businessId}/edit`} className="font-medium text-foreground hover:underline">
                    {location.business.name}
                  </Link>
                </div>
                
                <div>
                  <span className="text-muted-foreground block mb-1">Address</span>
                  <span className="text-foreground">
                    {location.address}<br/>
                    {location.city}{location.state ? `, ${location.state}` : ''}<br/>
                    {location.country}
                  </span>
                </div>
                
                {(location.contactName || location.contactPhone) && (
                  <div>
                    <span className="text-muted-foreground block mb-1">Contact</span>
                    <span className="text-foreground">
                      {location.contactName && <span>{location.contactName}<br/></span>}
                      {location.contactPhone}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-border mt-auto">
                <Link 
                  href={`/dashboard/businesses/${location.businessId}/edit`} 
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Edit in Business &rarr;
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
