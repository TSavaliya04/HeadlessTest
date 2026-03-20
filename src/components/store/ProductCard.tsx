import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { type ShopifyProduct } from "@/lib/shopify";
import { ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const firstVariant = node.variants.edges[0]?.node;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!firstVariant) return;
    await addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
    });
    toast.success("Added to cart", {
      description: node.title,
      position: "top-center",
    });
  };

  return (
    <article
      className="group cursor-pointer"
      onClick={() => navigate(`/product/${node.handle}`)}
    >
      <div className="aspect-[3/4] overflow-hidden rounded-sm bg-card mb-4 relative">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || node.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
            <ShoppingCart className="h-12 w-12" />
          </div>
        )}
        <button
          onClick={handleAddToCart}
          disabled={isLoading || !firstVariant?.availableForSale}
          className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm text-foreground p-2.5 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-background active:scale-95 disabled:opacity-50 shadow-md"
          aria-label="Add to cart"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
        </button>
      </div>
      <h3 className="font-display text-lg font-medium leading-tight">{node.title}</h3>
      <p className="text-muted-foreground text-sm mt-1">
        {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
      </p>
    </article>
  );
};
