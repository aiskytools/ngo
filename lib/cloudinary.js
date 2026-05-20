import { v2 as cloudinary } from "cloudinary";

const FOLDER = process.env.CLOUDINARY_FOLDER || "ngo_website";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(base64Data) {
  try {
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: FOLDER,
      transformation: [{ width: 1200, height: 800, crop: "limit", quality: "auto" }],
    });
    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Image upload failed");
  }
}

// Throws on failure. Callers decide whether to surface the error to the client
// (DELETE) or swallow + log it (UPDATE replacing an old image).
export async function deleteImage(publicId) {
  if (typeof publicId !== "string" || !publicId.startsWith(`${FOLDER}/`)) {
    throw new Error(`Refusing to delete publicId outside folder "${FOLDER}/"`);
  }
  const result = await cloudinary.uploader.destroy(publicId);
  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(`Cloudinary delete failed: ${result.result}`);
  }
  return result;
}

export default cloudinary;
