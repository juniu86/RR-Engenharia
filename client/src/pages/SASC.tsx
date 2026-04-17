import { ArrowLeft, CheckCircle, FileText, Shield, Clock, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { FAQ_SASC } from "@/lib/seo-config";

export default function SASC() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-gradient-to-r from-[#001c3d] to-[#002863] shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80">
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/yhvTuDKbGiiZptyN.png" alt="RR Engenharia" className="h-20 w-auto" />
          </Link>
          <Link href="/#contato">
            <button className="bg-[#0963ed] hover:bg-[#0752c4] text-white px-6 py-2 rounded-lg transition">Solicitar Orçamento</button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-r from-[#001c3d] to-[#002863] text-white">
        <div className="container mx-auto px-4">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-blue-200">
            <ol className="flex flex-wrap items-center gap-1">
              <li><Link href="/" className="hover:text-white">Início</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} className="inline" /></li>
              <li><Link href="/#servicos" className="hover:text-white">Serviços</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} className="inline" /></li>
              <li aria-current="page" className="text-white">SASC</li>
            </ol>
          </nav>
          <Link href="/" className="flex items-center gap-2 text-blue-200 hover:text-white mb-6">
            <ArrowLeft size={20} />
            Voltar
          </Link>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            SASC — Sistema de Armazenamento Subterrâneo de Combustíveis
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Instalação, inspeção e certificação <strong>INMETRO</strong> de SASC conforme ABNT NBR 13786 e Portaria INMETRO 457/2008. RR Engenharia acreditada até 2029, atendendo todo o Brasil a partir do Rio de Janeiro.
          </p>
        </div>
      </section>

      {/* O que é SASC */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold mb-8 text-[#001c3d]">O que é SASC?</h2>
          <div className="space-y-6 text-gray-700 text-lg">
            <p>
              <strong>SASC</strong> é a sigla para <strong>Sistema de Armazenamento Subterrâneo de Combustíveis</strong> — o conjunto de tanques, tubulações, dispositivos de monitoramento e sistemas de contenção instalados no subsolo de postos de combustível. Todo SASC em operação no Brasil está sujeito à fiscalização da ANP e à certificação pelo INMETRO.
            </p>
            <p>
              A instalação, inspeção periódica e retirada de um SASC só podem ser executadas por <strong>empresas acreditadas pelo INMETRO</strong> como Organismo de Inspeção, em conformidade com ABNT NBR 13786, ABNT NBR 14725 e a Portaria INMETRO 457/2008. A RR Engenharia possui acreditação vigente até <strong>02/02/2029</strong>, garantindo que nossos laudos tenham validade legal perante ANP, órgãos ambientais (INEA, CETESB, FEAM) e seguradoras.
            </p>
            <div className="bg-blue-50 border-l-4 border-[#0963ed] p-6 my-8">
              <p className="font-bold text-[#001c3d] mb-2">Normas Aplicáveis ao SASC</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ ABNT NBR 13786 — Tanques de aço carbono para armazenamento de combustível</li>
                <li>✓ ABNT NBR 13784 — Seleção de métodos para detecção de vazamento</li>
                <li>✓ ABNT NBR 14725 — Ficha de Informação de Segurança (FISPQ)</li>
                <li>✓ Portaria INMETRO 457/2008 — Inspeção de SASC</li>
                <li>✓ Resolução ANP 41/2013 — Regulamentação de postos revendedores</li>
                <li>✓ NR-20 — Segurança com Inflamáveis e Combustíveis</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Processo */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold mb-12 text-[#001c3d]">Processo de Instalação e Certificação SASC</h2>
          <div className="space-y-8">
            {[
              { step: 1, title: "Avaliação Técnica do Local", desc: "Análise do local, dimensionamento de tanques e conformidade com legislação ambiental estadual" },
              { step: 2, title: "Projeto Executivo SASC", desc: "Desenhos técnicos ABNT, especificações de materiais e cronograma de execução" },
              { step: 3, title: "Preparação do Canteiro", desc: "Escavação, drenagem, leito de areia e preparação da base para o SASC" },
              { step: 4, title: "Instalação de Tanques Subterrâneos", desc: "Posicionamento, conexões hidráulicas e primeiros testes de estanqueidade" },
              { step: 5, title: "Ensaio TEPS (Estanqueidade)", desc: "Teste de Estanqueidade de Postos e Sistemas com instrumentação INMETRO" },
              { step: 6, title: "Emissão do Laudo INMETRO", desc: "Dossiê completo, relatórios técnicos e certificado de conformidade" }
            ].map(item => (
              <div key={item.step} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#0963ed] text-white font-bold">
                    {item.step}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#001c3d] mb-2">{item.title}</h3>
                  <p className="text-gray-700">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como RR Ajuda */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold mb-12 text-[#001c3d]">Por que contratar a RR Engenharia para seu SASC</h2>
          <div className="space-y-6">
            {[
              { icon: Clock, title: "Cronograma Otimizado", desc: "Reduzimos prazos em 30% com planejamento executivo e equipes dedicadas ao SASC" },
              { icon: FileText, title: "Dossiê INMETRO Completo", desc: "Documentação pronta para auditoria ANP, com relatórios técnicos detalhados e rastreáveis" },
              { icon: Shield, title: "Conformidade Garantida", desc: "Acreditação INMETRO vigente até 2029 com auditorias regulares e escopo completo de SASC" },
              { icon: CheckCircle, title: "Rastreabilidade Total", desc: "Cada etapa do SASC documentada com fotos, assinaturas e artefatos auditáveis" }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex gap-4 p-6 bg-blue-50 rounded-lg border-l-4 border-[#0963ed]">
                  <Icon className="w-8 h-8 text-[#0963ed] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-[#001c3d] mb-2">{item.title}</h3>
                    <p className="text-gray-700">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50" id="faq">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold mb-12 text-[#001c3d]">Perguntas Frequentes sobre SASC</h2>
          <div className="space-y-4">
            {FAQ_SASC.map((item, idx) => (
              <details key={idx} className="group bg-white rounded-lg border border-gray-200 p-6">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <h3 className="text-lg font-bold text-[#001c3d] pr-4">{item.question}</h3>
                  <ChevronRight className="text-[#0963ed] transition-transform group-open:rotate-90 flex-shrink-0" size={20} />
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold text-[#001c3d] mb-6">Conteúdos relacionados</h2>
          <ul className="grid md:grid-cols-2 gap-4">
            <li><Link href="/teps" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"><strong className="text-[#0963ed]">→ TEPS — Teste de Estanqueidade</strong><p className="text-sm text-gray-700 mt-1">Ensaio obrigatório de estanqueidade em SASC</p></Link></li>
            <li><Link href="/obras" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"><strong className="text-[#0963ed]">→ Obras em Postos de Combustível</strong><p className="text-sm text-gray-700 mt-1">Construção e reforma de postos com SASC</p></Link></li>
            <li><Link href="/blog/o-que-e-sasc" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"><strong className="text-[#0963ed]">→ Guia completo: O que é SASC</strong><p className="text-sm text-gray-700 mt-1">Artigo técnico sobre conformidade SASC</p></Link></li>
            <li><Link href="/manutencao" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"><strong className="text-[#0963ed]">→ Manutenção Preventiva</strong><p className="text-sm text-gray-700 mt-1">PCM com SLA para postos de combustível</p></Link></li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#001c3d] to-[#002863] text-white">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-4xl font-bold mb-6">Pronto para Instalar ou Certificar seu SASC?</h2>
          <p className="text-xl mb-8 text-blue-100">Solicite uma avaliação técnica gratuita. Nossa equipe acreditada INMETRO analisará seu projeto SASC e apresentará cronograma e orçamento realistas.</p>
          <Link href="/#contato">
            <button className="bg-[#0963ed] hover:bg-[#0752c4] text-white text-lg px-10 py-4 rounded-lg transition">Solicitar Orçamento</button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#001c3d] text-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2026 RR Engenharia. Todos os direitos reservados. Acreditação INMETRO vigente até 02/02/2029.</p>
        </div>
      </footer>
    </div>
  );
}
