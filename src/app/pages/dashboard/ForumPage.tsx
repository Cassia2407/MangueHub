import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Search, PenLine, Heart, MessageCircle, Share2, X,
  TrendingUp, Folder, CalendarDays, Clock, ChevronRight,
  Filter, Sprout, Droplets, Leaf, Cpu, Globe, BookOpen,
  FlaskConical, Lightbulb, Send, Check, Link, MapPin, Users, Sparkles, Tag,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useT, useAppSettings } from "../../contexts/AppSettingsContext";
import { UserAvatar } from "../../components/UserAvatar";

// ── Static category IDs (labels built with t() inside components) ─────────────

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  todos: Globe,
  ambiental: Leaf,
  biologia: FlaskConical,
  tecnologia: Cpu,
  iot: Sprout,
  sustentabilidade: Droplets,
  projetos: Folder,
  duvidas: Lightbulb,
  eventos: CalendarDays,
};

const CATEGORY_IDS = ["todos", "ambiental", "biologia", "tecnologia", "iot", "sustentabilidade", "projetos", "duvidas", "eventos"];

const CATEGORY_KEYS: Record<string, string> = {
  todos: "forum.cat.general",
  ambiental: "forum.cat.environmental",
  biologia: "forum.cat.biology",
  tecnologia: "forum.cat.technology",
  iot: "IoT",
  sustentabilidade: "forum.cat.sustainability",
  projetos: "forum.cat.projects",
  duvidas: "forum.cat.questions",
  eventos: "forum.cat.events",
};

function useCategoryLabel() {
  const t = useT();
  return (id: string) => {
    const key = CATEGORY_KEYS[id];
    if (!key) return id;
    if (key === "IoT") return "IoT";
    return t(key);
  };
}

// ── Data ─────────────────────────────────────────────────────────────────────

interface PostComment {
  id: number;
  author: string;
  avatar: string;
  course: string;
  text: string;
  date: string;
}

interface Post {
  id: number;
  author: string;
  avatar: string;
  course: string;
  date: string;
  title: string;
  content: string;
  image?: string;
  tags: string[];
  category: string;
  likes: number;
  comments: number;
  shares: number;
  liked?: boolean;
  commentsList?: PostComment[];
  likedBy?: string[];
}

