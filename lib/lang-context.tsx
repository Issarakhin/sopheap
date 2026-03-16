'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Lang = 'en' | 'kh';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.blog': 'Blog',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Sign In',
    'nav.admin': 'Admin',
    'hero.title': "AI Thinking for Cambodia's Future",
    'hero.sub': 'Weekly insights. Strategic depth. Local clarity.',
    'hero.cta1': 'Read My Latest Writing',
    'hero.cta2': 'Work With Me',
    'blog.readMore': 'Read Article →',
    'blog.featured': 'Featured',
    'blog.viewAll': 'View All Articles →',
    'blog.minRead': 'min read',
    'services.title': 'How I Can Help',
    'services.sub': 'From executive training to AI agent deployment — I work with organisations ready to move from AI curiosity to AI capability.',
    'services.cta': 'Work With Sopheap',
    'contact.telegram': 'Telegram (Fastest)',
    'contact.email': 'Email',
    'contact.form': 'Fill the Form',
    'contact.name': 'Your Name',
    'contact.org': 'Organisation',
    'contact.emailLabel': 'Email Address',
    'contact.service': 'Service Interested In',
    'contact.message': 'Tell me about your challenge',
    'contact.submit': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.success': 'Message sent! Sopheap will be in touch soon.',
    'about.title': "Building Cambodia's AI Future",
    'about.sub': 'One Leader, One Company, One Insight at a Time',
    'chat.title': 'Chat with Sophea',
    'chat.sub': "Sopheap's AI Assistant",
    'chat.placeholder': 'Ask about AI, services, or articles...',
    'chat.send': 'Send',
    'footer.rights': 'All rights reserved.',
    'footer.built': 'Built in Phnom Penh, Cambodia',
    'subscribe.title': 'Get the AI Frontier Brief',
    'subscribe.sub': 'Every Tuesday — the AI news that matters, through a Cambodian lens.',
    'subscribe.cta': 'Subscribe Free',
    'subscribe.placeholder': 'Your email address',
  },
  kh: {
    'nav.blog': 'ប្លុក',
    'nav.services': 'សេវាកម្ម',
    'nav.about': 'អំពីខ្ញុំ',
    'nav.contact': 'ទំនាក់ទំនង',
    'nav.login': 'ចូលប្រើ',
    'nav.admin': 'ផ្ទាំងគ្រប់គ្រង',
    'hero.title': 'ការគិតពី AI សម្រាប់អនាគតរបស់កម្ពុជា',
    'hero.sub': 'ការយល់ដឹងប្រចាំសប្ដាហ៍។ ចំណេះដឹងយុទ្ធសាស្ត្រ។ ភាពច្បាស់លាស់ក្នុងស្រុក។',
    'hero.cta1': 'អានអត្ថបទចុងក្រោយ',
    'hero.cta2': 'ធ្វើការជាមួយខ្ញុំ',
    'blog.readMore': 'អានអត្ថបទ →',
    'blog.featured': 'ពិសេស',
    'blog.viewAll': 'មើលអត្ថបទទាំងអស់ →',
    'blog.minRead': 'នាទីអាន',
    'services.title': 'តើខ្ញុំអាចជួយអ្នកយ៉ាងដូចម្ដេច',
    'services.sub': 'ពីការបណ្ដុះបណ្ដាលអ្នកគ្រប់គ្រងរហូតដល់ការដាក់ពង្រាយ AI Agent — ខ្ញុំធ្វើការជាមួយស្ថាប័នដែលត្រៀមខ្លួនរួចជាស្រេច។',
    'services.cta': 'ធ្វើការជាមួយ Sopheap',
    'contact.telegram': 'Telegram (លឿនបំផុត)',
    'contact.email': 'អ៊ីមែល',
    'contact.form': 'បំពេញទម្រង់',
    'contact.name': 'ឈ្មោះរបស់អ្នក',
    'contact.org': 'អង្គការ',
    'contact.emailLabel': 'អាសយដ្ឋានអ៊ីមែល',
    'contact.service': 'សេវាកម្មដែលចាប់អារម្មណ៍',
    'contact.message': 'ប្រាប់ខ្ញុំអំពីបញ្ហារបស់អ្នក',
    'contact.submit': 'ផ្ញើសារ',
    'contact.sending': 'កំពុងផ្ញើ...',
    'contact.success': 'ផ្ញើជោគជ័យ! Sopheap នឹងទំនាក់ទំនងមកវិញ។',
    'about.title': 'កសាងអនាគត AI របស់កម្ពុជា',
    'about.sub': 'មួយអ្នកដឹកនាំ មួយក្រុមហ៊ុន មួយការយល់ដឹង ក្នុងពេលតែមួយ',
    'chat.title': 'ជជែកជាមួយ Sophea',
    'chat.sub': 'ជំនួយការ AI របស់ Sopheap',
    'chat.placeholder': 'សួរអំពី AI, សេវាកម្ម, ឬអត្ថបទ...',
    'chat.send': 'ផ្ញើ',
    'footer.rights': 'រក្សាសិទ្ធិទាំងអស់។',
    'footer.built': 'បង្កើតនៅភ្នំពេញ, កម្ពុជា',
    'subscribe.title': 'ទទួល AI Frontier Brief',
    'subscribe.sub': 'រៀងរាល់ថ្ងៃអង្គារ — ព័ត៌មាន AI សំខាន់ តាមទស្សនៈកម្ពុជា។',
    'subscribe.cta': 'ជាវដោយឥតគិតថ្លៃ',
    'subscribe.placeholder': 'អាសយដ្ឋានអ៊ីមែលរបស់អ្នក',
  },
};

const LangContext = createContext<LangContextType>({} as LangContextType);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang;
    if (stored === 'en' || stored === 'kh') setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  const t = (key: string): string => {
    return (translations[lang] as Record<string, string>)[key] || (translations.en as Record<string, string>)[key] || key;
  };

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
