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
  source: { work: { zh: string; en: string }; chapter?: { zh: string; en: string } };
  coOccurrence: { zh: string; en: string }[]; // 共现词汇
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

// --- 哲学家数据 ---

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
    id: "augustine",
    name: { zh: "奥古斯丁", en: "Augustine of Hippo" },
    birth: 354,
    death: 430,
    era: { zh: "罗马帝国晚期 (354-430)", en: "Late Roman Empire (354-430)" },
    avatar: "/avatars/augustine.svg",
    tradition: "western",
    summary: {
      zh: "早期基督教哲学集大成者。融合柏拉图哲学与基督教神学，提出自由意志、原罪、恩典等核心概念，其《忏悔录》开创了西方自传体哲学传统。",
      en: "Synthesizer of early Christian philosophy, integrated Platonism with Christian theology. Developed concepts of free will, original sin, and grace."
    },
    works: [
      { zh: "忏悔录", en: "Confessions" },
      { zh: "上帝之城", en: "The City of God" },
      { zh: "论自由意志", en: "On Free Choice of the Will" },
    ],
  },
  {
    id: "aquinas",
    name: { zh: "托马斯·阿奎那", en: "Thomas Aquinas" },
    birth: 1225,
    death: 1274,
    era: { zh: "中世纪经院哲学 (1225-1274)", en: "Medieval Scholasticism (1225-1274)" },
    avatar: "/avatars/aquinas.svg",
    tradition: "western",
    summary: {
      zh: "经院哲学集大成者。将亚里士多德哲学系统融入基督教神学，提出「存在与本质」的区分及「五路证明」，其体系后成为天主教官方哲学。",
      en: "The summit of Scholasticism, systematically integrated Aristotle into Christian theology. Distinguished existence from essence and formulated the Five Ways."
    },
    works: [
      { zh: "神学大全", en: "Summa Theologica" },
      { zh: "反异教大全", en: "Summa Contra Gentiles" },
      { zh: "论存在者与本质", en: "On Being and Essence" },
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
      { zh: "近思录", en: "Reflections on Things at Hand" },
    ],
  },
  {
    id: "wangyangming",
    name: { zh: "王阳明", en: "Wang Yangming" },
    birth: 1472,
    death: 1529,
    era: { zh: "宋明心学 (1472-1529)", en: "School of Mind (1472-1529)" },
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
  // 奥古斯丁
  {
    philosopherId: "augustine",
    title: { zh: "忏悔录", en: "Confessions" },
    year: 397,
    chapter: { zh: "第十一卷", en: "Book XI" },
    excerpt: {
      zh: "时间是什么？若无人问我，我便知道；若要向提问者解释，我便不知道。",
      en: "What then is time? If no one asks me, I know; if I wish to explain it to someone who asks, I know not.",
    },
  },
  // 阿奎那
  {
    philosopherId: "aquinas",
    title: { zh: "神学大全", en: "Summa Theologica" },
    year: 1265,
    chapter: { zh: "第一部分·第二题", en: "Part I, Question 2" },
    excerpt: {
      zh: "存在与本质是理智首先把握的东西。存在是一切现实活动的现实性，是一切完善性的完善性。",
      en: "Being is that which the intellect first conceives. Existence is the actuality of all acts, and therefore the perfection of all perfections.",
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
// 西方演变链: Being → Form → Substance → Cogito → Subject → Noumenon → Language → Will
// 中国演变链（按历史时序）:
//   先秦道家: 道 → 无
//   先秦儒家: 仁 → 天人感应
//   宋明汇合: 道 → 理, 仁 → 理（朱熹综合先秦儒道）
//   宋明展开: 理 → 气, 理 → 心 → 良知
// 注：这些链条展示概念间的主题发展关系，而非线性进步

export const conceptNodes: ConceptNode[] = [
  // 西方概念
  {
    id: "being",
    term: { zh: "存在", en: "Being" },
    tradition: "western",
    definition: {
      zh: "古希腊哲学的核心问题，探讨「是什么」的本质。柏拉图将其与理念关联，亚里士多德则研究「存在之为存在」。",
      en: "The central question of ancient Greek philosophy, exploring the essence of 'what is'. Plato linked it to Forms, Aristotle studied 'being qua being'."
    },
    source: { work: { zh: "形而上学", en: "Metaphysics" }, chapter: { zh: "第四卷", en: "Book IV" } },
    coOccurrence: [{ zh: "实体", en: "Substance" }, { zh: "形式", en: "Form" }, { zh: "本质", en: "Essence" }, { zh: "真理", en: "Truth" }],
    weight: 0.95,
  },
  {
    id: "form",
    term: { zh: "理念/形式", en: "Form/Idea" },
    tradition: "western",
    definition: {
      zh: "柏拉图哲学的核心，认为现实世界是理念世界的影子，理念是完美、永恒、不变的原型。",
      en: "Central to Plato's philosophy, the eternal, perfect, unchanging archetypes of which the material world is a copy."
    },
    source: { work: { zh: "理想国", en: "The Republic" }, chapter: { zh: "第七卷", en: "Book VII" } },
    coOccurrence: [{ zh: "存在", en: "Being" }, { zh: "本质", en: "Essence" }, { zh: "真理", en: "Truth" }, { zh: "善", en: "Good" }],
    weight: 0.93,
  },
  {
    id: "substance",
    term: { zh: "实体", en: "Substance" },
    tradition: "western",
    definition: {
      zh: "亚里士多德哲学的核心范畴，指独立存在、作为属性承载者的基本实在。笛卡尔将其发展为心物二元的实体概念。",
      en: "Core category in Aristotelian philosophy, referring to independent existence as the bearer of properties. Descartes developed it into mind-body dualism."
    },
    source: { work: { zh: "范畴篇", en: "Categories" }, chapter: { zh: "第五章", en: "Chapter 5" } },
    coOccurrence: [{ zh: "存在", en: "Being" }, { zh: "属性", en: "Attribute" }, { zh: "质料", en: "Matter" }, { zh: "形式", en: "Form" }],
    weight: 0.92,
  },
  {
    id: "cogito",
    term: { zh: "我思", en: "Cogito" },
    tradition: "western",
    definition: {
      zh: "笛卡尔的「我思故我在」，将思维自为的主体确立为知识的不可动摇基础，标志着现代主体性哲学的开端。",
      en: "Descartes' 'Cogito ergo sum', establishing the thinking self as the indubitable foundation of knowledge, marking the birth of modern subjectivity."
    },
    source: { work: { zh: "第一哲学沉思集", en: "Meditations" }, chapter: { zh: "第二沉思", en: "Second Meditation" } },
    coOccurrence: [{ zh: "主体", en: "Subject" }, { zh: "意识", en: "Consciousness" }, { zh: "怀疑", en: "Doubt" }, { zh: "确定性", en: "Certainty" }],
    weight: 0.91,
  },
  {
    id: "subject",
    term: { zh: "主体", en: "Subject" },
    tradition: "western",
    definition: {
      zh: "近代哲学的核心概念，笛卡尔的「我思」确立了认识主体的优先地位，康德进一步发展为先验主体。",
      en: "Core concept of modern philosophy. Descartes' 'Cogito' established the primacy of the knowing subject, Kant developed it into the transcendental subject."
    },
    source: { work: { zh: "第一哲学沉思集", en: "Meditations" }, chapter: { zh: "第二沉思", en: "Second Meditation" } },
    coOccurrence: [{ zh: "我思", en: "Cogito" }, { zh: "意识", en: "Consciousness" }, { zh: "客体", en: "Object" }, { zh: "知识", en: "Knowledge" }],
    weight: 0.94,
  },
  {
    id: "noumenon",
    term: { zh: "物自体", en: "Thing-in-itself" },
    tradition: "western",
    definition: {
      zh: "康德的「物自体」，指独立于我们的感知之外的事实。我们永远不能直接认识物自体，只能知道现象。",
      en: "Kant's 'thing-in-itself', the reality as it is independent of our perception. We can never know it directly, only phenomena."
    },
    source: { work: { zh: "纯粹理性批判", en: "Critique of Pure Reason" }, chapter: { zh: "先验分析论", en: "Transcendental Analytic" } },
    coOccurrence: [{ zh: "现象", en: "Phenomenon" }, { zh: "表象", en: "Appearance" }, { zh: "界限", en: "Limit" }, { zh: "理性", en: "Reason" }],
    weight: 0.89,
  },
  {
    id: "language",
    term: { zh: "语言", en: "Language" },
    tradition: "western",
    definition: {
      zh: "20世纪哲学的「语言学转向」核心。维特根斯坦认为哲学问题是语言问题，语言的界限即世界的界限。",
      en: "Core of the 20th century 'linguistic turn'. Wittgenstein argued philosophical problems are language problems; the limits of language are the limits of the world."
    },
    source: { work: { zh: "逻辑哲学论", en: "Tractatus" }, chapter: { zh: "命题5.6", en: "Proposition 5.6" } },
    coOccurrence: [{ zh: "意义", en: "Meaning" }, { zh: "逻辑", en: "Logic" }, { zh: "游戏", en: "Game" }, { zh: "生活形式", en: "Form of Life" }],
    weight: 0.90,
  },
  {
    id: "will",
    term: { zh: "权力意志", en: "Will to Power" },
    tradition: "western",
    definition: {
      zh: "尼采的「权力意志」，认为所有生命的根本驱动力是追求力量和自我超越，批判传统道德和价值观。",
      en: "Nietzsche's 'will to power', the fundamental driving force in all life to seek strength and self-overcoming, critiquing traditional morality."
    },
    source: { work: { zh: "查拉图斯特拉如是说", en: "Thus Spoke Zarathustra" }, chapter: { zh: "序言", en: "Prologue" } },
    coOccurrence: [{ zh: "力量", en: "Power" }, { zh: "价值", en: "Value" }, { zh: "虚无主义", en: "Nihilism" }, { zh: "超人", en: "Overman" }],
    weight: 0.88,
  },
  // 中国概念
  {
    id: "dao",
    term: { zh: "道", en: "Tao" },
    tradition: "chinese",
    definition: {
      zh: "道家哲学的最高范畴。道是宇宙万物的本源和规律，强调超越有限、回归本真、顺应自然。",
      en: "The highest category in Taoist philosophy. Tao is the origin and principle of all things, emphasizing transcendence of the finite and return to authenticity."
    },
    source: { work: { zh: "道德经", en: "Tao Te Ching" }, chapter: { zh: "第一章", en: "Chapter 1" } },
    coOccurrence: [{ zh: "自然", en: "Ziran (Nature)" }, { zh: "无为", en: "Wu-wei (Non-action)" }, { zh: "德", en: "De (Virtue)" }, { zh: "有", en: "You (Being)" }],
    weight: 0.98,
  },
  {
    id: "wu",
    term: { zh: "无", en: "Wu/Nothingness" },
    tradition: "chinese",
    definition: {
      zh: "道的本体状态。无不是一种虚空、潜势的存在方式，是万物生成的源泉，强调非为而无为。",
      en: "The ontological state of the Tao. Wu (nothingness) is a mode of being characterized by emptiness and potential, the source of all things."
    },
    source: { work: { zh: "道德经", en: "Tao Te Ching" }, chapter: { zh: "第二章", en: "Chapter 2" } },
    coOccurrence: [{ zh: "道", en: "Tao" }, { zh: "自然", en: "Ziran (Nature)" }, { zh: "无为", en: "Wu-wei" }, { zh: "虚", en: "Xu (Emptiness)" }],
    weight: 0.96,
  },
  {
    id: "li",
    term: { zh: "理", en: "Li/Principle" },
    tradition: "chinese",
    definition: {
      zh: "宋明理学的形而上本体。理是宇宙的内在规律和模式，是一切事物的根本原理，先于气而立。",
      en: "The metaphysical principle in Neo-Confucianism. Li is the inherent pattern and law of the universe, the fundamental principle of all things."
    },
    source: { work: { zh: "四书章句集注", en: "Collected Commentaries" }, chapter: { zh: "大学章句", en: "Commentary on the Great Learning" } },
    coOccurrence: [{ zh: "太极", en: "Taiji (Supreme Ultimate)" }, { zh: "格物", en: "Gewu (Investigation of Things)" }, { zh: "天理", en: "Tianli (Heavenly Principle)" }, { zh: "人欲", en: "Renyu (Human Desire)" }],
    weight: 0.94,
  },
  {
    id: "qi",
    term: { zh: "气", en: "Qi" },
    tradition: "chinese",
    definition: {
      zh: "宋明理学的形而下质料。气是构成物质的活力，与理不可分离，共同构成万物的存在。",
      en: "The material force in Neo-Confucianism. Qi is the vital energy constituting matter, inseparable from Li, together forming all phenomena."
    },
    source: { work: { zh: "四书章句集注", en: "Collected Commentaries" }, chapter: { zh: "大学章句", en: "Commentary on the Great Learning" } },
    coOccurrence: [{ zh: "理", en: "Li (Principle)" }, { zh: "太极", en: "Taiji (Supreme Ultimate)" }, { zh: "阴阳", en: "Yin-Yang" }, { zh: "五行", en: "Wuxing (Five Phases)" }],
    weight: 0.90,
  },

  {
    id: "xin",
    term: { zh: "心", en: "Mind/Xin" },
    tradition: "chinese",
    definition: {
      zh: "心学的核心。心是 cognition、情感和道德直觉的统一源泉，是人性的本体，与理不可分。",
      en: "The core of the School of Mind. Mind is the unified source of cognition, emotion, and moral intuition, the ontological basis of human nature."
    },
    source: { work: { zh: "传习录", en: "Instructions for Practical Living" }, chapter: { zh: "上卷", en: "Volume I" } },
    coOccurrence: [{ zh: "良知", en: "Liangzhi (Innate Knowledge)" }, { zh: "道德", en: "Morality" }, { zh: "觉知", en: "Awareness" }, { zh: "情", en: "Qing (Emotion)" }],
    weight: 0.93,
  },
  {
    id: "liangzhi",
    term: { zh: "良知", en: "Liangzhi" },
    tradition: "chinese",
    definition: {
      zh: "心学的道德直觉。良知是先天的道德意识，能够即时分别是非，王阳明称其为「心即理」的直接显现。",
      en: "Moral intuition in the School of Mind. Liangzhi is the innate moral consciousness that immediately distinguishes right from wrong."
    },
    source: { work: { zh: "传习录", en: "Instructions for Practical Living" }, chapter: { zh: "上卷", en: "Volume I" } },
    coOccurrence: [{ zh: "心", en: "Xin (Mind)" }, { zh: "知行合一", en: "Unity of Knowledge and Action" }, { zh: "致良知", en: "Extension of Innate Knowledge" }, { zh: "道德", en: "Morality" }],
    weight: 0.91,
  },

  {
    id: "ren",
    term: { zh: "仁", en: "Ren/Benevolence" },
    tradition: "chinese",
    definition: {
      zh: "儒家的核心美德。仁是爱人之心，包括同情、关怀和对他人的善意，是人际关系的道德基础。",
      en: "The core virtue of Confucianism. Ren is the heart of loving others, encompassing compassion, care, and goodwill toward others."
    },
    source: { work: { zh: "论语", en: "The Analects" }, chapter: { zh: "颜渊篇", en: "Yan Yuan Chapter" } },
    coOccurrence: [{ zh: "礼", en: "Li (Ritual)" }, { zh: "义", en: "Yi (Righteousness)" }, { zh: "中庸", en: "Zhongyong (Mean)" }, { zh: "爱人", en: "Loving Others" }],
    weight: 0.87,
  },
  {
    id: "tianren",
    term: { zh: "天人感应", en: "Heaven-Human Correlation" },
    tradition: "chinese",
    definition: {
      zh: "汉代儒学的宇宙伦理学。天人感应是天与人之间的对应关系，天的变化反映在人身上，人德感动天。",
      en: "Cosmic ethics in Han Confucianism. The correlation between Heaven and humanity, where Heaven's changes are reflected in humans."
    },
    source: { work: { zh: "春秋繁露", en: "Luxuriant Dew" }, chapter: { zh: "深察名号", en: "Deep Investigation of Names" } },
    coOccurrence: [{ zh: "天理", en: "Tianli (Heavenly Principle)" }, { zh: "人德", en: "Rende (Human Virtue)" }, { zh: "阴阳", en: "Yin-Yang" }, { zh: "五行", en: "Wuxing (Five Phases)" }],
    weight: 0.85,
  },
];

// --- 概念演变边 ---
// 注：「evolution」表示概念间的主题发展关系（非线性进步），
// 「contrast」表示跨文化的对立或差异关系

export const conceptEdges: ConceptEdge[] = [
  // 西方演变链: Being → Form → Substance → Cogito → Subject → Noumenon → Language → Will
  { source: "being", target: "form", relation: "evolution" },
  { source: "form", target: "substance", relation: "evolution" },
  { source: "substance", target: "cogito", relation: "evolution" },
  { source: "cogito", target: "subject", relation: "evolution" },
  { source: "subject", target: "noumenon", relation: "evolution" },
  { source: "noumenon", target: "language", relation: "evolution" },
  { source: "subject", target: "will", relation: "evolution" },
  // 中国演变链（按历史时序）:
  // 先秦道家线: 道 → 无
  // 先秦儒家线: 仁 → 天人感应
  // 宋明理学线: 道 → 理, 仁 → 理, 理 → 气, 理 → 心 → 良知
  { source: "dao", target: "wu", relation: "evolution" },
  { source: "ren", target: "tianren", relation: "evolution" },
  { source: "dao", target: "li", relation: "evolution" },
  { source: "ren", target: "li", relation: "evolution" },
  { source: "li", target: "qi", relation: "evolution" },
  { source: "li", target: "xin", relation: "evolution" },
  { source: "xin", target: "liangzhi", relation: "evolution" },
  // 跨文化对比（附学理说明）
  // Being ↔ Dao: 最高本体论范畴——一个导向系词逻辑，一个导向悖论式自否
  { source: "being", target: "dao", relation: "contrast" },
  // Form ↔ Li: 超越个体的普遍原则——Form超越于事物（分离），Li内在于事物（理在气中）
  { source: "form", target: "li", relation: "contrast" },
  // Substance ↔ Qi: 构成万物的基底——Substance要求持存性，Qi拥抱流变性
  { source: "substance", target: "qi", relation: "contrast" },
  // Cogito ↔ Xin: 主体性的确立——Cogito纯粹认知性，Xin兼具认知与道德
  { source: "cogito", target: "xin", relation: "contrast" },
  // Subject ↔ Xin: 主体性问题的不同回答
  { source: "subject", target: "xin", relation: "contrast" },
  // Noumenon ↔ Wu: 认识边界——不可知者与不可名者
  { source: "noumenon", target: "wu", relation: "contrast" },
  // Noumenon ↔ Dao: 超越现象的终极实在
  { source: "noumenon", target: "dao", relation: "contrast" },
  // Will to Power ↔ Liangzhi: 行动驱力——探索性对照，争议较大
  { source: "will", target: "liangzhi", relation: "contrast" },
];


// --- 概念投影坐标 (用于散点图) ---
// 基于预计算的词向量，投射到二维平面
// x轴: 抽象 ← → 具体 (Abstract - Concrete)
// y轴: 实践 ← → 形而上 (Practical - Metaphysical)
// 注：坐标来自词向量降维，轴标签为解释性标注，不代表绝对定义

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
// 评分基于专家判断，反映概念在五大哲学维度上的倾向性强度 (0-100)

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