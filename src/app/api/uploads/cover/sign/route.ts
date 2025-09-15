import { NextRequest } from "next/server";
import { getCloudinaryConfig, signCloudinaryParams } from "@/lib/cloudinary";
import { Policies, Roles } from "@/app/api/auth/roles";
import { requireRole, json } from "@/app/api/auth/withAuth";

export async function POST(req: NextRequest) {
  const auth = await requireRole(Policies.managePosts)(req);
  if (auth instanceof Response) return auth;

  try {
    const { cloudName, apiKey, apiSecret, uploadFolder } = getCloudinaryConfig();

    const { filename } = await req.json().catch(() => ({ filename: undefined }));
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = uploadFolder;

    const unsignedParams = { timestamp, folder }; // nothing else
    const signature = signCloudinaryParams(unsignedParams, apiSecret);

    return json({
      cloudName,
      apiKey,
      timestamp,
      folder,
      signature,
    });
  } catch (err) {
    return json({ error: "Failed to sign upload" }, { status: 500 });
  }
}


