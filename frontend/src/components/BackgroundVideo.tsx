import heroPoster from "../assets/hero.png";

/**
 * Vídeo de fundo do hero.
 * autoPlay + muted + playsInline + loop => reproduz sozinho em todos os
 * navegadores (autoplay só é permitido sem som). O poster (hero.png)
 * aparece instantaneamente enquanto o vídeo carrega, mantendo a página leve.
 */
export default function BackgroundVideo() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0805]">
      <video
        className="h-full w-full object-cover"
        style={{ animation: "bcs-kenburns 30s ease-in-out infinite" }}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={heroPoster}
        aria-hidden
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
