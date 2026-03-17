# TCM Self-Diagnosis Webapp - Full Specification

## 1. Product Overview

### 1.1 Purpose

A web application enabling users to:
- Self-assess their TCM constitution type (体质)
- Check and understand their symptoms from a TCM perspective
- Receive personalized health recommendations
- Learn about TCM health principles

### 1.2 Target Users

- Health-conscious individuals seeking holistic health insights
- People interested in TCM but lacking professional access
- TCM students as a learning reference
- General wellness seekers

### 1.3 MVP Scope

| Feature | Priority | Status |
|---------|----------|--------|
| Constitution Assessment | P0 | Spec'd |
| Symptom Checker | P0 | Spec'd |
| Results Dashboard | P0 | Spec'd |
| Educational Content | P1 | Spec'd |
| User Profiles | P1 | Spec'd |

---

## 2. Symptom Checker Design

### 2.1 Symptom Categories

Based on TCM diagnostic principles (四诊):

| Category | Chinese | Examples |
|----------|---------|----------|
| Cold-Heat | 寒热 | 恶寒, 发热, 潮热, 寒热往来 |
| Sweat | 汗 | 自汗, 盗汗, 大汗, 无汗 |
| Pain | 疼痛 | 头痛, 胸痛, 腹痛, 关节痛 |
| Digestion | 饮食 | 纳呆, 消谷善饥, 口苦, 口淡 |
| Sleep | 睡眠 | 失眠, 嗜睡, 多梦, 梦呓 |
| Excretion | 二便 | 便秘, 泄泻, 小便频数, 小便不利 |
| Emotion | 情志 | 易怒, 抑郁, 焦虑, 善悲 |
| Respiration | 呼吸 | 咳嗽, 气喘, 气短, 胸闷 |
| Skin | 皮肤 | 皮疹, 瘙痒, 干燥, 油腻 |
| Head-Face | 头面 | 头晕, 耳鸣, 目眩, 面色 |

### 2.2 Symptom Database Structure

```typescript
// Example symptoms from TCM theory
const symptoms: Symptom[] = [
  // Cold-Heat (寒热)
  {
    id: "SYM001",
    code: "WU_HAN",
    name: "恶寒",
    nameEn: "Aversion to Cold",
    category: "cold-heat",
    tcmMeaning: {
      primary: "外感风寒初期,卫阳被遏",
      patterns: [
        { pattern: "风寒表证", condition: "伴发热无汗", confidence: 0.85 },
        { pattern: "阳虚证", condition: "长期畏寒喜暖", confidence: 0.75 }
      ]
    },
    relatedOrgans: ["肺", "肾"],
    relatedSymptoms: ["SYM002", "SYM003"]
  },
  {
    id: "SYM002",
    code: "FA_RE",
    name: "发热",
    nameEn: "Fever",
    category: "cold-heat",
    tcmMeaning: {
      primary: "正气抗邪或阴阳失调",
      patterns: [
        { pattern: "外感风热", condition: "伴咽喉痛", confidence: 0.80 },
        { pattern: "阴虚发热", condition: "午后或夜间发热", confidence: 0.70 }
      ]
    },
    relatedOrgans: ["肺", "心"],
    relatedSymptoms: ["SYM001"]
  },
  
  // Sweat (汗)
  {
    id: "SYM010",
    code: "ZI_HAN",
    name: "自汗",
    nameEn: "Spontaneous Sweating",
    category: "sweat",
    tcmMeaning: {
      primary: "气虚卫外不固",
      patterns: [
        { pattern: "气虚证", condition: "动则汗出,气短乏力", confidence: 0.90 },
        { pattern: "阳虚证", condition: "汗出怕冷", confidence: 0.70 }
      ]
    },
    relatedOrgans: ["肺", "脾", "心"],
    relatedSymptoms: ["SYM011"]
  },
  {
    id: "SYM011",
    code: "DAO_HAN",
    name: "盗汗",
    nameEn: "Night Sweats",
    category: "sweat",
    tcmMeaning: {
      primary: "阴虚内热迫津外泄",
      patterns: [
        { pattern: "阴虚证", condition: "睡则汗出,醒则汗止", confidence: 0.95 }
      ]
    },
    relatedOrgans: ["肾", "心"],
    relatedSymptoms: ["SYM010"]
  },
  
  // Sleep (睡眠)
  {
    id: "SYM030",
    code: "SHI_MIAN",
    name: "失眠",
    nameEn: "Insomnia",
    category: "sleep",
    tcmMeaning: {
      primary: "心神不安或阴阳失调",
      patterns: [
        { pattern: "心脾两虚", condition: "多梦易醒,心悸健忘", confidence: 0.80 },
        { pattern: "肝火扰心", condition: "烦躁难眠,口苦", confidence: 0.75 },
        { pattern: "阴虚火旺", condition: "心烦不眠,手足心热", confidence: 0.70 }
      ]
    },
    relatedOrgans: ["心", "肝", "脾"],
    relatedSymptoms: ["SYM031"]
  },
  
  // Emotion (情志)
  {
    id: "SYM040",
    code: "YI_NU",
    name: "易怒",
    nameEn: "Easily Angered",
    category: "emotion",
    tcmMeaning: {
      primary: "肝气郁结或肝火上炎",
      patterns: [
        { pattern: "肝郁气滞", condition: "胸闷胁胀,善太息", confidence: 0.85 },
        { pattern: "肝火上炎", condition: "头痛目赤,口苦", confidence: 0.80 }
      ]
    },
    relatedOrgans: ["肝"],
    relatedSymptoms: ["SYM041", "SYM042"]
  }
];
```

