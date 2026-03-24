// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface ServiceItem {
  title: string;
  desc: string;
  features: string[];
}

export interface ServiceTeaserItem {
  title: string;
  title_kh: string;
  desc: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  org: string;
}

export interface Credential {
  year: string;
  title: string;
  desc: string;
}

export interface Company {
  name: string;
  desc: string;
}

export interface SiteContent {
  // ─── SERVICES PAGE ──────────────────────────────────────────────────────────
  services_hero_eyebrow: string;
  services_hero_heading: string;
  services_hero_highlight: string;
  services_hero_subtext: string;
  services_items: ServiceItem[];
  services_testimonials: Testimonial[];
  services_contact_eyebrow: string;
  services_contact_heading: string;
  services_contact_subtext: string;

  // ─── ABOUT PAGE ─────────────────────────────────────────────────────────────
  about_hero_eyebrow: string;
  about_hero_heading: string;
  about_hero_highlight: string;
  about_bio: string[];
  about_credentials: Credential[];
  about_companies: Company[];

  // ─── HOME / HERO ─────────────────────────────────────────────────────────────
  home_hero_badge: string;
  home_hero_title: string;
  home_hero_title_kh: string;
  home_hero_sub: string;
  home_hero_sub_kh: string;
  home_hero_cta1: string;
  home_hero_cta1_kh: string;
  home_hero_cta2: string;
  home_hero_cta2_kh: string;

  // ─── HOME / SERVICES TEASER ──────────────────────────────────────────────────
  home_services_eyebrow: string;
  home_services_heading: string;
  home_services_heading_kh: string;
  home_services_sub: string;
  home_services_sub_kh: string;
  home_services_cta: string;
  home_services_cta_kh: string;
  home_services_items: ServiceTeaserItem[];

  // ─── HOME / ABOUT TEASER ─────────────────────────────────────────────────────
  home_about_eyebrow: string;
  home_about_heading: string;
  home_about_highlight: string;
  home_about_para1: string;
  home_about_para2: string;
  home_about_cta: string;
  home_about_badge_label: string;
  home_about_badge_sub: string;

  // ─── HOME / SUBSCRIBE BANNER ─────────────────────────────────────────────────
  home_subscribe_eyebrow: string;
  home_subscribe_heading: string;
  home_subscribe_heading_kh: string;
  home_subscribe_sub: string;
  home_subscribe_sub_kh: string;
  home_subscribe_cta: string;
  home_subscribe_cta_kh: string;
  home_subscribe_placeholder: string;
  home_subscribe_placeholder_kh: string;
}

// ─── DEFAULTS ─────────────────────────────────────────────────────────────────

