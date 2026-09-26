import type { Metadata } from "next";
import { CATEGORIES, type Component } from "@/lib/types";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://skockaj.rs"
).replace(/\/$/, "");

export const SITE_NAME = "skockaj.rs";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Category landing path with stable slug (for canonical / sitemap / breadcrumbs). */
export function categoryPath(slug: string): string {
  return `/komponente?kategorija=${slug}`;
}

export function categoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function categoryByValue(value: string) {
  return CATEGORIES.find((c) => c.value === value);
}

export function pageMetadata({
  title,
  description,
  path,
  robots,
  noIndex,
}: {
  title: string;
  description: string;
  path: string;
  robots?: Metadata["robots"];
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: robots ?? (noIndex ? { index: false, follow: false } : undefined),
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: "sr_RS",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export function priceRange(c: Component): { low: number; high: number } | null {
  const prices = (c.prices ?? [])
    .filter((p) => p.in_stock && p.price_rsd > 0)
    .map((p) => p.price_rsd);
  if (prices.length === 0) return null;
  return { low: Math.min(...prices), high: Math.max(...prices) };
}

export function formatRsd(n: number): string {
  return `${n.toLocaleString("sr-RS")} RSD`;
}

/** Organization + WebSite (home). */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl("/brand/skockaj-mark-dark.png"),
        sameAs: [
          // fill as social profiles go live
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: "sr-RS",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productJsonLd(c: Component) {
  const range = priceRange(c);
  const offers = (c.prices ?? [])
    .filter((p) => p.in_stock && p.price_rsd > 0)
    .map((p) => ({
      "@type": "Offer",
      price: p.price_rsd,
      priceCurrency: "RSD",
      availability: "https://schema.org/InStock",
      url: p.product_url || absoluteUrl(`/komponente/${c.id}`),
    }));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: c.name,
    sku: String(c.id),
    brand: {
      "@type": "Brand",
      name: c.manufacturer || c.name.split(" ")[0],
    },
    category: categoryByValue(c.category)?.title ?? c.category,
    ...(offers.length > 0
      ? {
          offers:
            offers.length === 1
              ? offers[0]
              : {
                  "@type": "AggregateOffer",
                  priceCurrency: "RSD",
                  lowPrice: range?.low,
                  highPrice: range?.high,
                  offerCount: offers.length,
                  offers,
                },
        }
      : {}),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}
