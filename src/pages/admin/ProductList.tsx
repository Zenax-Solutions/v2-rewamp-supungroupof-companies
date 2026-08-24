import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, type Product, getErrorMessage, getFileUrl } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        const filtered = products.filter((product) =>
            `${product.title} ${product.categoryName || ''} ${product.shortDescription || ''}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const data = await productsAPI.getAllAdmin();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await productsAPI.delete(deleteId);
            toast.success('Product deleted successfully');
            loadProducts();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <Package className="h-6 w-6" />
                            Products
                        </CardTitle>
                        <Link to="/admin/products/new">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Product
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {isLoading && (
                        <div className="text-center py-8 text-muted-foreground">Loading products...</div>
                    )}

                    {!isLoading && filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No products found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm ? 'Try adjusting your search terms' : 'Create your first product'}
                            </p>
                        </div>
                    )}

                    {!isLoading && filteredProducts.length > 0 && (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Wholesale</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden flex items-center justify-center">
                                                    {product.imageUrl ? (
                                                        <img
                                                            src={getFileUrl(product.imageUrl) || ''}
                                                            alt={product.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">No image</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{product.title}</div>
                                                <div className="text-xs text-muted-foreground max-w-[250px] truncate">
                                                    {product.shortDescription || '-'}
                                                </div>
                                            </TableCell>
                                            <TableCell>{product.categoryName || '-'}</TableCell>
                                            <TableCell>LKR {Number(product.price || 0).toFixed(2)}</TableCell>
                                            <TableCell>LKR {Number(product.wholesalePrice || 0).toFixed(2)}</TableCell>
                                            <TableCell>
                                                {Number(product.isVariable) === 1 || product.isVariable === true ? (
                                                    <Badge variant="secondary">Variable</Badge>
                                                ) : (
                                                    <Badge variant="outline">Simple</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {Number(product.isActive) === 1 || product.isActive === true ? (
                                                    <Badge>Active</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Inactive</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link to={`/admin/products/${product.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="destructive" size="sm" onClick={() => setDeleteId(product.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone and all product variations will also be removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
