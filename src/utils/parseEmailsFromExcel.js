import XLSX from "xlsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMAIL_HEADER_CANDIDATES = [
  "email",
  "emails",
  "email id",
  "emailid",
  "hr email",
  "hremail",
  "mail",
  "e-mail",
];

const normalizeHeader = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

const isValidEmail = (value) => EMAIL_REGEX.test(String(value).trim().toLowerCase());

/**
 * Reads an Excel buffer and returns unique valid email addresses.
 * Prefers a column named email (or similar); otherwise scans all cells.
 */
export const parseEmailsFromExcel = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    return [];
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  if (!rows.length) {
    return [];
  }

  const headers = Object.keys(rows[0]);
  const emailHeader = headers.find((header) =>
    EMAIL_HEADER_CANDIDATES.includes(normalizeHeader(header))
  );

  const emails = new Set();

  if (emailHeader) {
    for (const row of rows) {
      const value = String(row[emailHeader] ?? "").trim().toLowerCase();
      if (isValidEmail(value)) {
        emails.add(value);
      }
    }
  } else {
    for (const row of rows) {
      for (const value of Object.values(row)) {
        const email = String(value ?? "").trim().toLowerCase();
        if (isValidEmail(email)) {
          emails.add(email);
        }
      }
    }
  }

  return [...emails];
};
