"use client";
import { useRef } from "react";
import { Upload } from "lucide-react";
import { readImageFile } from "../_lib/admin";

// Reusable cover-image picker. `preview` is a freshly selected base64 data URL,
// `existing` is a previously saved image URL. Calls onChange(base64) on pick.
export default function ImageField({ preview, existing, onChange, onError }) {
  const fileRef = useRef(null);

  const handle = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readImageFile(file);
      onChange(dataUrl);
    } catch (err) {
      onError?.(err.message);
      e.target.value = "";
    }
  };

  const shown = preview || existing;
  return (
    <div
      onClick={() => fileRef.current?.click()}
      className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-amber-400 transition-colors mb-4 text-gray-400"
    >
      {shown ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={shown} alt="Selected cover preview" className="max-h-48 mx-auto rounded-xl object-cover" />
      ) : (
        <>
          <Upload size={24} className="mx-auto mb-2" />
          <p className="text-sm">📷 Click to add photo</p>
        </>
      )}
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handle} className="hidden" />
    </div>
  );
}
