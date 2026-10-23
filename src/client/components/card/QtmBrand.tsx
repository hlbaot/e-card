import Image from "next/image";

/** Shared logo lockup for cards, live previews and the public profile. */
export function QtmBrand() {
  return (
    <div className="qtm-card-brand" aria-label="QTM MediaTech">
      <Image
        src="/images/brand/qtm-logo.png"
        width={34}
        height={34}
        alt=""
        unoptimized
      />
      <strong>QTM</strong>
    </div>
  );
}
