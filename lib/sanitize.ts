const MAX_ANSWER_LENGTH = 200;

/**
 * Sanitização mínima para o único campo de texto livre do produto (as
 * perguntas do tipo "open"): remove tags HTML (evita XSS se esse texto
 * algum dia for exibido em outro lugar, como um preview de
 * compartilhamento) e garante um limite de tamanho no servidor — o
 * cliente já corta em 40 caracteres, mas nunca confie só na validação do
 * cliente.
 */
export function sanitizeUserText(text: string, maxLength: number = MAX_ANSWER_LENGTH): string {
  const withoutTags = text.replace(/<[^>]*>/g, "");
  const trimmed = withoutTags.trim();
  return trimmed.slice(0, maxLength);
}
