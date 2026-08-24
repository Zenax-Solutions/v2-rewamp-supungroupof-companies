import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    getErrorMessage,
    getFileUrl,
    productsAPI,
    type Product,
    type ProductVariation,
} from '@/services/api';
import {
    ArrowLeft,
    CircleAlert,
    Layers,
    Store,
} from 'lucide-react';
import Seo, { SITE_URL, DEFAULT_IMAGE } from '@/components/Seo';

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(value || 0));

const cssColorNameRegex = /^[a-zA-Z]{3,20}$/;
const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const cssFunctionColorRegex = /^(rgb|rgba|hsl|hsla)\(([^)]+)\)$/;

function getSafeColorValue(color?: string | null): string | null {
    if (!color) return null;

    const normalized = color.trim();
    if (!normalized) return null;

    if (hexColorRegex.test(normalized)) return normalized;
    if (cssFunctionColorRegex.test(normalized)) return normalized;
    if (cssColorNameRegex.test(normalized)) return normalized.toLowerCase();

    return null;
}

function getVariationTitle(variation: ProductVariation): string {
    const parts = [variation.name, variation.color, variation.size].filter(Boolean);
    return parts.join(' / ') || 'Variation';
}

function getVariationColorOptions(variations: ProductVariation[]): Array<{ label: string; cssValue: string | null }> {
    const uniqueColors = new Map<string, { label: string; cssValue: string | null }>();

    for (const variation of variations) {
        const color = variation.color?.trim();
        if (!color) continue;

        const key = color.toLowerCase();
        if (!uniqueColors.has(key)) {
            uniqueColors.set(key, {
                label: color,
                cssValue: getSafeColorValue(color),
            });
        }
    }

    return Array.from(uniqueColors.values());
}

function getVariationSizeOptions(variations: ProductVariation[]): string[] {
    const uniqueSizes = new Map<string, string>();

    for (const variation of variations) {
        const size = variation.size?.trim();
        if (!size) continue;

        const key = size.toLowerCase();
        if (!uniqueSizes.has(key)) {
            uniqueSizes.set(key, size);
        }
    }

    return Array.from(uniqueSizes.values());
}

function findVariationIndex(
    variations: ProductVariation[],
    options: { color?: string | null; size?: string | null }
): number {
    const normalizedColor = options.color?.trim().toLowerCase() || '';
    const normalizedSize = options.size?.trim().toLowerCase() || '';

    const exactMatchIndex = variations.findIndex((variation) => {
        const variationColor = variation.color?.trim().toLowerCase() || '';
        const variationSize = variation.size?.trim().toLowerCase() || '';
        const colorMatch = normalizedColor ? variationColor === normalizedColor : true;
        const sizeMatch = normalizedSize ? variationSize === normalizedSize : true;
        return colorMatch && sizeMatch;
    });

    if (exactMatchIndex !== -1) {
        return exactMatchIndex;
    }

    if (normalizedColor) {
        const colorOnlyIndex = variations.findIndex(
            (variation) => (variation.color?.trim().toLowerCase() || '') === normalizedColor
        );
        if (colorOnlyIndex !== -1) return colorOnlyIndex;
    }

    if (normalizedSize) {
        const sizeOnlyIndex = variations.findIndex(
            (variation) => (variation.size?.trim().toLowerCase() || '') === normalizedSize
        );
        if (sizeOnlyIndex !== -1) return sizeOnlyIndex;
    }

    return 0;
}

