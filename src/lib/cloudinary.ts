import crypto from "crypto";

type SignParams = Record<string, string | number | undefined>;

export function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const uploadFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || "blog_covers";

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not configured");
  }
  return { cloudName, apiKey, apiSecret, uploadFolder };
}

export function signCloudinaryParams(params: SignParams, apiSecret: string) {
  // Cloudinary requires params sorted lexicographically and joined as key=value&..., excluding undefined
  const toSign = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== "")
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const signature = crypto
    .createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");
  return signature;
}

export function buildUploadUrl(cloudName: string) {
  return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
}


