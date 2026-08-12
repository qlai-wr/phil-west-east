# Implementation Plan: 中西方哲学概念演变与跨文化映射可视化平台

## Overview

本实现计划基于已有的 Next.js 14 + D3.js + ECharts 项目骨架，补全数据校验层、错误边界、无障碍合规、响应式优化和属性测试。项目已具备三大可视化组件（Timeline、ConceptNetwork、MappingView）、LanguageContext 双语切换、Tab 导航和静态数据源（`data/philosophyData.ts`）。任务按依赖关系分层，聚焦于补全缺失功能、增强健壮性和测试覆盖。

## Tasks

- [ ] 1. 数据校验与序列化层
  - [ ] 1.1 实现数据类型校验器 (DataValidator)
    - 在 `data/validators.ts` 中实现 `validatePhilosopher`、`validateConceptNode`、`validateConceptEdge`、`validateProjection`、`validateRadarDimension` 五个类型守卫函数
    - 每个函数检查必填字段存在性和类型正确性（包括嵌套的 `{ zh: string; en: string }` 结构）
    - 对未识别字段保留而非丢弃（满足往返一致性要求 8.4）
    - 导出统一接口 `DataValidator`，方便后续集成调用
    - _Requirements: 7.5, 8.4_

  - [ ] 1.2 实现 JSON 解析器与序列化器
    - 在 `data/serializer.ts` 中实现 `PhilosophyDataParser` 和 `PhilosophyDataSerializer` 接口
    - `parsePhilosophers(json)` 等函数：JSON.parse → 逐项调用校验器 → 校验失败返回错误列表
    - `serializePhilosophers(data)` 等函数：调用 JSON.stringify 保持字段顺序一致
    - 确保往返一致性：对任意有效对象，`parse(serialize(obj))` 深度等于 `obj`
    - 解析时保留未识别字段（直接透传，不做 pick）
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ] 1.3 实现 `validateDataIntegrity` 入口函数
    - 在 `data/philosophyData.ts` 底部新增 `validateDataIntegrity` 函数
    - 检查所有 `conceptEdges` 中引用的 source/target ID 是否存在于 `conceptNodes` 集合中
    - 检查 `radarDimensions` 和 `conceptProjections` 引用的 conceptId 是否存在
    - 返回 `{ valid: boolean; errors: string[] }`
    - _Requirements: 7.5_

  - [ ] 1.4 实现 `getNearestNeighbor` 工具函数
    - 在 `data/philosophyData.ts` 中新增 `getNearestNeighbor(point: ConceptProjection): { nearest: ConceptProjection | null; distance: number }`
    - 使用欧氏距离公式计算最近邻（排除自身）
    - 供 MappingView 散点图 tooltip 调用
    - _Requirements: 5.3_

- [ ] 2. 错误边界与加载状态
  - [ ] 2.1 创建通用 ErrorBoundary 组件
    - 在 `src/components/ErrorBoundary.tsx` 中实现 React Class 组件式错误边界
    - Props: `componentName: string`、`children: ReactNode`、`fallback?: ReactNode`
    - 错误状态 UI：展示组件名称、错误消息、"重试" 按钮（调用 `onRetry` 或 remount children）
    - 添加 `aria-live="assertive"` 使错误信息对屏幕阅读器可见
    - _Requirements: 7.4_

  - [ ] 2.2 为每个 Tab 包裹独立 ErrorBoundary
    - 修改 `src/app/page.tsx`，在每个 `role="tabpanel"` 的 div 内用 `<ErrorBoundary componentName="...">` 包裹动态组件
    - Timeline → `componentName={t('历史时间轴','Timeline')}`
    - ConceptNetwork → `componentName={t('概念网络','Concept Network')}`
    - MappingView → `componentName={t('跨文化映射','Cross-Cultural Mapping')}`
    - _Requirements: 7.4_

  - [ ] 2.3 完善数据加载错误提示
    - 在 MappingView 中为散点图数据加载添加 loading 状态和 error 状态展示
    - ConceptNetwork 中对 `conceptEdges` 遍历时，跳过 source/target 不存在的边，并 `console.warn` 警告
    - 数据加载失败时展示文件名和建议排查步骤："请检查 data/philosophyData.ts 是否完整"
    - _Requirements: 7.4, 5.4_

