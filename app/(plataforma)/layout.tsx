import { SiteHeader } from "@/components/site/site-header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 px-3 md:px-6 lg:px-12 py-4 md:py-6 sm:py-12">
        {children}
      </main>
    </div>
  );
}