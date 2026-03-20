import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Loader2, PackageOpen } from "lucide-react";

export const ProductGrid = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['shopify-products'],
    queryFn: async () => {
      const result = await storefrontApiRequest(PRODUCTS_QUERY, { first: 20 });
      return (result?.data?.products?.edges || []) as ShopifyProduct[];
    },
  });

  return (
    <section id="collection" ref={ref} className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <p className="text-sm uppercase tracking-[0.3em] text-gold font-medium mb-4">Our Collection</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            Curated Traditions
          </h2>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-muted-foreground">
            <p>Unable to load products. Please try again later.</p>
          </div>
        )}

        {!isLoading && !error && data && data.length === 0 && (
          <div className="text-center py-20">
            <PackageOpen className="h-16 w-16 text-muted-foreground/40 mx-auto mb-6" />
            <h3 className="font-display text-2xl font-medium mb-2">No products yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              The collection is being prepared. Check back soon for our handcrafted pieces.
            </p>
          </div>
        )}

        {!isLoading && !error && data && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((product, index) => (
              <div
                key={product.node.id}
                className={`transition-all duration-700 ${visible ? 'animate-reveal-up' : 'opacity-0'}`}
                style={{ animationDelay: `${150 + index * 80}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
