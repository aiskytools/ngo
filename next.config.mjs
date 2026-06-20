/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

// Content-Security-Policy. Allows only the third parties this site actually uses:
//   - Razorpay checkout (script + modal iframe + API calls)
//   - Cloudinary (uploaded images)
//   - Google Maps (contact-page embed)
// 'unsafe-inline' is required for Next.js's hydration/bootstrap inline scripts and
// for injected styles. The CSP is only enforced in production so that `next dev`'s
// HMR (which relies on eval + websockets) keeps working.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self' https://*.razorpay.com",
  "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://*.razorpay.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.razorpay.com",
  "frame-src 'self' https://*.razorpay.com https://www.google.com https://maps.google.com",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  ...(isProd ? [{ key: "Content-Security-Policy", value: csp }] : []),
];

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // X-Powered-By leaks the framework; turn it off.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Keep the admin panel out of search indexes.
        source: "/admin",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
