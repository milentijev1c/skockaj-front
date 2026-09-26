/**
 * JSON-LD for crawlers. Rendered as HTML string inside a wrapper so React
 * never sees a <script> element as a client child (avoids hydration warning).
 * Content is in the SSR HTML, which is what search engines read.
 */
export function JsonLd({ data, id }: { data: object; id?: string }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <div
      id={id}
      style={{ display: "contents" }}
      dangerouslySetInnerHTML={{
        __html: `<script type="application/ld+json">${json}</script>`,
      }}
    />
  );
}