### 2.3 Body Map Integration

```
┌─────────────────────────────────────────┐
│           SYMPTOM BODY MAP               │
├─────────────────────────────────────────┤
│                                         │
│         ┌─────┐                         │
│         │ 头  │ ← Head-Face symptoms    │
│         │ 面  │   (头痛,头晕,面赤...)   │
│         └──┬──┘                         │
│            │                            │
│      ┌─────┴─────┐                      │
│      │    胸    │ ← Chest symptoms      │
│      │    腹    │   (胸闷,腹痛...)      │
│      └─────┬─────┘                      │
│            │                            │
│       ┌────┴────┐                       │
│       │  上肢   │ ← Upper limbs         │
│       │         │   (手臂麻木...)       │
│       └────┬────┘                       │
│            │                            │
│       ┌────┴────┐                       │
│       │  下肢   │ ← Lower limbs         │
│       │         │   (腿痛,脚冷...)      │
│       └─────────┘                       │
│                                         │
│  [全身] ← Whole body symptoms           │
└─────────────────────────────────────────┘

Click on region → Filter symptoms by body region
```

### 2.4 Symptom Assessment Flow

```
User selects body region
         │
         ▼
┌─────────────────────────────────┐
│  Show categorized symptom list  │
│  for selected region            │
└─────────────────┬───────────────┘
                  │
                  ▼
User selects symptom(s)
                  │
                  ▼
┌─────────────────────────────────┐
│  For each selected symptom:     │
│                                 │
│  1. Severity (1-5)              │
│  2. Duration (time period)      │
│  3. Triggers (optional)         │
│  4. Notes (optional)            │
└─────────────────┬───────────────┘
                  │
                  ▼
┌─────────────────────────────────┐
│  Dynamic follow-up questions    │
│  based on symptom combination   │
└─────────────────┬───────────────┘
                  │
                  ▼
┌─────────────────────────────────┐
│  Pattern matching engine        │
│  - Match symptom patterns       │
│  - Calculate confidence scores  │
│  - Identify organ involvement   │
└─────────────────────────────────┘
```

---

## 3. API Routes & Data Flow

### 3.1 App Router Structure (Next.js 14)

```
src/app/
├── layout.tsx                 # Root layout
├── page.tsx                   # Home page
├── assessment/
│   ├── page.tsx              # Assessment landing
│   ├── constitution/
│   │   ├── page.tsx          # Questionnaire start
│   │   └── [step]/
│   │       └── page.tsx      # Question steps
│   └── symptoms/
│       └── page.tsx          # Symptom checker
├── results/
│   └── [id]/
│       └── page.tsx          # Results page
├── education/
│   ├── page.tsx              # Education hub
│   └── [article]/
│       └── page.tsx          # Article page
└── profile/
    └── page.tsx              # User profile & history
```