- [ ] 3. 无障碍与键盘导航
  - [ ] 3.1 补全 ARIA 标签和语义角色
    - Timeline 组件：SVG 容器添加 `role="img"` + `aria-label="双轨历史时间轴/Dual-track Historical Timeline"`
    - ConceptNetwork：SVG 容器添加 `role="img"` + `aria-label="哲学概念演变网络图/Philosophy Concept Evolution Network"`
    - MappingView 散点图：SVG 添加 `role="img"` + `aria-label`
    - MappingView 雷达图：ECharts 容器添加 `role="img"` + `aria-label`
    - Tab 按钮添加 `id="tab-{key}"` 以匹配 tabpanel 的 `aria-labelledby`
    - _Requirements: 11.1, 11.2_

  - [ ] 3.2 键盘导航支持
    - 时间轴滑块：支持左右箭头键调整年份（步长 50 年），Home/End 跳转到起止年份
    - 概念网络节点：使用 `tabindex="0"` 使 Concept_Node 可聚焦，Enter/Space 打开详情面板
    - 详情面板：Escape 关闭面板，焦点返回触发节点
    - Tab 导航按钮：支持左右箭头键切换 Tab（ARIA tabs pattern）
    - _Requirements: 11.1, 11.4_

  - [ ] 3.3 焦点管理与对比度验证
    - 在 `globals.css` 中添加 `:focus-visible` 样式规则（2px solid ring，古铜金色 #B7791F）
    - 验证配色方案对比度：靛蓝 #2B4C7E 在白底（≥4.5:1 ✓）、朱砂 #C53030 在白底（≥4.5:1 ✓）
    - 墨色文本 #1A202C 在 #F0F2F5 背景（确认 ≥ 4.5:1）
    - 浅灰辅助文本 #A0AEC0 仅用于大字号装饰性文本（非关键信息）
    - _Requirements: 11.3, 11.4_

- [ ] 4. 响应式布局与图表自适应
  - [ ] 4.1 创建 `useResizeObserver` 自定义 hook
    - 在 `src/hooks/useResizeObserver.ts` 中实现
    - 接收 `ref: RefObject<HTMLElement>`，返回 `{ width: number; height: number }`
    - 内部使用 ResizeObserver API + 200ms debounce 防抖
    - 提供 cleanup 逻辑（useEffect return 中 disconnect observer）
    - _Requirements: 9.4_

  - [ ] 4.2 三级响应式布局实现
    - 桌面 (≥1024px)：所有功能模块正常展示，图表使用完整宽度
    - 平板 (768-1023px)：时间轴 SVG 设为 `overflow-x: auto` 支持水平滚动，概念网络缩小视口
    - 手机 (<768px)：Tab 按钮换行排列，图表容器垂直堆叠，散点图和雷达图各占全宽
    - 使用 Tailwind 的 `md:` 和 `lg:` 前缀实现
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 4.3 图表 ResizeObserver 集成
    - 替换三个可视化组件中的 resize 监听为 `useResizeObserver` hook
    - D3 图表：resize 时重新计算 SVG viewBox 和 scale
    - ECharts 图表：resize 时调用 `chartInstance.resize()`
    - 确保 resize 后不出现布局抖动（debounce 保证）
    - _Requirements: 9.4_

- [ ] 5. 性能优化
  - [ ] 5.1 验证代码分割与懒加载
    - 确认 `next/dynamic` 配置正确：三个可视化组件均为 `ssr: false`（已实现，验证无回退）
    - 验证 ECharts 和 D3 库不出现在首屏 main chunk 中（仅在 Tab 激活时按需加载）
    - 确认 `activeTab === 'timeline' && <Timeline />` 模式确保非激活组件不渲染
    - 目标：主 bundle < 200KB gzipped
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ] 5.2 交互响应延迟优化
    - Timeline 滑块拖拽：使用 `requestAnimationFrame` 节流，确保高亮更新 ≤100ms
    - RadarChart 下拉切换：ECharts `setOption` 使用 `animation: true` + `animationDuration: 300`
    - D3 图表 resize：使用 200ms debounce（来自 useResizeObserver）
    - ConceptNetwork 力模拟：`alphaDecay` 调优确保拖拽不卡顿
    - _Requirements: 2.4, 6.4_

- [ ] 6. Checkpoint: 功能完整性验证
  - 运行 `npm run build` 确认零编译错误
  - 手动验证三个 Tab 功能正常
  - 如有问题请向用户确认

- [ ] 7. 测试基础设施搭建
  - [ ] 7.1 安装测试依赖并配置 Vitest
    - 安装：`vitest`、`@testing-library/react`、`@testing-library/jest-dom`、`fast-check`、`jsdom`、`@vitejs/plugin-react`
    - 创建 `vitest.config.ts`：environment jsdom, 配置 path aliases (@/), setupFiles
    - 创建 `vitest.setup.ts`：import `@testing-library/jest-dom`
    - 在 `package.json` 中添加 `"test": "vitest --run"` 和 `"test:watch": "vitest"` 脚本
    - _Requirements: 全部（测试基础设施）_

