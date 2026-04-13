import multer from "multer";

// simpen di memoeri biar bisa langusng di upload ke Supabase
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // max size file 5mb
  },
});
