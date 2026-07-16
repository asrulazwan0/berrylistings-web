import { useState, useEffect, type FormEvent } from 'react';
import type { Property } from '../api/types';

export interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  type: string;
  status: string;
  addressLine: string;
  city: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  lotSizeAcres: string;
  yearBuilt: string;
  amenities: string[];
  photos: string[];
}

const empty = (): PropertyFormData => ({
  title: '', description: '', price: '', type: 'HOUSE', status: 'DRAFT',
  addressLine: '', city: '', bedrooms: '0', bathrooms: '0', sqft: '0',
  lotSizeAcres: '', yearBuilt: '', amenities: [], photos: [],
});

function fromProperty(p: Property): PropertyFormData {
  return {
    title: p.title, description: p.description, price: String(p.price),
    type: p.type, status: p.status, addressLine: p.addressLine, city: p.city,
    bedrooms: String(p.bedrooms), bathrooms: String(p.bathrooms), sqft: String(p.sqft),
    lotSizeAcres: p.lotSizeAcres != null ? String(p.lotSizeAcres) : '',
    yearBuilt: p.yearBuilt != null ? String(p.yearBuilt) : '',
    amenities: p.amenities ?? [],
    photos: (p.photos ?? []).map((ph) => ph.url),
  };
}

function toPayload(d: PropertyFormData) {
  return {
    title: d.title, description: d.description, price: Number(d.price),
    type: d.type, status: d.status, addressLine: d.addressLine, city: d.city,
    bedrooms: Number(d.bedrooms), bathrooms: Number(d.bathrooms), sqft: Number(d.sqft),
    lotSizeAcres: d.lotSizeAcres ? Number(d.lotSizeAcres) : null,
    yearBuilt: d.yearBuilt ? Number(d.yearBuilt) : null,
    amenities: d.amenities.filter(Boolean),
    photos: d.photos.filter(Boolean),
  };
}

interface Props {
  property?: Property | null;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
  saving?: boolean;
}

export default function PropertyForm({ property, onSave, onClose, saving }: Props) {
  const [form, setForm] = useState<PropertyFormData>(empty());
  const [errors, setErrors] = useState<string[]>([]);
  const isEdit = !!property;

  useEffect(() => {
    setForm(property ? fromProperty(property) : empty());
    setErrors([]);
  }, [property]);

  function set(k: keyof PropertyFormData, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function addItem(field: 'amenities' | 'photos') {
    const val = field === 'photos'
      ? (document.getElementById('new-photo-url') as HTMLInputElement)?.value?.trim()
      : (document.getElementById('new-amenity') as HTMLInputElement)?.value?.trim();
    if (!val) return;
    setForm((f) => ({ ...f, [field]: [...f[field], val] }));
    if (field === 'photos') (document.getElementById('new-photo-url') as HTMLInputElement).value = '';
    else (document.getElementById('new-amenity') as HTMLInputElement).value = '';
  }

  function removeItem(field: 'amenities' | 'photos', idx: number) {
    setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors([]);
    try {
      await onSave(toPayload(form));
    } catch (err: unknown) {
      setErrors([(err as Error).message]);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={isEdit ? 'Edit property' : 'New property'}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Property' : 'New Property'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          {errors.length > 0 && (
            <div className="field__error" style={{ marginBottom: 'var(--space-4)' }}>{errors.join(', ')}</div>
          )}
          <div className="form-grid">
            <div className="field"><label>Title *</label><input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} required /></div>
            <div className="field"><label>Price *</label><input className="input" type="number" value={form.price} onChange={(e) => set('price', e.target.value)} required /></div>
            <div className="field"><label>Type</label><select className="select" value={form.type} onChange={(e) => set('type', e.target.value)}>
              <option>HOUSE</option><option>CONDO</option><option>TOWNHOME</option><option>LAND</option>
            </select></div>
            <div className="field"><label>Status</label><select className="select" value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option>DRAFT</option><option>ACTIVE</option><option>PENDING</option><option>SOLD</option>
            </select></div>
            <div className="field" style={{ gridColumn: '1 / -1' }}><label>Description *</label><textarea className="input" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} required /></div>
            <div className="field"><label>Address *</label><input className="input" value={form.addressLine} onChange={(e) => set('addressLine', e.target.value)} required /></div>
            <div className="field"><label>City *</label><input className="input" value={form.city} onChange={(e) => set('city', e.target.value)} required /></div>
            <div className="field"><label>Bedrooms</label><input className="input" type="number" min="0" value={form.bedrooms} onChange={(e) => set('bedrooms', e.target.value)} /></div>
            <div className="field"><label>Bathrooms</label><input className="input" type="number" min="0" step="0.5" value={form.bathrooms} onChange={(e) => set('bathrooms', e.target.value)} /></div>
            <div className="field"><label>Sqft</label><input className="input" type="number" min="0" value={form.sqft} onChange={(e) => set('sqft', e.target.value)} /></div>
            <div className="field"><label>Lot (acres)</label><input className="input" type="number" min="0" step="0.01" value={form.lotSizeAcres} onChange={(e) => set('lotSizeAcres', e.target.value)} /></div>
            <div className="field"><label>Year Built</label><input className="input" type="number" min="1800" max="2027" value={form.yearBuilt} onChange={(e) => set('yearBuilt', e.target.value)} /></div>
          </div>

          <div className="field" style={{ marginTop: 'var(--space-5)' }}>
            <label>Amenities</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input id="new-amenity" className="input" placeholder="e.g. Pool" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('amenities'))} />
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => addItem('amenities')}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              {form.amenities.map((a, i) => (
                <span key={i} className="chip">{a} <button type="button" onClick={() => removeItem('amenities', i)} style={{ border: 'none', background: 'none', cursor: 'pointer', marginLeft: 4 }}>×</button></span>
              ))}
            </div>
          </div>

          <div className="field" style={{ marginTop: 'var(--space-5)' }}>
            <label>Photos (URLs)</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input id="new-photo-url" className="input" placeholder="https://..." onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('photos'))} />
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => addItem('photos')}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              {form.photos.map((url, i) => (
                <div key={i} style={{ position: 'relative', width: 80, height: 60, borderRadius: 4, overflow: 'hidden' }}>
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => removeItem('photos', i)} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 12, lineHeight: 1 }}>×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer" style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
