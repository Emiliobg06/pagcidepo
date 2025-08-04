import Image from "next/image";

const Logo = () => (
  <div className="w-24 h-24 relative mb-4">
    <Image
      src="/logo.png"
      alt="Logo CIDEPO"
      fill
      style={{ objectFit: "contain" }}
      priority
    />
  </div>
);

export default Logo;