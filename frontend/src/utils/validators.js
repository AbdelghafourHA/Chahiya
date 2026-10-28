// client/src/utils/validators.js

// Algerian mobile: 05/06/07 + 8 digits, allow spaces
export const isValidAlgerianPhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\s+/g, "");
  return /^0[5-7]\d{8}$/.test(cleaned);
};

// Format 0550000000 -> 0550 00 00 00
export const formatPhone = (phone) => {
  const cleaned = (phone || "").replace(/\D/g, "").slice(0, 10);
  if (cleaned.length <= 4) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  if (cleaned.length <= 8)
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(
    6,
    8
  )} ${cleaned.slice(8)}`;
};

// Google Maps link — accepts maps.google.com, goo.gl/maps, maps.app.goo.gl
export const isValidMapsLink = (link) => {
  if (!link) return true; // optional
  const trimmed = link.trim();
  if (!/^https?:\/\//i.test(trimmed)) return false;
  return /(google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(
    trimmed
  );
};

// Text field: at least n chars
export const isLongEnough = (value, n = 5) => (value || "").trim().length >= n;