const POSTS: Post[] = [
  {
    id: 1,
    author: "João Victor Santos",
    avatar: "JV",
    course: "Engenharia Ambiental · 5º período",
    date: "Hoje às 14:30",
    title: "Monitoramento da qualidade da água em áreas de manguezal",
    content:
      "Alguém tem referências ou dados recentes sobre métodos de monitoramento em manguezais urbanos? Estou desenvolvendo meu TCC e precisaria de artigos publicados nos últimos 5 anos. Já encontrei algumas publicações da FIOCRUZ mas quero comparar com estudos de outras regiões do Brasil.",
    tags: ["Água", "Pesquisa", "TCC", "Manguezal"],
    category: "ambiental",
    likes: 24,
    comments: 8,
    shares: 3,
    likedBy: ["Beatriz Lima", "Lucas Almeida", "Ana Paula Ferreira", "Marcos Ribeiro", "Camila Torres", "Rafael Souza", "Fernanda Costa", "Thiago Mendes", "Priya Nair", "Carlos Henrique", "Sofia Andrade", "Daniel Farias", "Larissa Moura", "Bruno Tavares", "Juliana Rocha", "Renata Dias", "Pedro Lemos", "Vitória Cunha", "Gustavo Pinto", "Amanda Freitas", "Felipe Borges", "Natália Carvalho", "Eduardo Melo", "Isabela Ramos"],
    commentsList: [
      { id: 1, author: "Ana Paula Ferreira", avatar: "AP", course: "TI · 4º período", text: "Já usei publicações do INPE para monitoramento de manguezais no Pará, posso te mandar os links!", date: "há 3h" },
      { id: 2, author: "Marcos Ribeiro", avatar: "MR", course: "Eng. Ambiental · 8º período", text: "A EMBRAPA também tem estudos recentes sobre qualidade da água em estuários, vale a pena verificar.", date: "há 2h" },
      { id: 3, author: "Camila Torres", avatar: "CT", course: "Biologia · 3º período", text: "Que tema incrível! Meu orientador trabalhou exatamente com isso em 2024, posso te apresentar a ele.", date: "há 1h" },
    ],
  },
  {
    id: 2,
    author: "Beatriz Lima",
    avatar: "BL",
    course: "Biologia Marinha · 7º período",
    date: "Hoje às 11:15",
    title: "Fauna associada ao mangue vermelho — compartilhando artigo",
    content:
      "Compartilhando meu artigo sobre a importância do mangue vermelho para a biodiversidade local. O estudo foi realizado em conjunto com o laboratório de ecologia da universidade e identificamos 47 espécies de invertebrados associadas ao rizoma. Comentários são muito bem-vindos!",
    tags: ["Biodiversidade", "Mangue", "Fauna", "Publicação"],
    category: "biologia",
    likes: 56,
    comments: 12,
    shares: 18,
    likedBy: ["João Victor Santos", "Lucas Almeida", "Ana Paula Ferreira", "Marcos Ribeiro", "Camila Torres", "Rafael Souza", "Fernanda Costa", "Thiago Mendes", "Carlos Henrique", "Sofia Andrade", "Daniel Farias", "Larissa Moura", "Bruno Tavares", "Juliana Rocha", "Renata Dias", "Pedro Lemos", "Vitória Cunha", "Gustavo Pinto", "Amanda Freitas", "Felipe Borges", "Natália Carvalho", "Eduardo Melo", "Isabela Ramos", "Paulo Sérgio", "Mariana Lopes", "Rodrigo Assis", "Cláudia Nunes", "Henrique Barros", "Aline Figueiredo", "Leonardo Castro", "Tatiana Vieira", "Roberto Campos", "Priya Nair", "Carolina Ribas", "Diego Moreira", "Vanessa Araújo", "Murilo Teixeira", "Flávia Gomes", "André Borba", "Letícia Alves", "Vinicius Souza", "Patrícia Esteves", "Cíntia Duarte", "Marcelo Queiroz", "Elisa Brito", "Adriano Neves", "Bianca Rocha", "Hugo Cavalcante", "Luana Ferraz", "Sandro Macedo", "Viviane Pereira", "Cleiton Barbosa", "Érika Monteiro", "Fábio Corrêa", "Gisele Nogueira"],
    commentsList: [
      { id: 1, author: "João Victor Santos", avatar: "JV", course: "Eng. Ambiental · 5º período", text: "Artigo fantástico! As 47 espécies identificadas reforçam a importância da preservação dos rizomas. Parabéns pela pesquisa!", date: "há 10h" },
      { id: 2, author: "Lucas Almeida", avatar: "LA", course: "Oceanografia · 6º período", text: "Consegui acessar o artigo, muito bem escrito. Você considerou incluir dados sobre espécies migratórias também?", date: "há 8h" },
      { id: 3, author: "Camila Torres", avatar: "CT", course: "Biologia · 3º período", text: "Esse estudo vai ser muito útil para o meu TCC! Obrigada por compartilhar.", date: "há 6h" },
      { id: 4, author: "Marcos Ribeiro", avatar: "MR", course: "Eng. Ambiental · 8º período", text: "Seria interessante correlacionar com dados de salinidade. Você tem esses registros?", date: "há 4h" },
    ],
  },
  {
    id: 3,
    author: "Lucas Almeida",
    avatar: "LA",
    course: "Oceanografia · 6º período",
    date: "Ontem às 19:42",
    title: "Grupo de pesquisa sobre carbono azul — quem topa?",
    content:
      "Estou formando um grupo para estudar carbono azul em manguezais como sumidouro de carbono. A ideia é desenvolver um protocolo de coleta e análise de solo que possa ser replicado por estudantes. Quem tiver interesse em ecossistemas costeiros e mitigação climática, me chama!",
    tags: ["Carbono Azul", "Pesquisa", "Grupo de Estudo"],
    category: "projetos",
    likes: 12,
    comments: 5,
    shares: 2,
  },
  {
    id: 4,
    author: "Ana Paula Ferreira",
    avatar: "AP",
    course: "Tecnologia da Informação · 4º período",
    date: "Há 2 dias",
    title: "Dúvida: como integrar dados do ESP32 com uma API REST?",
    content:
      "Oi pessoal! Estou tentando conectar meu ESP32 a uma API REST para enviar as leituras dos sensores, mas estou tendo problemas com autenticação via token. Alguém já passou por isso? Já testei com ArduinoHttpClient mas o certificado SSL não está sendo aceito.",
    tags: ["ESP32", "API", "IoT", "Dúvida"],
    category: "iot",
    likes: 8,
    comments: 15,
    shares: 1,
  },
  {
    id: 5,
    author: "Marcos Ribeiro",
    avatar: "MR",
    course: "Engenharia Ambiental · 8º período",
    date: "Há 3 dias",
    title: "Evento: Semana da Sustentabilidade — inscrições abertas!",
    content:
      "A Semana da Sustentabilidade 2026 já está com inscrições abertas! Teremos palestras sobre restauração de manguezais, tecnologias verdes e economia circular. O evento acontece nos dias 28 a 31 de julho no campus principal. As inscrições são gratuitas para estudantes.",
    tags: ["Evento", "Sustentabilidade", "Campus"],
    category: "eventos",
    likes: 42,
    comments: 7,
    shares: 24,
  },
  {
    id: 6,
    author: "Camila Torres",
    avatar: "CT",
    course: "Biologia · 3º período",
    date: "Há 4 dias",
    title: "Impactos do descarte inadequado de plástico em ecossistemas de mangue",
    content:
      "Pesquisando para a disciplina de Ecologia Marinha encontrei dados alarmantes: estima-se que 80% do plástico nos oceanos vem de rios, e os manguezais funcionam como \"filtros\" retendo grande parte desse material. Mas essa acumulação causa sérios danos à biota local. Compartilhando alguns dados para quem estiver estudando o tema.",
    tags: ["Plástico", "Poluição", "Ecologia", "Mangue"],
    category: "sustentabilidade",
    likes: 35,
    comments: 10,
    shares: 9,
  },
  {
    id: 7,
    author: "Rafael Souza",
    avatar: "RS",
    course: "Química Ambiental · 6º período",
    date: "Há 5 dias",
    title: "Impactos do bio-plástico no mangue",
    content:
      "Tenho estudado os efeitos dos bio-plásticos em ecossistemas de manguezal e os dados são preocupantes mesmo para materiais ditos \"biodegradáveis\". A decomposição desses polímeros libera compostos que alteram o pH do sedimento, afetando diretamente a flora e fauna nativa. Alguém aqui já trabalhou com análise de microplásticos em amostras de sedimento de manguezal? Quero comparar metodologias.",
    tags: ["Bio-plástico", "Química", "Mangue", "Pesquisa"],
    category: "sustentabilidade",
    likes: 41,
    comments: 18,
    shares: 12,
  },
  {
    id: 8,
    author: "Fernanda Costa",
    avatar: "FC",
    course: "Engenharia Ambiental · 9º período",
    date: "Há 6 dias",
    title: "TCC: Restauração de áreas degradadas",
    content:
      "Estou na reta final do meu TCC sobre técnicas de restauração de áreas de manguezal degradadas no litoral nordestino. Meu recorte é comparar o replantio de propágulos com a regeneração natural assistida ao longo de 18 meses. Se alguém tiver referências sobre protocolos de monitoramento pós-replantio ou quiser trocar dados sobre índices de sobrevivência, me chama! Defendo em agosto.",
    tags: ["TCC", "Restauração", "Manguezal", "Eng. Ambiental"],
    category: "ambiental",
    likes: 29,
    comments: 9,
    shares: 7,
  },
  {
    id: 9,
    author: "Thiago Mendes",
    avatar: "TM",
    course: "Biologia · 4º período",
    date: "Há 1 semana",
    title: "Alguém tem material sobre IQA?",
    content:
      "Estou montando um estudo comparativo do Índice de Qualidade da Água em canais próximos a manguezais urbanos e rurais. Preciso de referências sobre os parâmetros usados especificamente em ecossistemas estuarinos — os padrões do CONAMA são bem gerais. Alguém já aplicou IQA adaptado para manguezais ou tem artigos sobre isso? Qualquer indicação ajuda muito!",
    tags: ["IQA", "Qualidade da Água", "Biologia", "Estuário"],
    category: "biologia",
    likes: 17,
    comments: 6,
    shares: 4,
  },
];

