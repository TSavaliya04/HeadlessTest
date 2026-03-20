import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Navbar } from "@/components/store/Navbar";
import { Footer } from "@/components/store/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const isCartLoading = useCartStore(state => state.isLoading);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const { data: product, isLoading } = useQuery({
    queryKey: ['shopify-product', handle],
    queryFn: async () => {
      const result = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
      return result?.data?.productByHandle;
    },
    enabled: !!handle,
  });

  const getSelectedVariant = () => {
    if (!product) return null;
    if (Object.keys(selectedOptions).length === 0) return product.variants.edges[0]?.node;
    return product.variants.edges.find((v: { node: { selectedOptions: Array<{ name: string; value: string }> } }) =>
      v.node.selectedOptions.every((opt: { name: string; value: string }) => selectedOptions[opt.name] === opt.value)
    )?.node || product.variants.edges[0]?.node;
  };

  const selectedVariant = getSelectedVariant();

  const handleAddToCart = async () => {
    if (!selectedVariant || !product) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Added to cart", { description: product.title, position: "top-center" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-16">
          <h2 className="font-display text-2xl mb-4">Product not found</h2>
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to collection
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images.edges;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Images */}
            <div className="space-y-4 animate-reveal-left">
              <div className="aspect-[3/4] rounded-sm overflow-hidden bg-card">
                {images[selectedImageIndex]?.node ? (
                  <img
                    src={images[selectedImageIndex].node.url}
                    alt={images[selectedImageIndex].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                    <ShoppingCart className="h-16 w-16" />
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img: { node: { url: string; altText: string | null } }, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-20 rounded-sm overflow-hidden flex-shrink-0 border-2 transition-colors ${
                        idx === selectedImageIndex ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={img.node.url} alt={img.node.altText || ''} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="animate-reveal-up">
              <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight mb-4">{product.title}</h1>
              
              {selectedVariant && (
                <p className="text-2xl font-medium text-foreground mb-6">
                  {selectedVariant.price.currencyCode} {parseFloat(selectedVariant.price.amount).toFixed(2)}
                </p>
              )}

              {product.description && (
                <p className="text-muted-foreground leading-relaxed mb-8 text-pretty">{product.description}</p>
              )}

              {/* Options */}
              {product.options?.filter((opt: { name: string; values: string[] }) => !(opt.values.length === 1 && opt.values[0] === 'Default Title')).map((option: { name: string; values: string[] }) => (
                <div key={option.name} className="mb-6">
                  <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3 block">{option.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value: string) => (
                      <button
                        key={value}
                        onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                        className={`px-4 py-2 rounded-sm text-sm border transition-colors active:scale-95 ${
                          selectedOptions[option.name] === value
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-foreground/30'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <Button
                onClick={handleAddToCart}
                disabled={isCartLoading || !selectedVariant?.availableForSale}
                className="w-full mt-4"
                size="lg"
              >
                {isCartLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : !selectedVariant?.availableForSale ? (
                  "Sold Out"
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