### 3.2 Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │ Assessment  │    │   Symptom   │    │   Results   │        │
│  │   Form      │    │   Checker   │    │  Dashboard  │        │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘        │
│         │                  │                   │                │
│         └──────────────────┼───────────────────┘                │
│                            │                                    │
│                            ▼                                    │
│                 ┌─────────────────────┐                        │
│                 │   Zustand Store     │                        │
│                 │  (assessment state) │                        │
│                 └──────────┬──────────┘                        │
│                            │                                    │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                      SERVER (Next.js)                           │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                   Static JSON Data                       │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │  │
│  │  │constitutions│ │  symptoms   │ │ questions   │       │  │
│  │  │    .json    │ │    .json    │ │    .json    │       │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Server Actions / API Routes                 │  │
│  │                                                          │  │
│  │  calculateConstitution(answers) → ConstitutionResult    │  │
│  │  analyzeSymptoms(symptoms) → PatternResult[]            │  │
│  │  getRecommendations(constitution, patterns) → Rec[]     │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                   PERSISTENCE (localStorage)                    │
│                                                                 │
│  - Assessment history                                          │
│  - User preferences                                            │
│  - Saved results                                               │
└────────────────────────────────────────────────────────────────┘
```

### 3.3 Core Functions

```typescript
// src/lib/assessment.ts

export async function calculateConstitutionScore(
  answers: Record<string, number>
): Promise<ConstitutionResult[]> {
  const questions = await getQuestions();
  const results: ConstitutionResult[] = [];
  
  for (const type of CONSTITUTION_TYPES) {
    const typeQuestions = questions.filter(q => q.constitutionType === type.id);
    const rawScore = typeQuestions.reduce((sum, q) => sum + (answers[q.id] || 1), 0);
    const convertedScore = ((rawScore - typeQuestions.length) / (typeQuestions.length * 4)) * 100;
    
    results.push({
      constitutionId: type.id,
      rawScore,
      convertedScore,
      determination: getDetermination(type.id, convertedScore)
    });
  }
  
  return results;
}

export function analyzeSymptomPatterns(
  selectedSymptoms: SelectedSymptom[],
  allSymptoms: Symptom[]
): PatternResult[] {
  const patternScores: Map<string, PatternScore> = new Map();
  
  for (const selected of selectedSymptoms) {
    const symptom = allSymptoms.find(s => s.id === selected.symptomId);
    if (!symptom) continue;
    
    for (const pattern of symptom.tcmMeaning.patterns) {
      const existing = patternScores.get(pattern.pattern) || { score: 0, count: 0 };
      patternScores.set(pattern.pattern, {
        score: existing.score + pattern.confidence * selected.severity,
        count: existing.count + 1
      });
    }
  }
  
  return Array.from(patternScores.entries())
    .map(([name, data]) => ({
      patternId: name,
      name,
      confidence: data.score / (data.count * 5), // Normalize to 0-1
      basedOn: selectedSymptoms.filter(s => 
        allSymptoms.find(sym => 
          sym.id === s.symptomId && 
          sym.tcmMeaning.patterns.some(p => p.pattern === name)
        )?.id
      ).map(s => s.symptomId)
    }))
    .filter(p => p.confidence >= 0.3)
    .sort((a, b) => b.confidence - a.confidence);
}
```

---

## 4. UI/UX Specifications

### 4.1 Page Layouts

#### Home Page
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]                              [开始评估] [了解更多]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │    了解您的中医体质，掌握健康密码                    │   │
│  │    Discover Your TCM Constitution                   │   │
│  │                                                     │   │
│  │    [开始体质评估]  [症状自查]                        │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ 九种体质    │ │ 症状解析    │ │ 养生建议    │          │
│  │ 体质辨识    │ │ 中医视角    │ │ 个性方案    │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                             │
│  [⚠️ 免责声明: 本系统仅供健康参考，不作为医疗诊断依据]     │
└─────────────────────────────────────────────────────────────┘
```

