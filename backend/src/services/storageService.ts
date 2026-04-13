import { createClient } from "@supabase/supabase-js";
import { Express } from "express";
import multer from "multer";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const upImageReport = async (
  file: Express.Multer.File,
): Promise<string> => {
  // set nama file harus unique biar ga dupe
  const fileExt = file.originalname.split(".").pop();
  const fileName = `report-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
  const filePath = `reports/${fileName}`;

  const { data, error } = await supabase.storage
    .from("musangking_bucket") // file bucket di supabase (storage)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw new Error(`Upload gagal: ${error.message}`);
  }

  // ambil public url nya dari file yang udah diupload tadi
  const { data: publicUrlData } = supabase.storage
    .from("musangking_bucket")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};
