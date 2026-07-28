import multer from "multer";

const storage = multer.memoryStorage();

export const uploadExcel = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
      "application/csv",
    ];

    const isExcelExt = /\.(xlsx|xls|csv)$/i.test(file.originalname);

    if (allowed.includes(file.mimetype) || isExcelExt) {
      cb(null, true);
      return;
    }

    cb(new Error("Only Excel (.xlsx, .xls) or CSV files are allowed"));
  },
}).single("file");
