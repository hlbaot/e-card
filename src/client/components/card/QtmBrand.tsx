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


export function CyberSecurityBrand() {
  return (
    <div className="qtm-card-brand anm-card-brand" aria-label="An ninh mạng Việt Nam">
      <Image src="/logo_anninhmang.png" width={1191} height={1320}
        alt="Logo An ninh mạng Việt Nam" unoptimized />
      <div className="anm-brand-copy">
        <strong>AN NINH MẠNG VIỆT NAM</strong>
        <small>VIETNAM CYBER SECURITY MAGAZINE</small>
      </div>
    </div>
  );
}
