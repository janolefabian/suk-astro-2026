export const site = {
  origin: 'https://klavierlernen-berlin.de',
  title: 'Klavierunterricht in Berlin Prenzlauer Berg',
  description: 'Jongsuk Kim gibt professionellen Klavierunterricht für Anfänger und Fortgeschrittene in Berlin Prenzlauer Berg. Alle Altersgruppen sind herzlich willkommen!',
  name: 'Jongsuk Kim',
  email: 'jongsuk.kim83@gmail.com',
  privacyEmail: 'jongsuk.kim83@gmail.com',
  pricesUpdated: '27.12.2025',
  trial: 30,
  prices: [{minutes:30,price:45},{minutes:45,price:50},{minutes:60,price:60}]
};
export type Language = 'de' | 'ko';
export const localizedSiteMetadata: Record<Language, {title:string; description:string}> = {
  de: {title:site.title, description:site.description},
  ko: {
    title:'베를린 프렌츠라우어베르크 피아노 레슨 | 김종숙',
    description:'피아니스트 김종숙의 베를린 프렌츠라우어베르크 피아노 레슨. 어린이부터 성인, 입문자부터 전공자까지 독일어와 한국어로 개인 레슨을 진행합니다.'
  }
};
export const audioAlternates: Record<Language, string> = {de:'/audio/', ko:'/ko/audio/'};
export const pathTo = (path = '/') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
export const canonical = (path = '/') => new URL(path, site.origin).href;
export const mailTo = (subject = 'Probestunde Klavierunterricht') => `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
export const homeFor = (lang:Language) => lang === 'ko' ? '/ko/home/' : '/';
export const comparisonFor = (lang:Language) => lang === 'ko' ? '/vergleich/ko/' : '/vergleich/';
export type LessonReview = 'current' | 'draft';
export const lessonReviewFor = (lang:Language, version:LessonReview) => `/vergleich/unterricht/${version === 'current' ? 'bisher/' : ''}${lang === 'ko' ? 'ko/' : ''}`;
export const photo = (name:string) => pathTo(`/wp-content/uploads/2015/09/${name}`);
export const isIndexable = import.meta.env.PUBLIC_INDEXABLE === 'true';

export const recordings = [
  {composer:'Robert Schumann', work:'Klaviersonate Nr. 3 f-Moll, op. 14', movement:'Satz I', file:'schumann.mp3'},
  {composer:'Franz Schubert', work:'Klaviersonate A-Dur, D. 664', movement:'Satz III', file:'schubert.mp3'},
  {composer:'Ludwig van Beethoven', work:'Trio für Klavier, Violine und Violoncello D-Dur, op. 70', movement:'Satz I', file:'beethoven.mp3'}
];
