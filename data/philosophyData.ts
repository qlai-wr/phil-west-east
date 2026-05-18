// ============================================================
// 哲学数字人文项目 - 核心数据集
// Philosophy Digital Humanities - Core Dataset
// ============================================================

// --- 类型定义 ---

export interface Philosopher {
  id: string;
  name: { zh: string; en: string };
  birth: number; // 负数表示公元前
  death: number;
  era: { zh: string; en: string };
  avatar: string;
  tradition: "western" | "chinese";
  summary: { zh: string; en: string }; // 核心思想摘要
  works: { zh: string; en: string }[]; // 主要著作列表
}

export interface CoreText {
  philosopherId: string;
  title: { zh: string; en: string };
  year: number;
  chapter?: { zh: string; en: string };
  excerpt: { zh: string; en: string };
}

export interface ConceptNode {
  id: string;
  term: { zh: string; en: string };
  tradition: "western" | "chinese";
  definition: { zh: string; en: string };
  source: { work: { zh: string; en: string }; chapter?: string };
  coOccurrence: string[]; // 共现词汇
  weight: number;
}

export interface ConceptEdge {
  source: string;
  target: string;
  relation: "evolution" | "influence" | "contrast";
}

export interface ConceptProjection {
  conceptId: string;
  term: { zh: string; en: string };
  tradition: "western" | "chinese";
  x: number;
  y: number;
}

export interface RadarDimension {
  conceptId: string;
  ontology: number;      // 本体论
  epistemology: number;  // 认识论
  ethics: number;        // 伦理学
  aesthetics: number;    // 美学
  logic: number;         // 逻辑学
}

// --- 哲学家数据 (按需求文档) ---

