import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { categoriesAPI, getErrorMessage } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const categorySchema = z.object({
    name: z.string().min(1, 'Category name is required'),
    slug: z
        .string()
        .regex(/^[a-z0-9-]*$/, 'Slug must contain lowercase letters, numbers, and hyphens only')
        .optional()
        .or(z.literal('')),
    description: z.string().optional().or(z.literal('')),
    isActive: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoryForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            slug: '',
            description: '',
            isActive: true,
        },
    });

    const isActive = watch('isActive');

    useEffect(() => {
        const loadCategory = async () => {
            if (!id) return;

            try {
                const category = await categoriesAPI.getById(Number(id));
                setValue('name', category.name);
                setValue('slug', category.slug || '');
                setValue('description', category.description || '');
                setValue('isActive', Number(category.isActive) === 1 || category.isActive === true);
            } catch (err) {
                setError(getErrorMessage(err));
            }
        };

        loadCategory();
    }, [id, setValue]);

    const onSubmit = async (data: CategoryFormData) => {
        try {
            setIsLoading(true);
            setError(null);

            const payload = {
                name: data.name,
                slug: data.slug || undefined,
                description: data.description || '',
                isActive: data.isActive,
            };

            if (id) {
                await categoriesAPI.update(Number(id), payload);
                toast.success('Category updated successfully');
            } else {
                await categoriesAPI.create(payload);
                toast.success('Category created successfully');
            }

            navigate('/admin/categories');
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <Button variant="ghost" onClick={() => navigate('/admin/categories')} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{id ? 'Edit Category' : 'Add New Category'}</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Category Name *</Label>
                            <Input id="name" {...register('name')} placeholder="Example: Electronics" disabled={isLoading} />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (optional)</Label>
                            <Input id="slug" {...register('slug')} placeholder="example-electronics" disabled={isLoading} />
                            {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" {...register('description')} placeholder="Short category description" rows={4} disabled={isLoading} />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label htmlFor="isActive" className="text-base">Active Category</Label>
                                <p className="text-sm text-muted-foreground">Inactive categories can be hidden from public product listings</p>
                            </div>
                            <Switch id="isActive" checked={isActive} onCheckedChange={(checked) => setValue('isActive', checked)} disabled={isLoading} />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => navigate('/admin/categories')} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving...' : id ? 'Update Category' : 'Create Category'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