const TRENDING = [
  { postId: 7, title: "Impacto do bio-plástico no mangue", replies: 18, category: "Química" },
  { postId: 8, title: "TCC: Restauração de áreas degradadas", replies: 9, category: "Eng. Ambiental" },
  { postId: 9, title: "Material sobre IQA?", replies: 6, category: "Biologia" },
  { postId: 4, title: "Sensores de nível d'água para rios", replies: 14, category: "IoT" },
];

interface ProjectDetail {
  id: number;
  name: string;
  author: string;
  status: string;
  statusKey: "done" | "dev" | "planning";
  area: string;
  about: string;
  why: string;
  team: { name: string; avatar: string; role: string }[];
  references: { title: string; source: string }[];
  curiosities: string[];
}

const PROJECTS: ProjectDetail[] = [
  {
    id: 1,
    name: "Sistema de alerta de maré",
    author: "Equipe TI + Ambiental",
    status: "Em desenvolvimento",
    statusKey: "dev",
    area: "IoT & Eng. Ambiental",
    about: "Plataforma de monitoramento em tempo real que combina sensores ultrassônicos e de pressão instalados em canais estuarinos para medir o nível da maré e emitir alertas automáticos via aplicativo e SMS para comunidades costeiras em situação de risco.",
    why: "Enchentes causadas por marés de sizígia afetam anualmente comunidades ribeirinhas próximas ao campus. A ideia surgiu após um episódio em junho de 2025 que inundou áreas residenciais sem nenhum aviso prévio. O grupo decidiu construir uma solução de baixo custo usando tecnologia IoT acessível.",
    team: [
      { name: "Daniel Farias", avatar: "DF", role: "Coordenador & Hardware" },
      { name: "Sofia Andrade", avatar: "SA", role: "Backend & API" },
      { name: "Bruno Tavares", avatar: "BT", role: "App Mobile" },
      { name: "Larissa Moura", avatar: "LM", role: "Análise Ambiental" },
    ],
    references: [
      { title: "Early Warning Systems for Coastal Flooding", source: "NOAA Technical Report, 2023" },
      { title: "IoT-based Water Level Monitoring for Flood Detection", source: "IEEE Sensors Journal, 2024" },
      { title: "Gestão de riscos em zonas costeiras brasileiras", source: "CEMADEN — Relatório Anual, 2025" },
    ],
    curiosities: [
      "O protótipo atual já detecta variações de nível com precisão de ±2 cm.",
      "O custo total do hardware por estação de monitoramento é inferior a R$ 150.",
      "O sistema já foi testado em um canal do bairro Brasília Teimosa no Recife.",
      "O projeto foi selecionado para o edital de extensão universitária 2026.",
    ],
  },
  {
    id: 2,
    name: "Banco de sementes de mangue",
    author: "Lab. Botânica",
    status: "Concluído",
    statusKey: "done",
    area: "Botânica & Conservação",
    about: "Criação de um banco físico e digital de propágulos e sementes de diferentes espécies de mangue da região costeira de Pernambuco. O acervo inclui catalogação genética, dados de origem geográfica e protocolos de armazenamento e reidratação para uso em programas de restauração.",
    why: "A perda de diversidade genética nos manguezais remanescentes dificulta programas de restauração baseados em replantio. O laboratório identificou que não havia nenhum repositório regional de material genético vegetal costeiro. O projeto nasceu como resposta direta a essa lacuna, com apoio da CAPES e do IBAMA.",
    team: [
      { name: "Profa. Dra. Renata Dias", avatar: "RD", role: "Coordenadora Científica" },
      { name: "Pedro Lemos", avatar: "PL", role: "Coleta & Catalogação" },
      { name: "Vitória Cunha", avatar: "VC", role: "Análise Genética" },
      { name: "Gustavo Pinto", avatar: "GP", role: "Banco de Dados" },
    ],
    references: [
      { title: "Seed banking of mangrove species: challenges and perspectives", source: "Forest Ecology and Management, 2022" },
      { title: "Genetic diversity of Rhizophora mangle in Northeastern Brazil", source: "Aquatic Botany, 2024" },
      { title: "Protocolo nacional de restauração de manguezais", source: "MMA — Ministério do Meio Ambiente, 2023" },
    ],
    curiosities: [
      "O banco conta com material de 6 espécies diferentes de manguezal.",
      "Alguns propágulos armazenados têm origem em áreas já extintas por urbanização.",
      "O acervo digital é acessível para pesquisadores de todo o Brasil.",
      "O projeto resultou em 2 artigos publicados em revistas internacionais.",
    ],
  },
  {
    id: 3,
    name: "App de monitoramento cidadão",
    author: "Lucas, Ana, Pedro",
    status: "Planejamento",
    statusKey: "planning",
    area: "Tecnologia & Cidadania",
    about: "Aplicativo colaborativo que permite a qualquer cidadão registrar ocorrências ambientais em manguezais — como desmatamento, descarte ilegal de resíduos, mortandade de fauna — com fotos e geolocalização. Os dados alimentam um painel público em tempo real integrado com órgãos ambientais.",
    why: "A fiscalização ambiental tem limitações de equipe e cobertura territorial. Ao mesmo tempo, moradores locais frequentemente presenciam impactos antes de qualquer órgão oficial. A ideia surgiu de uma conversa entre os três criadores durante uma saída de campo, quando viram um despejo ilegal de efluentes e não sabiam para onde reportar.",
    team: [
      { name: "Lucas Almeida", avatar: "LA", role: "Idealização & UX" },
      { name: "Ana Paula Ferreira", avatar: "AP", role: "Desenvolvimento Mobile" },
      { name: "Pedro Lemos", avatar: "PL", role: "Backend & Integrações" },
    ],
    references: [
      { title: "Citizen Science for Environmental Monitoring", source: "Nature Sustainability, 2023" },
      { title: "Crowdsourced environmental data: quality and applications", source: "Environmental Science & Technology, 2024" },
      { title: "Participação cidadã no monitoramento de ecossistemas costeiros", source: "SNUC — Relatório Técnico, 2025" },
    ],
    curiosities: [
      "O nome provisório do app é 'MangueSOS' — ainda em votação com a comunidade.",
      "A ideia já recebeu interesse de três prefeituras do litoral pernambucano.",
      "O projeto foi inscrito no Hackathon Ambiental do IBAMA 2026.",
      "Os fundadores não tinham experiência prévia com desenvolvimento mobile.",
    ],
  },
];

