/** True on Vercel previews and in local dev; false in production builds. */
export const SHOW_PLACEHOLDERS =
  process.env.VERCEL_ENV === "preview" ||
  process.env.NODE_ENV === "development";
