import { useState } from 'react';
import { uploadProductImage } from '../utils/uploadImage';

export default function EditProductModal({ product, onSave, onClose }) {
  const [minLimit, setMinLimit] = useState(product.min_limit);
  const [unitsPerBox, setUnitsPerBox] = useState(product.units_per_box);
  const [imageUrl, setImageUrl] = useState(product.image_url || '');
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadErr(null);
    try {
      const url = await uploadProductImage(product.id, file);
      setImageUrl(url);
    } catch (err) {
      setUploadErr(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    onSave({
      min_limit: Math.max(0, parseInt(minLimit, 10) || 0),
      units_per_box: Math.max(1, parseInt(unitsPerBox, 10) || 1),
      image_url: imageUrl,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>עריכת {product.name}</h3>

        <label className="field">
          <span>מינימום להזמנה</span>
          <input
            type="number"
            inputMode="numeric"
            value={minLimit}
            onChange={(e) => setMinLimit(e.target.value)}
          />
        </label>

        <label className="field">
          <span>יחידות בארגז</span>
          <input
            type="number"
            inputMode="numeric"
            value={unitsPerBox}
            onChange={(e) => setUnitsPerBox(e.target.value)}
          />
        </label>

        <label className="field">
          <span>תמונת מוצר</span>
          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
        </label>
        {uploading && <p className="field-hint">מעלה תמונה…</p>}
        {uploadErr && <p className="field-error">{uploadErr}</p>}
        {imageUrl && (
          <img className="modal__preview" src={imageUrl} alt={product.name} />
        )}

        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            ביטול
          </button>
          <button type="button" className="btn btn--primary" onClick={handleSave} disabled={uploading}>
            שמירה
          </button>
        </div>
      </div>
    </div>
  );
}
