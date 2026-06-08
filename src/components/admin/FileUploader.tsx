import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { api } from '@/services/apiService';
import '@/components/features/admin/Admin.css';

interface FileUploaderProps {
  onUploadSuccess: (url: string) => void;
  onRemove?: () => void;
  folder: string;
  type: 'image' | 'pdf';
  label?: string;
  currentValue?: string;
  maxSize?: number; // In MB
}

export default function FileUploader({
  onUploadSuccess,
  onRemove,
  folder,
  type,
  label,
  currentValue = '',
  maxSize
}: FileUploaderProps) {
  const defaultMaxSize = type === 'image' ? 5 : 20; // Default: 5MB for images, 20MB for PDFs
  const limitMB = maxSize || defaultMaxSize;
  
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [fileUrl, setFileUrl] = useState(currentValue);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    setError('');
    
    // Validate file type
    if (type === 'image') {
      const allowedImageMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedImageMimes.includes(file.type)) {
        setError('Unsupported image format. Allowed formats: JPG, JPEG, PNG, WEBP.');
        return;
      }
    } else if (type === 'pdf') {
      if (file.type !== 'application/pdf') {
        setError('Unsupported file format. Allowed format: PDF.');
        return;
      }
    }

    // Validate size
    if (file.size > limitMB * 1024 * 1024) {
      setError(`File size exceeds the ${limitMB}MB maximum limit.`);
      return;
    }

    // Prepare upload
    setUploading(true);
    setProgress(15);
    setUploadedFileName(file.name);

    const formData = new FormData();
    formData.append('file', file);

    const uploadEndpoint = type === 'image' ? '/uploads/image' : '/uploads/pdf';

    try {
      setProgress(40);
      const res = await api.post(`${uploadEndpoint}?folder=${folder}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          // Keep progress within 40-95% while database/storage finishes
          setProgress(Math.max(40, Math.min(95, percentCompleted)));
        }
      });
      
      setProgress(100);
      const url = res.data.url;
      setFileUrl(url);
      onUploadSuccess(url);
    } catch (err: any) {
      console.error("Upload error:", err);
      const errorMsg = err.response?.data?.detail || "Upload failed. Please try again.";
      setError(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const handleClear = () => {
    setFileUrl('');
    setUploadedFileName('');
    setProgress(0);
    setError('');
    if (onRemove) onRemove();
  };

  const getPdfFilename = (url: string) => {
    if (uploadedFileName) return uploadedFileName;
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  return (
    <div className="admin-form-group" style={{ marginBottom: '16px' }}>
      {label && <label style={{ display: 'block', marginBottom: '8px', color: '#001943', fontWeight: 600 }}>{label}</label>}
      
      {fileUrl ? (
        <div style={{
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '16px',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          {type === 'image' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={fileUrl} 
                alt="Uploaded file" 
                style={{ 
                  width: folder === 'reviews' ? '48px' : '80px', 
                  height: folder === 'reviews' ? '48px' : '48px', 
                  borderRadius: folder === 'reviews' ? '50%' : '6px', 
                  objectFit: 'cover',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }} 
              />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#001943' }}>Image uploaded successfully</div>
                <a href={fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'none' }}>View full size</a>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#ef4444', fontSize: '28px' }}>picture_as_pdf</span>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#001943', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {getPdfFilename(fileUrl)}
                </div>
                <a href={fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'none' }}>View document</a>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="button" 
              onClick={onButtonClick}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Replace
            </button>
            <button 
              type="button" 
              onClick={handleClear}
              style={{
                background: '#fee2e2',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#ef4444',
                cursor: 'pointer'
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          style={{
            border: dragActive ? '2px dashed #2563eb' : '2px dashed #cbd5e1',
            borderRadius: '8px',
            padding: '24px',
            background: dragActive ? '#eff6ff' : '#f8fafc',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onClick={onButtonClick}
        >
          {uploading ? (
            <div style={{ width: '100%', maxWidth: '200px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#475569', marginBottom: '4px', fontWeight: 600 }}>
                <span>Uploading file...</span>
                <span>{progress}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: '#2563eb', transition: 'width 0.2s ease' }} />
              </div>
            </div>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#64748b' }}>
                {type === 'image' ? 'image' : 'upload_file'}
              </span>
              <div style={{ fontSize: '13px', color: '#475569' }}>
                <span style={{ color: '#2563eb', fontWeight: 600 }}>Click to upload</span> or drag and drop
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                {type === 'image' ? `JPEG, PNG, WEBP (max. ${limitMB}MB)` : `PDF document (max. ${limitMB}MB)`}
              </div>
            </>
          )}
        </div>
      )}

      <input 
        ref={inputRef}
        type="file" 
        style={{ display: 'none' }} 
        onChange={handleChange}
        accept={type === 'image' ? 'image/jpeg,image/png,image/webp,image/jpg' : 'application/pdf'}
      />

      {error && (
        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>
          {error}
        </div>
      )}
    </div>
  );
}
