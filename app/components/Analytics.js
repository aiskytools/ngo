"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { GA_ID } from "@/lib/site";
import { trackPageview } from "@/lib/analytics";

// Google Analytics 4. Renders nothing (and loads no script) unless NEXT_PUBLIC_GA_ID
// is configured. Manual page_view on route change handles client-side navigation.
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (GA_ID) trackPageview(pathname);
  }, [pathname]);

  if (!GA_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA_ID}', { send_page_view: false });`}
      </Script>
    </>
  );
}
