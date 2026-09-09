import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade",
};

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-[620px] min-h-dvh mx-auto px-6 py-14 text-text">
      <Link href="/" className="text-text-dim text-sm mb-10 inline-block">
        ← Voltar ao UNSAY
      </Link>

      <h1 className="font-serif text-3xl mb-2">Política de Privacidade</h1>
      <p className="text-text-faint text-sm mb-10">Última atualização: setembro de 2026.</p>

      <div className="space-y-8 text-[15px] leading-[1.7] text-text-dim">
        <section>
          <h2 className="font-serif text-xl text-text mb-2">1. O que coletamos</h2>
          <p>
            Quando você responde uma pergunta no UNSAY, guardamos a resposta em si, a categoria da
            pergunta e um horário. A partir das respostas, calculamos um vetor de perfil (ex.:
            liberdade, segurança, dinheiro) usado só para gerar as descobertas mostradas dentro do
            próprio app. Se você criar conta, guardamos também seu e-mail (ou os dados básicos da
            sua conta Google, se escolher esse login). Se você não criar conta, usamos um
            identificador anônimo gerado automaticamente pelo Supabase Auth.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-text mb-2">2. Como usamos seus dados</h2>
          <p>
            Suas respostas e seu vetor de perfil são usados para: mostrar comparações estatísticas
            agregadas e anônimas com outras pessoas; detectar possíveis padrões e contradições nas
            suas próprias respostas; e gerar as descobertas em linguagem natural (algumas dessas
            descobertas são geradas por um modelo de IA de terceiros — ver seção 4). Nunca vendemos
            respostas individuais, e nunca exibimos a resposta de uma pessoa para outra, exceto a
            resposta específica que você escolhe compartilhar através de um link de convite.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-text mb-2">3. Compartilhamento entre usuários</h2>
          <p>
            Ao usar o botão de compartilhar em uma pergunta, sua resposta a essa pergunta específica
            é anexada ao link gerado, para que quem abrir o link veja como você respondeu. Isso é
            uma ação explícita sua a cada compartilhamento — nenhuma outra resposta sua é incluída.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-text mb-2">4. Terceiros envolvidos</h2>
          <p>
            Usamos o <strong className="text-text">Supabase</strong> como banco de dados e provedor
            de autenticação, e a <strong className="text-text">API do Gemini (Google)</strong> para
            gerar o texto de algumas descobertas — nesses casos, enviamos ao Gemini um resumo
            estruturado do seu perfil (pontuações agregadas, não as respostas literais) e as
            categorias das últimas respostas, nunca seu e-mail ou identificação direta. Se você fizer
            login com Google, a autenticação em si passa pelos servidores do Google/Supabase.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-text mb-2">5. Seus direitos</h2>
          <p>
            Você pode excluir sua conta e todos os dados associados a qualquer momento, direto no
            app: abra o painel de perfil (ícone no topo da tela) e toque em &ldquo;Excluir conta e
            todos os dados&rdquo;. A exclusão é imediata e definitiva — remove suas respostas,
            perfil, descobertas, contradições e compartilhamentos.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-text mb-2">6. Cookies e armazenamento local</h2>
          <p>
            Usamos apenas o armazenamento local necessário para manter você conectado (sessão do
            Supabase Auth). Não usamos cookies de rastreamento publicitário. Usamos o Vercel
            Analytics para métricas agregadas de uso (páginas visitadas, performance), sem
            identificar pessoas individualmente.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-text mb-2">7. Contato</h2>
          <p>Dúvidas sobre esta política podem ser enviadas para o e-mail de suporte do produto.</p>
        </section>

        <p className="text-text-faint text-[13px] pt-6 border-t border-border">
        </p>
      </div>
    </div>
  );
}