export default function ProductDetail() {
    const { id } = useParams();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const loadData = async () => {
            if (!id) {
                setErrorMessage('Product ID is missing.');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setErrorMessage('');

            try {
                const productData = await productsAPI.getById(Number(id));
                setProduct(productData);

                if (productData.categoryId) {
                    const categoryProducts = await productsAPI.getAll(Number(productData.categoryId));
                    const related = categoryProducts
                        .filter((item) => Number(item.id) !== Number(productData.id))
                        .slice(0, 3);
                    setRelatedProducts(related);
                } else {
                    setRelatedProducts([]);
                }
            } catch (error) {
                setErrorMessage(getErrorMessage(error));
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [id]);

    const isVariable = Number(product?.isVariable) === 1 || product?.isVariable === true;

    const activeVariation = useMemo(() => {
        if (!product?.variations || product.variations.length === 0) {
            return null;
        }

        const index = Math.max(0, Math.min(selectedVariationIndex, product.variations.length - 1));
        return product.variations[index] || null;
    }, [product, selectedVariationIndex]);

    const variationColorOptions = useMemo(() => {
        if (!product?.variations || product.variations.length === 0) {
            return [];
        }

        return getVariationColorOptions(product.variations);
    }, [product]);

    const variationSizeOptions = useMemo(() => {
        if (!product?.variations || product.variations.length === 0) {
            return [];
        }

        return getVariationSizeOptions(product.variations);
    }, [product]);

    const selectedColor = activeVariation?.color?.trim().toLowerCase() || '';
    const selectedSize = activeVariation?.size?.trim().toLowerCase() || '';

    const displayPrice = activeVariation ? Number(activeVariation.price || 0) : Number(product?.price || 0);
    const displayWholesalePrice = activeVariation
        ? Number(activeVariation.wholesalePrice || 0)
        : Number(product?.wholesalePrice || 0);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="h-10 w-40 rounded bg-muted animate-pulse mb-6" />
                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="h-[420px] rounded-2xl bg-muted animate-pulse" />
                    <div className="space-y-4">
                        <div className="h-12 w-3/4 rounded bg-muted animate-pulse" />
                        <div className="h-6 w-1/2 rounded bg-muted animate-pulse" />
                        <div className="h-28 rounded bg-muted animate-pulse" />
                        <div className="h-28 rounded bg-muted animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (errorMessage || !product) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Card className="max-w-xl mx-auto rounded-2xl border-destructive/30 bg-destructive/5">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-3 text-destructive">
                            <CircleAlert className="h-5 w-5 mt-0.5" />
                            <div>
                                <h1 className="text-xl mb-1">Unable to load product</h1>
                                <p className="text-sm">{errorMessage || 'Product not found.'}</p>
                                <Link to="/shop" className="inline-block mt-4">
                                    <Button variant="outline">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Shop
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const imageUrl = getFileUrl(product.imageUrl);

    const productJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.shortDescription || product.longDescription || product.title,
        image: imageUrl || DEFAULT_IMAGE,
        url: `${SITE_URL}/shop/${product.id}`,
        category: product.categoryName || 'Products',
        brand: {
            "@type": "Brand",
            name: 'Supun Group of Companies',
        },
        offers: {
            "@type": "Offer",
            price: Number(product.price || 0),
            priceCurrency: 'LKR',
            availability: 'https://schema.org/InStock',
        },
    };

    return (
        <div className="relative overflow-hidden bg-slate-50">
            <Seo
                title={`${product.title} | Supun Group of Companies`}
                description={product.shortDescription || product.longDescription || `Buy ${product.title} from Supun Group of Companies.`}
                keywords={`${product.title}, ${product.categoryName || 'product'}, buy Sri Lanka, wholesale, Supun Group shop`}
                path={`/shop/${product.id}`}
                image={imageUrl || DEFAULT_IMAGE}
                type="product"
                jsonLd={productJsonLd}
            />
            <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_10%_20%,rgba(30,64,175,0.10),transparent_35%),radial-gradient(circle_at_90%_0%,rgba(217,119,6,0.14),transparent_30%)]" />

            <div className="container mx-auto px-4 py-10 md:py-14 relative z-10">
                <Link to="/shop" className="inline-flex items-center text-sm text-primary hover:text-primary/80 mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Shop
                </Link>

                <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr]">
                    <div className="rounded-2xl border border-primary/10 bg-white shadow-sm overflow-hidden">
                        <div className="h-[320px] md:h-[460px] bg-slate-100">
                            {imageUrl ? (
                                <img src={imageUrl} alt={product.title} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                    No product image
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="flex flex-wrap gap-2">
                            <Badge className="bg-primary/90">{product.categoryName || 'Uncategorized'}</Badge>
                            {isVariable && <Badge variant="secondary">Variable Product</Badge>}
                            {activeVariation && (
                                <Badge variant="outline" className="bg-white">
                                    <span className="inline-flex items-center gap-2">
                                        {getSafeColorValue(activeVariation.color) && (
                                            <span
                                                className="h-3.5 w-3.5 rounded-full border border-black/15 shadow-sm"
                                                style={{ backgroundColor: getSafeColorValue(activeVariation.color) || 'transparent' }}
                                                title={activeVariation.color || undefined}
                                                aria-label={activeVariation.color ? `Color ${activeVariation.color}` : 'Color'}
                                            />
                                        )}
                                        {getVariationTitle(activeVariation)}
                                    </span>
                                </Badge>
                            )}
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-4xl text-primary leading-tight">{product.title}</h1>
                            <p className="text-muted-foreground mt-2">
                                {product.shortDescription || 'Product information and pricing details below.'}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-primary/10 bg-white p-5">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">Retail Price</p>
                            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(displayPrice)}</p>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-4">Wholesale Price</p>
                            <p className="text-xl font-semibold text-amber-600 mt-1">{formatCurrency(displayWholesalePrice)}</p>
                        </div>

                        {isVariable && product.variations && product.variations.length > 0 && (
                            <div className="rounded-2xl border border-primary/10 bg-white p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Layers className="h-4 w-4 text-primary" />
                                    <h2 className="text-base text-primary">Choose Variation</h2>
                                </div>

                                <div className="space-y-4">
                                    {variationColorOptions.length > 0 && (
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Color</p>
                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                {variationColorOptions.map((colorOption) => {
                                                    const isSelected = selectedColor === colorOption.label.trim().toLowerCase();

                                                    return (
                                                        <button
                                                            key={colorOption.label}
                                                            type="button"
                                                            onClick={() => {
                                                                const nextIndex = findVariationIndex(product.variations || [], {
                                                                    color: colorOption.label,
                                                                    size: activeVariation?.size || null,
                                                                });
                                                                setSelectedVariationIndex(nextIndex);
                                                            }}
                                                            className={`inline-flex h-7 w-7 items-center justify-center rounded-full border bg-white transition ${isSelected
                                                                ? 'border-primary ring-2 ring-primary/20'
                                                                : 'border-slate-300 hover:border-primary/40'
                                                                }`}
                                                            title={colorOption.label}
                                                            aria-label={`Color ${colorOption.label}`}
                                                        >
                                                            <span
                                                                className="h-4 w-4 rounded-full border border-black/10"
                                                                style={{ backgroundColor: colorOption.cssValue || '#d4d4d8' }}
                                                            />
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {variationSizeOptions.length > 0 && (
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Size</p>
                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                {variationSizeOptions.map((sizeOption) => {
                                                    const isSelected = selectedSize === sizeOption.trim().toLowerCase();

                                                    return (
                                                        <Button
                                                            key={sizeOption}
                                                            type="button"
                                                            variant={isSelected ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={() => {
                                                                const nextIndex = findVariationIndex(product.variations || [], {
                                                                    color: activeVariation?.color || null,
                                                                    size: sizeOption,
                                                                });
                                                                setSelectedVariationIndex(nextIndex);
                                                            }}
                                                        >
                                                            {sizeOption}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {activeVariation && (
                                        <p className="text-sm text-muted-foreground">
                                            Selected: <span className="font-medium text-primary">{getVariationTitle(activeVariation)}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="rounded-2xl border border-primary/10 bg-white p-5">
                            <h2 className="text-lg text-primary mb-2">Product Details</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {product.longDescription || 'No detailed description available.'}
                            </p>
                        </div>
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <section className="mt-12">
                        <div className="flex items-center gap-2 mb-4">
                            <Store className="h-5 w-5 text-primary" />
                            <h2 className="text-2xl text-primary">Related Products</h2>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {relatedProducts.map((item) => {
                                const relatedImage = getFileUrl(item.imageUrl);
                                return (
                                    <Link key={item.id} to={`/shop/${item.id}`} className="group">
                                        <Card className="h-full overflow-hidden rounded-2xl border border-primary/10 bg-white hover:shadow-elegant transition-smooth">
                                            <div className="h-44 bg-slate-100 overflow-hidden">
                                                {relatedImage ? (
                                                    <img
                                                        src={relatedImage}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover group-hover:scale-105 transition-smooth"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                                                        No image
                                                    </div>
                                                )}
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="text-lg text-primary line-clamp-1">{item.title}</h3>
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                    {item.shortDescription || item.longDescription || 'No description'}
                                                </p>
                                                <p className="mt-3 text-base font-semibold text-primary">
                                                    {formatCurrency(Number(item.price || 0))}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
