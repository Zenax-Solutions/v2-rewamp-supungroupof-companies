import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    categoriesAPI,
    getFileUrl,
    getErrorMessage,
    productsAPI,
    type Category,
    type Product,
} from '@/services/api';
import {
    Search,
    ShoppingBag,
    SlidersHorizontal,
    ListFilter,
    Sparkles,
} from 'lucide-react';
import Seo from '@/components/Seo';

const PRODUCTS_PER_PAGE = 9;

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

function getProductPriceLabel(product: Product): string {
    if (!product.variations || product.variations.length === 0) {
        return formatCurrency(Number(product.price || 0));
    }

    const prices = product.variations.map((variation) => Number(variation.price || 0));
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    if (min === max) {
        return formatCurrency(min);
    }

    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
}

function getProductColorOptions(product: Product): Array<{ label: string; cssValue: string | null }> {
    if (!product.variations || product.variations.length === 0) {
        return [];
    }

    const uniqueColors = new Map<string, { label: string; cssValue: string | null }>();

    for (const variation of product.variations) {
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

function getProductSizeOptions(product: Product): string[] {
    if (!product.variations || product.variations.length === 0) {
        return [];
    }

    const uniqueSizes = new Map<string, string>();

    for (const variation of product.variations) {
        const size = variation.size?.trim();
        if (!size) continue;

        const key = size.toLowerCase();
        if (!uniqueSizes.has(key)) {
            uniqueSizes.set(key, size);
        }
    }

    return Array.from(uniqueSizes.values());
}

function getPaginationItems(totalPages: number, currentPage: number): Array<number | 'ellipsis-left' | 'ellipsis-right'> {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const items: Array<number | 'ellipsis-left' | 'ellipsis-right'> = [1];

    if (currentPage > 3) {
        items.push('ellipsis-left');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let page = start; page <= end; page += 1) {
        items.push(page);
    }

    if (currentPage < totalPages - 2) {
        items.push('ellipsis-right');
    }

    items.push(totalPages);
    return items;
}

export default function Shop() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const loadShopData = async () => {
            setIsLoading(true);
            setErrorMessage('');

            try {
                const [categoriesData, productsData] = await Promise.all([
                    categoriesAPI.getAll(),
                    productsAPI.getAll(),
                ]);

                setCategories(categoriesData);
                setProducts(productsData);
            } catch (error) {
                setErrorMessage(getErrorMessage(error));
            } finally {
                setIsLoading(false);
            }
        };

        loadShopData();
    }, []);

    const filteredProducts = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        return products.filter((product) => {
            const categoryMatch =
                selectedCategory === 'all' || Number(product.categoryId) === Number(selectedCategory);

            const searchText = [
                product.title,
                product.shortDescription,
                product.longDescription,
                product.categoryName,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            const searchMatch = normalizedQuery === '' || searchText.includes(normalizedQuery);

            return categoryMatch && searchMatch;
        });
    }, [products, selectedCategory, searchQuery]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));

    useEffect(() => {
        setCurrentPage((prevPage) => Math.min(prevPage, totalPages));
    }, [totalPages]);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
        return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    const paginationItems = useMemo(
        () => getPaginationItems(totalPages, currentPage),
        [totalPages, currentPage]
    );

    const activeFiltersCount = (searchQuery.trim() ? 1 : 0) + (selectedCategory === 'all' ? 0 : 1);

    return (
        <div className="relative overflow-hidden bg-slate-50">
            <Seo
                title="Shop | Supun Group of Companies"
                description="Browse quality products from Supun Group of Companies. Explore cookware, helmets, and more with retail and wholesale pricing available."
                keywords="Supun Group shop, Sri Lanka products, cookware, helmets, wholesale prices, retail prices"
            />
            <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(30,64,175,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(217,119,6,0.14),transparent_30%)]" />
            <div className="container mx-auto px-4 py-10 md:py-14 relative z-10">
                <section className="mb-8 rounded-2xl bg-white/90 backdrop-blur-sm border border-primary/10 shadow-sm p-6 md:p-7">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
                                <Sparkles className="h-3.5 w-3.5" />
                                Curated Product Collection
                            </div>
                            <h1 className="text-3xl md:text-4xl text-primary mb-2">Shop</h1>
                            <p className="text-muted-foreground max-w-2xl">
                                Explore products with Shopify-style filtering. Use the left panel to search and refine by category.
                            </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Showing <span className="font-semibold text-primary">{filteredProducts.length}</span> of{' '}
                            <span className="font-semibold text-primary">{products.length}</span> products
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr]">
                    <aside className="rounded-2xl border border-primary/10 bg-white/95 p-4 md:p-5 shadow-sm h-fit lg:sticky lg:top-24">
                        <div className="flex items-center gap-2 text-primary mb-4">
                            <ListFilter className="h-4 w-4" />
                            <h2 className="text-sm font-semibold uppercase tracking-wide">Filters</h2>
                            {activeFiltersCount > 0 && (
                                <Badge variant="secondary" className="ml-auto">
                                    {activeFiltersCount} active
                                </Badge>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="shop-search" className="text-sm font-medium text-primary">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="shop-search"
                                        value={searchQuery}
                                        onChange={(event) => setSearchQuery(event.target.value)}
                                        placeholder="Search products..."
                                        className="pl-10 h-10 bg-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium text-primary">Category</p>
                                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                                    <Button
                                        type="button"
                                        variant={selectedCategory === 'all' ? 'default' : 'outline'}
                                        className="w-full justify-start"
                                        onClick={() => setSelectedCategory('all')}
                                    >
                                        All Categories
                                    </Button>
                                    {categories.map((category) => (
                                        <Button
                                            type="button"
                                            key={category.id}
                                            variant={selectedCategory === category.id ? 'default' : 'outline'}
                                            className="w-full justify-start"
                                            onClick={() => setSelectedCategory(category.id)}
                                        >
                                            {category.name}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                }}
                            >
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                Reset Filters
                            </Button>
                        </div>
                    </aside>

                    <section>
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-lg text-primary">Products</h2>
                            <p className="text-sm text-muted-foreground">
                                Page <span className="font-semibold text-primary">{currentPage}</span> of{' '}
                                <span className="font-semibold text-primary">{totalPages}</span>
                            </p>
                        </div>

                        {isLoading && (
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => (
                                    <div key={index} className="h-80 rounded-2xl bg-white border border-border animate-pulse" />
                                ))}
                            </div>
                        )}

                        {!isLoading && errorMessage && (
                            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive text-sm">
                                {errorMessage}
                            </div>
                        )}

                        {!isLoading && !errorMessage && filteredProducts.length === 0 && (
                            <Card className="rounded-2xl">
                                <CardContent className="py-14 text-center">
                                    <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <h2 className="text-xl text-primary mb-2">No products found</h2>
                                    <p className="text-muted-foreground">
                                        Try changing search text or choose a different category filter.
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {!isLoading && !errorMessage && filteredProducts.length > 0 && (
                            <>
                                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                    {paginatedProducts.map((product) => {
                                        const imageUrl = getFileUrl(product.imageUrl);
                                        const variableProduct = Number(product.isVariable) === 1 || product.isVariable === true;
                                        const colorOptions = getProductColorOptions(product);
                                        const sizeOptions = getProductSizeOptions(product);

                                        return (
                                            <Card
                                                key={product.id}
                                                className="overflow-hidden rounded-2xl border border-primary/10 bg-white/95 shadow-sm hover:shadow-elegant hover:-translate-y-1 transition-smooth"
                                            >
                                                <Link to={`/shop/${product.id}`}>
                                                    <div className="relative h-52 bg-slate-100">
                                                        {imageUrl ? (
                                                            <img
                                                                src={imageUrl}
                                                                alt={product.title}
                                                                className="h-full w-full object-cover"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                                                                No image
                                                            </div>
                                                        )}
                                                        <div className="absolute top-3 left-3 flex items-center gap-2">
                                                            <Badge className="bg-primary/90">{product.categoryName || 'Uncategorized'}</Badge>
                                                            {variableProduct && <Badge variant="secondary">Variable</Badge>}
                                                        </div>
                                                    </div>
                                                </Link>

                                                <CardContent className="p-5">
                                                    <Link to={`/shop/${product.id}`}>
                                                        <h3 className="text-xl text-primary line-clamp-1 hover:underline">{product.title}</h3>
                                                    </Link>
                                                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 min-h-[2.6rem]">
                                                        {product.shortDescription || product.longDescription || 'No description available'}
                                                    </p>

                                                    <div className="mt-4 flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Retail Price</p>
                                                            <p className="text-lg font-bold text-primary">{getProductPriceLabel(product)}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-muted-foreground">Wholesale</p>
                                                            <p className="text-base font-semibold text-amber-600">
                                                                {formatCurrency(Number(product.wholesalePrice || 0))}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {variableProduct && (colorOptions.length > 0 || sizeOptions.length > 0) && (
                                                        <div className="mt-4 space-y-3">
                                                            {colorOptions.length > 0 && (
                                                                <div>
                                                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Color</p>
                                                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                                                        {colorOptions.slice(0, 5).map((colorOption) => (
                                                                            <span
                                                                                key={colorOption.label}
                                                                                className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white"
                                                                                title={colorOption.label}
                                                                                aria-label={`Color ${colorOption.label}`}
                                                                            >
                                                                                <span
                                                                                    className="h-4 w-4 rounded-full border border-black/10"
                                                                                    style={{ backgroundColor: colorOption.cssValue || '#d4d4d8' }}
                                                                                />
                                                                            </span>
                                                                        ))}
                                                                        {colorOptions.length > 5 && (
                                                                            <Badge variant="outline" className="text-xs">
                                                                                +{colorOptions.length - 5} more
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {sizeOptions.length > 0 && (
                                                                <div>
                                                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Size</p>
                                                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                                                        {sizeOptions.slice(0, 5).map((size) => (
                                                                            <Badge key={size} variant="outline" className="text-xs px-2.5 py-1">
                                                                                {size}
                                                                            </Badge>
                                                                        ))}
                                                                        {sizeOptions.length > 5 && (
                                                                            <Badge variant="outline" className="text-xs">
                                                                                +{sizeOptions.length - 5} more
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="mt-4 pt-4 border-t border-primary/10 flex justify-end">
                                                        <Link to={`/shop/${product.id}`}>
                                                            <Button size="sm" variant="outline">View Details</Button>
                                                        </Link>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-8">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        href="#"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            if (currentPage > 1) {
                                                                setCurrentPage((prevPage) => prevPage - 1);
                                                            }
                                                        }}
                                                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                                    />
                                                </PaginationItem>

                                                {paginationItems.map((item) => {
                                                    if (item === 'ellipsis-left' || item === 'ellipsis-right') {
                                                        return (
                                                            <PaginationItem key={item}>
                                                                <PaginationEllipsis />
                                                            </PaginationItem>
                                                        );
                                                    }

                                                    return (
                                                        <PaginationItem key={item}>
                                                            <PaginationLink
                                                                href="#"
                                                                isActive={item === currentPage}
                                                                onClick={(event) => {
                                                                    event.preventDefault();
                                                                    setCurrentPage(item);
                                                                }}
                                                            >
                                                                {item}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    );
                                                })}

                                                <PaginationItem>
                                                    <PaginationNext
                                                        href="#"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            if (currentPage < totalPages) {
                                                                setCurrentPage((prevPage) => prevPage + 1);
                                                            }
                                                        }}
                                                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
