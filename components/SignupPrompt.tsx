import { AccountActions } from "@/components/AccountActions";

interface SignupPromptProps {
  onSkip: () => void;
}

export function SignupPrompt({ onSkip }: SignupPromptProps) {
  return (
    <div className="flex flex-col items-center text-center w-full my-auto pt-2">
      <div className="w-[52px] h-[52px] rounded-full unsay-gradient-soft border border-border-hi flex items-center justify-center mb-6">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F0529C" strokeWidth="1.8">
          <path d="M12 2l2.9 6.3L22 9.3l-5 4.9 1.2 7-6.2-3.3-6.2 3.3 1.2-7-5-4.9 7.1-1z" />
        </svg>
      </div>
      <h2 className="font-serif font-medium text-[23px] leading-[1.35] mb-3">
        Você já respondeu o suficiente para descobrirmos algo sobre você.
      </h2>
      <p className="text-text-dim text-[15.5px] leading-[1.55] max-w-[300px] mb-0">
        Crie sua conta para salvar suas descobertas e continuar de onde parou.
      </p>

      <div className="flex flex-col gap-2.5 w-full mt-8">
        <AccountActions />
        <button
          type="button"
          onClick={onSkip}
          className="text-text-faint text-[13.5px] font-semibold py-2.5 bg-transparent border-none"
        >
          Continuar sem conta
        </button>
      </div>
    </div>
  );
}
