import { ArrowLeft, CheckCircle, FileText, Shield, Clock } from "lucide-react";
import { Link } from "wouter";

export default function TEPS() {
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
          <h1 className="text-5xl font-black mb-4">TEPS - Ensaios de Estanqueidade</h1>
          <p className="text-xl text-blue-100 max-w-2xl">Testes de integridade de sistemas subterrâneos com instrumentação de ponta e certificação INMETRO</p>
        </div>
      </section>

      {/* O que é TEPS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold mb-8 text-[#001c3d]">O que é TEPS?</h2>
          <div className="space-y-6 text-gray-700 text-lg">
            <p>
              <strong>TEPS</strong> significa <strong>Teste de Estanqueidade de Postos de Serviço</strong>. Trata-se de ensaios técnicos obrigatórios para verificar a integridade de sistemas de armazenamento subterrâneo de combustível, detectando vazamentos e garantindo conformidade ambiental e de segurança.
            </p>
            <p>
              Segundo a ABNT NBR 13786 e regulamentações INMETRO, todo SASC deve ser submetido a TEPS periodicamente (geralmente a cada 3 anos) ou após manutenção. A RR Engenharia utiliza <strong>instrumentação de ponta</strong> para detectar vazamentos de até 0,1 litro/hora.
            </p>
            <div className="bg-blue-50 border-l-4 border-[#0963ed] p-6 my-8">
              <p className="font-bold text-[#001c3d] mb-2">Normas Aplicáveis</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ ABNT NBR 13786 - Tanques de aço carbono para armazenamento de combustível</li>
                <li>✓ ABNT NBR 13787 - Sistemas de detecção de vazamento para tanques subterrâneos</li>
                <li>✓ EPA Method 30a - Detecção de vazamento em tanques subterrâneos</li>
                <li>✓ Resolução INMETRO Nº 10/2019 - Certificação de TEPS</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Metodologias */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold mb-12 text-[#001c3d]">Metodologias de Ensaio</h2>
          <div className="space-y-8">
            {[
              { title: "Teste Volumétrico", desc: "Medição de variações de volume em períodos controlados para detectar vazamentos" },
              { title: "Teste de Pressão", desc: "Pressurização do sistema para identificar pontos de vazamento" },
              { title: "Teste de Vácuo", desc: "Aplicação de vácuo para detectar fugas em conexões e soldas" },
              { title: "Teste com Traçador", desc: "Uso de gases traçadores para localizar vazamentos precisamente" }
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
          <h2 className="text-4xl font-bold mb-12 text-[#001c3d]">Como a RR Engenharia Garante Conformidade em TEPS</h2>
          <div className="space-y-6">
            {[
              { icon: Clock, title: "Agendamento Rápido", desc: "Disponibilidade para testes em até 48 horas, sem interrupção operacional" },
              { icon: FileText, title: "Relatório Detalhado", desc: "Documentação técnica com gráficos, análises e recomendações" },
              { icon: Shield, title: "Certificação INMETRO", desc: "Laudos reconhecidos por órgãos ambientais e auditores" },
              { icon: CheckCircle, title: "Suporte Pós-Teste", desc: "Orientação sobre manutenção preventiva e próximos ensaios" }
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
          <h2 className="text-4xl font-bold mb-6">Seu SASC Precisa de TEPS?</h2>
          <p className="text-xl mb-8 text-blue-100">Agende um ensaio com nossa equipe certificada. Garantimos conformidade regulatória e documentação pronta para auditoria.</p>
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
