import path from "path";
import { fileURLToPath } from "url";
import { emailQueue } from "../queue/emailQueue.js";
import { parseEmailsFromExcel } from "../utils/parseEmailsFromExcel.js";
import {
  HR_APPLICATION_SUBJECT,
  getHrApplicationHtml,
  getHrApplicationText,
} from "../templates/hrApplicationEmail.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESUME_PATH = path.resolve(
  __dirname,
  "../../assets/SHIVAM-MERN_Stack.pdf"
);

export const sendBulkEmail = async (req, res) => {
  try {
    const users = req.body.users;

    console.log("Users", users);

    for (const user of users) {
      await emailQueue.add(
        "sendEmail",
        {
          to: user.email,
          subject: "Welcome Email",
          html: `<h1>Hello ${user.name}</h1>`,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 3000,
          },
        }
      );
    }

    res.json({
      success: true,
      message: "Bulk emails queued successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Upload an Excel/CSV file with HR emails and queue application emails
 * with resume attachment for each unique email.
 *
 * Form field: file (Excel)
 * Optional body: subject (overrides default subject)
 */
export const sendHrBulkEmail = async (req, res) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({
        success: false,
        message: "Please upload an Excel file in the 'file' field",
      });
    }

    const emails = parseEmailsFromExcel(req.file.buffer);

    if (!emails.length) {
      return res.status(400).json({
        success: false,
        message:
          "No valid emails found. Add an 'email' column or put emails in the first sheet.",
      });
    }

    const subject =
      typeof req.body.subject === "string" && req.body.subject.trim()
        ? req.body.subject.trim()
        : HR_APPLICATION_SUBJECT;

    const html = getHrApplicationHtml();
    const text = getHrApplicationText();

    const jobs = emails.map((to) => ({
      name: "sendHrEmail",
      data: {
        to,
        subject,
        html,
        text,
        attachments: [
          {
            filename: "SHIVAM-MERN_Stack.pdf",
            path: RESUME_PATH,
          },
        ],
      },
      opts: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      },
    }));

    await emailQueue.addBulk(jobs);

    return res.json({
      success: true,
      message: "HR application emails queued successfully",
      totalEmails: emails.length,
      emails,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Send HR application email to a single address from JSON body.
 * Body: { "email": "hr@company.com", "subject": "optional" }
 */
export const sendHrSingleEmail = async (req, res) => {
  try {
    const email =
      typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";

    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email in the body: { \"email\": \"hr@company.com\" }",
      });
    }

    const subject =
      typeof req.body.subject === "string" && req.body.subject.trim()
        ? req.body.subject.trim()
        : HR_APPLICATION_SUBJECT;

    await emailQueue.add(
      "sendHrEmail",
      {
        to: email,
        subject,
        html: getHrApplicationHtml(),
        text: getHrApplicationText(),
        attachments: [
          {
            filename: "SHIVAM-MERN_Stack.pdf",
            path: RESUME_PATH,
          },
        ],
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      }
    );

    return res.json({
      success: true,
      message: "HR application email queued successfully",
      email,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
