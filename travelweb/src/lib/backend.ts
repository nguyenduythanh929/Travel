// Base URL of the Spring Boot backend, as seen from the browser.
// Set NEXT_PUBLIC_BACKEND_URL at build time to point at another host.
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8088";
