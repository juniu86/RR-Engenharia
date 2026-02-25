import { ArrowLeft, CheckCircle, FileText, Shield, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Obras() {
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
          <h1 className="text-5xl font-black mb-4">Obras & Infraestrutura Crítica</h1>
          <p className="text-xl text-blue-100 max-w-2xl">Construção, reforma e modernização de postos de combustível com conformidade regulatória total</p>
        </div>
      </section>

      {/* O que é */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold mb-8 text-[#001c3d]">Obras em Infraestrutura Crítica</h2>
          <div className="space-y-6 text-gray-700 text-lg">
            <p>
              Obras em postos de combustível exigem <strong>planejamento executivo rigoroso</strong>, conformidade com múltiplas normas técnicas (ABNT, NR-20, legislação ambiental) e gestão integrada de fornecedores. A RR Engenharia conduz desde o projeto até a entrega final, com documentação auditável e rastreabilidade total.
            </p>
            <p>
              Nossas obras incluem: construção de novos postos, reforma de instalações existentes, modernização de sistemas SASC, ampliação de capacidade e adequação a novas regulamentações ambientais.
            </p>
            <div className="bg-blue-50 border-l-4 border-[#0963ed] p-6 my-8">
              <p className="font-bold text-[#001c3d] mb-2">Normas Aplicáveis</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ ABNT NBR 13786 - Tanques de aço carbono para armazenamento de combustível</li>
                <li>✓ NR-20 - Segurança e Saúde no Trabalho com Inflamáveis e Combustíveis</li>
                <li>✓ ABNT NBR 16280 - Reforma em edificações</li>
                <li>✓ Lei Nº 12.305/2010 - Política Nacional de Resíduos Sólidos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Fases */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold mb-12 text-[#001c3d]">Fases de Execução</h2>
          <div className="space-y-8">
            {[
              { step: 1, title: "Planejamento Executivo", desc: "Análise de viabilidade, cronograma detalhado e orçamento com BDI" },
              { step: 2, title: "Projeto Técnico", desc: "Desenhos executivos, especificações de materiais e plano de segurança" },
              { step: 3, title: "Mobilização", desc: "Contratação de fornecedores, licenças ambientais e preparação do canteiro" },
              { step: 4, title: "Execução", desc: "Obra com acompanhamento diário, relatórios de progresso e controle de qualidade" },
              { step: 5, title: "Testes e Comissionamento", desc: "Ensaios de funcionamento, testes de estanqueidade e validação de sistemas" },
              { step: 6, title: "Entrega e Documentação", desc: "Dossiê completo, manuais operacionais e certificados de conformidade" }
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
          <h2 className="text-4xl font-bold mb-12 text-[#001c3d]">Como a RR Engenharia Entrega Obras no Prazo</h2>
          <div className="space-y-6">
            {[
              { icon: Clock, title: "Cronograma Realista", desc: "Planejamento com buffers de contingência, sem atrasos surpresa" },
              { icon: FileText, title: "Gestão Integrada", desc: "Coordenação de fornecedores, subcontratados e órgãos reguladores" },
              { icon: Shield, title: "Conformidade Total", desc: "Todas as licenças, certificados e documentação pronta para operação" },
              { icon: CheckCircle, title: "Qualidade Garantida", desc: "Inspeções diárias, testes de comissionamento e suporte pós-entrega" }
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
          <h2 className="text-4xl font-bold mb-6">Sua Obra Precisa de Expertise?</h2>
          <p className="text-xl mb-8 text-blue-100">Solicite uma avaliação técnica. Apresentaremos cronograma, orçamento e plano de execução detalhado.</p>
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
