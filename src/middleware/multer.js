import multer from "multer";

export const validExtensions = {
  image: ["image/png", "image/jpg"],
  video: ["video/mp4"],
  pdf: ["applicatin/pdf"],
};

export const multerHost = (customValidation = []) => {
  const storage = multer.diskStorage({});
  const upload = multer({ storage });
  return upload;
};