interface EventDetail {
  id: number;
  name: string;
  date: string;
  time: string;
  local: string;
  description: string;
  speakers: { name: string; role: string; avatar: string }[];
  schedule: { time: string; activity: string }[];
  curiosities: string[];
  category: string;
  free: boolean;
}

const EVENTS: EventDetail[] = [
  {
    id: 1,
    name: "Semana da Sustentabilidade",
    date: "28–31 jul 2026",
    time: "09h às 18h",
    local: "Campus Principal — Auditório Central",
    category: "Sustentabilidade",
    free: true,
    description: "Quatro dias de imersão em temas ambientais, com palestras, oficinas práticas, exposições e rodas de conversa. O evento reúne estudantes, professores e especialistas para discutir restauração de manguezais, tecnologias verdes e economia circular.",
    speakers: [
      { name: "Dra. Mariana Lopes", role: "Bióloga Marinha — UFPE", avatar: "ML" },
      { name: "Prof. Ricardo Fonseca", role: "Eng. Ambiental — IFPE", avatar: "RF" },
      { name: "Lic. Carla Drummond", role: "Especialista em Economia Circular", avatar: "CD" },
      { name: "Eng. Paulo Sérgio", role: "Pesquisador IoT Verde — SENAI", avatar: "PS" },
    ],
    schedule: [
      { time: "09h00", activity: "Abertura oficial e apresentação dos projetos de extensão" },
      { time: "10h30", activity: "Palestra: Restauração de Manguezais Urbanos" },
      { time: "14h00", activity: "Oficina prática: Coleta e análise de solo estuarino" },
      { time: "16h00", activity: "Mesa-redonda: Economia Circular e Sustentabilidade" },
      { time: "17h30", activity: "Encerramento e networking" },
    ],
    curiosities: [
      "O evento é realizado anualmente desde 2019 e já reuniu mais de 2.000 participantes.",
      "A edição 2026 terá uma exposição fotográfica sobre manguezais brasileiros.",
      "Haverá plantio simbólico de propágulos de mangue vermelho ao vivo.",
      "Os projetos premiados recebem bolsas de extensão para continuar a pesquisa.",
    ],
  },
  {
    id: 2,
    name: "Workshop IoT para o Meio Ambiente",
    date: "5 ago 2026",
    time: "13h às 17h",
    local: "Laboratório de Eletrônica — Bloco C, sala 12",
    category: "Tecnologia & IoT",
    free: true,
    description: "Workshop hands-on para quem quer aprender a montar sensores ambientais com ESP32 e Arduino. Os participantes constroem um protótipo funcional de monitoramento de qualidade do ar e água, do zero até a transmissão de dados em tempo real.",
    speakers: [
      { name: "Arnott Ramos Caiado", role: "Mentor FalaMangue! — Desenvolvimento IoT", avatar: "AR" },
      { name: "Jamile Keiller", role: "Programação Embarcada — FalaMangue!", avatar: "JK" },
      { name: "Júlia Cássia", role: "Design e Sistemas — FalaMangue!", avatar: "JC" },
    ],
    schedule: [
      { time: "13h00", activity: "Introdução ao ESP32 e configuração do ambiente Arduino IDE" },
      { time: "13h45", activity: "Montagem do circuito com sensores de temperatura e umidade" },
      { time: "14h30", activity: "Programação do firmware e leitura dos dados" },
      { time: "15h30", activity: "Transmissão via Wi-Fi e visualização em dashboard" },
      { time: "16h30", activity: "Apresentação dos protótipos e dúvidas" },
    ],
    curiosities: [
      "Os participantes ficam com o protótipo montado ao final do workshop.",
      "Não é necessário ter experiência prévia com eletrônica — tudo é explicado do zero.",
      "O projeto FalaMangue! nasceu de um workshop semelhante a este.",
      "Vagas limitadas a 20 participantes para garantir atenção individual.",
    ],
  },
  {
    id: 3,
    name: "Defesa TCC — Ecossistemas",
    date: "12 ago 2026",
    time: "14h às 18h",
    local: "Auditório B — Bloco A",
    category: "Acadêmico",
    free: false,
    description: "Sessão aberta de defesas de Trabalho de Conclusão de Curso com foco em ecossistemas costeiros e estuarinos. Três estudantes apresentarão pesquisas sobre restauração de manguezais, qualidade da água e impacto de micro-plásticos na biota local.",
    speakers: [
      { name: "Fernanda Costa", role: "TCC: Restauração de Manguezais — Eng. Ambiental", avatar: "FC" },
      { name: "Thiago Mendes", role: "TCC: IQA em Canais Estuarinos — Biologia", avatar: "TM" },
      { name: "Sofia Andrade", role: "TCC: Micro-plásticos em Rizomas — Biologia Marinha", avatar: "SA" },
    ],
    schedule: [
      { time: "14h00", activity: "Abertura da sessão pela coordenação do curso" },
      { time: "14h15", activity: "Defesa 1 — Fernanda Costa (40 min + 20 min perguntas)" },
      { time: "15h15", activity: "Defesa 2 — Thiago Mendes (40 min + 20 min perguntas)" },
      { time: "16h15", activity: "Defesa 3 — Sofia Andrade (40 min + 20 min perguntas)" },
      { time: "17h30", activity: "Deliberação da banca e resultado final" },
    ],
    curiosities: [
      "As defesas são abertas ao público — qualquer estudante pode assistir e aprender.",
      "A banca é composta por professores convidados de outras instituições.",
      "Os trabalhos aprovados serão publicados no repositório digital da universidade.",
      "É uma ótima oportunidade para quem está iniciando o próprio TCC ver como funciona.",
    ],
  },
];

