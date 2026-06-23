import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "enquiry" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default function EnquiryLayout({ children }) {
  return children;
}
