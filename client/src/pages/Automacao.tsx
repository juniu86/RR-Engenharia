import { ArrowLeft, CheckCircle, FileText, Shield, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Automacao() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-gradient-to-r from-[#001c3d] to-[#002863] shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80">
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/yhvTuDKbGiiZptyN.png" alt="RR Engenharia" className="h-20 w-auto" />
          </Link>
          <button className="bg-[#0963ed] hover:bg-[#0752c4] text-white px-6 py-2 rounded-lg transition">Solicitar Orçamento</button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-r from-[#001c3d] to-[#002863] text-white">
        <div className="container mx-auto px-4">
          <Link href="/" className="flex items-center gap-2 text-blue-200 hover:text-white mb-6">
            <ArrowLeft size={20} />
            Voltar
          </Link>
          <h1 className="text-5xl font-black mb-4">Automação (RR Engine)</h1>
          <p className="text-xl text-blue-100 max-w-2xl">Engenharia em escala com templates, automação e artefatos exportáveis para acelerar propostas</p>
        </div>
      </section>

      {/* O que é */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold mb-8 text-[#001c3d]">RR Engine (BDI.ai)</h2>
          <div className="space-y-6 text-gray-700 text-lg">
            <p>
              <strong>RR Engine</strong> é uma plataforma de automação que transforma orçamentação de engenharia. Usando <strong>templates padronizados, checklists inteligentes e integração com bases de dados técnicas</strong>, aceleramos a geração de propostas em até 70%, reduzindo erro humano e garantindo consistência.
            </p>
            <p>
              A plataforma utiliza <strong>prompt engineering avançado</strong> para gerar documentos técnicos, análises de custo, cronogramas e especificações. Cada artefato é exportável em múltiplos formatos (PDF, Excel, Word) e pronto para apresentação ao cliente.
            </p>
            <div className="bg-blue-50 border-l-4 border-[#0963ed] p-6 my-8">
              <p className="font-bold text-[#001c3d] mb-2">Tecnologias Utilizadas</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ IA Generativa para redação técnica e análise de custo</li>
                <li>✓ Templates parametrizados para SASC, TEPS, Obras e Manutenção</li>
                <li>✓ Integração com bases SINAPI, PINI e históricos internos</li>
                <li>✓ Exportação automática de documentos (PDF, Excel, Word)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold mb-12 text-[#001c3d]">Funcionalidades Principais</h2>
          <div className="space-y-6">
            {[
              { title: "Gerador de Propostas", desc: "Cria propostas técnicas e comerciais em minutos, não em dias" },
              { title: "Análise de Custo Automática", desc: "Calcula BDI, administração local e margem com base em históricos" },
              { title: "Cronograma Inteligente", desc: "Gera cronogramas realistas com dependências e buffers de contingência" },
              { title: "Checklists de Conformidade", desc: "Valida normas ABNT, NR-20 e requisitos reguladores automaticamente" },
              { title: "Biblioteca de Especificações", desc: "Acesso a templates de especificação técnica para todos os serviços" },
              { title: "Relatórios Gerenciais", desc: "Dashboards com histórico de propostas, taxa de conversão e margens" }
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
          <h2 className="text-4xl font-bold mb-12 text-[#001c3d]">Como RR Engine Transforma Seu Negócio</h2>
          <div className="space-y-6">
            {[
              { icon: Clock, title: "Velocidade de Resposta", desc: "Propostas em 24 horas vs. 5-7 dias. Mais leads convertidos." },
              { icon: FileText, title: "Qualidade Consistente", desc: "Todas as propostas seguem padrão técnico e comercial da empresa" },
              { icon: Shield, title: "Menos Erros", desc: "Automação reduz erros de cálculo, omissões e inconsistências" },
              { icon: CheckCircle, title: "Escalabilidade", desc: "Mesmo time gera 3x mais propostas sem aumentar headcount" }
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

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#001c3d] to-[#002863] text-white">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-4xl font-bold mb-6">Quer Automatizar Suas Propostas?</h2>
          <p className="text-xl mb-8 text-blue-100">Solicite uma demonstração do RR Engine. Mostraremos como gerar uma proposta completa em menos de 5 minutos.</p>
          <button className="bg-[#0963ed] hover:bg-[#0752c4] text-white text-lg px-10 py-4 rounded-lg transition">Agendar Demo</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#001c3d] text-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2026 RR Engenharia. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
