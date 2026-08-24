import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    categoriesAPI,
    productsAPI,
    type Category,
    type ProductVariation,
    getErrorMessage,
    getFileUrl,
} from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const productSchema = z.object({
    title: z.string().min(1, 'Product title is required'),
    shortDescription: z.string().min(1, 'Short description is required'),
    longDescription: z.string().min(1, 'Large description is required'),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid price'),
    wholesalePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid wholesale price'),
    categoryId: z.string().optional().or(z.literal('')),
    isVariable: z.boolean(),
    isActive: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

type EditableVariation = {
    name: string;
    color: string;
    size: string;
    imageUrl: string;
    imageFile: File | null;
    imagePreview: string;
    price: string;
    wholesalePrice: string;
    isActive: boolean;
};

type EditableVariationField = 'name' | 'color' | 'size' | 'imageUrl' | 'price' | 'wholesalePrice' | 'isActive';

const emptyVariation = (): EditableVariation => ({
    name: '',
    color: '',
    size: '',
    imageUrl: '',
    imageFile: null,
    imagePreview: '',
    price: '',
    wholesalePrice: '',
    isActive: true,
});

const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const normalizeColorForPicker = (colorValue: string): string => {
    if (hexColorRegex.test(colorValue)) {
        if (colorValue.length === 4) {
            return `#${colorValue[1]}${colorValue[1]}${colorValue[2]}${colorValue[2]}${colorValue[3]}${colorValue[3]}`;
        }
        return colorValue;
    }

    return '#000000';
};

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(isEditMode);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [variations, setVariations] = useState<EditableVariation[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: '',
            shortDescription: '',
            longDescription: '',
            price: '0',
            wholesalePrice: '0',
            categoryId: '',
            isVariable: false,
            isActive: true,
        },
    });

    const isVariable = watch('isVariable');
    const isActive = watch('isActive');
    const basePrice = watch('price');
    const baseWholesalePrice = watch('wholesalePrice');

    const categoryOptions = useMemo(() => {
        return categories.filter((category) => Number(category.isActive) === 1 || category.isActive === true);
    }, [categories]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const categoryData = await categoriesAPI.getAllAdmin();
                setCategories(categoryData);

                if (isEditMode && id) {
                    const product = await productsAPI.getById(Number(id));

                    setValue('title', product.title);
                    setValue('shortDescription', product.shortDescription || '');
                    setValue('longDescription', product.longDescription || '');
                    setValue('price', String(product.price ?? 0));
                    setValue('wholesalePrice', String(product.wholesalePrice ?? 0));
                    setValue('categoryId', product.categoryId ? String(product.categoryId) : '');
                    setValue('isVariable', Number(product.isVariable) === 1 || product.isVariable === true);
                    setValue('isActive', Number(product.isActive) === 1 || product.isActive === true);

                    if (product.imageUrl) {
                        setImagePreview(getFileUrl(product.imageUrl));
                    }

                    const existingVariations = (product.variations || []).map((variation: ProductVariation) => ({
                        name: variation.name || '',
                        color: variation.color || '',
                        size: variation.size || '',
                        imageUrl: variation.imageUrl || '',
                        imageFile: null,
                        imagePreview: getFileUrl(variation.imageUrl) || '',
                        price: String(variation.price ?? ''),
                        wholesalePrice: String(variation.wholesalePrice ?? ''),
                        isActive: Number(variation.isActive) === 1 || variation.isActive === true,
                    }));

                    setVariations(existingVariations);
                }
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setIsFetching(false);
            }
        };

        loadInitialData();
    }, [id, isEditMode, setValue]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image must be less than 10MB');
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const addVariation = () => {
        setVariations((prev) => [...prev, emptyVariation()]);
    };

    const removeVariation = (index: number) => {
        setVariations((prev) => prev.filter((_, i) => i !== index));
    };

    const updateVariation = (index: number, key: EditableVariationField, value: string | boolean) => {
        setVariations((prev) =>
            prev.map((variation, i) => (i === index ? { ...variation, [key]: value } : variation))
        );
    };

    const handleVariationImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid variation image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('Variation image must be less than 10MB');
            return;
        }

        const preview = URL.createObjectURL(file);

        setVariations((prev) =>
            prev.map((variation, i) =>
                i === index
                    ? {
                        ...variation,
                        imageFile: file,
                        imagePreview: preview,
                    }
                    : variation
            )
        );
    };

    const onSubmit = async (data: ProductFormData) => {
        try {
            setIsLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('title', data.title);
            const preparedVariations = variations
                .map((variation, index) => ({ variation, index }))
                .filter(({ variation }) => variation.name.trim() !== '');

            const cleanVariations = preparedVariations.map(({ variation, index }) => {
                const imageField = `variationImage_${index}`;

                if (variation.imageFile) {
                    formData.append(imageField, variation.imageFile);
                }

                return {
                    name: variation.name,
                    color: variation.color || null,
                    size: variation.size || null,
                    imageUrl: variation.imageUrl || null,
                    imageField: variation.imageFile ? imageField : null,
                    price: variation.price === '' ? Number(data.price) : Number(variation.price),
                    wholesalePrice:
                        variation.wholesalePrice === ''
                            ? Number(data.wholesalePrice)
                            : Number(variation.wholesalePrice),
                    isActive: variation.isActive,
                };
            });
            formData.append('shortDescription', data.shortDescription);
            formData.append('longDescription', data.longDescription);
            formData.append('price', data.price);
            formData.append('wholesalePrice', data.wholesalePrice);
            formData.append('categoryId', data.categoryId || '');
            formData.append('isVariable', String(data.isVariable));
            formData.append('isActive', String(data.isActive));
            formData.append('variations', JSON.stringify(cleanVariations));

            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (isEditMode && id) {
                await productsAPI.update(Number(id), formData);
                toast.success('Product updated successfully');
            } else {
                await productsAPI.create(formData);
                toast.success('Product created successfully');
            }

            navigate('/admin/products');
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="py-12 text-center text-muted-foreground">Loading product data...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Button variant="ghost" onClick={() => navigate('/admin/products')} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{isEditMode ? 'Edit Product' : 'Add New Product'}</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <Label>Product Image</Label>
                                <div className="flex items-start gap-4">
                                    <div className="w-40 h-40 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Product preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
                                        <p className="text-xs text-muted-foreground">JPEG, PNG, or WebP. Max 10MB.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input id="title" {...register('title')} placeholder="Product title" disabled={isLoading} />
                                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="shortDescription">Small Description *</Label>
                                <Textarea id="shortDescription" {...register('shortDescription')} rows={3} placeholder="Short product summary" disabled={isLoading} />
                                {errors.shortDescription && <p className="text-sm text-destructive">{errors.shortDescription.message}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="longDescription">Large Description *</Label>
                                <Textarea id="longDescription" {...register('longDescription')} rows={6} placeholder="Detailed product description" disabled={isLoading} />
                                {errors.longDescription && <p className="text-sm text-destructive">{errors.longDescription.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Price *</Label>
                                <Input id="price" {...register('price')} placeholder="0.00" disabled={isLoading} />
                                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="wholesalePrice">Wholesale Price *</Label>
                                <Input id="wholesalePrice" {...register('wholesalePrice')} placeholder="0.00" disabled={isLoading} />
                                {errors.wholesalePrice && <p className="text-sm text-destructive">{errors.wholesalePrice.message}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="categoryId">Category</Label>
                                <select
                                    id="categoryId"
                                    {...register('categoryId')}
                                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                                    disabled={isLoading}
                                >
                                    <option value="">Select a category</option>
                                    {categoryOptions.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <Label htmlFor="isVariable" className="text-base">Variable Product</Label>
                                    <p className="text-sm text-muted-foreground">Enable if this product has size/color options</p>
                                </div>
                                <Switch id="isVariable" checked={isVariable} onCheckedChange={(checked) => setValue('isVariable', checked)} disabled={isLoading} />
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <Label htmlFor="isActive" className="text-base">Active Product</Label>
                                    <p className="text-sm text-muted-foreground">Inactive products are hidden from public listing</p>
                                </div>
                                <Switch id="isActive" checked={isActive} onCheckedChange={(checked) => setValue('isActive', checked)} disabled={isLoading} />
                            </div>
                        </div>

                        {isVariable && (
                            <div className="space-y-4 rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Variations (size/color)</h3>
                                    <Button type="button" variant="outline" onClick={addVariation}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Variation
                                    </Button>
                                </div>

                                {variations.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No variations yet. Add options like Red / XL.</p>
                                ) : (
                                    <div className="max-h-[28rem] overflow-y-auto space-y-4 pr-1">
                                        {variations.map((variation, index) => (
                                            <div key={index} className="grid gap-3 md:grid-cols-6 rounded-md border p-3">
                                                <div className="md:col-span-2">
                                                    <Label className="text-xs">Name *</Label>
                                                    <Input
                                                        value={variation.name}
                                                        onChange={(e) => updateVariation(index, 'name', e.target.value)}
                                                        placeholder="Red Large"
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Label className="text-xs">Color</Label>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            type="color"
                                                            value={normalizeColorForPicker(variation.color)}
                                                            onChange={(e) => updateVariation(index, 'color', e.target.value)}
                                                            className="h-10 w-12 p-1"
                                                            disabled={isLoading}
                                                        />
                                                        <Input
                                                            value={variation.color}
                                                            onChange={(e) => updateVariation(index, 'color', e.target.value)}
                                                            placeholder="#ff0000 or red"
                                                            disabled={isLoading}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Size</Label>
                                                    <Input
                                                        value={variation.size}
                                                        onChange={(e) => updateVariation(index, 'size', e.target.value)}
                                                        placeholder="XL"
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Price</Label>
                                                    <Input
                                                        value={variation.price}
                                                        onChange={(e) => updateVariation(index, 'price', e.target.value)}
                                                        placeholder={basePrice || '0.00'}
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Wholesale</Label>
                                                    <Input
                                                        value={variation.wholesalePrice}
                                                        onChange={(e) => updateVariation(index, 'wholesalePrice', e.target.value)}
                                                        placeholder={baseWholesalePrice || '0.00'}
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                                <div className="md:col-span-6">
                                                    <Label className="text-xs">Variation Image</Label>
                                                    <div className="mt-1 flex items-center gap-3">
                                                        <div className="h-14 w-14 border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                                                            {variation.imagePreview ? (
                                                                <img
                                                                    src={variation.imagePreview}
                                                                    alt={`Variation ${variation.name || index + 1}`}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleVariationImageChange(index, e)}
                                                            disabled={isLoading}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="md:col-span-6 flex items-center justify-between">
                                                    <label className="flex items-center gap-2 text-sm">
                                                        <input
                                                            type="checkbox"
                                                            checked={variation.isActive}
                                                            onChange={(e) => updateVariation(index, 'isActive', e.target.checked)}
                                                            disabled={isLoading}
                                                        />
                                                        Active variation
                                                    </label>
                                                    <Button type="button" variant="destructive" size="sm" onClick={() => removeVariation(index)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={() => navigate('/admin/products')} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
