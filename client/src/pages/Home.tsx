import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, CheckCircle, Award, Zap, TrendingUp } from 'lucide-react';

const CLIENTS = [
  { name: 'Gran Petro', logo: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/YIAWAblrlyQwVjsV.jpg' },
  { name: 'Matte Leão', logo: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/QnQwNndobGZmmqSf.png' },
  { name: 'Shell', logo: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/JnyTCLHGwwpnaIgg.png' },
  { name: 'Marinha do Brasil', logo: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/LJoXqslFcNeNEoKo.png' },
  { name: 'Atacadão', logo: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/OBrRyZoIJqvLclUv.jpg' },
  { name: 'AirBP', logo: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/LJwgRyTTAsbIMKGz.png' },
  { name: 'ICTSI', logo: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/RmMWgXjnWmhNiRpV.png' },
  { name: 'Valorec', logo: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/fqEgbvbLDYlwpmLj.png' },
  { name: 'Guanabara', logo: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/kyLqRBZJxmKTzvlc.png' },
  { name: 'BR Distribuidora', logo: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/KvYkfqOCpmJUfdhy.png' },
  { name: 'Le Canton Hotel', logo: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/IzjdyHvbNPkETflI.png' },
  { name: 'Gulf', logo: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/kyKGUMAUxFuFvecM.png' },
];

const SERVICES = [
  {
    title: 'Obras & Infraestrutura Crítica',
    description: 'Entrega no prazo, dentro do orçamento. Cronograma com buffers, gestão integrada e dossiê completo para auditoria.',
    icon: '📐',
    link: '/obras',
    color: 'from-orange-50 to-orange-100',
    border: 'border-l-4 border-orange-500'
  },
  {
    title: 'SASC Certificado INMETRO',
    description: 'Conformidade garantida. Instalação, testes e documentação com rastreabilidade total. Certificação vigente até 2029.',
    icon: '🏆',
    link: '/sasc',
    color: 'from-blue-50 to-blue-100',
    border: 'border-l-4 border-blue-500'
  },
  {
    title: 'TEPS - Ensaios de Estanqueidade',
    description: 'Detecta vazamentos de 0,1 L/hora. Laudos reconhecidos por órgãos ambientais. Disponível em 48 horas.',
    icon: '⚡',
    link: '/teps',
    color: 'from-green-50 to-green-100',
    border: 'border-l-4 border-green-500'
  },
  {
    title: 'Manutenção & Facilities',
    description: 'Reduz custos de emergência em 40%. PCM com SLA, relatórios mensais e previsibilidade orçamentária.',
    icon: '🔧',
    link: '/manutencao',
    color: 'from-purple-50 to-purple-100',
    border: 'border-l-4 border-purple-500'
  },
  {
    title: 'Automação (RR Engine)',
    description: 'Propostas em 24 horas vs. 7 dias. 70% mais rápido. Qualidade consistente, menos erros, 3x mais escalabilidade.',
    icon: '⚙️',
    link: '/automacao',
    color: 'from-pink-50 to-pink-100',
    border: 'border-l-4 border-pink-500'
  }
];

const DIFFERENTIALS = [
  {
    icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
    title: 'Experiência Comprovada',
    description: '150+ projetos entregues. 50+ clientes satisfeitos. 15+ anos em infraestrutura crítica.'
  },
  {
    icon: <Award className="w-8 h-8 text-blue-600" />,
    title: 'Certificações INMETRO',
    description: 'SASC e TEPS vigentes até 02/02/2029. Auditorias regulares. Conformidade garantida.'
  },
  {
    icon: <Zap className="w-8 h-8 text-blue-600" />,
    title: 'Entrega Rápida',
    description: 'Orçamentos em 24 horas. Ensaios em 48 horas. Suporte 24/7 para clientes.'
  }
];

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    location: '',
    urgency: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Formspree will handle the submission
    const form = e.target as HTMLFormElement;
    form.submit();
  };

  return (
    <div className="min-h-screen bg-white">
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
      {/* Hero Section */}
      <section 
        className="relative h-[600px] flex items-center justify-center bg-cover bg-center pt-24"
        style={{
          backgroundImage: 'url(https://files.manuscdn.com/user_upload_by_module/session_file/310419663029694742/bDafTWxDICGsSZPQ.png)',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl">
          <h1 className="text-6xl font-black mb-4" style={{ fontFamily: 'Montserrat' }}>Infraestrutura Crítica Sem Risco</h1>
          <p className="text-2xl font-medium mb-6" style={{ fontFamily: 'Montserrat' }}>SASC · TEPS · Obras · Manutenção · Automação</p>
          <p className="text-lg mb-8">Conformidade INMETRO garantida. 150+ projetos entregues. Certificações vigentes até 2029.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/#contato">
              <Button size="lg" className="bg-[#0963ed] hover:bg-[#0752c4] text-white font-bold">
                Solicitar Orçamento Agora
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 font-bold">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Differentials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ fontFamily: 'Montserrat' }}>
            Por Que Escolher a RR Engenharia
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {DIFFERENTIALS.map((diff, idx) => (
              <Card key={idx} className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">{diff.icon}</div>
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Montserrat' }}>{diff.title}</h3>
                <p className="text-gray-600">{diff.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50" id="servicos">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4" style={{ fontFamily: 'Montserrat' }}>
            Nossas Verticais de Serviço
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Soluções completas em engenharia de infraestrutura com foco em qualidade, conformidade e inovação
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, idx) => (
              <Link key={idx} href={service.link}>
                <Card className={`p-6 h-full hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br ${service.color} ${service.border}`}>
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Montserrat' }}>{service.title}</h3>
                  <p className="text-gray-700 mb-6">{service.description}</p>
                  <Button className="w-full bg-[#0963ed] hover:bg-[#0752c4] font-bold">
                    Saiba Mais
                  </Button>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ fontFamily: 'Montserrat' }}>
            Clientes que Confiam em Nós
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center">
            {CLIENTS.map((client, idx) => (
              <div key={idx} className="flex items-center justify-center h-24 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img 
                  src={client.logo} 
                  alt={client.name}
                  className="max-h-20 max-w-full object-contain px-4"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ fontFamily: 'Montserrat' }}>
            Nossa Experiência
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-black mb-2" style={{ fontFamily: 'Montserrat' }}>150+</div>
              <p className="text-lg">Projetos Entregues</p>
            </div>
            <div>
              <div className="text-5xl font-black mb-2" style={{ fontFamily: 'Montserrat' }}>50+</div>
              <p className="text-lg">Clientes Satisfeitos</p>
            </div>
            <div>
              <div className="text-5xl font-black mb-2" style={{ fontFamily: 'Montserrat' }}>15+</div>
              <p className="text-lg">Anos de Experiência</p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ fontFamily: 'Montserrat' }}>
            Certificações INMETRO
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-l-4 border-blue-600">
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Montserrat' }}>INMETRO SASC</h3>
              <p className="text-gray-600 mb-4">Sistema de Abastecimento Subterrâneo de Combustíveis</p>
              <p className="text-sm text-gray-500">Certificado: CTBC-SASC-001-2025</p>
              <p className="text-sm text-gray-500">Vigente até 02/02/2029</p>
            </Card>
            <Card className="p-8 border-l-4 border-green-600">
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Montserrat' }}>INMETRO TEPS</h3>
              <p className="text-gray-600 mb-4">Ensaio de Estanqueidade em Instalações Subterrâneas</p>
              <p className="text-sm text-gray-500">Certificado: CTBC-TEPS-001-2025</p>
              <p className="text-sm text-gray-500">Vigente até 02/02/2029</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4" style={{ fontFamily: 'Montserrat' }}>
            Blog Técnico
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Artigos sobre normas ABNT/INMETRO, conformidade regulatória e melhores práticas em engenharia
          </p>
          <div className="text-center">
            <Link href="/blog">
              <Button size="lg" className="bg-[#0963ed] hover:bg-[#0752c4]">
                Acessar Blog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50" id="contato">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Montserrat' }}>
              Receba Seu Orçamento em 24 Horas
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              Especialistas certificados INMETRO prontos para analisar seu projeto
            </p>
            <p className="text-sm text-[#0963ed] font-semibold">
              ⚠️ Preencha o formulário abaixo e receba uma proposta customizada
            </p>
          </div>
          <form 
            onSubmit={handleSubmit}
            action="https://formspree.io/f/xyzabc"
            method="POST"
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <Input 
                name="name"
                placeholder="Seu Nome"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <Input 
                name="email"
                type="email"
                placeholder="Seu Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input 
                name="phone"
                type="tel"
                placeholder="Seu Telefone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <Select value={formData.service} onValueChange={(val) => setFormData({...formData, service: val})}>
                <SelectTrigger name="service">
                  <SelectValue placeholder="Tipo de Serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="obras">Obras & Infraestrutura</SelectItem>
                  <SelectItem value="sasc">SASC Certificado</SelectItem>
                  <SelectItem value="teps">TEPS - Ensaios</SelectItem>
                  <SelectItem value="manutencao">Manutenção & Facilities</SelectItem>
                  <SelectItem value="automacao">Automação (RR Engine)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input 
                name="location"
                placeholder="Localização do Projeto"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
              <Select value={formData.urgency} onValueChange={(val) => setFormData({...formData, urgency: val})}>
                <SelectTrigger name="urgency">
                  <SelectValue placeholder="Urgência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="imediato">Imediato (até 7 dias)</SelectItem>
                  <SelectItem value="curto">Curto Prazo (até 30 dias)</SelectItem>
                  <SelectItem value="medio">Médio Prazo (até 90 dias)</SelectItem>
                  <SelectItem value="planejamento">Planejamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea 
              name="message"
              placeholder="Descreva seu projeto..."
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
            <Button type="submit" size="lg" className="w-full bg-[#0963ed] hover:bg-[#0752c4] font-bold text-lg py-6">
              Solicitar Orçamento Agora
            </Button>
            <p className="text-xs text-gray-500 text-center mt-4">
              ✓ Resposta em até 24 horas | ✓ Sem compromisso | ✓ Dados protegidos
            </p>
          </form>
        </div>
      </section>

      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/5521995740273"
        className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all z-50"
        title="Enviar mensagem via WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
    </div>
  );
}
