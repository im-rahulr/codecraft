import React, { useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, LoaderCircle, Upload } from 'lucide-react';
import { WEBSITE_UPLOAD_ACCEPT, WEBSITE_UPLOAD_PASSWORD } from '../uploadConfig';

type UploadStatus = 'idle' | 'waiting-password' | 'uploading' | 'success' | 'failure';

interface UploadWidgetProps {
  onUploadComplete?: () => void;
}

function getStatusMessage(status: UploadStatus, fileCount: number) {
  switch (status) {
    case 'waiting-password':
      return `Selected ${fileCount} file${fileCount === 1 ? '' : 's'}. Enter the upload password to continue.`;
    case 'uploading':
      return `Uploading ${fileCount} file${fileCount === 1 ? '' : 's'}...`;
    case 'success':
      return `Uploaded ${fileCount} file${fileCount === 1 ? '' : 's'} successfully.`;
    default:
      return 'Select image or video files to upload.';
  }
}

export default function UploadWidget({ onUploadComplete }: UploadWidgetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [password, setPassword] = useState(WEBSITE_UPLOAD_PASSWORD);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [message, setMessage] = useState(getStatusMessage('idle', 0));

  const resetSelection = () => {
    setSelectedFiles([]);
    setPassword(WEBSITE_UPLOAD_PASSWORD);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setSelectedFiles(files);

    if (files.length === 0) {
      setStatus('idle');
      setMessage(getStatusMessage('idle', 0));
      return;
    }

    setStatus('waiting-password');
    setMessage(getStatusMessage('waiting-password', files.length));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setStatus('failure');
      setMessage('Select at least one file before uploading.');
      return;
    }

    setStatus('uploading');
    setMessage(getStatusMessage('uploading', selectedFiles.length));

    const formData = new FormData();
    formData.set('password', password);
    selectedFiles.forEach((file) => formData.append('files', file, file.name));

    try {
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus('failure');
        setMessage(payload.error ?? 'Upload failed.');
        return;
      }

      const uploadedCount = Array.isArray(payload.uploadedFiles)
        ? payload.uploadedFiles.length
        : selectedFiles.length;

      setStatus('success');
      setMessage(getStatusMessage('success', uploadedCount));
      resetSelection();
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload failed', error);
      setStatus('failure');
      setMessage('Upload failed. Please try again.');
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <input
        ref={fileInputRef}
        type="file"
        accept={WEBSITE_UPLOAD_ACCEPT}
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>
          {selectedFiles.length > 0 && (
            <p className="mt-2 text-xs text-gray-500">
              {selectedFiles.map((file) => file.name).join(', ')}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:min-w-[320px]">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Upload password
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-400 focus:outline-none"
              placeholder="Enter upload password"
            />
            <button
              type="button"
              onClick={handleUpload}
              disabled={status === 'uploading' || selectedFiles.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'uploading' ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Start upload
            </button>
          </div>
        </div>
      </div>

      <div
        className={`mt-3 flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
          status === 'failure'
            ? 'bg-red-50 text-red-700'
            : status === 'success'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-gray-50 text-gray-700'
        }`}
      >
        {status === 'failure' ? (
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
        ) : status === 'success' ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
        ) : status === 'uploading' ? (
          <LoaderCircle className="mt-0.5 h-4 w-4 animate-spin flex-shrink-0" />
        ) : (
          <Upload className="mt-0.5 h-4 w-4 flex-shrink-0" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
}
