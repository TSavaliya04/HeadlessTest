import { CartDrawer } from "./CartDrawer";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Beeneg
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
            Home
          </a>
          <a href="/#collection" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
            Collection
          </a>
        </div>
        <CartDrawer />
      </div>
    </nav>
  );
};
