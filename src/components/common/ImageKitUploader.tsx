import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Link as LinkIcon, 
  X, 
  Check, 
  Copy, 
  Sparkles, 
  Image as ImageIcon, 
  Eye, 
  Maximize2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

interface ImageKitUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  multiple?: boolean;
  folder?: string;
  label?: string;
  helperText?: string;
}

export const ImageKitUploader: React.FC<ImageKitUploaderProps> = ({
  images,
  onImagesChange,
  maxImages = 6,
  multiple = true,
  folder = '/lumina-store',
  label = 'Product Media (ImageKit CDN)',
  helperText = 'Upload images directly to ImageKit or paste an existing ImageKit/web URL.'
}) => {
  const [activeInputMode, setActiveInputMode] = useState<'upload' | 'url'>('upload');
  const [pastedUrl, setPastedUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick copy URL helper
  const handleCopyUrl = (url: string, idx: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  // Upload file via /api/upload/imagekit
  const uploadFileToImageKit = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      // Convert file to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/upload/imagekit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: base64Data,
          fileName: file.name.replace(/[^a-zA-Z0-9.-]/g, '_'),
          folder,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to process image');
      }

      const newUrl = data.url;
      if (multiple) {
        if (images.length < maxImages) {
          onImagesChange([...images, newUrl]);
        }
      } else {
        onImagesChange([newUrl]);
      }
    } catch (err: any) {
      console.error('ImageKit upload error:', err);
      setUploadError(err.message || 'ImageKit upload failed. Check connection.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Process files
    Array.from(files).forEach((file: File) => {
      if (file.type.startsWith('image/')) {
        uploadFileToImageKit(file);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      if (file.type.startsWith('image/')) {
        uploadFileToImageKit(file);
      }
    });
  };

  // Add pasted URL
  const handleAddPastedUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = pastedUrl.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image')) {
      setUploadError('Please enter a valid image URL starting with https://');
      return;
    }

    setUploadError(null);
    if (multiple) {
      if (images.length < maxImages) {
        onImagesChange([...images, trimmed]);
      }
    } else {
      onImagesChange([trimmed]);
    }
    setPastedUrl('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onImagesChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  // Check if an image is ImageKit-hosted or optimized
  const isImageKit = (url: string) => url.includes('imagekit.io') || url.includes('/tr:');

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span>{label}</span>
            <Badge variant="outline" className="text-[10px] bg-slate-900 text-amber-300 border-slate-900 font-mono py-0 h-4">
              ImageKit CDN
            </Badge>
          </label>
          <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>
        </div>

        {/* Toggle Mode Buttons */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px]">
          <button
            type="button"
            onClick={() => setActiveInputMode('upload')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              activeInputMode === 'upload' 
                ? 'bg-white text-slate-950 shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3 h-3" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveInputMode('url')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              activeInputMode === 'url' 
                ? 'bg-white text-slate-950 shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Paste URL</span>
          </button>
        </div>
      </div>

      {/* Input Action Area */}
      {activeInputMode === 'upload' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            isDragging 
              ? 'border-amber-400 bg-amber-50/50' 
              : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50/60 bg-slate-50/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-5 h-5 text-slate-900" />
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-slate-900">
              {isUploading ? 'Uploading to ImageKit CDN...' : 'Click to select or drag & drop image'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Supports PNG, JPG, WEBP, SVG · Auto-compressed for high-speed delivery
            </p>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="url"
              value={pastedUrl}
              onChange={e => setPastedUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddPastedUrl()}
              placeholder="Paste image URL (e.g. https://ik.imagekit.io/... or web image)..."
              className="pl-8 bg-white text-xs h-9 rounded-xl border-slate-200"
            />
          </div>
          <Button
            type="button"
            onClick={handleAddPastedUrl}
            size="sm"
            className="rounded-xl text-xs font-bold bg-slate-900 text-white shrink-0 h-9 px-4"
          >
            Add Image
          </Button>
        </div>
      )}

      {/* Error Notice */}
      {uploadError && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <span>{uploadError}</span>
          <button onClick={() => setUploadError(null)} className="text-rose-500 hover:text-rose-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ImageKit Preview Section */}
      {images.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span>ImageKit Media Preview ({images.length}/{maxImages})</span>
            <span className="text-[10px] text-slate-400 font-normal">First image is primary card cover</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {images.map((imgUrl, idx) => (
              <div 
                key={idx}
                className="group relative bg-white rounded-xl border border-slate-200 p-2 overflow-hidden shadow-xs hover:border-slate-900 transition-all flex flex-col justify-between"
              >
                {/* Image Frame */}
                <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                  <img
                    src={imgUrl}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />

                  {/* Primary Cover Badge */}
                  {idx === 0 && (
                    <Badge className="absolute top-1.5 left-1.5 bg-slate-950 text-white text-[9px] font-black tracking-wider uppercase px-1.5 py-0 h-4">
                      Primary
                    </Badge>
                  )}

                  {/* ImageKit Tag */}
                  {isImageKit(imgUrl) && (
                    <Badge className="absolute bottom-1.5 left-1.5 bg-amber-400 text-slate-950 text-[9px] font-black py-0 h-4 shadow-xs">
                      IK CDN
                    </Badge>
                  )}

                  {/* Action Buttons overlay */}
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(imgUrl, idx)}
                      className="w-6 h-6 rounded-md bg-white/95 text-slate-700 hover:text-slate-950 flex items-center justify-center shadow-xs border border-slate-200"
                      title="Copy ImageKit URL"
                    >
                      {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="w-6 h-6 rounded-md bg-rose-600 text-white hover:bg-rose-700 flex items-center justify-center shadow-xs"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* URL Snippet */}
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 font-mono truncate">
                  <span className="truncate max-w-[130px]" title={imgUrl}>
                    {imgUrl.split('/').pop() || 'image.jpg'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(imgUrl, idx)}
                    className="text-slate-400 hover:text-slate-900 transition-colors ml-1 shrink-0"
                  >
                    {copiedIdx === idx ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
