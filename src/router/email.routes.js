import express from "express";
import { sendBulkEmail, sendHrBulkEmail } from "../controller/email.controller.js";
import { uploadExcel } from "../middleware/upload.js";

const router = express.Router();

router.post("/bulk-email", sendBulkEmail);

// POST /api/v1/email/hr-bulk
// multipart/form-data: file=<excel>, optional subject=<string>
router.post("/hr-bulk", (req, res, next) => {
  uploadExcel(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    return next();
  });
}, sendHrBulkEmail);

export default router;
