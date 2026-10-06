export interface UploadedImageResult {
  success: boolean;
  url: string;
  filename: string;
  size?: number;
  message?: string;
  isLocalFallback?: boolean;
}

export interface SavedImageItem {
  id: string;
  filename: string;
  url: string;
  size: number;
  mtime: string;
  isVideo?: boolean;
}

function normalizeCategory(value?: string): string {
  const allowed = new Set(['books', 'electronics', 'superstore', 'fashion', 'kids', 'general', 'home', 'campaigns', 'site', 'landing']);
  const cleaned = (value || 'general').toString().trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  return allowed.has(cleaned) ? cleaned : 'general';
}

function normalizeAssetType(value?: string): string {
  const cleaned = (value || 'products').toString().trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  return cleaned || 'products';
}

export async function uploadImageFile(
  file: File,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    targetSizeKB?: number;
    prefix?: string;
    category?: string;
    assetType?: string;
  }
): Promise<UploadedImageResult> {
  const isImageMime = Boolean(file.type && file.type.startsWith('image/'));
  const isImageExt = /\.(jpe?g|png|webp|gif|svg|bmp|jfif|avif|ico)$/i.test(file.name);

  if (!isImageMime && !isImageExt) {
    throw new Error('দয়া করে একটি সঠিক ইমেজ ফাইল নির্বাচন করুন!');
  }

  const rawBase64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('ইমেজ ফাইল পড়তে ত্রুটি হয়েছে'));
    reader.readAsDataURL(file);
  });

  let optimizedBase64 = rawBase64;
  try {
    const { optimizeImageAsync } = await import('./imageOptimizer');
    optimizedBase64 = await optimizeImageAsync(rawBase64, {
      maxWidth: options?.maxWidth || 1600,
      maxHeight: options?.maxHeight,
      quality: options?.quality || 0.9,
      targetSizeKB: options?.targetSizeKB || 450,
      minQuality: 0.65,
    });
  } catch (err) {
    console.warn('Image optimization skipped:', err);
  }

  const res = await fetch('/api/upload-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: optimizedBase64,
      filename: file.name,
      category: normalizeCategory(options?.category),
      assetType: normalizeAssetType(options?.assetType),
      prefix: options?.prefix || 'img',
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success || !data.url) {
    throw new Error(data.error || 'ছবিটি ফোল্ডারে সংরক্ষণ করা যায়নি');
  }

  return {
    success: true,
    url: data.url,
    filename: data.filename,
    size: data.size,
    message: data.message || 'ছবি সেভ হয়েছে',
  };
}

export async function getSavedImages(): Promise<SavedImageItem[]> {
  try {
    const res = await fetch('/api/images');
    if (!res.ok) return [];
    const data = await res.json();
    if (data.success && Array.isArray(data.images)) {
      return data.images.map((item: any) => ({
        id: item.filename,
        filename: item.filename,
        url: item.url,
        size: item.size,
        mtime: item.mtime,
        isVideo: Boolean(item.isVideo),
      }));
    }
  } catch (err) {
    console.error('Failed to fetch saved media:', err);
  }
  return [];
}

export async function deleteSavedImage(filename: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/images/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    return Boolean(res.ok && data.success);
  } catch (err) {
    console.error(`Failed to delete media ${filename}:`, err);
  }
  return false;
}

export async function uploadVideoFile(
  file: File,
  options?: { prefix?: string; category?: string; assetType?: string }
): Promise<UploadedImageResult> {
  const isVideoMime = Boolean(file.type && file.type.startsWith('video/'));
  const isVideoExt = /\.(mp4|webm|mov|ogg|m4v)$/i.test(file.name);

  if (!isVideoMime && !isVideoExt) {
    throw new Error('দয়া করে একটি সঠিক ভিডিও ফাইল (MP4, WebM, MOV, OGG) নির্বাচন করুন!');
  }

  const rawBase64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('ভিডিও ফাইল পড়তে সমস্যা হয়েছে'));
    reader.readAsDataURL(file);
  });

  const res = await fetch('/api/upload-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      video: rawBase64,
      filename: file.name,
      category: normalizeCategory(options?.category),
      assetType: normalizeAssetType(options?.assetType || 'videos'),
      prefix: options?.prefix || 'video',
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success || !data.url) {
    throw new Error(data.error || 'ভিডিওটি ফোল্ডারে সংরক্ষণ করা যায়নি');
  }

  return {
    success: true,
    url: data.url,
    filename: data.filename,
    size: data.size,
    message: data.message || 'ভিডিও সেভ হয়েছে',
  };
}

export async function uploadMultipleImages(
  files: File[] | FileList,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    targetSizeKB?: number;
    prefix?: string;
    category?: string;
    assetType?: string;
  }
): Promise<UploadedImageResult[]> {
  const list = Array.from(files).slice(0, 5);
  const results: UploadedImageResult[] = [];

  for (const file of list) {
    try {
      const result = await uploadImageFile(file, options);
      results.push(result);
    } catch (err) {
      console.error(`Failed uploading ${file.name}:`, err);
    }
  }

  return results;
}
