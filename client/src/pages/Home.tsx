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
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#001c3d] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/rWKLKroeEkmCJWYv.jpg" alt="RR Engenharia - SASC, TEPS e Postos de Combustível" className="h-20 w-auto" />
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-white">
            <a href="#inicio" className="hover:text-[#0963ed] transition">Início</a>
            <a href="#sobre" className="hover:text-[#0963ed] transition">Sobre</a>
            <a href="#servicos" className="hover:text-[#0963ed] transition">Serviços</a>
            <a href="#certificacoes" className="hover:text-[#0963ed] transition">Certificações</a>
            <a href="#contato" className="hover:text-[#0963ed] transition">Contato</a>
          </nav>
          <a href="#contato" style={{ textDecoration: 'none' }}>
            <Button className="bg-[#0963ed] hover:bg-[#0752c4] text-white">
              Solicitar Orçamento
            </Button>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="pt-40 pb-20 bg-gradient-to-br from-[#001c3d] to-[#002863] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
              Infraestrutura Crítica com Precisão Técnica
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              SASC, TEPS e Postos de Combustível. Certificação vigente até 02/02/2029.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="#contato" style={{ textDecoration: 'none' }}>
                <Button className="bg-[#0963ed] hover:bg-[#0752c4] text-white px-8 py-6 text-lg">
                  Solicitar Orçamento <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <a href="#servicos" style={{ textDecoration: 'none' }}>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  Conhecer Serviços
                </Button>
              </a>
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
            <div className="rounded-lg overflow-hidden shadow-lg h-96">
              <img src="https://private-us-east-1.manuscdn.com/sessionFile/Jm9kFcCWkshC1h65gmRwQG/sandbox/O3DmHECnj6eF6HAPQ0Ynzp-img-1_1771956406000_na1fn_c2FzYy1pbnN0YWxsYXRpb24.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSm05ZEZjQ1drc2hDMWg2NWdtUndRRy9zYW5kYm94L08zRG1IRUNuajZlRjZIQVBRMFluenAtaW1nLTFfMTc3MTk1NjQwNjAwMF9uYTFmbl9jMkZ6WXkxcGJuTjBZV3hzWVhScGIyNC5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=HqwgFj9euMFghOkja92bF9CieKUT9UiT2xVgfjH6Tj92t9CGV~ocniCyhJRoRWnTrDETtmt9-y3AzY8Ub1NA7ZQ-IAyxeEa-AkRyZx1VZ6rCflSYHuMlrPrJyHIIbNbUsSFsE7j~IyR0P0MY5W9BQYITzQTAw-EXHinWtJRT6CEKyCwKaFUVrpGqRI~6sgGwuRl8FtMuQzvilZI7JVERttzaLklTE1jheYPqMYRY~njSGWf93llZ8R-VgrQUoQeEWV6gT6eYv63nInDRJ~D8vKtsGOLfJJHmA2hVK-61ugVHZXf0lY7QYbUHHvx1HdmiRVwyEe5WcagNg-DA1GiMPA__" alt="Instalação de Sistema de Armazenamento Subterrâneo de Combustíveis SASC pela RR Engenharia" loading="lazy" className="w-full h-full object-cover" />
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
          
          {/* SASC Section with Image */}
          <div className="mb-16 grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-lg overflow-hidden shadow-lg h-80">
              <img src="https://private-us-east-1.manuscdn.com/sessionFile/Jm9dFcCWkshC1h65gmRwQG/sandbox/O3DmHECnj6eF6HAPQ0Ynzp-img-1_1771956406000_na1fn_c2FzYy1pbnN0YWxsYXRpb24.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSm05ZEZjQ1drc2hDMWg2NWdtUndRRy9zYW5kYm94L08zRG1IRUNuajZlRjZIQVBRMFluenAtaW1nLTFfMTc3MTk1NjQwNjAwMF9uYTFmbl9jMkZ6WXkxcGJuTjBZV3hzWVhScGIyNC5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=HqwgFj9euMFghOkja92bF9CieKUT9UiT2xVgfjH6Tj92t9CGV~ocniCyhJRoRWnTrDETtmt9-y3AzY8Ub1NA7ZQ-IAyxeEa-AkRyZx1VZ6rCflSYHuMlrPrJyHIIbNbUsSFsE7j~IyR0P0MY5W9BQYITzQTAw-EXHinWtJRT6CEKyCwKaFUVrpGqRI~6sgGwuRl8FtMuQzvilZI7JVERttzaLklTE1jheYPqMYRY~njSGWf93llZ8R-VgrQUoQeEWV6gT6eYv63nInDRJ~D8vKtsGOLfJJHmA2hVK-61ugVHZXf0lY7QYbUHHvx1HdmiRVwyEe5WcagNg-DA1GiMPA__" alt="Serviço certificado de instalação SASC em posto de combustível" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[#001c3d] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>SASC Certificado</h3>
              <p className="text-gray-600 mb-4 text-lg">Instalação e retirada de Sistemas de Armazenamento Subterrâneo de Combustíveis com certificação vigente. Conformidade regulatória e rastreabilidade completa.</p>
              <p className="text-[#0963ed] font-semibold">Serviço certificado de instalação e retirada de sistemas subterrâneos.</p>
            </div>
          </div>

          {/* TEPS Section with Image */}
          <div className="mb-16 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-[#001c3d] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>TEPS - Ensaios de Estanqueidade</h3>
              <p className="text-gray-600 mb-4 text-lg">Testes certificados de integridade de sistemas subterrâneos. Relatórios técnicos para auditoria e conformidade regulatória.</p>
              <p className="text-[#0963ed] font-semibold">Ensaios de estanqueidade em instalações subterrâneas certificados.</p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg h-80">
              <img src="https://private-us-east-1.manuscdn.com/sessionFile/Jm9dFcCWkshC1h65gmRwQG/sandbox/O3DmHECnj6eF6HAPQ0Ynzp-img-2_1771956414000_na1fn_dGVwcy10ZXN0aW5n.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSm05ZEZjQ1drc2hDMWg2NWdtUndRRy9zYW5kYm94L08zRG1IRUNuajZlRjZIQVBRMFluenAtaW1nLTJfMTc3MTk1NjQxNDAwMF9uYTFmbl9kR1Z3Y3kxMFpYTjBhVzVuLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=rhhTF5a-JhZAHHFGuzTmLeA9p29RUc0PeHcifofkeGenzZaO1rSP-USAlYhMTKdta2nkfVkU2EscfKj-zY7PnWBfBfnSYtF5cABHF5IzjB9oC-XKSeqXk87vEeQPcG7rkgelbXq8tRGmDzbuZrfFUYyZaytduYS2R3i~KqeZuNUClOAT7rnEgDXOGyy5rhds0n0te7DlZpwLj50vIMb5lRBISq~fcuKpCpr52nnSBtJL7M8R2U2Tp1jY6YLeTToukVHViVAEwyvjOksgg7qzuYNcMWWLArmGTX6R4~g3gFKM8O7yD~U9DS2grDybiIOwm3nG~-49~lq3pybHFbwXqQ__" alt="Ensaio de estanqueidade TEPS em sistema subterrâneo de combustível" loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Fuel Station Section with Image */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-lg overflow-hidden shadow-lg h-80">
              <img src="https://private-us-east-1.manuscdn.com/sessionFile/Jm9dFcCWkshC1h65gmRwQG/sandbox/O3DmHECnj6eF6HAPQ0Ynzp-img-3_1771956418000_na1fn_ZnVlbC1zdGF0aW9uLWNvbnN0cnVjdGlvbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSm05ZEZjQ1drc2hDMWg2NWdtUndRRy9zYW5kYm94L08zRG1IRUNuajZlRjZIQVBRMFluenAtaW1nLTNfMTc3MTk1NjQxODAwMF9uYTFmbl9ablZsYkMxemRHRjBhVzl1TFdOdmJuTjBjblZqZEdsdmJnLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=QKvle-oy~uAww393AHAw5eZO15YqlVepwLJBlgLK0VyR3esuZPiIk1gC6b~YK3Qoy-pWnODk1b5hdXF~3E70WIgracUTxlEbEVh03YtYl~bJTearEIXINKSu0hc-GugAO1BM8~g4378Q3GKr7GQKEnTUqlOfzWKKBzUvjatLn9KNN3dlws6MatFl8skkO0Tezqu50PX6n6WEMoBnwqJH63ppnXzV6f4uBqtTxktrHW7Ehs4--Axt8ppWatHOUU9236rNbPJCaijHudos5mnxsfJYozedE7-CgfjYATt6VzS1zZ40UIM4BN7TkblcA7XbSvu~10jCPV34yqGs7AyrVA__" alt="Construção e reforma de posto de combustível pela RR Engenharia" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[#001c3d] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Postos de Combustível</h3>
              <p className="text-gray-600 mb-4 text-lg">Construção, reforma e adequação de postos de abastecimento com governança de custo, prazo e segurança.</p>
              <p className="text-[#0963ed] font-semibold">Construção, reforma e adequação de postos com especialização em SASC.</p>
            </div>
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
              <div className="flex items-center gap-3 mb-4">
                <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/rWKLKroeEkmCJWYv.jpg" alt="RR Engenharia - SASC, TEPS e Postos de Combustível" className="h-12 w-auto" />
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
                <li><a href="#servicos" className="hover:text-[#0963ed]">SASC</a></li>
                <li><a href="#servicos" className="hover:text-[#0963ed]">TEPS</a></li>
                <li><a href="#servicos" className="hover:text-[#0963ed]">Postos</a></li>
                <li><a href="#servicos" className="hover:text-[#0963ed]">Manutenção</a></li>
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
    </main>
  );
}