- [ ] 8. 数据层属性测试 (Property-Based Testing)
  - [ ]* 8.1 属性测试：数据校验正确性 (Property 9)
    - **Property 9: Data validation correctness**
    - 测试文件：`data/__tests__/validators.pbt.test.ts`
    - 使用 fast-check 生成随机对象（有效变体：所有必填字段正确；无效变体：随机删除必填字段或改变类型）
    - 验证校验器对有效对象返回 true，对无效对象返回 false
    - Generator：`fc.record({id: fc.string(), name: fc.record({zh: fc.string(), en: fc.string()}), ...})`
    - 100+ iterations per property
    - **Validates: Requirements 7.5**

  - [ ]* 8.2 属性测试：JSON 往返一致性 (Property 10)
    - **Property 10: JSON serialization round-trip consistency**
    - 测试文件：`data/__tests__/serializer.pbt.test.ts`
    - 使用 fast-check 为每个数据类型生成随机有效对象
    - 验证 `parse(serialize(obj))` 深度等于原始对象
    - Generator：为 Philosopher, ConceptNode, ConceptEdge, ConceptProjection, RadarDimension 各建一个 arbitrary
    - **Validates: Requirements 8.3**

  - [ ]* 8.3 属性测试：未知字段保留 (Property 11)
    - **Property 11: Unknown field preservation during parsing**
    - 测试文件：`data/__tests__/serializer.pbt.test.ts`（追加）
    - 使用 `fc.record({...knownFields})` + `fc.dictionary(fc.string(), fc.jsonValue())` 生成带额外字段的 JSON
    - 验证解析后输出保留所有额外字段及其值
    - **Validates: Requirements 8.4**

