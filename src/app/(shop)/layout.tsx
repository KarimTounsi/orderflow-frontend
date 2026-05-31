
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
      <Footer />
      <Toaster richColors position="bottom-right" />
    </>
  );
}