export const philosophers: Philosopher[] = [
  // 西方哲学家
  {
    id: "plato",
    name: { zh: "柏拉图", en: "Plato" },
    birth: -428,
    death: -348,
    era: { zh: "古希腊 (公元前428-348)", en: "Ancient Greece (428-348 BCE)" },
    avatar: "/avatars/plato.svg",
    tradition: "western",
    summary: {
      zh: "西方哲学奠基人之一，提出理念论，认为现实世界是理念世界的影子。其洞穴寓言深刻揭示了认识论的核心问题。",
      en: "One of the founders of Western philosophy, proposed the Theory of Forms, believing the physical world is a shadow of the world of Ideas."
    },
    works: [
      { zh: "理想国", en: "The Republic" },
      { zh: "会饮篇", en: "Symposium" },
      { zh: "斐多篇", en: "Phaedo" },
    ],
  },
  {
    id: "aristotle",
    name: { zh: "亚里士多德", en: "Aristotle" },
    birth: -384,
    death: -322,
    era: { zh: "古希腊 (公元前384-322)", en: "Ancient Greece (384-322 BCE)" },
    avatar: "/avatars/aristotle.svg",
    tradition: "western",
    summary: {
      zh: "柏拉图学生，百科全书式学者。提出实体论和四因说，奠定了形式逻辑的基础。",
      en: "Student of Plato, encyclopedic scholar. Proposed substance theory and the Four Causes, established formal logic."
    },
    works: [
      { zh: "形而上学", en: "Metaphysics" },
      { zh: "尼各马可伦理学", en: "Nicomachean Ethics" },
      { zh: "工具论", en: "Organon" },
    ],
  },
  {
    id: "descartes",
    name: { zh: "笛卡尔", en: "René Descartes" },
    birth: 1596,
    death: 1650,
    era: { zh: "近代理性主义 (1596-1650)", en: "Early Modern Rationalism (1596-1650)" },
    avatar: "/avatars/descartes.svg",
    tradition: "western",
    summary: {
      zh: "近代哲学之父，提出「我思故我在」，确立主体性哲学的基础，开创心物二元论。",
      en: "Father of modern philosophy, proposed 'Cogito ergo sum', established the foundation of subjectivity philosophy."
    },
    works: [
      { zh: "第一哲学沉思集", en: "Meditations on First Philosophy" },
      { zh: "方法论", en: "Discourse on the Method" },
      { zh: "哲学原理", en: "Principles of Philosophy" },
    ],
  },
  {
    id: "kant",
    name: { zh: "康德", en: "Immanuel Kant" },
    birth: 1724,
    death: 1804,
    era: { zh: "德国古典哲学 (1724-1804)", en: "German Idealism (1724-1804)" },
    avatar: "/avatars/kant.svg",
    tradition: "western",
    summary: {
      zh: "批判哲学创始人，调和理性主义与经验主义，提出先验哲学体系，区分现象与物自体。",
      en: "Founder of critical philosophy, reconciled rationalism and empiricism, proposed transcendental philosophy."
    },
    works: [
      { zh: "纯粹理性批判", en: "Critique of Pure Reason" },
      { zh: "实践理性批判", en: "Critique of Practical Reason" },
      { zh: "判断力批判", en: "Critique of Judgment" },
    ],
  },
  {
    id: "nietzsche",
    name: { zh: "尼采", en: "Friedrich Nietzsche" },
    birth: 1844,
    death: 1900,
    era: { zh: "存在主义先驱 (1844-1900)", en: "Proto-Existentialism (1844-1900)" },
    avatar: "/avatars/nietzsche.svg",
    tradition: "western",
    summary: {
      zh: "宣告「上帝已死」，提出超人学说和永恒轮回，对传统道德进行激烈批判，开启价值重估。",
      en: "Declared 'God is dead', proposed the Übermensch and eternal recurrence, radically critiqued traditional morality."
    },
    works: [
      { zh: "查拉图斯特拉如是说", en: "Thus Spoke Zarathustra" },
      { zh: "善恶的彼岸", en: "Beyond Good and Evil" },
      { zh: "悲剧的诞生", en: "The Birth of Tragedy" },
    ],
  },
  {
    id: "wittgenstein",
    name: { zh: "维特根斯坦", en: "Ludwig Wittgenstein" },
    birth: 1889,
    death: 1951,
    era: { zh: "语言哲学 (1889-1951)", en: "Philosophy of Language (1889-1951)" },
    avatar: "/avatars/wittgenstein.svg",
    tradition: "western",
    summary: {
      zh: "语言哲学的核心人物，早期提出图像论，后期发展语言游戏理论，认为哲学问题源于语言误用。",
      en: "Central figure in philosophy of language, proposed picture theory early, later developed language-game theory."
    },
    works: [
      { zh: "逻辑哲学论", en: "Tractatus Logico-Philosophicus" },
      { zh: "哲学研究", en: "Philosophical Investigations" },
      { zh: "论确定性", en: "On Certainty" },
    ],
  },
  // 中国哲学家
  {
    id: "kongzi",
    name: { zh: "孔子", en: "Confucius" },
    birth: -551,
    death: -479,
    era: { zh: "先秦 (公元前551-479)", en: "Pre-Qin (551-479 BCE)" },
    avatar: "/avatars/kongzi.svg",
    tradition: "chinese",
    summary: {
      zh: "儒家学派创始人，提出仁、礼、中庸等核心概念，强调修身齐家治国平天下的人生理想。",
      en: "Founder of Confucianism, proposed core concepts of Ren, Li, and the Doctrine of the Mean."
    },
    works: [
      { zh: "论语", en: "The Analects" },
      { zh: "春秋", en: "Spring and Autumn Annals" },
    ],
  },
  {
    id: "laozi",
    name: { zh: "老子", en: "Laozi" },
    birth: -571,
    death: -471,
    era: { zh: "先秦 (公元前571-471)", en: "Pre-Qin (571-471 BCE)" },
    avatar: "/avatars/laozi.svg",
    tradition: "chinese",
    summary: {
      zh: "道家学派创始人，提出道、无、自然、无为等核心概念，主张顺应自然、返璞归真。",
      en: "Founder of Taoism, proposed concepts of Tao, Wu, Ziran, and Wu-wei, advocating harmony with nature."
    },
    works: [
      { zh: "道德经", en: "Tao Te Ching" },
    ],
  },
  {
    id: "dongzhongshu",
    name: { zh: "董仲舒", en: "Dong Zhongshu" },
    birth: -179,
    death: -104,
    era: { zh: "西汉 (公元前179-104)", en: "Western Han (179-104 BCE)" },
    avatar: "/avatars/dongzhongshu.svg",
    tradition: "chinese",
    summary: {
      zh: "汉代儒学代表，提出「天人感应」学说，将儒学与阴阳五行结合，确立儒学独尊地位。",
      en: "Representative of Han Confucianism, proposed the theory of Heaven-Human correlation, integrating Confucianism with Yin-Yang."
    },
    works: [
      { zh: "春秋繁露", en: "Luxuriant Dew of the Spring and Autumn Annals" },
      { zh: "天人三策", en: "Three Strategies on Heaven and Man" },
    ],
  },
  {
    id: "huineng",
    name: { zh: "慧能", en: "Huineng" },
    birth: 638,
    death: 713,
    era: { zh: "唐代禅宗 (638-713)", en: "Tang Dynasty Chan Buddhism (638-713)" },
    avatar: "/avatars/huineng.svg",
    tradition: "chinese",
    summary: {
      zh: "禅宗六祖，提出「顿悟」说，主张「不立文字，直指人心，见性成佛」，开创南宗禅。",
      en: "Sixth Patriarch of Chan Buddhism, proposed sudden enlightenment, founded Southern School of Chan."
    },
    works: [
      { zh: "六祖坛经", en: "Platform Sutra of the Sixth Patriarch" },
    ],
  },
  {
    id: "zhuxi",
    name: { zh: "朱熹", en: "Zhu Xi" },
    birth: 1130,
    death: 1200,
    era: { zh: "宋明理学 (1130-1200)", en: "Neo-Confucianism (1130-1200)" },
    avatar: "/avatars/zhuxi.svg",
    tradition: "chinese",
    summary: {
      zh: "理学集大成者，提出「理气」二元论，主张「格物致知」，建立系统的理学体系。",
      en: "Synthesizer of Neo-Confucianism, proposed Li-Qi dualism, advocated 'investigation of things'."
    },
    works: [
      { zh: "四书章句集注", en: "Collected Commentaries on the Four Books" },
      { zh: "近思录", en: "Reflerta on Things at Hand" },
    ],
  },
  {
    id: "wangyangming",
    name: { zh: "王阳明", en: "Wang Yangming" },
    birth: 1472,
    death: 1529,
    era: { zh: "宋明心学 (1472-1529)", en: "Neo-Confucianism (1472-1529)" },
    avatar: "/avatars/wangyangming.svg",
    tradition: "chinese",
    summary: {
      zh: "心学集大成者，提出「心即理」、「致良知」、「知行合一」，强调道德实践与内心修养。",
      en: "Synthesizer of School of Mind, proposed 'Mind is Principle', 'Extension of Innate Knowledge', 'Unity of Knowledge and Action'."
    },
    works: [
      { zh: "传习录", en: "Instructions for Practical Living" },
      { zh: "大学问", en: "Inquiry on the Great Learning" },
    ],
  },
];


