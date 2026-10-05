import { PageHero, ThemedSection } from "@/components/common";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        title="Essence Web Template"
        description="Um template moderno Next.js 15+ com Tailwind CSS v4, tipografia personalizada, design system monocromático e arquitetura escalável."
      />
      <ThemedSection className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <section className="rounded-lg border bg-card p-6">
              <h2 className="font-heading text-2xl tracking-wide uppercase">Stack Tecnológica</h2>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li>Next.js 15+ (App Router)</li>
                <li>React 19</li>
                <li>Tailwind CSS v4</li>
                <li>TypeScript</li>
              </ul>
            </section>
            <section className="rounded-lg border bg-card p-6">
              <h2 className="font-heading text-2xl tracking-wide uppercase">Recursos Inclusos</h2>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li>Design system monocromático (preto/branco)</li>
                <li>Suporte a modo claro/escuro</li>
                <li>Tipografia personalizada (Google Fonts)</li>
                <li>Componentes UI (shadcn/ui)</li>
                <li>Animações com GSAP</li>
                <li>Formulário de contato</li>
                <li>SEO otimizado (sitemap, robots, OG)</li>
              </ul>
            </section>
            <section className="rounded-lg border bg-card p-6">
              <h2 className="font-heading text-2xl tracking-wide uppercase">Estrutura de Pastas</h2>
              <ul className="mt-4 space-y-2 text-muted-foreground font-mono text-sm">
                <li>src/app/(rotas)</li>
                <li>src/components/(ui, layout, sections, common)</li>
                <li>src/data/(dados tipados)</li>
                <li>src/lib/(utilitários, SEO)</li>
                <li>src/hooks/(hooks personalizados)</li>
                <li>src/constants/(rotas, config)</li>
              </ul>
            </section>
          </div>
        </div>
      </ThemedSection>
      <ThemedSection className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="font-heading text-3xl tracking-wide uppercase md:text-4xl">
            Pronto para começar?
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Clone este template, personalize os dados em <code className="font-mono bg-muted px-1.5 rounded">src/data/</code> e 
            <code className="font-mono bg-muted px-1.5 rounded">src/lib/seo.ts</code>, e comece a desenvolver.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 rounded-lg text-sm font-semibold transition"
            >
              Ver no GitHub
            </a>
            <a
              href="/contato"
              className="border-border bg-background hover:bg-muted h-11 px-6 rounded-lg border text-sm font-semibold transition"
            >
              Contato
            </a>
          </div>
        </div>
      </ThemedSection>
    </main>
  );
}