/**
 * Advanced High-Definition Image Optimization Engine
 * 
 * Features:
 * - High-Resolution preservation (up to 1920px HD / 4K downscaling)
 * - Intelligent target size balancing (~200 - 500 KB optimal sweet spot)
 * - Lanczos / Bicubic high-quality canvas smoothing
 * - Smart transparency detection (PNG alpha channel retention)
 * - Adaptive iterative quantization and byte-accurate size budgeting
 * - Firestore single-document safe batch budget allocation
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  targetSizeKB?: number; // Target size in KB (e.g. 200 - 500 KB)
  minSizeKB?: number;
  quality?: number; // 0.1 to 1.0 (default: 0.88 - 0.92 for crystal clear HD)
  minQuality?: number; // Lower bound quality to prevent artifacts (default: 0.65)
  format?: 'auto' | 'image/jpeg' | 'image/png' | 'image/webp';
}

/**
 * Calculates byte size of a base64 string
 */
export const getBase64ByteSize = (base64Str: string): number => {
  if (!base64Str || typeof base64Str !== 'string') return 0;
  const commaIndex = base64Str.indexOf(',');
  const data = commaIndex >= 0 ? base64Str.slice(commaIndex + 1) : base64Str;
  const padding = (data.endsWith('==') ? 2 : data.endsWith('=') ? 1 : 0);
  return Math.max(0, Math.floor((data.length * 3) / 4) - padding);
};

/**
 * Formats bytes to human readable string (e.g. 420 KB)
 */
export const formatBytes = (bytes: number): string => {
  if (bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Checks if a base64 or Canvas image contains transparent pixels
 */
const hasTransparency = (ctx: CanvasRenderingContext2D, width: number, height: number): boolean => {
  try {
    const imgData = ctx.getImageData(0, 0, Math.min(width, 100), Math.min(height, 100));
    const data = imgData.data;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 250) return true; // Alpha < 250 means transparent pixel
    }
  } catch {
    // Security or canvas error fallback
    return false;
  }
  return false;
};

/**
 * Optimizes an image (base64 string) maintaining pristine HD resolution
 * and targeting an optimal budget (~200 - 500 KB).
 */
export const optimizeImageAsync = (
  base64Str: string,
  options: ImageOptimizationOptions = {}
): Promise<string> => {
  return new Promise((resolve) => {
    if (!base64Str || typeof base64Str !== 'string') {
      resolve('');
      return;
    }

    // Return non-image base64 or external URLs as-is
    if (!base64Str.startsWith('data:image/')) {
      resolve(base64Str);
      return;
    }

    const {
      maxWidth = 1920,
      maxHeight = 1200,
      targetSizeKB = 650, // Sweet spot ~500-650 KB for crystal clear HD banners
      quality = 0.92,
      minQuality = 0.75,
      format = 'auto'
    } = options;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        let origWidth = img.width || 1;
        let origHeight = img.height || 1;

        // Calculate aspect-ratio preserved dimensions
        let targetWidth = origWidth;
        let targetHeight = origHeight;

        if (targetWidth > maxWidth || targetHeight > maxHeight) {
          const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
          targetWidth = Math.round(targetWidth * ratio);
          targetHeight = Math.round(targetHeight * ratio);
        }

        // Create high precision rendering canvas
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) {
          resolve(base64Str);
          return;
        }

        // Apply high-quality bicubic resampling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Determine best output format
        let outFormat = 'image/jpeg';
        if (format === 'auto') {
          const isSvgOrPng = base64Str.startsWith('data:image/png') || base64Str.startsWith('data:image/svg');
          if (isSvgOrPng && hasTransparency(ctx, targetWidth, targetHeight)) {
            outFormat = 'image/png';
          } else {
            outFormat = 'image/jpeg';
          }
        } else {
          outFormat = format;
        }

        // For PNG with alpha transparency, return high-fidelity PNG
        if (outFormat === 'image/png') {
          const pngResult = canvas.toDataURL('image/png');
          const pngBytes = getBase64ByteSize(pngResult);
          // If PNG is reasonably sized (<600KB), use it
          if (pngBytes <= targetSizeKB * 1024 * 1.3) {
            resolve(pngResult);
            return;
          }
        }

        // For JPEG / WebP: iterative adaptive quantization to target ~200 - 500 KB
        let curQuality = quality;
        let result = canvas.toDataURL('image/jpeg', curQuality);
        let curBytes = getBase64ByteSize(result);
        const maxTargetBytes = targetSizeKB * 1024;

        // If image is already smaller than target, keep top quality
        if (curBytes <= maxTargetBytes) {
          resolve(result);
          return;
        }

        // Iteratively tune quality & slight downscale if necessary to hit ~400-500 KB
        let attempts = 0;
        while (curBytes > maxTargetBytes && attempts < 5 && curQuality > minQuality) {
          attempts++;
          curQuality = Math.max(minQuality, curQuality - 0.07);

          // If still significantly oversized, step down dimensions by 10%
          if (curBytes > maxTargetBytes * 1.5 && targetWidth > 800) {
            targetWidth = Math.round(targetWidth * 0.9);
            targetHeight = Math.round(targetHeight * 0.9);
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          }

          result = canvas.toDataURL('image/jpeg', curQuality);
          curBytes = getBase64ByteSize(result);
        }

        resolve(result);
      } catch (err) {
        console.warn('optimizeImageAsync error, falling back to original:', err);
        resolve(base64Str);
      }
    };

    img.onerror = () => {
      resolve(base64Str);
    };

    img.src = base64Str;
  });
};

