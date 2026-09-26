import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 pt-24 pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
