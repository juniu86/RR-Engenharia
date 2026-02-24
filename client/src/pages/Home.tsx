import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Building2,
  Droplet,
  Fuel,
  Wrench,
  CheckCircle2,
  Zap,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "Orçamento",
    mensagem: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar envio de formulário
    console.log("Form submitted:", formData);
    alert("Mensagem enviada com sucesso!");
    setFormData({ nome: "", email: "", telefone: "", assunto: "Orçamento", mensagem: "" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0963ed] to-[#001c3d] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">RR</span>
            </div>
            <span className="font-bold text-[#001c3d] text-lg">Engenharia</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-[#001c3d]">
            <a href="#inicio" className="hover:text-[#0963ed] transition">Início</a>
            <a href="#sobre" className="hover:text-[#0963ed] transition">Sobre</a>
            <a href="#servicos" className="hover:text-[#0963ed] transition">Serviços</a>
            <a href="#certificacoes" className="hover:text-[#0963ed] transition">Certificações</a>
            <a href="#contato" className="hover:text-[#0963ed] transition">Contato</a>
          </nav>
          <Button className="bg-[#0963ed] hover:bg-[#0752c4] text-white">
            Solicitar Orçamento
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="pt-32 pb-20 bg-gradient-to-br from-[#001c3d] to-[#002863] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
              Infraestrutura Crítica com Precisão Técnica
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              SASC, TEPS e Postos de Combustível. Certificação vigente até 02/02/2029.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button className="bg-[#0963ed] hover:bg-[#0752c4] text-white px-8 py-6 text-lg">
                Solicitar Orçamento <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                Conhecer Serviços
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-20 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-[#001c3d] mb-16" style={{ fontFamily: "Poppins, sans-serif" }}>
            Por Que Escolher a RR Engenharia?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* SASC Card */}
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-[#0963ed]/10 rounded-lg flex items-center justify-center mb-6">
                <Droplet className="w-8 h-8 text-[#0963ed]" />
              </div>
              <h3 className="text-2xl font-bold text-[#001c3d] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
                SASC Certificado
              </h3>
              <p className="text-gray-600 mb-4">
                Instalação e retirada de Sistemas de Armazenamento Subterrâneo de Combustíveis com certificação vigente. Conformidade regulatória e rastreabilidade completa.
              </p>
              <p className="text-sm font-semibold text-[#0963ed]">
                Certificação Vigente: 03/02/2025 a 02/02/2029
              </p>
            </Card>

            {/* TEPS Card */}
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-[#0963ed]/10 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-[#0963ed]" />
              </div>
              <h3 className="text-2xl font-bold text-[#001c3d] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
                Ensaios de Estanqueidade (TEPS)
              </h3>
              <p className="text-gray-600 mb-4">
                Testes certificados de integridade de sistemas subterrâneos. Relatórios técnicos para auditoria e conformidade regulatória.
              </p>
              <p className="text-sm font-semibold text-[#0963ed]">
                Certificação Vigente: 03/02/2025 a 02/02/2029
              </p>
            </Card>

            {/* Postos Card */}
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-[#0963ed]/10 rounded-lg flex items-center justify-center mb-6">
                <Fuel className="w-8 h-8 text-[#0963ed]" />
              </div>
              <h3 className="text-2xl font-bold text-[#001c3d] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
                Especialista em Postos
              </h3>
              <p className="text-gray-600 mb-4">
                Construção, reforma e adequação de postos de abastecimento com governança de custo, prazo e segurança.
              </p>
              <p className="text-sm font-semibold text-[#0963ed]">
                Experiência Comprovada
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#001c3d] mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
                Experiência e Compromisso em Cada Projeto
              </h2>
              <p className="text-gray-600 mb-4 text-lg">
                A RR Engenharia é uma empresa especializada em soluções de engenharia civil, oferecendo serviços de alta qualidade desde a concepção do projeto até a entrega final da obra.
              </p>
              <p className="text-gray-600 mb-8 text-lg">
                Nossa equipe é formada por profissionais qualificados e comprometidos com a excelência, atuando com responsabilidade técnica, cumprimento de prazos e total transparência com nossos clientes.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#0963ed]">+100</p>
                  <p className="text-gray-600 text-sm">Projetos Realizados</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#0963ed]">+10</p>
                  <p className="text-gray-600 text-sm">Anos de Experiência</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#0963ed]">100%</p>
                  <p className="text-gray-600 text-sm">Compromisso</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#001c3d] to-[#002863] rounded-lg h-96 flex items-center justify-center text-white">
              <Building2 className="w-32 h-32 opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-20 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-[#001c3d] mb-16" style={{ fontFamily: "Poppins, sans-serif" }}>
            Soluções Completas em Engenharia
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "Obras e Reformas",
                description: "Execução de obras de ponta a ponta com governança de custo, prazo e segurança.",
              },
              {
                icon: Droplet,
                title: "SASC",
                description: "Serviço certificado de instalação e retirada de sistemas subterrâneos.",
              },
              {
                icon: CheckCircle2,
                title: "TEPS",
                description: "Ensaios de estanqueidade em instalações subterrâneas certificados.",
              },
              {
                icon: Fuel,
                title: "Postos de Combustível",
                description: "Construção, reforma e adequação de postos com especialização em SASC.",
              },
              {
                icon: Wrench,
                title: "Manutenção & Facilities",
                description: "Manutenção estruturada com SLAs e previsibilidade de custo.",
              },
              {
                icon: Zap,
                title: "Automação (RR Engine)",
                description: "Padronização de templates e geração de artefatos com rastreabilidade.",
              },
            ].map((service, idx) => (
              <Card key={idx} className="p-8 border-0 shadow-md hover:shadow-lg transition">
                <service.icon className="w-12 h-12 text-[#0963ed] mb-4" />
                <h3 className="text-xl font-bold text-[#001c3d] mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certificações */}
      <section id="certificacoes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-[#001c3d] mb-16" style={{ fontFamily: "Poppins, sans-serif" }}>
            Certificações e Conformidade
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-2 border-[#0963ed]">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-12 h-12 text-[#0963ed] flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-[#001c3d] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                    SASC Certificado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Certificação CTBC para instalação e retirada de Sistemas de Armazenamento Subterrâneo de Combustíveis.
                  </p>
                  <div className="bg-[#0963ed]/10 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-[#0963ed]">
                      Órgão: CTBC<br />
                      Validade: 03/02/2025 a 02/02/2029<br />
                      Autorização para uso do selo de conformidade
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-2 border-[#0963ed]">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-12 h-12 text-[#0963ed] flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-[#001c3d] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                    TEPS Certificado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Certificação CTBC para ensaios de estanqueidade em instalações subterrâneas.
                  </p>
                  <div className="bg-[#0963ed]/10 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-[#0963ed]">
                      Órgão: CTBC<br />
                      Validade: 03/02/2025 a 02/02/2029<br />
                      Autorização para uso do selo de conformidade
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-20 bg-[#001c3d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ fontFamily: "Poppins, sans-serif" }}>
            Fale Conosco
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Informações */}
            <div className="space-y-8">
              <div className="flex gap-4">
                <Phone className="w-8 h-8 text-[#0963ed] flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Telefone</h3>
                  <p className="text-gray-300">(021) 99574-0273</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="w-8 h-8 text-[#0963ed] flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">E-mail</h3>
                  <p className="text-gray-300">contato@rres.com.br</p>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="w-8 h-8 text-[#0963ed] flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Endereço</h3>
                  <p className="text-gray-300">
                    Av. das Américas, 4200 - Barra da Tijuca<br />
                    Rio de Janeiro - RJ, 22640-907<br />
                    Bloco 8, Sala 106A
                  </p>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Seu nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#0963ed]"
                required
              />
              <input
                type="email"
                placeholder="Seu e-mail"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#0963ed]"
                required
              />
              <input
                type="tel"
                placeholder="Seu telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#0963ed]"
              />
              <select
                value={formData.assunto}
                onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#0963ed]"
              >
                <option value="Orçamento" className="bg-[#001c3d]">Orçamento</option>
                <option value="Informações" className="bg-[#001c3d]">Informações</option>
                <option value="Parceria" className="bg-[#001c3d]">Parceria</option>
                <option value="Outro" className="bg-[#001c3d]">Outro</option>
              </select>
              <textarea
                placeholder="Sua mensagem"
                value={formData.mensagem}
                onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#0963ed] resize-none"
                required
              />
              <Button className="w-full bg-[#0963ed] hover:bg-[#0752c4] text-white py-3">
                Enviar Mensagem
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#000d1a] text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#0963ed] to-[#001c3d] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RR</span>
                </div>
                <span className="font-bold text-white">Engenharia</span>
              </div>
              <p className="text-sm">Sua parceira em obras e instalações.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Navegação</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#inicio" className="hover:text-[#0963ed]">Início</a></li>
                <li><a href="#sobre" className="hover:text-[#0963ed]">Sobre</a></li>
                <li><a href="#servicos" className="hover:text-[#0963ed]">Serviços</a></li>
                <li><a href="#contato" className="hover:text-[#0963ed]">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Serviços</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#0963ed]">SASC</a></li>
                <li><a href="#" className="hover:text-[#0963ed]">TEPS</a></li>
                <li><a href="#" className="hover:text-[#0963ed]">Postos</a></li>
                <li><a href="#" className="hover:text-[#0963ed]">Manutenção</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contato</h4>
              <ul className="space-y-2 text-sm">
                <li>(021) 99574-0273</li>
                <li>contato@rres.com.br</li>
                <li>Rio de Janeiro, RJ</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>&copy; 2026 RR Engenharia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
