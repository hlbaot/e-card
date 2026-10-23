import { absoluteUrl, siteConfig } from "@/config/site";
import { getPublicFields, type Employee } from "@/shared/types/employee";
import { websiteUrl } from "@/shared/utils/vcard";
import { ProfilePage } from "@/client/components/card/ProfilePage";

/**
 * Builds JSON-LD structured data (`Person` + `Organization` QTM Media Technology JSC).
 *
 * PRIVACY & SEO NOTE:
 * - All cards are public and indexable.
 * - Sensitive contact fields (`telephone`, `email`, `url`, `workLocation`) are included
 *   in JSON-LD ONLY when both `employee.allowIndexing === true` AND the corresponding
 *   flag in `employee.publicFields` is `true`.
 */
function buildPersonJsonLd(employee: Employee) {
  const pf = getPublicFields(employee);
  const canonicalUrl = absoluteUrl(`/card/${employee.slug}`);
  const orgId = `${siteConfig.url}/#organization`;

  const organizationNode: Record<string, unknown> = {
    "@type": "Organization",
    "@id": orgId,
    name: siteConfig.companyLegalName,
    alternateName: employee.company || siteConfig.companyName,
    url: "https://www.qtmmedia.vn",
    logo: absoluteUrl("/images/brand/qtm.svg"),
  };

  const personNode: Record<string, unknown> = {
    "@type": "Person",
    "@id": `${canonicalUrl}#person`,
    name: employee.fullName,
    jobTitle: employee.position,
    url: canonicalUrl,
    worksFor: {
      "@id": orgId,
    },
  };

  if (employee.avatarUrl) {
    personNode.image = absoluteUrl(employee.avatarUrl);
  }

  // Only include telephone/email/website/offices in JSON-LD when explicitly public:
  if (pf.phone && employee.phone.trim()) {
    personNode.telephone = employee.phone.trim();
  }
  if (pf.email && employee.email.trim()) {
    personNode.email = employee.email.trim();
  }
  if (pf.website && websiteUrl(employee.website)) {
    personNode.sameAs = [websiteUrl(employee.website)];
  }
  if (pf.offices && employee.offices.length > 0) {
    personNode.workLocation = employee.offices
      .filter((o) => o.address.trim())
      .map((o) => ({
        "@type": "Place",
        name: o.label,
        address: {
          "@type": "PostalAddress",
          streetAddress: o.address,
          addressCountry: "VN",
        },
      }));
  }

  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode, personNode],
  };
}

export function CardView({ employee }: { employee: Employee }) {
  const jsonLd = buildPersonJsonLd(employee);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <ProfilePage employee={employee} />
    </>
  );
}
