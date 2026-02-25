import { ArrowLeft, Calendar, User } from "lucide-react";
import { Link } from "wouter";

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "O que é SASC e por que sua conformidade é obrigatória",
      excerpt: "Entenda o Sistema de Armazenamento Subterrâneo de Combustível, normas aplicáveis e como a RR Engenharia garante conformidade INMETRO.",
      date: "24 de fevereiro de 2026",
      author: "RR Engenharia",
      category: "SASC",
      slug: "o-que-e-sasc",
      content: `
        <h2>O que é SASC?</h2>
        <p>SASC é a sigla para <strong>Sistema de Armazenamento Subterrâneo de Combustível</strong>. Trata-se da instalação de tanques subterrâneos em postos de combustível, com conformidade obrigatória às normas técnicas brasileiras (ABNT NBR 13786, ABNT NBR 14725) e regulamentações INMETRO.</p>
        
        <h3>Normas Aplicáveis</h3>
        <ul>
          <li><strong>ABNT NBR 13786:</strong> Tanques de aço carbono para armazenamento de combustível</li>
          <li><strong>ABNT NBR 14725:</strong> Ficha de Informação de Segurança de Produto Químico</li>
          <li><strong>NR-20:</strong> Segurança e Saúde no Trabalho com Inflamáveis e Combustíveis</li>
          <li><strong>Resolução INMETRO Nº 10/2019:</strong> Certificação de SASC</li>
        </ul>
        
        <h3>Por que a Conformidade é Crítica?</h3>
        <p>Tanques subterrâneos mal instalados ou sem manutenção adequada causam vazamentos que contaminam lençol freático, gerando passivos ambientais e multas regulatórias. A conformidade INMETRO garante que o sistema foi instalado por empresa certificada, com documentação auditável.</p>
        
        <h3>Como a RR Engenharia Acelera seu SASC</h3>
        <p>Nós conduzimos todo o processo: avaliação técnica, projeto executivo, instalação, testes de estanqueidade (TEPS) e documentação final. Nosso diferencial é a <strong>rastreabilidade total</strong>—cada etapa é fotografada, assinada e documentada. Resultado: conformidade garantida e dossiê pronto para auditoria.</p>
        
        <p><strong>Próximo passo:</strong> Solicite uma avaliação técnica gratuita. Analisaremos seu projeto e apresentaremos cronograma realista.</p>
      `
    },
    {
      id: 2,
      title: "TEPS: Ensaios de Estanqueidade Obrigatórios",
      excerpt: "Conheça as metodologias de teste, frequência de ensaios e como a RR Engenharia garante conformidade com INMETRO.",
      date: "23 de fevereiro de 2026",
      author: "RR Engenharia",
      category: "TEPS",
      slug: "teps-ensaios-estanqueidade",
      content: `
        <h2>O que é TEPS?</h2>
        <p>TEPS significa <strong>Teste de Estanqueidade de Postos de Serviço</strong>. Trata-se de ensaios técnicos obrigatórios para verificar a integridade de sistemas de armazenamento subterrâneo de combustível, detectando vazamentos e garantindo conformidade ambiental e de segurança.</p>
        
        <h3>Frequência de Ensaios</h3>
        <p>Segundo ABNT NBR 13786 e regulamentações INMETRO:</p>
        <ul>
          <li><strong>Novo SASC:</strong> Teste obrigatório antes de operação</li>
          <li><strong>Periódico:</strong> A cada 3 anos (ou conforme legislação estadual)</li>
          <li><strong>Após manutenção:</strong> Sempre que houver intervenção no sistema</li>
        </ul>
        
        <h3>Metodologias de Teste</h3>
        <ul>
          <li><strong>Teste Volumétrico:</strong> Medição de variações de volume em períodos controlados</li>
          <li><strong>Teste de Pressão:</strong> Pressurização para identificar pontos de vazamento</li>
          <li><strong>Teste de Vácuo:</strong> Aplicação de vácuo para detectar fugas em conexões</li>
          <li><strong>Teste com Traçador:</strong> Gases traçadores para localizar vazamentos precisamente</li>
        </ul>
        
        <h3>Como a RR Engenharia Garante Conformidade</h3>
        <p>Utilizamos <strong>instrumentação de ponta</strong> capaz de detectar vazamentos de até 0,1 litro/hora. Cada teste gera relatório detalhado com gráficos, análises e recomendações. Laudos são reconhecidos por órgãos ambientais e auditores.</p>
        
        <p><strong>Próximo passo:</strong> Agende um ensaio. Disponibilidade em até 48 horas, sem interrupção operacional.</p>
      `
    },
    {
      id: 3,
      title: "Obras em Postos de Combustível: Planejamento Executivo",
      excerpt: "Guia completo sobre fases de execução, conformidade regulatória e como evitar atrasos em obras críticas.",
      date: "22 de fevereiro de 2026",
      author: "RR Engenharia",
      category: "Obras",
      slug: "obras-postos-combustivel",
      content: `
        <h2>Desafios em Obras de Infraestrutura Crítica</h2>
        <p>Obras em postos de combustível exigem <strong>planejamento executivo rigoroso</strong>, conformidade com múltiplas normas técnicas (ABNT, NR-20, legislação ambiental) e gestão integrada de fornecedores. Um atraso de uma semana pode custar dezenas de milhares em perda operacional.</p>
        
        <h3>Fases Críticas de Execução</h3>
        <ol>
          <li><strong>Planejamento Executivo:</strong> Análise de viabilidade, cronograma detalhado e orçamento com BDI</li>
          <li><strong>Projeto Técnico:</strong> Desenhos executivos, especificações de materiais e plano de segurança</li>
          <li><strong>Mobilização:</strong> Contratação de fornecedores, licenças ambientais e preparação do canteiro</li>
          <li><strong>Execução:</strong> Obra com acompanhamento diário, relatórios de progresso e controle de qualidade</li>
          <li><strong>Testes e Comissionamento:</strong> Ensaios de funcionamento, testes de estanqueidade e validação</li>
          <li><strong>Entrega:</strong> Dossiê completo, manuais operacionais e certificados de conformidade</li>
        </ol>
        
        <h3>Como Evitar Atrasos</h3>
        <ul>
          <li>Cronograma com <strong>buffers de contingência</strong> (não linear)</li>
          <li>Coordenação integrada de fornecedores e órgãos reguladores</li>
          <li>Inspeções diárias para identificar desvios cedo</li>
          <li>Relatórios de progresso com ações corretivas em tempo real</li>
        </ul>
        
        <h3>O Diferencial da RR Engenharia</h3>
        <p>Nós entregamos obras <strong>no prazo e dentro do orçamento</strong>. Nossa metodologia inclui planejamento executivo rigoroso, gestão de riscos e suporte pós-entrega. Resultado: zero atrasos surpresa, conformidade total e documentação auditável.</p>
        
        <p><strong>Próximo passo:</strong> Solicite uma avaliação técnica. Apresentaremos cronograma, orçamento e plano de execução detalhado.</p>
      `
    },
    {
      id: 4,
      title: "Manutenção Preventiva: Reduzindo Custos Operacionais",
      excerpt: "Como implementar PCM (Plano de Manutenção Preventiva) com SLA e reduzir custos de emergência em até 40%.",
      date: "21 de fevereiro de 2026",
      author: "RR Engenharia",
      category: "Manutenção",
      slug: "manutencao-preventiva-sla",
      content: `
        <h2>O Problema da Manutenção Reativa</h2>
        <p>Manutenção reativa (conserto quando quebra) é cara. Uma bomba que falha em horário de pico pode custar R$ 50.000+ em perda operacional. Além disso, falhas frequentes indicam falta de conformidade regulatória, atraindo auditores e multas.</p>
        
        <h3>Solução: PCM (Plano de Manutenção Preventiva)</h3>
        <p>PCM é um <strong>cronograma de manutenção planejada</strong> baseado em:</p>
        <ul>
          <li><strong>Histórico de falhas:</strong> Padrões de desgaste específicos do seu equipamento</li>
          <li><strong>Recomendações do fabricante:</strong> Intervalos de manutenção técnica</li>
          <li><strong>Normas regulatórias:</strong> Inspeções obrigatórias (ABNT, NR-20)</li>
          <li><strong>Análise de risco:</strong> Priorização de equipamentos críticos</li>
        </ul>
        
        <h3>Benefícios Mensuráveis</h3>
        <ul>
          <li><strong>Redução de 40% em custos de emergência</strong> (menos chamados fora de horário)</li>
          <li><strong>Aumento de 30% em disponibilidade</strong> (menos downtime)</li>
          <li><strong>Conformidade regulatória garantida</strong> (documentação sempre atualizada)</li>
          <li><strong>Previsibilidade orçamentária</strong> (custos mensais fixos vs. surpresas)</li>
        </ul>
        
        <h3>Como a RR Implementa PCM com SLA</h3>
        <p>Realizamos auditoria de manutenção, criamos plano customizado, implementamos com SLA (tempo de resposta máximo) e fornecemos relatórios gerenciais mensais. Você tem visibilidade total de custos, histórico e tendências.</p>
        
        <p><strong>Próximo passo:</strong> Solicite auditoria de manutenção gratuita. Apresentaremos plano PCM e estimativa de economia.</p>
      `
    },
    {
      id: 5,
      title: "RR Engine: Automação de Propostas em Engenharia",
      excerpt: "Como IA generativa e templates inteligentes reduzem tempo de proposta de 7 dias para 24 horas.",
      date: "20 de fevereiro de 2026",
      author: "RR Engenharia",
      category: "Automação",
      slug: "rr-engine-automacao-propostas",
      content: `
        <h2>O Problema: Propostas Lentas Perdem Clientes</h2>
        <p>Orçamentação em engenharia é manual e lenta. Analistas passam dias coletando dados, calculando custos, redigindo especificações. Resultado: cliente espera 7-10 dias e acaba contratando concorrente que respondeu em 24 horas.</p>
        
        <h3>Solução: RR Engine (BDI.ai)</h3>
        <p><strong>RR Engine</strong> é uma plataforma que automatiza orçamentação usando:</p>
        <ul>
          <li><strong>IA Generativa:</strong> Redação técnica automática de especificações e análises</li>
          <li><strong>Templates Parametrizados:</strong> Modelos para SASC, TEPS, Obras e Manutenção</li>
          <li><strong>Integração com Bases de Dados:</strong> SINAPI, PINI, históricos internos</li>
          <li><strong>Exportação Automática:</strong> PDF, Excel, Word prontos para apresentação</li>
        </ul>
        
        <h3>Resultados Mensuráveis</h3>
        <ul>
          <li><strong>70% de redução em tempo de proposta</strong> (7 dias → 24 horas)</li>
          <li><strong>Qualidade consistente</strong> (todas as propostas seguem padrão técnico)</li>
          <li><strong>Menos erros</strong> (automação reduz omissões e inconsistências)</li>
          <li><strong>Escalabilidade</strong> (mesmo time gera 3x mais propostas)</li>
        </ul>
        
        <h3>Como Funciona na Prática</h3>
        <p>Você insere dados do projeto (localização, tipo de serviço, escopo). RR Engine gera automaticamente: especificação técnica, análise de custo com BDI, cronograma, checklist de conformidade e proposta comercial. Tudo pronto em minutos.</p>
        
        <p><strong>Próximo passo:</strong> Agende uma demonstração do RR Engine. Mostraremos como gerar uma proposta completa em menos de 5 minutos.</p>
      `
    }
  ];

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
          <Link href="/" className="flex items-center gap-2 text-blue-200 hover:text-white mb-6">
            <ArrowLeft size={20} />
            Voltar
          </Link>
          <h1 className="text-5xl font-black mb-4" style={{ fontFamily: 'Montserrat' }}>Blog Técnico</h1>
          <p className="text-xl text-blue-100">Artigos sobre normas ABNT/INMETRO, conformidade regulatória e melhores práticas em engenharia de infraestrutura</p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {posts.map(post => (
              <article key={post.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="inline-block bg-[#0963ed] text-white px-3 py-1 rounded-full text-xs font-bold">{post.category}</span>
                    <span className="flex items-center gap-1"><Calendar size={16} /> {post.date}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#001c3d] mb-3">{post.title}</h2>
                  <p className="text-gray-700 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-gray-600"><User size={16} /> {post.author}</span>
                    <a href={`/blog/${post.slug}`} className="text-[#0963ed] hover:text-[#0752c4] font-bold">Ler Mais →</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#001c3d] to-[#002863] text-white">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat' }}>Pronto para Começar?</h2>
          <p className="text-xl mb-8 text-blue-100">Solicite uma consulta com nossos especialistas. Analisaremos seu projeto e apresentaremos soluções customizadas.</p>
          <Link href="/#contato">
            <button className="bg-[#0963ed] hover:bg-[#0752c4] text-white text-lg px-10 py-4 rounded-lg transition">Solicitar Orçamento</button>
          </Link>
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
