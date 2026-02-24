import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X, MessageCircle, Award, Users, TrendingUp, Zap, Wrench, Settings, BarChart3 } from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [counters, setCounters] = useState({ projects: 0, clients: 0, years: 0 });

  // Animate counters
  useEffect(() => {
    const interval = setInterval(() => {
      setCounters(prev => ({
        projects: Math.min(prev.projects + 3, 150),
        clients: Math.min(prev.clients + 1, 50),
        years: Math.min(prev.years + 0.2, 15)
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      title: "Obras & Infraestrutura Crítica",
      description: "Planejamento executivo, gestão de fornecedores e dossiê de entrega para postos, hangares e obras complexas.",
      icon: TrendingUp,
      color: "border-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      title: "SASC Certificado",
      description: "Sistema de Abastecimento Subterrâneo de Combustível com precisão técnica e conformidade regulatória.",
      icon: Award,
      color: "border-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "TEPS - Ensaios de Estanqueidade",
      description: "Testes de estanqueidade com instrumentação de ponta para garantir integridade de sistemas.",
      icon: Zap,
      color: "border-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Manutenção & Facilities",
      description: "Manutenção previsível e auditável com PCM, SLAs e relatórios gerenciais para reduzir custos.",
      icon: Wrench,
      color: "border-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      title: "Automação (RR Engine)",
      description: "Engenharia em escala com templates padronizados, checklists e artefatos exportáveis.",
      icon: Settings,
      color: "border-pink-500",
      bgColor: "bg-pink-50"
    }
  ];

  const differentials = [
    {
      title: "Experiência Comprovada",
      description: "Mais de 15 anos em infraestrutura crítica com 150+ projetos entregues",
      icon: Users
    },
    {
      title: "Certificações Vigentes",
      description: "CTBC, ISO e demais normas até 2029 com auditorias regulares",
      icon: Award
    },
    {
      title: "Tecnologia & Automação",
      description: "RR Engine (BDI.ai) para acelerar propostas e reduzir erro humano",
      icon: BarChart3
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-gradient-to-r from-[#001c3d] to-[#002863] shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/yhvTuDKbGiiZptyN.png" alt="RR Engenharia" className="h-20 w-auto" />
          </div>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#inicio" className="text-white hover:text-[#0963ed] transition">Início</a>
            <a href="#servicos" className="text-white hover:text-[#0963ed] transition">Serviços</a>
            <a href="#certificacoes" className="text-white hover:text-[#0963ed] transition">Certificações</a>
            <a href="#sobre" className="text-white hover:text-[#0963ed] transition">Sobre</a>
            <a href="#contato" className="text-white hover:text-[#0963ed] transition">Contato</a>
            <Button className="bg-[#0963ed] hover:bg-[#0752c4] text-white">Solicitar Orçamento</Button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden bg-[#0D1F3C] border-t border-gray-700 p-4 flex flex-col gap-4">
            <a href="#inicio" className="text-white hover:text-[#0963ed]">Início</a>
            <a href="#servicos" className="text-white hover:text-[#0963ed]">Serviços</a>
            <a href="#certificacoes" className="text-white hover:text-[#0963ed]">Certificações</a>
            <a href="#sobre" className="text-white hover:text-[#0963ed]">Sobre</a>
            <a href="#contato" className="text-white hover:text-[#0963ed]">Contato</a>
            <Button className="bg-[#0963ed] hover:bg-[#0752c4] text-white w-full">Solicitar Orçamento</Button>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section id="inicio" className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/bDafTWxDICGsSZPQ.png" 
            alt="Infraestrutura RR Engenharia" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001c3d]/85 to-[#001c3d]/65"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-white flex items-center justify-center min-h-[600px]">
          <div className="text-center max-w-3xl">
            <h1 className="text-6xl md:text-7xl font-black mb-2 leading-tight">RR Engenharia</h1>
            <h2 className="text-3xl md:text-4xl font-medium mb-6 text-blue-200">Engenharia de Infraestrutura Critica</h2>
            <p className="text-lg md:text-xl mb-8 text-gray-100">Obras · Manutencao & Facilities · SASC · TEPS · Automacao</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button className="bg-[#0963ed] hover:bg-[#0752c4] text-white text-lg px-8 py-6">Solicitar Orçamento</Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">Saiba Mais</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#001c3d]">Por Que Escolher a RR Engenharia</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {differentials.map((diff, idx) => {
              const Icon = diff.icon;
              return (
                <div key={idx} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
                  <Icon className="w-12 h-12 text-[#0963ed] mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-[#001c3d]">{diff.title}</h3>
                  <p className="text-gray-600">{diff.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-[#001c3d]">Nossas Verticais de Serviço</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Soluções completas em engenharia de infraestrutura com foco em qualidade, conformidade e inovação</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div key={idx} className={`${service.bgColor} border-l-4 ${service.color} p-8 rounded-lg hover:shadow-lg transition transform hover:-translate-y-1`}>
                  <Icon className="w-10 h-10 text-[#001c3d] mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-[#001c3d]">{service.title}</h3>
                  <p className="text-gray-700">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certificações */}
      <section id="certificacoes" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#001c3d]">Certificacoes INMETRO</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-lg text-center shadow-md border-t-4 border-[#0963ed]">
              <Award className="w-16 h-16 text-[#0963ed] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2 text-[#001c3d]">INMETRO SASC</h3>
              <p className="text-gray-600 mb-2">Sistema de Abastecimento Subterrâneo de Combustíveis</p>
              <p className="text-[#0963ed] font-semibold">Certificado: CTBC-SASC-001-2025</p>
              <p className="text-gray-700 mt-2">Vigente até 02/02/2029</p>
            </div>
            <div className="bg-white p-8 rounded-lg text-center shadow-md border-t-4 border-[#0963ed]">
              <Award className="w-16 h-16 text-[#0963ed] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2 text-[#001c3d]">INMETRO TEPS</h3>
              <p className="text-gray-600 mb-2">Ensaio de Estanqueidade em Instalações Subterrâneas</p>
              <p className="text-[#0963ed] font-semibold">Certificado: CTBC-TEPS-001-2025</p>
              <p className="text-gray-700 mt-2">Vigente até 02/02/2029</p>
            </div>
          </div>
          <div className="flex justify-center mt-12">
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/JSTYMJxfSLgEJiXU.jpg" alt="Selo INMETRO" className="h-32 w-auto" />
          </div>
        </div>
      </section>

      {/* Numeros */}
      <section id="sobre" className="py-20 bg-gradient-to-r from-[#001c3d] to-[#002863] text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Nossa Experiência</h2>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold text-[#0963ed] mb-2">{Math.floor(counters.projects)}+</div>
              <p className="text-xl text-gray-300">Projetos Entregues</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-blue-300 mb-2">{Math.floor(counters.clients)}+</div>
              <p className="text-xl text-gray-300">Clientes Satisfeitos</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-blue-200 mb-2">{Math.floor(counters.years)}+</div>
              <p className="text-xl text-gray-300">Anos de Experiência</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#001c3d]">Solicitar Orçamento</h2>
          <div className="max-w-2xl mx-auto">
            <form className="space-y-6 bg-gray-50 p-8 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Seu Nome" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0963ed]" />
                <input type="email" placeholder="Seu Email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0963ed]" />
              </div>
              <input type="tel" placeholder="Seu Telefone" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0963ed]" />
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0963ed]">
                <option>Selecione o Tipo de Serviço</option>
                <option>Obras & Infraestrutura</option>
                <option>SASC Certificado</option>
                <option>TEPS - Ensaios</option>
                <option>Manutenção & Facilities</option>
                <option>Automação (RR Engine)</option>
              </select>
              <input type="text" placeholder="Localização do Projeto" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0963ed]" />
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0963ed]">
                <option>Urgência</option>
                <option>Imediato (até 7 dias)</option>
                <option>Curto Prazo (até 30 dias)</option>
                <option>Médio Prazo (até 90 dias)</option>
                <option>Planejamento</option>
              </select>
              <textarea placeholder="Descreva seu projeto..." rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0963ed]"></textarea>
              <Button className="w-full bg-[#0963ed] hover:bg-[#0752c4] text-white text-lg py-3">Enviar Solicitação</Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#001c3d] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">RR Engenharia</h3>
              <p className="text-gray-400">Soluções em infraestrutura crítica com excelência técnica e conformidade regulatória.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contato</h3>
              <p className="text-gray-400 mb-2">📞 (21) 995740273</p>
              <p className="text-gray-400 mb-2">📧 contato@rres.com.br</p>
              <p className="text-gray-400">📍 Av. das Américas, 4200 - Barra da Tijuca, Rio de Janeiro - RJ, 22640-907</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
              <ul className="text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-[#0963ed]">Início</a></li>
                <li><a href="#" className="hover:text-[#0963ed]">Serviços</a></li>
                <li><a href="#" className="hover:text-[#0963ed]">Certificações</a></li>
                <li><a href="#" className="hover:text-[#0963ed]">Contato</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2026 RR Engenharia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition transform hover:scale-110 z-40">
        <MessageCircle size={28} />
      </a>
    </div>
  );
}