// ── Components ────────────────────────────────────────────────────────────────

interface NewComment {
  id: number;
  author: string;
  avatar: string;
  photoUrl?: string;
  course: string;
  text: string;
  date: string;
}

function PostCard({ post, highlighted, cardRef }: { post: Post; highlighted?: boolean; cardRef?: React.Ref<HTMLElement> }) {
  const { user } = useAuth();
  const t = useT();
  const getCategoryLabel = useCategoryLabel();
  const [liked, setLiked] = useState(post.liked ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [likedBy, setLikedBy] = useState<string[]>(post.likedBy ?? []);
  const [showComments, setShowComments] = useState(false);
  const [showLikedBy, setShowLikedBy] = useState(false);
  const [newComments, setNewComments] = useState<NewComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);

  const allComments = [...(post.commentsList ?? []), ...newComments];

  function toggleLike() {
    if (!user) return;
    if (liked) {
      setLikedBy((prev) => prev.filter((n) => n !== user.name));
    } else {
      setLikedBy((prev) => [user.name, ...prev]);
    }
    setLiked((v) => !v);
    setLikeCount((n) => (liked ? n - 1 : n + 1));
  }

  function handleComment() {
    if (!commentText.trim() || !user) return;
    setNewComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: user.name,
        avatar: user.avatar,
        photoUrl: user.photoUrl,
        course: user.course,
        text: commentText.trim(),
        date: t("forum.justNow"),
      },
    ]);
    setCommentText("");
  }

  function handleShare() {
    navigator.clipboard.writeText(`${window.location.origin}/dashboard/forum — ${post.title}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const totalComments = allComments.length;

  return (
    <article
      ref={cardRef as React.Ref<HTMLElement>}
      className={`bg-card border rounded-2xl shadow-sm hover:border-accent/30 transition-all overflow-hidden ${highlighted ? "border-accent ring-2 ring-accent/30" : "border-border"}`}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-xs text-primary-foreground" style={{ fontWeight: 700 }}>{post.avatar}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground" style={{ fontWeight: 600 }}>{post.author}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{post.course} · {post.date}</p>
          </div>
          <span className="text-[10px] text-accent bg-accent/10 px-2.5 py-1 rounded-full flex-shrink-0" style={{ fontWeight: 600 }}>
            {getCategoryLabel(post.category)}
          </span>
        </div>

        <h3 className="text-base text-foreground mb-2 leading-snug" style={{ fontWeight: 700 }}>{post.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{post.content}</p>

        {post.image && (
          <div className="mb-4 rounded-xl overflow-hidden h-48">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs text-accent bg-accent/10 px-2.5 py-0.5 rounded-full" style={{ fontWeight: 500 }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          {likedBy.length > 0 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowLikedBy((v) => !v)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontWeight: 500 }}
              >
                ❤️ {likedBy.length <= 2
                  ? likedBy.join(" e ")
                  : `${likedBy[0]}, ${likedBy[1]} e mais ${likedBy.length - 2}`}
              </button>
            </div>
          )}
          {showLikedBy && likedBy.length > 2 && (
            <div className="bg-muted/40 border border-border rounded-xl px-3 py-3 flex flex-col gap-1 max-h-40 overflow-y-auto">
              <p className="text-[11px] text-muted-foreground mb-1" style={{ fontWeight: 600 }}>{t("forum.likedBy")}</p>
              {likedBy.map((name) => (
                <span key={name} className="text-xs text-foreground">{name}</span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                liked ? "text-red-500 bg-red-50" : "text-muted-foreground hover:text-red-500 hover:bg-red-50/60"
              }`}
            >
              <Heart size={15} className={liked ? "fill-red-500" : ""} />
              <span style={{ fontWeight: 500 }}>{likeCount}</span>
            </button>
            <button
              onClick={() => setShowComments((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                showComments ? "text-accent bg-accent/10" : "text-muted-foreground hover:text-accent hover:bg-accent/10"
              }`}
            >
              <MessageCircle size={15} />
              <span style={{ fontWeight: 500 }}>{totalComments} {t("forum.commentsCount")}</span>
            </button>
            <button
              onClick={handleShare}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors ml-auto ${
                copied ? "text-emerald-600 bg-emerald-50" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {copied ? <Check size={15} /> : <Link size={15} />}
              <span style={{ fontWeight: 500 }}>{copied ? t("forum.copied") : t("forum.share")}</span>
            </button>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="border-t border-border bg-muted/20 px-5 sm:px-6 py-4 flex flex-col gap-4">
          {allComments.length > 0 ? (
            <div className="flex flex-col gap-3">
              {allComments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <UserAvatar user={c} size={32} radius="0.5rem" />
                  <div className="flex-1 bg-card border border-border rounded-xl px-3 py-2.5">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs text-foreground" style={{ fontWeight: 600 }}>{c.author}</span>
                      <span className="text-[10px] text-muted-foreground">{c.course} · {c.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-2">{t("forum.noComments")}</p>
          )}

          <div className="flex gap-2 items-start">
            <div className="mt-0.5">
              <UserAvatar user={user} size={32} radius="0.5rem" />
            </div>
            <div className="flex-1 flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleComment(); } }}
                placeholder={t("forum.commentPlaceholder")}
                className="flex-1 px-3 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-accent/60 transition-colors"
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

// ── Project modal ─────────────────────────────────────────────────────────────

function ProjectModal({ project, onClose }: { project: ProjectDetail; onClose: () => void }) {
  const t = useT();
  const statusColor =
    project.statusKey === "done" ? "bg-emerald-500/20 text-emerald-300" :
    project.statusKey === "dev" ? "bg-blue-500/20 text-blue-300" :
    "bg-amber-500/20 text-amber-300";

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-2xl bg-background sm:rounded-3xl shadow-2xl border border-border overflow-hidden max-h-[92dvh] flex flex-col rounded-t-3xl">
        <div className="bg-primary px-6 pt-6 pb-5 relative overflow-hidden flex-shrink-0">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-accent/15 rounded-full" />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors">
            <X size={15} />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] text-accent bg-accent/20 px-2.5 py-1 rounded-full" style={{ fontWeight: 600 }}>
              <Tag size={10} /> {project.area}
            </span>
            <span className={`text-[10px] px-2.5 py-1 rounded-full ${statusColor}`} style={{ fontWeight: 600 }}>{project.status}</span>
          </div>
          <h2 className="text-xl text-white leading-tight mb-1" style={{ fontWeight: 800 }}>{project.name}</h2>
          <p className="text-sm text-white/60">{project.author}</p>
        </div>

        <div className="overflow-y-auto flex flex-col gap-5 p-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={15} className="text-accent" />
              <p className="text-sm text-foreground" style={{ fontWeight: 700 }}>{t("forum.projectAbout")}</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{project.about}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={15} className="text-accent" />
              <p className="text-sm text-foreground" style={{ fontWeight: 700 }}>{t("forum.projectWhy")}</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{project.why}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users size={15} className="text-accent" />
              <p className="text-sm text-foreground" style={{ fontWeight: 700 }}>{t("forum.projectTeam")}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {project.team.map((m) => (
                <div key={m.name} className="flex items-center gap-2.5 bg-muted/40 rounded-xl p-3">
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] text-primary-foreground" style={{ fontWeight: 700 }}>{m.avatar}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-foreground leading-snug" style={{ fontWeight: 600 }}>{m.name}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={15} className="text-accent" />
              <p className="text-sm text-foreground" style={{ fontWeight: 700 }}>{t("forum.projectRefs")}</p>
            </div>
            <div className="flex flex-col gap-2">
              {project.references.map((r, i) => (
                <div key={i} className="flex gap-2.5 items-start bg-muted/30 rounded-xl px-3 py-2.5">
                  <span className="text-[10px] text-accent mt-0.5 flex-shrink-0" style={{ fontWeight: 700, fontFamily: "DM Mono, monospace" }}>[{i + 1}]</span>
                  <div>
                    <p className="text-xs text-foreground leading-snug" style={{ fontWeight: 500 }}>{r.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{r.source}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={15} className="text-accent" />
              <p className="text-sm text-foreground" style={{ fontWeight: 700 }}>{t("forum.curiosities")}</p>
            </div>
            <div className="flex flex-col gap-2">
              {project.curiosities.map((c, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-lg bg-accent/15 text-accent flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5" style={{ fontWeight: 700 }}>{i + 1}</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Event modal ───────────────────────────────────────────────────────────────

function EventModal({ event, onClose }: { event: EventDetail; onClose: () => void }) {
  const t = useT();
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-2xl bg-background sm:rounded-3xl shadow-2xl border border-border overflow-hidden max-h-[92dvh] flex flex-col rounded-t-3xl">
        <div className="bg-primary px-6 pt-6 pb-5 relative overflow-hidden flex-shrink-0">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-accent/15 rounded-full" />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors">
            <X size={15} />
          </button>
          <span className="inline-flex items-center gap-1.5 text-[10px] text-accent bg-accent/20 px-2.5 py-1 rounded-full mb-3" style={{ fontWeight: 600 }}>
            <Tag size={10} /> {event.category}
          </span>
          <h2 className="text-xl text-white leading-tight mb-3" style={{ fontWeight: 800 }}>{event.name}</h2>
          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5 text-xs text-white/80"><CalendarDays size={13} className="text-accent" /> {event.date}</span>
            <span className="flex items-center gap-1.5 text-xs text-white/80"><Clock size={13} className="text-accent" /> {event.time}</span>
            <span className="flex items-center gap-1.5 text-xs text-white/80"><MapPin size={13} className="text-accent" /> {event.local}</span>
            <span className={`flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full ${event.free ? "bg-emerald-500/20 text-emerald-300" : "bg-orange-500/20 text-orange-300"}`} style={{ fontWeight: 600 }}>
              {event.free ? t("forum.eventFree") : t("forum.eventPaid")}
            </span>
          </div>
        </div>

        <div className="overflow-y-auto flex flex-col gap-5 p-6">
          <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users size={15} className="text-accent" />
              <p className="text-sm text-foreground" style={{ fontWeight: 700 }}>{t("forum.eventWho")}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {event.speakers.map((s) => (
                <div key={s.name} className="flex items-center gap-2.5 bg-muted/40 rounded-xl p-3">
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] text-primary-foreground" style={{ fontWeight: 700 }}>{s.avatar}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-foreground leading-snug" style={{ fontWeight: 600 }}>{s.name}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{s.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={15} className="text-accent" />
              <p className="text-sm text-foreground" style={{ fontWeight: 700 }}>{t("forum.eventSchedule")}</p>
            </div>
            <div className="flex flex-col gap-0 relative pl-4">
              <div className="absolute top-2 bottom-2 left-1.5 w-0.5 bg-border" />
              {event.schedule.map((s, i) => (
                <div key={i} className="flex gap-3 pb-3 relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent flex-shrink-0 mt-1 -ml-4 relative z-10" />
                  <div>
                    <span className="text-[10px] text-accent" style={{ fontWeight: 700, fontFamily: "DM Mono, monospace" }}>{s.time}</span>
                    <p className="text-xs text-foreground leading-snug mt-0.5">{s.activity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={15} className="text-accent" />
              <p className="text-sm text-foreground" style={{ fontWeight: 700 }}>{t("forum.curiosities")}</p>
            </div>
            <div className="flex flex-col gap-2">
              {event.curiosities.map((c, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-lg bg-accent/15 text-accent flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5" style={{ fontWeight: 700 }}>{i + 1}</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── New post modal ────────────────────────────────────────────────────────────

function NewPostModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (post: Post) => void }) {
  const { user } = useAuth();
  const t = useT();
  const getCategoryLabel = useCategoryLabel();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("todos");

  function handlePublish() {
    if (!title.trim() || !content.trim()) return;
    const newPost: Post = {
      id: Date.now(),
      author: user?.name ?? "Usuário",
      avatar: user?.avatar ?? "U",
      course: user?.course ?? "",
      date: t("forum.justNow"),
      title: title.trim(),
      content: content.trim(),
      tags: [],
      category,
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
    };
    onSubmit(newPost);
    onClose();
  }

  const canPublish = title.trim().length > 0 && content.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-background rounded-3xl shadow-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base text-foreground" style={{ fontWeight: 700 }}>{t("forum.newPostModalTitle")}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-muted/60 flex items-center justify-center text-muted-foreground">
            <X size={16} />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <UserAvatar user={user} size={40} />
            <div>
              <p className="text-sm text-foreground" style={{ fontWeight: 600 }}>{user?.name}</p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-xs text-muted-foreground bg-muted/40 border border-border rounded-lg px-2 py-0.5 mt-0.5 outline-none dark:[color-scheme:dark]"
              >
                {CATEGORY_IDS.map((id) => (
                  <option key={id} value={id}>{getCategoryLabel(id)}</option>
                ))}
              </select>
            </div>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("forum.postTitlePlaceholder")}
            className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-accent/60 transition-colors"
            style={{ fontWeight: 600 }}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("forum.contentPlaceholder")}
            rows={5}
            className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:border-accent/60 transition-colors"
          />
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <button onClick={onClose} className="px-4 py-2.5 text-sm text-foreground rounded-xl border border-border hover:bg-muted/60 transition-colors">
              {t("forum.cancel")}
            </button>
            <button
              onClick={handlePublish}
              disabled={!canPublish}
              className="px-5 py-2.5 text-sm bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontWeight: 600 }}
            >
              {t("forum.publish")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Forum Page ───────────────────────────────────────────────────────────

export function ForumPage() {
  const t = useT();
  const { locale, dynamicT } = useAppSettings();
  const getCategoryLabel = useCategoryLabel();
  const [extraPosts, setExtraPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("todos");

  const trendingData = useMemo(() => TRENDING.map((item, i) => ({
    ...item,
    title: t(`forum.trending${i + 1}.title`),
    category: t(`forum.trending${i + 1}.category`),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  })), [locale, dynamicT]);

  const projectsData = useMemo(() => PROJECTS.map((p) => ({
    ...p,
    name: t(`forum.project${p.id}.name`),
    author: t(`forum.project${p.id}.author`),
    status: t(`forum.status.${p.statusKey}`),
    area: t(`forum.project${p.id}.area`),
    about: t(`forum.project${p.id}.about`),
    why: t(`forum.project${p.id}.why`),
    team: p.team.map((m, mi) => ({ ...m, role: t(`forum.project${p.id}.team${mi + 1}.role`) })),
    references: p.references.map((r, ri) => ({
      ...r,
      title: t(`forum.project${p.id}.ref${ri + 1}.title`),
      source: t(`forum.project${p.id}.ref${ri + 1}.source`),
    })),
    curiosities: p.curiosities.map((_, ci) => t(`forum.project${p.id}.curio${ci + 1}`)),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  })), [locale, dynamicT]);

  const eventsData = useMemo(() => EVENTS.map((e) => ({
    ...e,
    name: t(`forum.event${e.id}.name`),
    date: t(`forum.event${e.id}.date`),
    time: t(`forum.event${e.id}.time`),
    local: t(`forum.event${e.id}.local`),
    category: t(`forum.event${e.id}.category`),
    description: t(`forum.event${e.id}.desc`),
    speakers: e.speakers.map((s, si) => ({ ...s, role: t(`forum.event${e.id}.speaker${si + 1}.role`) })),
    schedule: e.schedule.map((s, si) => ({ ...s, activity: t(`forum.event${e.id}.schedule${si + 1}.activity`) })),
    curiosities: e.curiosities.map((_, ci) => t(`forum.event${e.id}.curio${ci + 1}`)),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  })), [locale, dynamicT]);

  const staticPosts = useMemo(() => POSTS.map((p) => ({
    ...p,
    title: t(`forum.post${p.id}.title`),
    content: t(`forum.post${p.id}.content`),
    course: t(`forum.post${p.id}.course`),
    date: t(`forum.post${p.id}.date`),
    tags: p.tags.map((_, i) => t(`forum.post${p.id}.tag${i + 1}`)),
    commentsList: p.commentsList?.map((c, ci) => ({
      ...c,
      course: t(`forum.post${p.id}.comment${ci + 1}.course`),
      text: t(`forum.post${p.id}.comment${ci + 1}.text`),
      date: t(`forum.post${p.id}.comment${ci + 1}.date`),
    })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  })), [locale, dynamicT]);

  const allPosts = [...extraPosts, ...staticPosts];
  const [showNewPost, setShowNewPost] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const postRefs = useRef<Record<number, HTMLElement | null>>({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const postId = params.get("post");
    if (!postId) return;
    const id = Number(postId);
    const target = POSTS.find((p) => p.id === id);
    if (target) setActiveCategory(target.category);
    setHighlightedId(id);
    setTimeout(() => {
      postRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
    setTimeout(() => setHighlightedId(null), 3000);
  }, [location.search]);

  function handleNewPost(post: Post) {
    setExtraPosts((prev) => [post, ...prev]);
    setActiveCategory(post.category);
  }

  const filtered = allPosts.filter((p) => {
    const matchCat = activeCategory === "todos" || p.category === activeCategory;
    const matchSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl text-foreground" style={{ fontWeight: 800 }}>{t("forum.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("forum.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden flex items-center gap-2 px-3 py-2.5 text-sm bg-card border border-border text-foreground rounded-xl hover:bg-muted/60 transition-colors"
            style={{ fontWeight: 500 }}
          >
            <Filter size={15} /> {t("forum.panel")}
          </button>
          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
            style={{ fontWeight: 600 }}
          >
            <PenLine size={15} />
            <span className="hidden sm:inline">{t("forum.newPost")}</span>
            <span className="sm:hidden">{t("forum.newPostShort")}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 shadow-sm mb-5 focus-within:border-accent/50 transition-colors">
        <Search size={16} className="text-muted-foreground flex-shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("forum.searchPlaceholder")}
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 mb-6" style={{ scrollbarWidth: "none" }}>
        {CATEGORY_IDS.map((id) => {
          const Icon = CATEGORY_ICONS[id];
          return (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm transition-all ${
                activeCategory === id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent/30"
              }`}
              style={{ fontWeight: 500 }}
            >
              <Icon size={13} />
              {getCategoryLabel(id)}
            </button>
          );
        })}
      </div>

      <div className="flex gap-6">
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {filtered.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <p className="text-muted-foreground text-sm">{t("forum.noPostsFound")}</p>
            </div>
          ) : (
            filtered.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                highlighted={highlightedId === post.id}
                cardRef={(el) => { postRefs.current[post.id] = el; }}
              />
            ))
          )}
        </div>

        <aside
          className={`
            lg:w-72 lg:flex-shrink-0 lg:block
            ${showSidebar
              ? "fixed inset-y-0 right-0 z-50 w-80 bg-background border-l border-border overflow-y-auto px-4 py-6 pt-20 lg:static lg:border-none lg:p-0"
              : "hidden lg:block"
            }
          `}
        >
          {showSidebar && (
            <button
              onClick={() => setShowSidebar(false)}
              className="lg:hidden absolute top-4 right-4 w-8 h-8 rounded-xl hover:bg-muted/60 flex items-center justify-center"
            >
              <X size={16} />
            </button>
          )}

          <div className="flex flex-col gap-5">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={15} className="text-accent" />
                <p className="text-sm text-foreground" style={{ fontWeight: 700 }}>{t("forum.trending")}</p>
              </div>
              <div className="flex flex-col gap-1">
                {trendingData.map((item, i) => (
                  <button
                    key={item.postId}
                    onClick={() => navigate(`/dashboard/forum?post=${item.postId}`)}
                    className="text-left flex items-start gap-2.5 py-2 hover:bg-muted/40 rounded-xl px-2 transition-colors group"
                  >
                    <span className="text-xs text-muted-foreground mt-0.5 w-4 flex-shrink-0" style={{ fontFamily: "DM Mono, monospace" }}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-snug group-hover:text-accent transition-colors" style={{ fontWeight: 500 }}>{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.category} · {item.replies} {t("forum.replies")}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Folder size={15} className="text-accent" />
                <p className="text-sm text-foreground" style={{ fontWeight: 700 }}>{t("forum.latestProjects")}</p>
              </div>
              <div className="flex flex-col gap-2">
                {projectsData.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className="flex items-start gap-2 py-1.5 hover:bg-muted/40 rounded-xl px-2 transition-colors text-left w-full group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                      <BookOpen size={13} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-foreground leading-snug group-hover:text-accent transition-colors" style={{ fontWeight: 500 }}>{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.author}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full mt-1 inline-block ${
                        p.statusKey === "done" ? "bg-emerald-100 text-emerald-700" :
                        p.statusKey === "dev" ? "bg-blue-100 text-blue-700" :
                        "bg-amber-100 text-amber-700"
                      }`} style={{ fontWeight: 600 }}>{p.status}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays size={15} className="text-accent" />
                <p className="text-sm text-foreground" style={{ fontWeight: 700 }}>{t("forum.cat.events")}</p>
              </div>
              <div className="flex flex-col gap-1">
                {eventsData.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setSelectedEvent(e)}
                    className="flex items-center gap-3 py-2 hover:bg-muted/40 rounded-xl px-2 transition-colors text-left w-full group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <CalendarDays size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground leading-snug group-hover:text-accent transition-colors" style={{ fontWeight: 600 }}>{e.name}</p>
                      <p className="text-[10px] text-muted-foreground">{e.date} · {e.local}</p>
                    </div>
                    <ChevronRight size={13} className="text-muted-foreground flex-shrink-0 group-hover:text-accent transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={15} className="text-accent" />
                <p className="text-sm text-foreground" style={{ fontWeight: 700 }}>{t("forum.recentDiscussions")}</p>
              </div>
              <div className="flex flex-col gap-1">
                {staticPosts.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/dashboard/forum?post=${p.id}`)}
                    className="text-left flex items-start gap-2 py-2 hover:bg-muted/40 rounded-xl px-2 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[9px] text-primary-foreground" style={{ fontWeight: 700 }}>{p.avatar}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-foreground leading-snug group-hover:text-accent transition-colors line-clamp-2" style={{ fontWeight: 500 }}>{p.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{p.date}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {showSidebar && (
          <div className="lg:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setShowSidebar(false)} />
        )}
      </div>

      {showNewPost && <NewPostModal onClose={() => setShowNewPost(false)} onSubmit={handleNewPost} />}
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}
