import { ShoppingBag, ShieldCheck, Truck, CreditCard } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[55%_45%]">
      {/* Lado Esquerdo: Branding e Diferenciais */}
      <div className="relative hidden flex-col items-center justify-center bg-primary p-12 text-white lg:flex">
        {/* Grid decorativo de fundo inspirado no KYDORA */}
        <div className="pointer-events-none absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="mb-12 flex items-center gap-3">
            <div className="rounded-xl bg-white p-2.5 shadow-xl shadow-black/10">
              <ShoppingBag className="h-9 w-9 text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">EcoStore</h1>
          </div>

          <h2 className="mb-8 text-3xl font-semibold leading-tight">
            Sua jornada para uma compra sustentável começa aqui.
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md transition-all hover:bg-white/15">
              <Truck className="h-10 w-10 shrink-0 text-primary-foreground/80" />
              <div>
                <h3 className="text-lg font-bold">Entrega Ágil</h3>
                <p className="text-sm text-primary-foreground/70">Receba seus produtos com rapidez e rastreamento em tempo real.</p>
              </div>
            </div>

            <div className="flex gap-4 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md transition-all hover:bg-white/15">
              <ShieldCheck className="h-10 w-10 shrink-0 text-primary-foreground/80" />
              <div>
                <h3 className="text-lg font-bold">Compra Segura</h3>
                <p className="text-sm text-primary-foreground/70">Dados protegidos por criptografia de ponta e camadas extras de segurança.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background flex flex-col justify-center px-6 sm:px-12 lg:px-16">
        {children}
      </div>
    </div>
  )
}