- [ ] 9. 可视化逻辑属性测试
  - [ ]* 9.1 属性测试：时间顺序保持 (Property 1)
    - **Property 1: Chronological ordering preservation**
    - 测试文件：`src/components/visualizations/__tests__/timeline.pbt.test.ts`
    - 生成随机 `Philosopher[]` 列表（同一 tradition），验证按 birth 排序后索引单调递增
    - Generator：`fc.array(fc.record({birth: fc.integer(-600, 2000), tradition: fc.constant('western'), ...}), {minLength: 2})`
    - **Validates: Requirements 1.2, 1.3**

  - [ ]* 9.2 属性测试：年份过滤 (Property 3)
    - **Property 3: Year-based philosopher filtering**
    - 测试文件：`src/components/visualizations/__tests__/timeline.pbt.test.ts`（追加）
    - 生成随机年份 `fc.integer(-600, 2000)`，用已知数据集计算预期高亮集合（birth ≤ year ≤ death 的哲学家）
    - 比对过滤函数实际返回结果
    - **Validates: Requirements 2.1**

  - [ ]* 9.3 属性测试：传统颜色分配 (Property 5)
    - **Property 5: Tradition-based color assignment**
    - 测试文件：`src/components/visualizations/__tests__/colors.pbt.test.ts`
    - 生成随机 tradition 值 `fc.constantFrom('western', 'chinese')`
    - 验证颜色映射：western → 靛蓝色系 (#2B4C7E)，chinese → 朱砂色系 (#C53030)
    - **Validates: Requirements 3.3, 5.2**

  - [ ]* 9.4 属性测试：边样式映射 (Property 6)
    - **Property 6: Edge visual style by relation type**
    - 测试文件：`src/components/visualizations/__tests__/colors.pbt.test.ts`（追加）
    - 生成随机 relation 值 `fc.constantFrom('evolution', 'influence', 'contrast')`
    - 验证：evolution/influence → 实线 + 箭头标记，contrast → 虚线无箭头
    - **Validates: Requirements 3.4**

  - [ ]* 9.5 属性测试：雷达图维度精度 (Property 8)
    - **Property 8: Radar chart dimensional accuracy**
    - 测试文件：`src/components/visualizations/__tests__/radar.pbt.test.ts`
    - 生成随机 RadarDimension 数据对（各维度分数 0-100）
    - 验证 ECharts 配置项中 series data 数组的值与输入分数一致
    - **Validates: Requirements 6.2, 6.3**

- [ ] 10. 语言与无障碍属性测试
  - [ ]* 10.1 属性测试：颜色对比度合规 (Property 12)
    - **Property 12: Color contrast compliance**
    - 测试文件：`src/__tests__/accessibility.pbt.test.ts`
    - 枚举平台所有前景色/背景色对（从设计规范提取），计算 WCAG 相对亮度和对比度比率
    - 验证所有正文文本对的对比度 ≥ 4.5:1
    - 实现 `calculateContrastRatio(fg, bg)` 辅助函数
    - **Validates: Requirements 11.3**

  - [ ]* 10.2 属性测试：语言函数正确性 (Property 13)
    - **Property 13: Language function correctness**
    - 测试文件：`src/__tests__/language.pbt.test.ts`
    - Generator：`fc.tuple(fc.string(), fc.string(), fc.constantFrom('zh', 'en'))`
    - 验证：当 lang='zh' 时 `t(zh, en)` === zh；当 lang='en' 时 `t(zh, en)` === en
    - 验证：返回值永远是单一语言的字符串，不包含另一语言的内容（除非两者碰巧相同）
    - **Validates: Requirements 12.2, 12.3**

- [x] 11. 组件渲染属性测试
  - [ ]* 11.1 属性测试：哲学家节点内容完整性 (Property 2)
    - **Property 2: Philosopher node content completeness**
    - 测试文件：`src/components/visualizations/__tests__/timeline.pbt.test.ts`（追加）
    - 对 `philosophers` 数据集中每个条目，验证渲染辅助函数输出包含 name[lang] 和 era 年份范围
    - **Validates: Requirements 1.4**

  - [ ]* 11.2 属性测试：概念详情面板完整性 (Property 4)
    - **Property 4: Concept detail panel completeness**
    - 测试文件：`src/components/visualizations/__tests__/conceptNetwork.pbt.test.ts`
    - 对 `conceptNodes` 数据集中每个条目，验证详情面板数据包含：definition[lang]、source.work[lang]、coOccurrence 列表
    - **Validates: Requirements 4.2**

  - [x]* 11.3 属性测试：散点图悬停提示完整性 (Property 7)
    - **Property 7: Scatter plot hover tooltip completeness**
    - 测试文件：`src/components/visualizations/__tests__/mappingView.pbt.test.ts`
    - 对每个 ConceptProjection，验证 tooltip 数据构建函数返回：term[lang]、tradition 标签、最近邻 distance 数值
    - **Validates: Requirements 5.3**

  - [ ]* 11.4 属性测试：D3 图表语言同步 (Property 14)
    - **Property 14: D3 chart text language synchronization**
    - 测试文件：`src/components/visualizations/__tests__/conceptNetwork.pbt.test.ts`（追加）
    - 验证：对任意 ConceptNode，给定 lang 状态，D3 渲染的文本标签内容等于 `term[lang]`
    - **Validates: Requirements 12.5**

- [ ] 12. Final Checkpoint: 全部测试通过验证
  - 运行 `npm run test` 确认所有 unit test 和 PBT 全部通过
  - 运行 `npm run build` 确认零编译错误
  - 如有问题请向用户确认

## Notes

- Tasks marked with `*` are property-based tests (PBT) requiring fast-check library
- 项目已有三大可视化组件的基本实现，任务聚焦于补全校验层、错误处理、无障碍、性能优化和测试覆盖
- 每个任务标注了对应的 Requirements 编号以确保可追溯性
- Property 测试覆盖设计文档中全部 14 个正确性属性
- Checkpoints (Tasks 6, 12) 确保增量验证，避免累积错误
- 数据文件路径：`data/philosophyData.ts`（TypeScript 静态数据，包含接口定义和辅助函数）
- 现有辅助函数：`getPhilosopherById`, `getPhilosophersByTradition`, `getCoreTextsByPhilosopher`, `getConceptById`, `getConceptsByTradition`, `getRadarDataForConcept`, `getProjectionForConcept`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1", "7.1"], "description": "基础设施：校验器 + 错误边界 + 测试框架" },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4", "2.2", "2.3"], "description": "数据层完善 + 错误集成" },
    { "id": 2, "tasks": ["3.1", "3.2", "3.3", "4.1"], "description": "无障碍 + ResizeObserver hook" },
    { "id": 3, "tasks": ["4.2", "4.3", "5.1", "5.2"], "description": "响应式布局 + 性能优化" },
    { "id": 4, "tasks": ["6"], "description": "中间检查点：功能完整性验证" },
    { "id": 5, "tasks": ["8.1", "8.2", "8.3"], "description": "数据层 PBT" },
    { "id": 6, "tasks": ["9.1", "9.2", "9.3", "9.4", "9.5"], "description": "可视化逻辑 PBT" },
    { "id": 7, "tasks": ["10.1", "10.2"], "description": "语言与无障碍 PBT" },
    { "id": 8, "tasks": ["11.1", "11.2", "11.3", "11.4"], "description": "组件渲染 PBT" },
    { "id": 9, "tasks": ["12"], "description": "最终检查点：全部测试通过" }
  ]
}
```
