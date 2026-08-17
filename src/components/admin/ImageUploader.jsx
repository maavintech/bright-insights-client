import { useState } from 'react';
import api, { API_ORIGIN } from '../../api/client';

export default function ImageUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  const previewSrc = value ? (value.startsWith('http') ? value : `${API_ORIGIN}${value}`) : null;

  return (
    <div>
      {previewSrc && (
        <div className="mb-3 flex items-center gap-3">
          <img src={previewSrc} alt="Featured" className="h-24 w-40 rounded-lg object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      )}
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-brand-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-brand-blue/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-blue hover:file:bg-brand-blue/20"
      />
      {uploading && <p className="mt-1 text-sm text-brand-ink/50">Uploading…</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
