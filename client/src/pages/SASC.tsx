import { ArrowLeft, CheckCircle, FileText, Shield, Clock } from "lucide-react";
import { Link } from "wouter";

export default function SASC() {
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
          <h1 className="text-5xl font-black mb-4">SASC Certificado</h1>
          <p className="text-xl text-blue-100 max-w-2xl">Sistema de Armazenamento Subterrâneo de Combustível com conformidade INMETRO e precisão técnica absoluta</p>
        </div>
      </section>

      {/* O que é SASC */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold mb-8 text-[#001c3d]">O que é SASC?</h2>
          <div className="space-y-6 text-gray-700 text-lg">
            <p>
              <strong>SASC</strong> é a sigla para <strong>Sistema de Armazenamento Subterrâneo de Combustível</strong>. Trata-se da instalação de tanques subterrâneos em postos de combustível, com conformidade obrigatória às normas técnicas brasileiras (ABNT NBR 13786, ABNT NBR 14725) e regulamentações INMETRO.
            </p>
            <p>
              Todo SASC deve ser instalado, inspecionado e retirado por empresas <strong>certificadas INMETRO</strong>. A RR Engenharia é autorizada para executar essas operações, garantindo documentação completa, rastreabilidade e conformidade regulatória.
            </p>
            <div className="bg-blue-50 border-l-4 border-[#0963ed] p-6 my-8">
              <p className="font-bold text-[#001c3d] mb-2">Normas Aplicáveis</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ ABNT NBR 13786 - Tanques de aço carbono para armazenamento de combustível</li>
                <li>✓ ABNT NBR 14725 - Ficha de Informação de Segurança de Produto Químico</li>
                <li>✓ NR-20 - Segurança e Saúde no Trabalho com Inflamáveis e Combustíveis</li>
                <li>✓ Resolução INMETRO Nº 10/2019 - Certificação de SASC</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Processo */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold mb-12 text-[#001c3d]">Processo de Instalação SASC</h2>
          <div className="space-y-8">
            {[
              { step: 1, title: "Avaliação Técnica", desc: "Análise do local, dimensionamento de tanques e conformidade com legislação ambiental" },
              { step: 2, title: "Projeto Executivo", desc: "Desenhos técnicos, especificações de materiais e cronograma de execução" },
              { step: 3, title: "Preparação do Canteiro", desc: "Escavação, drenagem e preparação da base para instalação" },
              { step: 4, title: "Instalação de Tanques", desc: "Posicionamento, conexões e testes de estanqueidade inicial" },
              { step: 5, title: "Testes de Estanqueidade (TEPS)", desc: "Ensaios com instrumentação de ponta para garantir integridade" },
              { step: 6, title: "Documentação e Certificação", desc: "Relatórios técnicos, dossiê completo e certificado INMETRO" }
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
          <h2 className="text-4xl font-bold mb-12 text-[#001c3d]">Como a RR Engenharia Acelera Seu SASC</h2>
          <div className="space-y-6">
            {[
              { icon: Clock, title: "Cronograma Otimizado", desc: "Reduzimos prazos em 30% com planejamento executivo e equipes dedicadas" },
              { icon: FileText, title: "Dossiê Completo", desc: "Documentação pronta para auditoria, com relatórios técnicos detalhados" },
              { icon: Shield, title: "Conformidade Garantida", desc: "Certificação INMETRO vigente até 2029 com auditorias regulares" },
              { icon: CheckCircle, title: "Rastreabilidade Total", desc: "Cada etapa documentada com fotos, assinaturas e artefatos auditáveis" }
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
          <h2 className="text-4xl font-bold mb-6">Pronto para Instalar seu SASC?</h2>
          <p className="text-xl mb-8 text-blue-100">Solicite uma avaliação técnica gratuita. Nossa equipe analisará seu projeto e apresentará um cronograma realista.</p>
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
