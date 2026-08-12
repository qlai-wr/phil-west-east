# 需求文档：中西方哲学概念演变与跨文化映射可视化平台

## 简介

本项目旨在构建一个数字人文可视化网站，用于展示中西方哲学核心概念的历史演变轨迹，并通过跨文化语义映射技术揭示两大哲学传统之间的深层关联。平台采用 Next.js + Tailwind CSS 作为前端框架，结合 ECharts / D3.js 实现交互式数据可视化，使用预处理的静态 JSON 数据提供语义分析支持。

## 术语表

- **Platform（平台）**：本中西方哲学概念演变与跨文化映射可视化网站的整体系统
- **Timeline_Component（时间轴组件）**：负责渲染和管理双轨历史时间轴的前端交互模块
- **Concept_Network（概念网络）**：以拓扑图形式展示哲学概念演变链的可视化模块
- **Mapping_View（映射视图）**：跨文化概念对比页面，包含散点图和雷达图
- **Philosopher_Node（哲学家节点）**：时间轴上代表某位哲学家的可交互元素，包含姓名、时代和核心文本信息
- **Concept_Node（概念节点）**：概念网络中代表某个哲学概念的可交互元素，包含释义、文本出处和共现词汇
- **Vector_Distance（向量距离）**：通过预计算的词向量模型（如 Word2Vec）得出的两个哲学概念之间的语义相似度数值
- **Radar_Chart（雷达图）**：用于多维度对比两个哲学概念的图表组件
- **Scatter_Plot（散点图）**：将中西方哲学词汇投射到二维平面上展示语义距离的 D3.js 图表
- **JSON_Data_Source（JSON 数据源）**：存储哲学家信息、概念释义、向量距离等预处理数据的静态 JSON 文件集合
- **Co_occurrence_Vocabulary（共现词汇）**：与某个哲学概念在原始文本中频繁共同出现的相关词汇列表
- **Western_Track（西方轨道）**：时间轴中展示西方哲学家序列的水平轨道
- **Chinese_Track（中国轨道）**：时间轴中展示中国哲学家序列的水平轨道

---

## 需求

### 需求 1：双轨历史时间轴渲染

**用户故事：** 作为一名哲学研究者，我希望在一个双轨时间轴上同时查看中西方哲学家的历史分布，以便直观理解两大传统的时间对应关系。

#### 验收标准

1. THE Platform SHALL 在页面中渲染一个包含 Western_Track 和 Chinese_Track 的双轨水平时间轴
2. THE Timeline_Component SHALL 在 Western_Track 上按时间顺序展示以下 Philosopher_Node：柏拉图、亚里士多德、笛卡尔、康德、尼采、维特根斯坦
3. THE Timeline_Component SHALL 在 Chinese_Track 上按时间顺序展示以下 Philosopher_Node：孔子、老子、董仲舒、慧能、朱熹、王阳明
4. THE Timeline_Component SHALL 为每个 Philosopher_Node 展示姓名和所处时代的年份范围

### 需求 2：时间轴交互与同期高亮

**用户故事：** 作为一名哲学研究者，我希望通过滑动时间轴来高亮同一时期的中西方哲学家，以便发现跨文化的思想同步现象。

#### 验收标准

1. WHEN 用户在 Timeline_Component 上拖动时间滑块至某一年份区间时, THE Timeline_Component SHALL 高亮显示该年份区间内活跃的所有 Philosopher_Node
2. WHEN 某个 Philosopher_Node 被高亮时, THE Timeline_Component SHALL 在该节点旁展示该哲学家的核心文本名称
3. WHEN 用户点击某个 Philosopher_Node 时, THE Timeline_Component SHALL 展示该哲学家的详细信息面板，包含生卒年份、主要著作列表和核心思想摘要
4. WHILE 时间滑块处于拖动状态时, THE Timeline_Component SHALL 实时更新高亮状态，响应延迟不超过 100 毫秒

### 需求 3：概念网络拓扑图渲染

**用户故事：** 作为一名哲学研究者，我希望以网络拓扑图的形式查看哲学概念的演变链，以便理解核心概念之间的传承与转化关系。

#### 验收标准

