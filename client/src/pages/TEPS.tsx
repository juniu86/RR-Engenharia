import { ArrowLeft, CheckCircle, FileText, Shield, Clock, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { FAQ_TEPS } from "@/lib/seo-config";

export default function TEPS() {
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
              <li aria-current="page" className="text-white">TEPS</li>
            </ol>
          </nav>
          <Link href="/" className="flex items-center gap-2 text-blue-200 hover:text-white mb-6">
            <ArrowLeft size={20} />
            Voltar
          </Link>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            TEPS — Teste de Estanqueidade de Postos e Sistemas
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Ensaio INMETRO obrigatório para detectar vazamentos em SASC. Laudo com validade nacional conforme ABNT NBR 13784 e Portaria INMETRO 457/2008. RR Engenharia acreditada até 2029.
          </p>
        </div>
      </section>

      {/* O que é TEPS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold mb-8 text-[#001c3d]">O que é TEPS?</h2>
          <div className="space-y-6 text-gray-700 text-lg">
            <p>
              <strong>TEPS</strong> é a sigla para <strong>Teste de Estanqueidade de Postos e Sistemas</strong> — um ensaio técnico obrigatório que verifica a integridade de tanques e tubulações do SASC (Sistema de Armazenamento Subterrâneo de Combustíveis), detectando vazamentos com sensibilidade de até 0,1 litro por hora.
            </p>
            <p>
              Segundo a ABNT NBR 13784 e as regulamentações INMETRO, todo SASC em operação deve ser submetido a TEPS periodicamente — tipicamente a cada 3 anos, ou após qualquer intervenção no sistema. A RR Engenharia, acreditada pelo INMETRO como Organismo de Inspeção até <strong>02/02/2029</strong>, emite laudos TEPS reconhecidos por ANP, órgãos ambientais (INEA, CETESB, FEAM) e seguradoras em todo o Brasil.
            </p>
            <div className="bg-blue-50 border-l-4 border-[#0963ed] p-6 my-8">
              <p className="font-bold text-[#001c3d] mb-2">Normas Aplicáveis ao TEPS</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ ABNT NBR 13784 — Seleção de métodos para detecção de vazamento em SASC</li>
                <li>✓ ABNT NBR 13785 — Ensaio de estanqueidade em tubulações de SASC</li>
                <li>✓ ABNT NBR 13786 — Tanques de aço carbono</li>
                <li>✓ Portaria INMETRO 457/2008 — Inspeção de SASC e TEPS</li>
                <li>✓ Resolução ANP 41/2013 — Postos revendedores</li>
                <li>✓ EPA Method 30a — Referência internacional de detecção de vazamento</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Metodologias */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold mb-12 text-[#001c3d]">Metodologias de Ensaio TEPS</h2>
          <div className="space-y-8">
            {[
              { title: "Teste Volumétrico", desc: "Medição de variações de volume em períodos controlados para detectar vazamentos de até 0,1 L/h no SASC" },
              { title: "Teste de Pressão Positiva", desc: "Pressurização do sistema para identificar pontos de vazamento em tubulações e conexões" },
              { title: "Teste de Vácuo", desc: "Aplicação de vácuo para detectar fugas em juntas, soldas e pontos de conexão" },
              { title: "Teste com Traçador", desc: "Uso de gases traçadores para localização precisa de vazamentos subterrâneos" }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 p-6 bg-white rounded-lg border-l-4 border-[#0963ed]">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#0963ed] text-white font-bold">
                    {idx + 1}
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
          <h2 className="text-4xl font-bold mb-12 text-[#001c3d]">Por que contratar a RR Engenharia para TEPS</h2>
          <div className="space-y-6">
            {[
              { icon: Clock, title: "Agendamento Rápido", desc: "TEPS executado em até 48 horas, com planejamento para minimizar impacto operacional do posto" },
              { icon: FileText, title: "Laudo INMETRO Detalhado", desc: "Relatório técnico TEPS com gráficos de pressão/vácuo, análises e recomendações de manutenção" },
              { icon: Shield, title: "Acreditação INMETRO", desc: "Laudos TEPS com validade nacional, reconhecidos por ANP, IBAMA, INEA, CETESB e seguradoras" },
              { icon: CheckCircle, title: "Suporte Pós-Ensaio", desc: "Orientação sobre manutenção preventiva, próximos ensaios e retificação de não conformidades" }
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
          <h2 className="text-4xl font-bold mb-12 text-[#001c3d]">Perguntas Frequentes sobre TEPS</h2>
          <div className="space-y-4">
            {FAQ_TEPS.map((item, idx) => (
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
            <li><Link href="/sasc" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"><strong className="text-[#0963ed]">→ SASC — Sistema de Armazenamento Subterrâneo</strong><p className="text-sm text-gray-700 mt-1">Instalação e certificação INMETRO de SASC</p></Link></li>
            <li><Link href="/blog/teps-ensaios-estanqueidade" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"><strong className="text-[#0963ed]">→ Artigo: TEPS Ensaios Obrigatórios</strong><p className="text-sm text-gray-700 mt-1">Guia técnico de ensaios TEPS</p></Link></li>
            <li><Link href="/manutencao" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"><strong className="text-[#0963ed]">→ Manutenção Preventiva</strong><p className="text-sm text-gray-700 mt-1">PCM com SLA para postos de combustível</p></Link></li>
            <li><Link href="/obras" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"><strong className="text-[#0963ed]">→ Obras em Postos</strong><p className="text-sm text-gray-700 mt-1">Construção e reforma com conformidade ABNT</p></Link></li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#001c3d] to-[#002863] text-white">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-4xl font-bold mb-6">Seu SASC Precisa de TEPS Certificado INMETRO?</h2>
          <p className="text-xl mb-8 text-blue-100">Agende um ensaio TEPS com nossa equipe acreditada. Garantimos conformidade regulatória e laudo pronto para auditoria em até 10 dias úteis.</p>
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