// --- 核心文本 ---

export const coreTexts: CoreText[] = [
  // 柏拉图
  {
    philosopherId: "plato",
    title: { zh: "理想国", en: "The Republic" },
    year: -375,
    chapter: { zh: "第七卷·洞穴寓言", en: "Book VII: Allegory of the Cave" },
    excerpt: {
      zh: "洞穴中的囚徒只能看到影子，而哲学家转向光明，看到了事物的真实形式。",
      en: "The prisoners in the cave see only shadows; the philosopher turns toward the light and perceives the true Forms of things.",
    },
  },
  // 亚里士多德
  {
    philosopherId: "aristotle",
    title: { zh: "形而上学", en: "Metaphysics" },
    year: -350,
    chapter: { zh: "第四卷", en: "Book IV" },
    excerpt: {
      zh: "存在之为存在，以及存在本身所具有的属性，乃是我们所要研究的。",
      en: "There is a science which investigates being as being and the attributes which belong to this in virtue of its own nature.",
    },
  },
  // 笛卡尔
  {
    philosopherId: "descartes",
    title: { zh: "第一哲学沉思集", en: "Meditations on First Philosophy" },
    year: 1641,
    chapter: { zh: "第二沉思", en: "Second Meditation" },
    excerpt: {
      zh: "我思故我在。即便一个恶魔在欺骗我，我在怀疑这一事实本身就证明了我的存在。",
      en: "I think, therefore I am. Even if a demon deceives me, the very act of doubting proves my existence.",
    },
  },
  // 康德
  {
    philosopherId: "kant",
    title: { zh: "纯粹理性批判", en: "Critique of Pure Reason" },
    year: 1781,
    chapter: { zh: "导论", en: "Introduction" },
    excerpt: {
      zh: "直观无概念则盲，概念无直观则空。",
      en: "Thoughts without content are empty, intuitions without concepts are blind.",
    },
  },
  // 尼采
  {
    philosopherId: "nietzsche",
    title: { zh: "查拉图斯特拉如是说", en: "Thus Spoke Zarathustra" },
    year: 1883,
    chapter: { zh: "序言", en: "Prologue" },
    excerpt: {
      zh: "人是一根绳索，系于动物与超人之间——一根悬于深渊之上的绳索。",
      en: "Man is a rope stretched between the animal and the Übermensch — a rope over an abyss.",
    },
  },
  // 维特根斯坦
  {
    philosopherId: "wittgenstein",
    title: { zh: "逻辑哲学论", en: "Tractatus Logico-Philosophicus" },
    year: 1921,
    chapter: { zh: "命题7", en: "Proposition 7" },
    excerpt: {
      zh: "对于不可言说之物，必须保持沉默。",
      en: "Whereof one cannot speak, thereof one must be silent.",
    },
  },
  // 孔子
  {
    philosopherId: "kongzi",
    title: { zh: "论语", en: "The Analects" },
    year: -479,
    chapter: { zh: "颜渊篇", en: "Yan Yuan" },
    excerpt: {
      zh: "仁者爱人。己所不欲，勿施于人。",
      en: "The benevolent person loves others. Do not impose on others what you do not wish for yourself.",
    },
  },
  // 老子
  {
    philosopherId: "laozi",
    title: { zh: "道德经", en: "Tao Te Ching" },
    year: -500,
    chapter: { zh: "第一章", en: "Chapter 1" },
    excerpt: {
      zh: "道可道，非常道；名可名，非常名。无名天地之始，有名万物之母。",
      en: "The Tao that can be told is not the eternal Tao. The name that can be named is not the eternal name.",
    },
  },
  // 董仲舒
  {
    philosopherId: "dongzhongshu",
    title: { zh: "春秋繁露", en: "Luxuriant Dew of the Spring and Autumn Annals" },
    year: -140,
    chapter: { zh: "深察名号", en: "Deep Investigation of Names" },
    excerpt: {
      zh: "天人之际，合而为一。天亦有喜怒之气，哀乐之心，与人相副。",
      en: "Heaven and humanity are united as one. Heaven also has emotions of joy and anger, feelings of sorrow and happiness, corresponding to humans.",
    },
  },
  // 慧能
  {
    philosopherId: "huineng",
    title: { zh: "六祖坛经", en: "Platform Sutra" },
    year: 700,
    chapter: { zh: "行由品", en: "Chapter on Origins" },
    excerpt: {
      zh: "菩提本无树，明镜亦非台。本来无一物，何处惹尘埃。",
      en: "Bodhi originally has no tree, the mirror also has no stand. Originally there is not a single thing, where can dust alight?",
    },
  },
  // 朱熹
  {
    philosopherId: "zhuxi",
    title: { zh: "四书章句集注", en: "Collected Commentaries on the Four Books" },
    year: 1177,
    chapter: { zh: "大学章句", en: "Commentary on the Great Learning" },
    excerpt: {
      zh: "所谓致知在格物者，言欲致吾之知，在即物而穷其理也。",
      en: "What is meant by 'the extension of knowledge lies in the investigation of things' is that to extend our knowledge we must fathom the principle in things.",
    },
  },
  // 王阳明
  {
    philosopherId: "wangyangming",
    title: { zh: "传习录", en: "Instructions for Practical Living" },
    year: 1518,
    chapter: { zh: "上卷", en: "Volume I" },
    excerpt: {
      zh: "知是行之始，行是知之成。知行本体，原是如此。",
      en: "Knowledge is the beginning of action; action is the completion of knowledge. The original substance of knowledge and action is like this.",
    },
  },
];


