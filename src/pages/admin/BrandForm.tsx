import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { brandsAPI, type Brand, getErrorMessage, getFileUrl } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Upload, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const brandSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  displayOrder: z.string().regex(/^\d+$/, 'Must be a number').optional().or(z.literal('')),
  isActive: z.boolean(),
});

type BrandForm = z.infer<typeof brandSchema>;

export default function BrandForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [existingBrand, setExistingBrand] = useState<Brand | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BrandForm>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: '',
      website: '',
      displayOrder: '0',
      isActive: true,
    },
  });

  const isActive = watch('isActive');

  useEffect(() => {
    const loadBrand = async () => {
      try {
        const brand = await brandsAPI.getById(Number(id));
        setExistingBrand(brand);
        setValue('name', brand.name);
        setValue('website', brand.website || '');
        setValue('displayOrder', String(brand.displayOrder));
        setValue('isActive', brand.isActive === 1);
        
        if (brand.logoUrl) {
          const imageUrl = getFileUrl(brand.logoUrl);
          setLogoPreview(imageUrl);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      }
    };

    if (id) {
      loadBrand();
    }
  }, [id, setValue]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: BrandForm) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!id && !logoFile) {
        setError('Logo image is required for new brands');
        return;
      }

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('website', data.website || '');
      formData.append('displayOrder', data.displayOrder || '0');
      formData.append('isActive', String(data.isActive));

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      if (id) {
        await brandsAPI.update(Number(id), formData);
        toast.success('Brand updated successfully');
      } else {
        await brandsAPI.create(formData);
        toast.success('Brand created successfully');
      }

      navigate('/admin/brands');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/admin/brands')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Brands
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {id ? 'Edit Brand' : 'Add New Brand'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Brand Logo *</Label>
              <div className="flex items-start gap-4">
                {/* Logo Preview */}
                <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="max-w-full max-h-full object-contain p-2"
                    />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>

                {/* Upload Button */}
                <div className="flex-1 space-y-2">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: PNG or SVG with transparent background. Max file size: 5MB
                  </p>
                  {!id && (
                    <p className="text-xs text-destructive">
                      Logo is required for new brands
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Brand Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Brand Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter brand name"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Website URL */}
            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                {...register('website')}
                type="url"
                placeholder="https://example.com"
                disabled={isLoading}
              />
              {errors.website && (
                <p className="text-sm text-destructive">{errors.website.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Optional: Brand website (must start with https://)
              </p>
            </div>

            {/* Display Order */}
            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                {...register('displayOrder')}
                type="number"
                min="0"
                placeholder="0"
                disabled={isLoading}
              />
              {errors.displayOrder && (
                <p className="text-sm text-destructive">{errors.displayOrder.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first in the showcase
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Active Status</Label>
                <p className="text-sm text-muted-foreground">
                  {isActive
                    ? 'This brand will be visible on the website'
                    : 'This brand will be hidden from the website'}
                </p>
              </div>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue('isActive', checked)}
                disabled={isLoading}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Saving...' : id ? 'Update Brand' : 'Create Brand'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/brands')}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