1. THE Concept_Network SHALL 渲染西方核心概念演变链：Being → Form → Substance → Cogito → Subject → Noumenon → Language（另有 Subject → Will 分支），其中每个概念以 Concept_Node 形式呈现，相邻概念之间以有向边连接
2. THE Concept_Network SHALL 渲染中国核心概念演变链，按历史时序分为：先秦道家线（道 → 无）、先秦儒家线（仁 → 天人感应）、宋明汇合线（道 → 理、仁 → 理）、宋明展开线（理 → 气、理 → 心 → 良知），其中每个概念以 Concept_Node 形式呈现，相邻概念之间以有向边连接
3. THE Concept_Network SHALL 通过视觉区分（靛蓝色代表西方、朱砂色代表中国）标识概念节点的所属传统
4. THE Concept_Network SHALL 以实线箭头表示演变关系、虚线无箭头表示跨文化对照关系
5. THE Concept_Network SHALL 支持用户通过鼠标拖拽平移和滚轮缩放来浏览拓扑图

### 需求 4：概念节点详情交互

**用户故事：** 作为一名哲学研究者，我希望点击概念网络中的节点来查看详细释义和文本出处，以便深入理解每个概念的内涵与学术背景。

#### 验收标准

1. WHEN 用户点击某个 Concept_Node 时, THE Concept_Network SHALL 展示该概念的详情面板
2. THE Concept_Network SHALL 在详情面板中展示以下信息：概念释义文本、文本出处（包含著作名称和章节引用）、以及 Co_occurrence_Vocabulary 列表
3. WHEN 用户点击详情面板中的某个 Co_occurrence_Vocabulary 条目时, THE Concept_Network SHALL 在拓扑图中高亮该共现词汇对应的 Concept_Node（若该节点存在于图中）
4. WHEN 用户点击详情面板外部区域或按下 Escape 键时, THE Concept_Network SHALL 关闭当前详情面板

### 需求 5：跨文化语义散点图

**用户故事：** 作为一名哲学研究者，我希望在一个散点图中查看中西方哲学词汇的语义分布，以便通过空间距离直观感知不同概念之间的语义相似度。

#### 验收标准

1. THE Mapping_View SHALL 使用 D3.js 渲染一个二维 Scatter_Plot，将中西方核心哲学词汇基于预计算的 Vector_Distance 投射到同一坐标平面上
2. THE Scatter_Plot SHALL 通过不同颜色区分中国哲学词汇节点和西方哲学词汇节点
3. WHEN 用户将鼠标悬停在 Scatter_Plot 中的某个词汇节点上时, THE Mapping_View SHALL 展示该词汇的名称、所属传统（中国/西方）和与最近邻词汇的 Vector_Distance 数值
4. THE Mapping_View SHALL 从 JSON_Data_Source 中加载预计算的词向量坐标数据，加载完成前展示加载指示器

### 需求 6：双概念雷达图对比

**用户故事：** 作为一名哲学研究者，我希望选择两个中西方哲学概念进行多维度雷达图对比，以便从多个思想维度深入分析两个概念的异同。

#### 验收标准

1. THE Mapping_View SHALL 提供两个下拉选择器，允许用户分别从中国哲学概念列表和西方哲学概念列表中各选择一个概念
2. WHEN 用户选定两个概念后, THE Mapping_View SHALL 渲染一个 Radar_Chart，在多个思想维度（如本体论、认识论、伦理学、美学、逻辑学）上对比两个概念的评分
3. THE Radar_Chart SHALL 使用不同颜色的填充区域分别表示两个被对比的概念，并在图例中标注概念名称
4. WHEN 用户更改任一下拉选择器的选项时, THE Radar_Chart SHALL 在 300 毫秒内更新图表内容以反映新的对比组合

### 需求 7：JSON 数据源加载与解析

**用户故事：** 作为一名开发者，我希望平台能从静态 JSON 文件中加载所有哲学数据，以便无需后端服务即可独立运行前端应用。

#### 验收标准