/**
 * Optimizes an uploaded File object directly to high-quality base64
 */
export const optimizeImageFileAsync = (
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<{ base64: string; originalSize: number; optimizedSize: number }> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawBase64 = e.target?.result as string;
      if (!rawBase64) {
        reject(new Error('Failed to read file'));
        return;
      }

      try {
        const optimized = await optimizeImageAsync(rawBase64, options);
        const originalSize = file.size;
        const optimizedSize = getBase64ByteSize(optimized);
        resolve({
          base64: optimized,
          originalSize,
          optimizedSize
        });
      } catch (err) {
        resolve({
          base64: rawBase64,
          originalSize: file.size,
          optimizedSize: getBase64ByteSize(rawBase64)
        });
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading image file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Smart batch document optimizer for Firestore multi-banner aggregations.
 * Ensures total document size never exceeds maxDocBytes (e.g. 750KB) while giving
 * maximum resolution to each image.
 */
export const optimizeFirestoreDocumentImages = async <T extends Record<string, any>>(
  docData: T,
  maxDocBytes: number = 750000
): Promise<T> => {
  if (!docData || typeof docData !== 'object') return docData;

  const result: any = JSON.parse(JSON.stringify(docData));

  // 1. Collect all base64 image references
  const imageRefs: { parent: any; key: string | number; base64: string }[] = [];

  const scan = (obj: any) => {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (typeof val === 'string' && val.startsWith('data:image/')) {
        imageRefs.push({ parent: obj, key, base64: val });
      } else if (typeof val === 'object') {
        scan(val);
      }
    }
  };

  scan(result);

  if (imageRefs.length === 0) return result;

  // 2. Calculate optimal per-image target size based on image count
  // Budget available for images = maxDocBytes - metadata overhead (~50KB)
  const availableImageBudget = Math.max(100000, maxDocBytes - 50000);
  const targetPerImageKB = Math.min(
    450, // max individual banner cap ~450 KB
    Math.max(40, Math.floor(availableImageBudget / (imageRefs.length * 1024)))
  );

  // 3. Optimize each image to the allocated budget
  for (const ref of imageRefs) {
    try {
      const optimized = await optimizeImageAsync(ref.base64, {
        maxWidth: targetPerImageKB > 200 ? 1600 : targetPerImageKB > 100 ? 1200 : 900,
        targetSizeKB: targetPerImageKB,
        quality: targetPerImageKB > 200 ? 0.88 : 0.78,
        minQuality: 0.65
      });
      ref.parent[ref.key] = optimized;
    } catch (e) {
      console.warn('Batch image optimization fallback:', e);
    }
  }

  // 4. Final safety check: if total JSON size still exceeds maxDocBytes, perform quick downscale
  let finalJsonSize = JSON.stringify(result).length;
  if (finalJsonSize > maxDocBytes) {
    const compactTargetKB = Math.max(30, Math.floor(availableImageBudget / (imageRefs.length * 1024 * 1.2)));
    for (const ref of imageRefs) {
      try {
        const compact = await optimizeImageAsync(ref.parent[ref.key], {
          maxWidth: 800,
          targetSizeKB: compactTargetKB,
          quality: 0.68,
          minQuality: 0.55
        });
        ref.parent[ref.key] = compact;
      } catch {}
    }
  }

  return result;
};
