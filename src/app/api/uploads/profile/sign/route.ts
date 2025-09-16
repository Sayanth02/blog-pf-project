import React from 'react'
import { NextRequest} from 'next/server'
import { getCloudinaryConfig, signCloudinaryParams} from '@/lib/cloudinary' 
import { json } from "@/app/api/auth/withAuth";


export async function POST(request: NextRequest) {
 try {
   const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
   const timestamp = Math.floor(Date.now() / 1000);

  const paramsToSign = {
    timestamp,
    folder: "profile_pictures",
  };
  const signature = signCloudinaryParams(paramsToSign, apiSecret);

  return json({
    cloudName,
    apiKey,
    timestamp,
    folder: "profile_pictures",
    signature,
  });


 } catch (error) {
     return json({ error: "Failed to sign upload" }, { status: 500 });
 }
}