1. THE Platform SHALL 从 JSON_Data_Source 中加载哲学家信息数据，包含姓名、生卒年份、所属传统、主要著作和核心思想摘要
2. THE Platform SHALL 从 JSON_Data_Source 中加载概念网络数据，包含概念名称、释义、文本出处、共现词汇和演变链关系
3. THE Platform SHALL 从 JSON_Data_Source 中加载预计算的词向量坐标数据和维度评分数据
4. IF JSON_Data_Source 文件加载失败, THEN THE Platform SHALL 在页面上展示明确的错误提示信息，说明加载失败的文件名称和建议的排查步骤
5. THE Platform SHALL 对加载的 JSON 数据进行结构校验，确保必填字段存在且数据类型正确

### 需求 8：JSON 数据格式化与往返一致性

**用户故事：** 作为一名开发者，我希望 JSON 数据的解析和序列化过程保持往返一致性，以便确保数据在读取和写入过程中不会丢失或变形。

#### 验收标准

1. THE Platform SHALL 提供 JSON 数据解析器，将 JSON_Data_Source 文件解析为类型化的数据对象
2. THE Platform SHALL 提供 JSON 数据格式化器，将类型化的数据对象序列化回 JSON 格式字符串
3. FOR ALL 有效的类型化数据对象, 先序列化再解析所得到的对象 SHALL 与原始对象在结构和值上完全等价（往返一致性）
4. IF JSON_Data_Source 中包含无法识别的字段, THEN THE Platform SHALL 在解析时保留该字段而非丢弃

### 需求 9：响应式布局与移动端适配

**用户故事：** 作为一名用户，我希望在不同设备上都能正常使用本平台，以便在手机、平板和桌面端均获得良好的浏览体验。

#### 验收标准

1. THE Platform SHALL 在视口宽度大于等于 1024 像素时以桌面布局展示所有功能模块
2. THE Platform SHALL 在视口宽度介于 768 至 1023 像素之间时以平板布局展示，时间轴和概念网络支持水平滚动
3. THE Platform SHALL 在视口宽度小于 768 像素时以移动端布局展示，各功能模块垂直堆叠排列
4. WHILE 用户调整浏览器窗口大小时, THE Platform SHALL 自动重新计算并调整所有图表组件的尺寸，无需手动刷新页面

### 需求 10：页面加载性能

**用户故事：** 作为一名用户，我希望页面能快速加载完成，以便不因等待时间过长而影响研究体验。

#### 验收标准

1. THE Platform SHALL 在首次加载时于 3 秒内完成页面主体内容的渲染（基于标准宽带网络环境）
2. THE Platform SHALL 对 JSON_Data_Source 文件采用懒加载策略，仅在用户导航至对应功能模块时加载所需数据
3. THE Platform SHALL 对 ECharts 和 D3.js 库采用代码分割策略，避免在首屏加载时引入未使用的可视化库

### 需求 11：无障碍访问

**用户故事：** 作为一名有视觉障碍的用户，我希望平台提供基本的无障碍支持，以便能够通过辅助技术使用核心功能。

#### 验收标准

1. THE Platform SHALL 为所有交互元素提供符合 WCAG 2.1 AA 标准的键盘导航支持
2. THE Platform SHALL 为所有图表组件提供 ARIA 标签，描述图表的类型和数据摘要
3. THE Platform SHALL 确保所有文本内容与背景之间的颜色对比度不低于 4.5:1
4. WHEN 用户使用键盘 Tab 键导航时, THE Platform SHALL 以可见的焦点指示器标识当前聚焦的元素

### 需求 12：中英文语言切换

**用户故事：** 作为一名国际用户，我希望通过按钮在中文和英文界面之间切换，以便使用我熟悉的语言浏览平台内容。

#### 验收标准

1. THE Platform SHALL 在页面头部提供一个语言切换按钮，中文模式下显示"EN"，英文模式下显示"中文"
2. WHEN 用户点击语言切换按钮时, THE Platform SHALL 将所有界面文字（标题、标签、图例、说明文字、详情面板）切换为目标语言
3. THE Platform SHALL 在任一语言模式下仅显示该语言的内容，不做中英文并列展示
4. THE Platform SHALL 默认以中文模式启动
5. THE Platform SHALL 确保语言切换后所有 D3.js 图表中的文本标签同步更新
