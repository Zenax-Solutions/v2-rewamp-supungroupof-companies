import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { companiesAPI, type Company, type SocialLink, getErrorMessage, getFileUrl } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Upload, X, Plus } from 'lucide-react';

const companySchema = z.object({
  id: z.string().min(1, 'ID is required').regex(/^[a-z0-9-]+$/, 'ID must be lowercase letters, numbers, and hyphens only'),
  name: z.string().min(1, 'Name is required'),
  shortName: z.string().min(1, 'Short name is required'),
  description: z.string().min(1, 'Description is required'),
  fullDescription: z.string().min(1, 'Full description is required'),
  industry: z.string().min(1, 'Industry is required'),
  established: z.string().regex(/^\d{4}$/, 'Must be a valid year').optional().or(z.literal('')),
  website: z.string().url('Must be a valid URL').or(z.literal('')),
  features: z.string().min(1, 'At least one feature is required'),
  phone: z.string().optional().or(z.literal('')),
  hotline: z.string().optional().or(z.literal('')),
  email: z.string().email('Must be a valid email').optional().or(z.literal('')),
  faxNumber: z.string().optional().or(z.literal('')),
  sequence: z.string().optional().or(z.literal('')),
  googleMapsLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type CompanyFormData = z.infer<typeof companySchema>;

export default function CompanyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [catalogPdfFile, setCatalogPdfFile] = useState<File | null>(null);
  const [existingCatalogPdf, setExistingCatalogPdf] = useState<string>('');
  const [featureInput, setFeatureInput] = useState('');
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [socialLinkName, setSocialLinkName] = useState('');
  const [socialLinkUrl, setSocialLinkUrl] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      id: '',
      name: '',
      shortName: '',
      description: '',
      fullDescription: '',
      industry: '',
      established: '',
      website: '',
      features: '',
      phone: '',
      hotline: '',
      email: '',
      faxNumber: '',
      sequence: '',
      googleMapsLink: '',
    },
  });

  useEffect(() => {
    if (isEditMode && id) {
      loadCompany(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode]);

  const loadCompany = async (companyId: string) => {
    setIsFetching(true);
    try {
      const company = await companiesAPI.getById(companyId);
      console.log('Loaded company data:', company);
      
      // Safely handle established year
      const establishedYear = company.established 
        ? String(company.established) 
        : '';
      
      // Safely handle features array
      const featuresList = Array.isArray(company.features) 
        ? company.features 
        : [];
      
      // Safely handle sequence
      const sequence = company.sequence !== undefined 
        ? String(company.sequence) 
        : '0';
      
      reset({
        id: company.id || '',
        name: company.name || '',
        shortName: company.shortName || '',
        description: company.description || '',
        fullDescription: company.fullDescription || '',
        industry: company.industry || '',
        established: establishedYear,
        website: company.website || '',
        features: featuresList.join('\n'),
        phone: company.phone || '',
        hotline: company.hotline || '',
        email: company.email || '',
        faxNumber: company.faxNumber || '',
        sequence: sequence,
        googleMapsLink: company.googleMapsLink || '',
      });
      
      setFeaturesList(featuresList);
      setValue('features', featuresList.join('\n'));
      
      // Handle gallery
      if (company.gallery && Array.isArray(company.gallery)) {
        const galleryUrls = company.gallery.map(img => getFileUrl(img));
        setExistingGallery(galleryUrls);
      }
      
      // Handle social links
      if (company.socialLinks && Array.isArray(company.socialLinks)) {
        setSocialLinks(company.socialLinks);
      }
      
      if (company.imageUrl) {
        // Check if it's a full URL or relative path
        const imageUrl = getFileUrl(company.imageUrl);
        setImagePreview(imageUrl);
      }
      
      if (company.catalogPdf) {
        const catalogPdfUrl = getFileUrl(company.catalogPdf);
        setExistingCatalogPdf(catalogPdfUrl);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Failed to load company:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
      navigate('/admin/companies');
    } finally {
      setIsFetching(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'Invalid file',
          description: 'Please select an image file.',
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Image must be less than 5MB.',
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCatalogPdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          variant: 'destructive',
          title: 'Invalid file',
          description: 'Please select a PDF file.',
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'PDF must be less than 10MB.',
        });
        return;
      }
      setCatalogPdfFile(file);
      toast({
        title: 'PDF Selected',
        description: `${file.name} is ready to upload.`,
      });
    }
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      const newFeatures = [...featuresList, featureInput.trim()];
      setFeaturesList(newFeatures);
      setValue('features', newFeatures.join('\n'));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = featuresList.filter((_, i) => i !== index);
    setFeaturesList(newFeatures);
    setValue('features', newFeatures.join('\n'));
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'Invalid file',
          description: 'Please select only image files.',
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: `${file.name} must be less than 5MB.`,
        });
        return;
      }
    }

    // Add to existing gallery files
    const newGalleryFiles = [...galleryFiles, ...files];
    setGalleryFiles(newGalleryFiles);

    // Generate previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    toast({
      title: 'Images added',
      description: `${files.length} image(s) added to gallery.`,
    });
  };

  const handleRemoveGalleryImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingGallery(prev => prev.filter((_, i) => i !== index));
    } else {
      setGalleryFiles(prev => prev.filter((_, i) => i !== index));
      setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleAddSocialLink = () => {
    if (socialLinkName.trim() && socialLinkUrl.trim()) {
      // Validate URL
      try {
        new URL(socialLinkUrl);
      } catch {
        toast({
          variant: 'destructive',
          title: 'Invalid URL',
          description: 'Please enter a valid URL for the social link.',
        });
        return;
      }

      const newSocialLinks = [...socialLinks, { name: socialLinkName.trim(), url: socialLinkUrl.trim() }];
      setSocialLinks(newSocialLinks);
      setSocialLinkName('');
      setSocialLinkUrl('');
    }
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CompanyFormData) => {
    if (featuresList.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Validation error',
        description: 'Please add at least one feature.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('id', data.id);
      formData.append('name', data.name);
      formData.append('shortName', data.shortName);
      formData.append('description', data.description);
      formData.append('fullDescription', data.fullDescription);
      formData.append('industry', data.industry);
      formData.append('established', data.established);
      formData.append('website', data.website);
      formData.append('features', JSON.stringify(featuresList));
      
      // Add new fields
      formData.append('phone', data.phone || '');
      formData.append('hotline', data.hotline || '');
      formData.append('email', data.email || '');
      formData.append('faxNumber', data.faxNumber || '');
      formData.append('sequence', data.sequence || '0');
      formData.append('socialLinks', JSON.stringify(socialLinks));
      formData.append('googleMapsLink', data.googleMapsLink || '');

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (catalogPdfFile) {
        formData.append('catalogPdf', catalogPdfFile);
      }

      // Add gallery images
      if (galleryFiles.length > 0) {
        galleryFiles.forEach((file) => {
          formData.append('gallery', file);
        });
      }

      // Send existing gallery URLs to preserve them
      if (existingGallery.length > 0) {
        formData.append('existingGallery', JSON.stringify(existingGallery));
      }

      if (isEditMode) {
        await companiesAPI.update(data.id, formData);
        toast({
          title: 'Success',
          description: 'Company updated successfully.',
        });
      } else {
        await companiesAPI.create(formData);
        toast({
          title: 'Success',
          description: 'Company created successfully.',
        });
      }

      navigate('/admin/companies');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Failed to save company:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/companies')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Edit Company' : 'Add New Company'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditMode
              ? 'Update company information and details'
              : 'Fill in the details to add a new company'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Company identity and primary details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="id">Company ID *</Label>
                <Input
                  id="id"
                  {...register('id')}
                  placeholder="e.g., camy-smart"
                  disabled={isEditMode}
                />
                {errors.id && <p className="text-sm text-destructive">{errors.id.message}</p>}
                <p className="text-xs text-muted-foreground">
                  Unique identifier (lowercase, hyphens only)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortName">Short Name *</Label>
                <Input id="shortName" {...register('shortName')} placeholder="e.g., Camy Smart" />
                {errors.shortName && (
                  <p className="text-sm text-destructive">{errors.shortName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., Camy Smart Safety Helmet Manufacturing"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Input
                  id="industry"
                  {...register('industry')}
                  placeholder="e.g., Manufacturing"
                />
                {errors.industry && (
                  <p className="text-sm text-destructive">{errors.industry.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="established">Established Year *</Label>
                <Input
                  id="established"
                  {...register('established')}
                  placeholder="e.g., 2010"
                  type="number"
                />
                {errors.established && (
                  <p className="text-sm text-destructive">{errors.established.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                {...register('website')}
                placeholder="https://example.com"
                type="url"
              />
              {errors.website && (
                <p className="text-sm text-destructive">{errors.website.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleMapsLink">Google Maps Link</Label>
              <Input
                id="googleMapsLink"
                {...register('googleMapsLink')}
                placeholder="https://maps.google.com/..."
                type="url"
              />
              {errors.googleMapsLink && (
                <p className="text-sm text-destructive">{errors.googleMapsLink.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Share link from Google Maps to show company location
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sequence">Display Order (Sequence)</Label>
              <Input
                id="sequence"
                {...register('sequence')}
                placeholder="e.g., 1"
                type="number"
              />
              {errors.sequence && (
                <p className="text-sm text-destructive">{errors.sequence.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first in grid view
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Company contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="e.g., +94 11 123 4567"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hotline">Hotline</Label>
                <Input
                  id="hotline"
                  {...register('hotline')}
                  placeholder="e.g., +94 77 123 4567"
                />
                {errors.hotline && (
                  <p className="text-sm text-destructive">{errors.hotline.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  {...register('email')}
                  placeholder="e.g., info@company.com"
                  type="email"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="faxNumber">Fax Number</Label>
                <Input
                  id="faxNumber"
                  {...register('faxNumber')}
                  placeholder="e.g., +94 11 123 4568"
                />
                {errors.faxNumber && (
                  <p className="text-sm text-destructive">{errors.faxNumber.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
            <CardDescription>Company overview and detailed information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Brief description of the company..."
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullDescription">Full Description *</Label>
              <Textarea
                id="fullDescription"
                {...register('fullDescription')}
                placeholder="Detailed description of the company, its history, mission, and vision..."
                rows={6}
              />
              {errors.fullDescription && (
                <p className="text-sm text-destructive">{errors.fullDescription.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>Key features and highlights of the company</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Enter a feature..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
              />
              <Button type="button" onClick={handleAddFeature}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {featuresList.length > 0 && (
              <div className="space-y-2">
                {featuresList.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <span>{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {featuresList.length === 0 && (
              <p className="text-sm text-muted-foreground">No features added yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>Add social media profiles for the company</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="socialLinkName">Platform Name</Label>
                  <Input
                    id="socialLinkName"
                    value={socialLinkName}
                    onChange={(e) => setSocialLinkName(e.target.value)}
                    placeholder="e.g., Facebook, LinkedIn, Instagram"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSocialLink();
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialLinkUrl">URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="socialLinkUrl"
                      value={socialLinkUrl}
                      onChange={(e) => setSocialLinkUrl(e.target.value)}
                      placeholder="https://..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSocialLink();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddSocialLink}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {socialLinks.length > 0 && (
              <div className="space-y-2">
                {socialLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{link.name}</span>
                      <span className="text-sm text-muted-foreground truncate">{link.url}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSocialLink(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {socialLinks.length === 0 && (
              <p className="text-sm text-muted-foreground">No social links added yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Gallery */}
        <Card>
          <CardHeader>
            <CardTitle>Image Gallery</CardTitle>
            <CardDescription>Upload multiple images for the company gallery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gallery">Gallery Images (max 5MB each)</Label>
              <Input
                id="gallery"
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                You can select multiple images at once
              </p>
            </div>

            {/* Existing Gallery Images */}
            {existingGallery.length > 0 && (
              <div>
                <Label className="mb-2 block">Current Gallery Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {existingGallery.map((img, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        className="rounded-lg border shadow-sm w-full h-32 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveGalleryImage(index, true)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Gallery Images */}
            {galleryPreviews.length > 0 && (
              <div>
                <Label className="mb-2 block">New Gallery Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryPreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img
                        src={preview}
                        alt={`New gallery ${index + 1}`}
                        className="rounded-lg border shadow-sm w-full h-32 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveGalleryImage(index, false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {existingGallery.length === 0 && galleryPreviews.length === 0 && (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No gallery images uploaded</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Company Image</CardTitle>
            <CardDescription>Upload a featured image for the company</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">Image (max 5MB)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
            </div>

            {imagePreview && (
              <div className="relative w-full max-w-md">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="rounded-lg border shadow-sm w-full"
                />
                {imageFile && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {!imagePreview && (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No image selected</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Catalog PDF Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Product Catalog</CardTitle>
            <CardDescription>Upload a PDF catalog for the company (optional)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="catalogPdf">Catalog PDF (max 10MB)</Label>
              <Input
                id="catalogPdf"
                type="file"
                accept="application/pdf"
                onChange={handleCatalogPdfChange}
                className="cursor-pointer"
              />
            </div>

            {catalogPdfFile && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{catalogPdfFile.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCatalogPdfFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {existingCatalogPdf && !catalogPdfFile && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Current catalog uploaded</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(existingCatalogPdf, '_blank')}
                >
                  View PDF
                </Button>
              </div>
            )}

            {!catalogPdfFile && !existingCatalogPdf && (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No catalog PDF uploaded</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/companies')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>{isEditMode ? 'Update Company' : 'Create Company'}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