// --- 概念网络节点 ---
// 西方演变链: Being → Substance → Subject → Language
// 中国演变链: 道/无 → 理/气 → 心/良知

export const conceptNodes: ConceptNode[] = [
  // 西方概念演变链
  {
    id: "being",
    term: { zh: "存在 (Being)", en: "Being" },
    tradition: "western",
    definition: {
      zh: "古希腊哲学的核心问题，探讨「是什么」的本质。柏拉图将其与理念关联，亚里士多德则研究「存在之为存在」。",
      en: "The central question of ancient Greek philosophy, exploring the essence of 'what is'. Plato linked it to Forms, Aristotle studied 'being qua being'."
    },
    source: { work: { zh: "形而上学", en: "Metaphysics" }, chapter: "Book IV" },
    coOccurrence: ["Substance", "Form", "Essence", "Truth"],
    weight: 0.95,
  },
  {
    id: "substance",
    term: { zh: "实体 (Substance)", en: "Substance" },
    tradition: "western",
    definition: {
      zh: "亚里士多德哲学的核心范畴，指独立存在、作为属性承载者的基本实在。笛卡尔将其发展为心物二元的实体概念。",
      en: "Core category in Aristotelian philosophy, referring to independent existence as the bearer of properties. Descartes developed it into mind-body dualism."
    },
    source: { work: { zh: "范畴篇", en: "Categories" }, chapter: "Chapter 5" },
    coOccurrence: ["Being", "Attribute", "Matter", "Form"],
    weight: 0.92,
  },
  {
    id: "subject",
    term: { zh: "主体 (Subject)", en: "Subject" },
    tradition: "western",
    definition: {
      zh: "近代哲学的核心概念，笛卡尔的「我思」确立了认识主体的优先地位，康德进一步发展为先验主体。",
      en: "Core concept of modern philosophy. Descartes' 'Cogito' established the primacy of the knowing subject, Kant developed it into the transcendental subject."
    },
    source: { work: { zh: "第一哲学沉思集", en: "Meditations" }, chapter: "Second Meditation" },
    coOccurrence: ["Cogito", "Consciousness", "Object", "Knowledge"],
    weight: 0.94,
  },
  {
    id: "language",
    term: { zh: "语言 (Language)", en: "Language" },
    tradition: "western",
    definition: {
      zh: "20世纪哲学的「语言学转向」核心。维特根斯坦认为哲学问题是语言问题，语言的界限即世界的界限。",
      en: "Core of the 20th century 'linguistic turn'. Wittgenstein argued philosophical problems are language problems; the limits of language are the limits of the world."
    },
    source: { work: { zh: "逻辑哲学论", en: "Tractatus" }, chapter: "Proposition 5.6" },
    coOccurrence: ["Meaning", "Logic", "Game", "Form of Life"],
    weight: 0.90,
  },
  // 中国概念演变链
  {
    id: "dao",
    term: { zh: "道/无", en: "Tao/Wu" },
    tradition: "chinese",
    definition: {
      zh: "道家哲学的最高范畴。道是宇宙万物的本源和规律，无是道的本体状态，强调超越有限、回归本真。",
      en: "The highest category in Taoist philosophy. Tao is the origin and principle of all things; Wu (nothingness) is the ontological state of Tao."
    },
    source: { work: { zh: "道德经", en: "Tao Te Ching" }, chapter: "Chapter 1" },
    coOccurrence: ["自然", "无为", "德", "有"],
    weight: 0.98,
  },
  {
    id: "liqi",
    term: { zh: "理/气", en: "Li/Qi" },
    tradition: "chinese",
    definition: {
      zh: "宋明理学的核心范畴。理是形而上的本体和规律，气是形而下的质料。朱熹主张理先气后，理气不离不杂。",
      en: "Core categories of Neo-Confucianism. Li is the metaphysical principle, Qi is the material force. Zhu Xi argued Li precedes Qi, they are inseparable yet distinct."
    },
    source: { work: { zh: "四书章句集注", en: "Collected Commentaries" }, chapter: "大学章句" },
    coOccurrence: ["太极", "格物", "天理", "人欲"],
    weight: 0.96,
  },
  {
    id: "xinliangzhi",
    term: { zh: "心/良知", en: "Mind/Liangzhi" },
    tradition: "chinese",
    definition: {
      zh: "心学的核心范畴。王阳明主张「心即理」，良知是心之本体，是先天的道德意识，致良知即实现道德自觉。",
      en: "Core category of the School of Mind. Wang Yangming argued 'Mind is Principle', Liangzhi is the innate moral consciousness."
    },
    source: { work: { zh: "传习录", en: "Instructions for Practical Living" }, chapter: "上卷" },
    coOccurrence: ["知行合一", "致良知", "心即理", "格物"],
    weight: 0.95,
  },
];

