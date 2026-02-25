import { ArrowLeft, CheckCircle, FileText, Shield, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Manutencao() {
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
          <h1 className="text-5xl font-black mb-4">Manutenção & Facilities</h1>
          <p className="text-xl text-blue-100 max-w-2xl">Manutenção previsível com SLA, PCM e relatórios gerenciais para reduzir custos operacionais</p>
        </div>
      </section>

      {/* O que é */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold mb-8 text-[#001c3d]">Manutenção Previsível em Infraestrutura</h2>
          <div className="space-y-6 text-gray-700 text-lg">
            <p>
              Manutenção em postos de combustível não é reativa—é <strong>planejada e previsível</strong>. A RR Engenharia implementa <strong>PCM (Plano de Manutenção Preventiva)</strong> com SLA (Service Level Agreement), reduzindo downtime, custos de emergência e garantindo conformidade regulatória contínua.
            </p>
            <p>
              Nossas atividades incluem: inspeção periódica de SASC, manutenção de bombas e sistemas de abastecimento, limpeza de tanques, calibração de equipamentos e atualização de sistemas de segurança.
            </p>
            <div className="bg-blue-50 border-l-4 border-[#0963ed] p-6 my-8">
              <p className="font-bold text-[#001c3d] mb-2">Normas Aplicáveis</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ ABNT NBR 13786 - Manutenção de tanques subterrâneos</li>
                <li>✓ NR-20 - Segurança em trabalhos com combustível</li>
                <li>✓ ABNT NBR 5410 - Instalações elétricas em baixa tensão</li>
                <li>✓ Legislação ambiental estadual e municipal</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold mb-12 text-[#001c3d]">Serviços de Manutenção</h2>
          <div className="space-y-6">
            {[
              { title: "Inspeção Periódica de SASC", desc: "Verificação visual, testes de vazamento e documentação de conformidade" },
              { title: "Manutenção de Bombas", desc: "Limpeza, calibração e substituição de componentes desgastados" },
              { title: "Limpeza de Tanques", desc: "Remoção de sedimentos, resíduos e contaminantes com segurança total" },
              { title: "Atualização de Sistemas", desc: "Upgrade de equipamentos obsoletos e implementação de novas tecnologias" },
              { title: "Relatórios Gerenciais", desc: "Dashboards com histórico de manutenção, custos e recomendações" },
              { title: "Suporte 24/7", desc: "Atendimento de emergência para falhas críticas com SLA garantido" }
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
          <h2 className="text-4xl font-bold mb-12 text-[#001c3d]">Como a RR Reduz Custos de Manutenção</h2>
          <div className="space-y-6">
            {[
              { icon: Clock, title: "Planejamento Preventivo", desc: "Redução de 40% em custos de emergência com manutenção planejada" },
              { icon: FileText, title: "Relatórios Detalhados", desc: "Visibilidade total de custos, histórico e tendências de falha" },
              { icon: Shield, title: "SLA Garantido", desc: "Tempo de resposta máximo e compensação por descumprimento" },
              { icon: CheckCircle, title: "Conformidade Contínua", desc: "Documentação sempre atualizada para auditorias e reguladores" }
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
          <h2 className="text-4xl font-bold mb-6">Sua Manutenção Está Fora de Controle?</h2>
          <p className="text-xl mb-8 text-blue-100">Solicite uma auditoria de manutenção gratuita. Apresentaremos um plano PCM customizado com SLA e estimativa de economia.</p>
          <button className="bg-[#0963ed] hover:bg-[#0752c4] text-white text-lg px-10 py-4 rounded-lg transition">Solicitar Orçamento</button>
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