#### Assessment Page
```
┌─────────────────────────────────────────────────────────────┐
│  [< 返回]  体质评估                              [Step 2/4] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  进度条: [████████░░░░░░░░░░░░] 40%                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  问题 12 / 60                                       │   │
│  │                                                     │   │
│  │  您手脚发凉吗？                                      │   │
│  │  Do your hands and feet feel cold?                  │   │
│  │                                                     │   │
│  │  ○ 没有 (Never)                                     │   │
│  │  ○ 很少 (Rarely)                                    │   │
│  │  ● 有时 (Sometimes)                                 │   │
│  │  ○ 经常 (Often)                                     │   │
│  │  ○ 总是 (Always)                                    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                          [上一步]  [下一步 →]               │
└─────────────────────────────────────────────────────────────┘
```

#### Results Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  评估结果                              [保存] [分享] [重新评估] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │    您的主要体质: 阳虚质 (Yang Deficiency)           │   │
│  │    转化分: 52分                                     │   │
│  │                                                     │   │
│  │    [详细体质说明]                                   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  倾向体质:                                                  │
│  ┌───────────┐ ┌───────────┐                              │
│  │ 气虚质    │ │ 痰湿质    │                              │
│  │ 35分      │ │ 32分      │                              │
│  └───────────┘ └───────────┘                              │
│                                                             │
│  体质分布图:                                                │
│  [可视化雷达图或柱状图]                                     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  个性化建议                                          │   │
│  │                                                     │   │
│  │  🍵 饮食调养: 宜食温热食物,忌生冷...                 │   │
│  │  🏃 运动建议: 适度运动,避免过度出汗...               │   │
│  │  😌 情志调摄: 保持心情舒畅,避免过度忧思...           │   │
│  │  🌙 起居调养: 注意保暖,避免受寒...                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Component Hierarchy

```
src/components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Navigation.tsx
│   └── Layout.tsx
├── assessment/
│   ├── AssessmentForm.tsx
│   ├── QuestionCard.tsx
│   ├── ProgressBar.tsx
│   ├── AnswerOptions.tsx
│   └── AssessmentSummary.tsx
├── symptoms/
│   ├── BodyMap.tsx
│   ├── SymptomSelector.tsx
│   ├── SymptomCard.tsx
│   ├── SeveritySlider.tsx
│   └── DurationPicker.tsx
├── results/
│   ├── ResultsCard.tsx
│   ├── ConstitutionChart.tsx
│   ├── RecommendationList.tsx
│   └── ShareButton.tsx
├── education/
│   ├── ArticleCard.tsx
│   ├── ArticleList.tsx
│   └── ContentSection.tsx
└── common/
    ├── Button.tsx
    ├── Card.tsx
    ├── Modal.tsx
    ├── Tooltip.tsx
    └── Disclaimer.tsx
```

---

## 5. Implementation Checklist

### Phase 1: Foundation
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Tailwind CSS
- [ ] Create base layout components
- [ ] Implement static JSON data loading

### Phase 2: Core Features
- [ ] Constitution assessment questionnaire
- [ ] Scoring algorithm implementation
- [ ] Results calculation and display
- [ ] Symptom checker UI
- [ ] Body map component
- [ ] Pattern matching engine

### Phase 3: Polish
- [ ] Educational content pages
- [ ] User profile & history
- [ ] Mobile responsiveness
- [ ] Accessibility improvements
- [ ] Performance optimization

### Phase 4: Launch
- [ ] Testing (unit, integration)
- [ ] Legal disclaimers
- [ ] Privacy policy
- [ ] Deployment

---

## 6. Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 14 (App Router) | SSR, file-based routing, server actions |
| Language | TypeScript | Type safety for complex data structures |
| Styling | Tailwind CSS | Rapid UI development, responsive |
| State Management | Zustand | Lightweight, perfect for this scope |
| Data Storage | Static JSON | Simple, version-controllable, no DB overhead |
| Charts | Recharts | React-native, good for radar/bar charts |
| Icons | Lucide React | Consistent, tree-shakeable |