// --- 概念演变边 ---

export const conceptEdges: ConceptEdge[] = [
  // 西方演变链
  { source: "being", target: "substance", relation: "evolution" },
  { source: "substance", target: "subject", relation: "evolution" },
  { source: "subject", target: "language", relation: "evolution" },
  // 中国演变链
  { source: "dao", target: "liqi", relation: "evolution" },
  { source: "liqi", target: "xinliangzhi", relation: "evolution" },
  // 跨文化关联
  { source: "being", target: "dao", relation: "contrast" },
  { source: "liqi", target: "substance", relation: "contrast" },
  { source: "subject", target: "xinliangzhi", relation: "contrast" },
];


// --- 概念投影坐标 (用于散点图) ---
// 基于预计算的词向量，投射到二维平面

export const conceptProjections: ConceptProjection[] = [
  // 西方概念
  { conceptId: "being", term: { zh: "存在", en: "Being" }, tradition: "western", x: 0.75, y: 0.85 },
  { conceptId: "substance", term: { zh: "实体", en: "Substance" }, tradition: "western", x: 0.65, y: 0.70 },
  { conceptId: "subject", term: { zh: "主体", en: "Subject" }, tradition: "western", x: 0.80, y: 0.45 },
  { conceptId: "language", term: { zh: "语言", en: "Language" }, tradition: "western", x: 0.90, y: 0.25 },
  { conceptId: "form", term: { zh: "理念/形式", en: "Form/Idea" }, tradition: "western", x: 0.70, y: 0.90 },
  { conceptId: "cogito", term: { zh: "我思", en: "Cogito" }, tradition: "western", x: 0.85, y: 0.50 },
  { conceptId: "noumenon", term: { zh: "物自体", en: "Thing-in-itself" }, tradition: "western", x: 0.55, y: 0.75 },
  { conceptId: "will", term: { zh: "权力意志", en: "Will to Power" }, tradition: "western", x: 0.95, y: 0.35 },
  // 中国概念
  { conceptId: "dao", term: { zh: "道", en: "Tao" }, tradition: "chinese", x: 0.20, y: 0.88 },
  { conceptId: "wu", term: { zh: "无", en: "Wu/Nothingness" }, tradition: "chinese", x: 0.15, y: 0.92 },
  { conceptId: "li", term: { zh: "理", en: "Li/Principle" }, tradition: "chinese", x: 0.35, y: 0.80 },
  { conceptId: "qi", term: { zh: "气", en: "Qi" }, tradition: "chinese", x: 0.30, y: 0.60 },
  { conceptId: "xin", term: { zh: "心", en: "Mind/Xin" }, tradition: "chinese", x: 0.40, y: 0.55 },
  { conceptId: "liangzhi", term: { zh: "良知", en: "Liangzhi" }, tradition: "chinese", x: 0.45, y: 0.50 },
  { conceptId: "ren", term: { zh: "仁", en: "Ren/Benevolence" }, tradition: "chinese", x: 0.25, y: 0.40 },
  { conceptId: "tianren", term: { zh: "天人感应", en: "Heaven-Human Correlation" }, tradition: "chinese", x: 0.28, y: 0.70 },
];

