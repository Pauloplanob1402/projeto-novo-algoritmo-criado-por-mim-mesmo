import { Logo } from "@/components/Logo";

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="flex flex-col items-center text-center w-full my-auto pt-8">
      <div className="mb-[34px] drop-shadow-[0_10px_30px_rgba(139,107,255,0.35)]">
        <Logo size={64} gradientId="unsay-intro" />
      </div>

      <h1 className="font-serif font-normal text-[clamp(30px,8.2vw,40px)] leading-[1.18] tracking-tight mb-[18px] max-w-[320px]">
        Você <em className="font-semibold italic unsay-gradient-text">não</em> sabe tudo sobre
        você.
      </h1>
      <p className="text-text-dim text-[15.5px] leading-[1.55] max-w-[280px] mb-[42px]">
        Responda algumas perguntas. Talvez descubra algo inesperado.
      </p>

      <button
        type="button"
        onClick={onStart}
        className="unsay-gradient text-bg font-bold text-[15px] tracking-wide rounded-full py-[17px] px-[30px] max-w-[220px] w-full shadow-[0_14px_30px_-8px_rgba(196,90,190,0.55)] active:scale-[0.97] transition-transform"
      >
        COMEÇAR
      </button>
    </div>
  );
}
