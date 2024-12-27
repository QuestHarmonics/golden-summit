interface ImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export class ImageOptimizer {
  static async optimize(
    file: File,
    options: ImageOptions = {}
  ): Promise<Blob> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'webp'
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and optimize image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to desired format
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image'));
            }
          },
          `image/${format}`,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      // Create object URL from file
      img.src = URL.createObjectURL(file);
    });
  }

  static async optimizeUrl(
    url: string,
    options: ImageOptions = {}
  ): Promise<string> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], 'image', { type: blob.type });
      const optimizedBlob = await this.optimize(file, options);
      return URL.createObjectURL(optimizedBlob);
    } catch (error) {
      console.error('Image optimization error:', error);
      return url; // Return original URL if optimization fails
    }
  }

  static getOptimalFormat(): 'webp' | 'jpeg' | 'png' {
    const canvas = document.createElement('canvas');
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      return 'webp';
    }
    return 'jpeg';
  }

  static async generateThumbnail(
    file: File,
    size: number = 200
  ): Promise<Blob> {
    return this.optimize(file, {
      maxWidth: size,
      maxHeight: size,
      quality: 0.7,
      format: this.getOptimalFormat()
    });
  }
} 