// --- 雷达图维度评分 ---

export const radarDimensions: RadarDimension[] = [
  // 西方概念
  { conceptId: "being", ontology: 95, epistemology: 70, ethics: 40, aesthetics: 50, logic: 80 },
  { conceptId: "substance", ontology: 90, epistemology: 75, ethics: 30, aesthetics: 35, logic: 85 },
  { conceptId: "subject", ontology: 70, epistemology: 95, ethics: 60, aesthetics: 55, logic: 75 },
  { conceptId: "language", ontology: 50, epistemology: 85, ethics: 40, aesthetics: 60, logic: 95 },
  { conceptId: "form", ontology: 92, epistemology: 80, ethics: 65, aesthetics: 85, logic: 70 },
  { conceptId: "cogito", ontology: 75, epistemology: 98, ethics: 50, aesthetics: 40, logic: 80 },
  { conceptId: "noumenon", ontology: 88, epistemology: 90, ethics: 70, aesthetics: 60, logic: 75 },
  { conceptId: "will", ontology: 65, epistemology: 60, ethics: 85, aesthetics: 90, logic: 45 },
  // 中国概念
  { conceptId: "dao", ontology: 98, epistemology: 75, ethics: 80, aesthetics: 90, logic: 40 },
  { conceptId: "wu", ontology: 95, epistemology: 65, ethics: 70, aesthetics: 85, logic: 35 },
  { conceptId: "li", ontology: 92, epistemology: 85, ethics: 88, aesthetics: 60, logic: 70 },
  { conceptId: "qi", ontology: 80, epistemology: 70, ethics: 50, aesthetics: 55, logic: 45 },
  { conceptId: "xin", ontology: 75, epistemology: 88, ethics: 92, aesthetics: 70, logic: 55 },
  { conceptId: "liangzhi", ontology: 70, epistemology: 85, ethics: 98, aesthetics: 65, logic: 50 },
  { conceptId: "ren", ontology: 55, epistemology: 60, ethics: 98, aesthetics: 75, logic: 40 },
  { conceptId: "tianren", ontology: 85, epistemology: 70, ethics: 80, aesthetics: 65, logic: 50 },
  // 概念网络中的复合概念
  { conceptId: "liqi", ontology: 92, epistemology: 82, ethics: 75, aesthetics: 58, logic: 68 },
  { conceptId: "xinliangzhi", ontology: 73, epistemology: 87, ethics: 95, aesthetics: 68, logic: 53 },
];

// --- 辅助函数 ---

export function getPhilosopherById(id: string): Philosopher | undefined {
  return philosophers.find(p => p.id === id);
}

export function getPhilosophersByTradition(tradition: "western" | "chinese"): Philosopher[] {
  return philosophers.filter(p => p.tradition === tradition);
}

export function getCoreTextsByPhilosopher(philosopherId: string): CoreText[] {
  return coreTexts.filter(t => t.philosopherId === philosopherId);
}

export function getConceptById(id: string): ConceptNode | undefined {
  return conceptNodes.find(c => c.id === id);
}

export function getConceptsByTradition(tradition: "western" | "chinese"): ConceptNode[] {
  return conceptNodes.filter(c => c.tradition === tradition);
}

export function getRadarDataForConcept(conceptId: string): RadarDimension | undefined {
  return radarDimensions.find(r => r.conceptId === conceptId);
}

export function getProjectionForConcept(conceptId: string): ConceptProjection | undefined {
  return conceptProjections.find(p => p.conceptId === conceptId);
}