export const DEFAULT_CONTENT: SiteContent = {
  // Services page
  services_hero_eyebrow: 'Services',
  services_hero_heading: 'From ',
  services_hero_highlight: 'AI Curious',
  services_hero_subtext:
    'I work with organisations, governments, and leaders across Cambodia and ASEAN who are ready to move from talking about AI to building with it.',
  services_items: [
    {
      title: 'AI Capability Development',
      desc: 'Corporate AI training programmes, executive workshops, workforce transformation, train-the-trainer, and university partnerships. Designed to take organisations from AI-curious to AI-capable.',
      features: ['Custom curriculum design','Hands-on AI workshops','Certificate programmes','Leadership AI immersions','Train-the-trainer','English & Khmer delivery'],
    },
    {
      title: 'AI Agents & Solutions',
      desc: 'End-to-end design and deployment of AI agents, chatbots (Telegram, Web, WhatsApp), document intelligence systems, agentic workflow automation, and custom LLM integrations.',
      features: ['Telegram AI bots','Web AI agents','Document intelligence','Custom LLM pipelines','Agentic workflow automation','WhatsApp AI integration'],
    },
    {
      title: 'AI Strategy Consulting',
      desc: 'Using the proprietary PRISM Framework and Recursive Strategy Engine (RSE), I deliver AI readiness assessments, strategic roadmaps, governance design, and fractional AI advisory.',
      features: ['AI readiness audit','Strategic roadmap','PRISM Framework','Fractional AI advisory','Governance design','Board-level AI briefings'],
    },
    {
      title: 'Speaking & Thought Leadership',
      desc: "Keynotes and panel sessions on AI strategy, Cambodia's AI journey, ethical AI in ASEAN, and the future of work. Available in English and Khmer for corporate events and conferences.",
      features: ['Conference keynotes','Executive panel facilitation','University lectures','Media appearances','AI future workshops','English & Khmer'],
    },
  ],
  services_testimonials: [
    { quote: 'Sopheap brought AI from abstract concept to real business tool for our entire executive team.', name: 'Corporate Training Client', org: 'Cambodia' },
    { quote: 'The PRISM Framework gave us clarity on our AI roadmap like nothing else had. Transformative.', name: 'Strategy Consulting Client', org: 'Phnom Penh' },
    { quote: "His keynote at our conference sparked genuine action, not just conversation. That's rare.", name: 'Conference Organizer', org: 'ASEAN' },
  ],
  services_contact_eyebrow: 'Get in Touch',
  services_contact_heading: 'Work With Sopheap',
  services_contact_subtext: 'Ready to accelerate your AI journey? Choose the best way to start the conversation.',

  // About page
  about_hero_eyebrow: 'HIN Sopheap',
  about_hero_heading: "Building Cambodia's AI Future —",
  about_hero_highlight: 'One Leader at a Time',
  about_bio: [
    "I've spent 23 years building Cambodia's business landscape. Across banks, conglomerates, and enterprises, I've seen how leadership, strategy, and technology intersect — and how rarely they come together well. AI is the moment when they finally can.",
    "I pivoted fully into AI because I saw a dangerous gap forming in Cambodia: global AI adoption accelerating while Cambodian leaders were left without the frameworks, skills, or local-context knowledge to act wisely. The risk wasn't that Cambodia would adopt AI poorly — it was that Cambodia would adopt someone else's AI without understanding what it means for our own economy, culture, and people.",
    'Cambodia AI Group — the consolidated home of DG Academy, NeuraSpace AI, and AngkorGate AI — is my answer to that gap. We train the people who lead organisations. We build the AI agents that run real workflows.',
  ],
  about_credentials: [
    { year: '2001+', title: '23+ Years Senior Leadership', desc: 'Built and led major organisations across Cambodia.' },
    { year: 'MBA', title: 'Asian Institute of Technology', desc: 'Graduate business education with strategic focus.' },
    { year: '2021+', title: 'Co-Founder, Cambodia AI Group', desc: 'DG Academy · NeuraSpace AI · AngkorGate AI' },
    { year: 'Ongoing', title: 'AI Trainer & Educator', desc: 'Trained thousands of executives, managers, and students.' },
    { year: 'Regional', title: 'Conference Speaker', desc: 'Keynotes across Cambodia and the ASEAN region.' },
    { year: 'Weekly', title: 'AI Frontier Brief & The Long View', desc: 'Tuesday newsletter and Sunday deep opinion column.' },
  ],
  about_companies: [
    { name: 'DG Academy', desc: 'AI training platform for Cambodia and ASEAN. Corporate workshops, certificate programmes, workforce transformation.' },
    { name: 'NeuraSpace AI', desc: 'AI solutions and deployment. AI agents, chatbots, document intelligence, custom LLM integrations.' },
    { name: 'AngkorGate AI', desc: "Ecosystem building. Connecting Cambodia's AI community, fostering partnerships, and advancing national AI readiness." },
  ],

  // Home hero
  home_hero_badge: 'AI Strategist · Trainer · Entrepreneur',
  home_hero_title: "AI Thinking for Cambodia's Future",
  home_hero_title_kh: 'ការគិតពី AI សម្រាប់អនាគតរបស់កម្ពុជា',
  home_hero_sub: 'Weekly insights. Strategic depth. Local clarity.',
  home_hero_sub_kh: 'ការយល់ដឹងប្រចាំសប្ដាហ៍។ ចំណេះដឹងយុទ្ធសាស្ត្រ។ ភាពច្បាស់លាស់ក្នុងស្រុក។',
  home_hero_cta1: 'Read My Latest Writing',
  home_hero_cta1_kh: 'អានអត្ថបទចុងក្រោយ',
  home_hero_cta2: 'Work With Me',
  home_hero_cta2_kh: 'ធ្វើការជាមួយខ្ញុំ',

  // Home services teaser
  home_services_eyebrow: 'What I Do',
  home_services_heading: 'How I Can Help',
  home_services_heading_kh: 'តើខ្ញុំអាចជួយអ្នកយ៉ាងដូចម្ដេច',
  home_services_sub: 'From executive training to AI agent deployment — I work with organisations ready to move from AI curiosity to AI capability.',
  home_services_sub_kh: 'ពីការបណ្ដុះបណ្ដាលអ្នកគ្រប់គ្រងរហូតដល់ការដាក់ពង្រាយ AI Agent — ខ្ញុំធ្វើការជាមួយស្ថាប័នដែលត្រៀមខ្លួនរួចជាស្រេច។',
  home_services_cta: 'Work With Sopheap',
  home_services_cta_kh: 'ធ្វើការជាមួយ Sopheap',
  home_services_items: [
    { title: 'AI Capability Development', title_kh: 'ការអភិវឌ្ឍសមត្ថភាព AI', desc: 'Corporate AI training, executive workshops, workforce transformation. Delivered in English and Khmer.' },
    { title: 'AI Agents & Solutions', title_kh: 'AI Agents & Solutions', desc: 'End-to-end design and deployment of AI agents, chatbots, document intelligence, and agentic workflows.' },
    { title: 'AI Strategy Consulting', title_kh: 'ការប្រឹក្សាយុទ្ធសាស្ត្រ AI', desc: 'PRISM Framework-powered AI readiness assessments, roadmaps, governance design, and fractional advisory.' },
    { title: 'Speaking & Thought Leadership', title_kh: 'ការនិយាយ & ការដឹកនាំគំនិត', desc: "Keynotes and panels on AI strategy, Cambodia's AI journey, ethical AI in ASEAN, and the future of work." },
  ],

  // Home about teaser
  home_about_eyebrow: 'About Sopheap',
  home_about_heading: "Building Cambodia's",
  home_about_highlight: 'AI Future',
  home_about_para1: "23 years of senior leadership across Cambodia's major enterprises — and now building its AI future. As Co-Founder of Cambodia AI Group, I train executives, deploy intelligent agents, advise enterprises, and speak at conferences across the region.",
  home_about_para2: "My writing exists because Cambodians deserve clear, honest, locally-grounded thinking about how AI is reshaping the world. I'm not just talking about AI — I'm building it.",
  home_about_cta: 'Read My Full Story →',
  home_about_badge_label: 'MBA',
  home_about_badge_sub: 'Asian Institute of Technology',

  // Home subscribe banner
  home_subscribe_eyebrow: 'Every Tuesday',
  home_subscribe_heading: 'Get the AI Frontier Brief',
  home_subscribe_heading_kh: 'ទទួល AI Frontier Brief',
  home_subscribe_sub: 'Every Tuesday — the AI news that matters, through a Cambodian lens.',
  home_subscribe_sub_kh: 'រៀងរាល់ថ្ងៃអង្គារ — ព័ត៌មាន AI សំខាន់ តាមទស្សនៈកម្ពុជា។',
  home_subscribe_cta: 'Subscribe Free',
  home_subscribe_cta_kh: 'ជាវដោយឥតគិតថ្លៃ',
  home_subscribe_placeholder: 'Your email address',
  home_subscribe_placeholder_kh: 'អាសយដ្ឋានអ៊ីមែលរបស់អ្នក',
};

export function mergeSiteContent(fetched: Partial<SiteContent> | null): SiteContent {
  if (!fetched) return DEFAULT_CONTENT;
  return { ...DEFAULT_CONTENT, ...fetched };
}
