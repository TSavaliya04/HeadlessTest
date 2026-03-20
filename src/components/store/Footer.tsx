export const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 mt-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-display text-xl font-semibold tracking-tight">Beeneg</p>
          <p className="text-sm text-muted-foreground">
            Celebrating the artistry of Indian textiles
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Beeneg. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
