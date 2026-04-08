export type I18nKey =
  | 'nav.feed'
  | 'nav.profile'
  | 'nav.tech'
  | 'nav.finance'
  | 'nav.world'
  | 'nav.trending'
  | 'nav.election'
  | 'nav.state'
  | 'nav.sports'
  | 'nav.business'
  | 'nav.health'
  | 'nav.entertainment'
  | 'nav.more'
  | 'auth.signIn'
  | 'auth.join'
  | 'theme.light'
  | 'theme.dark'
  | 'lang.selectTitle'
  | 'common.cancel'
  | 'common.apply'
  | 'feed.recommended'
  | 'feed.home'
  | 'feed.business'
  | 'feed.more'
  | 'feed.error'
  | 'feed.retry'
  | 'feed.empty'
  | 'card.unknownSource'
  | 'card.summaryFallback'
  | 'card.openDetails'
  | 'card.readSource'
  | 'detail.backToFeed'
  | 'detail.aiSummary'
  | 'detail.tags'
  | 'detail.readOriginal'
  | 'landing.title'
  | 'landing.subtitle'
  | 'landing.getStarted'
  | 'landing.explore';

type Dictionary = Record<I18nKey, string>;

const en: Dictionary = {
  'nav.feed': 'Feed',
  'nav.profile': 'Profile',
  'nav.tech': 'Tech',
  'nav.finance': 'Finance',
  'nav.world': 'World',
  'nav.trending': 'Trending',
  'nav.election': 'Election',
  'nav.state': 'State News',
  'nav.sports': 'Sports',
  'nav.business': 'Business',
  'nav.health': 'Health',
  'nav.entertainment': 'Entertainment',
  'nav.more': 'More',
  'auth.signIn': 'Sign in',
  'auth.join': 'Join',
  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'lang.selectTitle': 'Select preferred languages',
  'common.cancel': 'Cancel',
  'common.apply': 'Apply',
  'feed.recommended': 'Recommended',
  'feed.home': 'Home',
  'feed.business': 'Business',
  'feed.more': 'More',
  'feed.error': 'Check your connection and try again.',
  'feed.retry': 'Retry',
  'feed.empty': 'No stories found in this category yet. Try another category.',
  'card.unknownSource': 'Unknown source',
  'card.summaryFallback': 'Summary unavailable. Open details for key points.',
  'card.openDetails': 'Open details',
  'card.readSource': 'Read from source',
  'detail.backToFeed': 'Back to feed',
  'detail.aiSummary': 'AI Summary',
  'detail.tags': 'Tags',
  'detail.readOriginal': 'Read Original Source',
  'landing.title': 'The internet is loud. Newsora gives you signal.',
  'landing.subtitle': 'Read concise AI summaries, track what matters to you, and discover stories from citizens in your community.',
  'landing.getStarted': 'Get started',
  'landing.explore': 'Explore public feed'
};

const bn: Dictionary = {
  ...en,
  'nav.feed': 'ফিড',
  'nav.profile': 'প্রোফাইল',
  'nav.tech': 'টেক',
  'nav.finance': 'ফাইন্যান্স',
  'nav.world': 'বিশ্ব',
  'nav.trending': 'ট্রেন্ডিং',
  'nav.election': 'নির্বাচন',
  'nav.state': 'রাজ্য সংবাদ',
  'nav.sports': 'খেলাধুলা',
  'nav.business': 'ব্যবসা',
  'nav.health': 'স্বাস্থ্য',
  'nav.entertainment': 'বিনোদন',
  'nav.more': 'আরও',
  'auth.signIn': 'সাইন ইন',
  'auth.join': 'যোগ দিন',
  'theme.light': 'লাইট',
  'theme.dark': 'ডার্ক',
  'lang.selectTitle': 'পছন্দের ভাষা নির্বাচন করুন',
  'common.cancel': 'বাতিল',
  'common.apply': 'প্রয়োগ করুন',
  'feed.recommended': 'আপনার জন্য',
  'feed.home': 'হোম',
  'feed.business': 'ব্যবসা',
  'feed.more': 'আরও',
  'feed.error': 'সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।',
  'feed.retry': 'আবার চেষ্টা',
  'feed.empty': 'এই বিভাগে এখনো খবর নেই। অন্য বিভাগ চেষ্টা করুন।',
  'card.unknownSource': 'অজানা উৎস',
  'card.summaryFallback': 'সারসংক্ষেপ নেই। বিস্তারিত খুলুন।',
  'card.openDetails': 'বিস্তারিত দেখুন',
  'card.readSource': 'উৎস থেকে পড়ুন',
  'detail.backToFeed': 'ফিডে ফিরুন',
  'detail.aiSummary': 'এআই সারসংক্ষেপ',
  'detail.tags': 'ট্যাগ',
  'detail.readOriginal': 'মূল উৎস পড়ুন',
  'landing.title': 'ইন্টারনেট খুব কোলাহলপূর্ণ। Newsora আপনাকে আসল সিগন্যাল দেয়।',
  'landing.subtitle': 'সংক্ষিপ্ত এআই সারসংক্ষেপ পড়ুন, আপনার পছন্দ ট্র্যাক করুন, এবং নাগরিক প্রতিবেদনে নজর রাখুন।',
  'landing.getStarted': 'শুরু করুন',
  'landing.explore': 'পাবলিক ফিড দেখুন'
};

const hi: Dictionary = {
  ...en,
  'nav.feed': 'फीड',
  'nav.profile': 'प्रोफाइल',
  'nav.trending': 'ट्रेंडिंग',
  'nav.election': 'चुनाव',
  'nav.state': 'राज्य समाचार',
  'nav.sports': 'खेल',
  'nav.business': 'व्यवसाय',
  'nav.health': 'स्वास्थ्य',
  'nav.entertainment': 'मनोरंजन',
  'nav.more': 'अधिक',
  'auth.signIn': 'साइन इन',
  'auth.join': 'जुड़ें',
  'feed.recommended': 'आपके लिए',
  'feed.home': 'होम',
  'feed.business': 'व्यवसाय',
  'feed.more': 'अधिक',
  'feed.error': 'अपने कनेक्शन की जांच करें और फिर से प्रयास करें।',
  'feed.retry': 'फिर से कोशिश करें',
  'feed.empty': 'इस श्रेणी में अभी कोई खबर नहीं। दूसरी श्रेणी आज़माएँ।',
  'detail.backToFeed': 'फीड पर वापस जाएं'
};

const dictionaries: Record<string, Dictionary> = {
  en,
  bn,
  hi
};

export function t(lang: string | undefined, key: I18nKey): string {
  const code = String(lang || 'en').toLowerCase();
  const dictionary = dictionaries[code] || en;
  return dictionary[key] || en[key];
}

export function langToLocale(lang: string | undefined): string {
  const code = String(lang || 'en').toLowerCase();
  if (code === 'bn') return 'bn-IN';
  if (code === 'hi') return 'hi-IN';
  if (code === 'te') return 'te-IN';
  if (code === 'ta') return 'ta-IN';
  return 'en-US';
}
