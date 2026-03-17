# Data Models Specification

## Overview

All data is stored as static JSON files in `/data/`. This document defines the structure of each data type.

---

## 1. Constitution (体质)

### File: `data/constitutions.json`

```typescript
interface Constitution {
  id: string;                    // "A" through "I"
  code: string;                  // "pinghe", "qixu", "yangxu", etc.
  name: string;                  // "平和质", "气虚质", etc.
  nameEn: string;                // "Balanced", "Qi Deficiency", etc.
  
  // Description
  summary: string;               // Brief description
  characteristics: {
    overall: string;             // Overall characteristics
    physical: string;            // Physical traits
    psychological: string;       // Psychological traits
  };
  
  // Body features
  bodyFeatures: {
    bodyType: string;            // "匀称", "偏瘦", "肥胖", etc.
    complexion: string;          // 面色
    tongueBody: string;          // 舌体
    tongueCoating: string;       // 舌苔
    pulse: string;               // 脉象
  };
  
  // Health tendencies
  healthTendencies: {
    susceptibleDiseases: string[];  // 易患疾病
    diseaseCharacteristics: string; // 发病特点
    seasonalSensitivity: string[];  // 季节敏感性
  };
  
  // Recommendations
  recommendations: {
    diet: {
      suitable: string[];        // 宜食
      avoid: string[];           // 忌食
      principles: string;        // 饮食原则
    };
    lifestyle: string[];         // 起居调养
    exercise: string[];          // 运动建议
    emotional: string;           // 情志调摄
  };
  
  // Scoring threshold
  scoring: {
    threshold: number;           // Minimum score to qualify
    weight: number;              // Question weight multiplier
  };
}
```

### The 9 Constitution Types

| ID | Code | Name | Name (EN) |
|----|------|------|-----------|
| A | pinghe | 平和质 | Balanced |
| B | qixu | 气虚质 | Qi Deficiency |
| C | yangxu | 阳虚质 | Yang Deficiency |
| D | yinxu | 阴虚质 | Yin Deficiency |
| E | tanshi | 痰湿质 | Phlegm-Dampness |
| F | shire | 湿热质 | Damp-Heat |
| G | xueyu | 血瘀质 | Blood Stasis |
| H | qiyu | 气郁质 | Qi Stagnation |
| I | tebing | 特禀质 | Special/Allergic |

---

## 2. Symptom (症状)

### File: `data/symptoms.json`

```typescript
interface Symptom {
  id: string;                    // Unique identifier
  code: string;                  // Short code for reference
  
  // Names
  name: string;                  // "恶寒", "发热", "自汗", etc.
  nameEn: string;                // English name
  
  // Categorization
  category: SymptomCategory;     // Primary category
  subcategory?: string;          // Sub-category if applicable
  bodyRegion?: BodyRegion;       // Related body area
  
  // TCM interpretation
  tcmMeaning: {
    primary: string;             // Primary TCM interpretation
    patterns: PatternAssociation[]; // Associated patterns
  };
  
  // Assessment context
  assessmentContext: {
    followUpQuestions?: string[]; // Additional questions if selected
    severityOptions?: SeverityLevel[];
    durationOptions?: DurationOption[];
  };
  
  // Related data
  relatedSymptoms: string[];     // IDs of commonly co-occurring symptoms
  relatedOrgans: Organ[];        // Associated Zang-Fu organs
}

type SymptomCategory = 
  | "cold-heat"      // 寒热
  | "sweat"          // 汗
  | "pain"           // 疼痛
  | "digestion"      // 饮食
  | "sleep"          // 睡眠
  | "excretion"      // 二便
  | "emotion"        // 情志
  | "respiration"    // 呼吸
  | "skin"           // 皮肤
  | "head-face"      // 头面
  | "body-limbs";    // 躯体四肢

type BodyRegion =
  | "head"
  | "face"
  | "neck"
  | "chest"
  | "abdomen"
  | "back"
  | "upper-limbs"
  | "lower-limbs"
  | "whole-body"
  | "skin";

type Organ = "心" | "肝" | "脾" | "肺" | "肾" | "胆" | "胃" | "小肠" | "大肠" | "膀胱" | "三焦";

interface PatternAssociation {
  pattern: string;               // Pattern name
  condition: string;             // When this association applies
  confidence: number;            // 0-1 confidence score
}

interface SeverityLevel {
  value: number;                 // 1-5
  label: string;                 // "轻微", "轻度", "中度", "较重", "严重"
  description: string;           // Detailed description
}

interface DurationOption {
  value: string;                 // Duration code
  label: string;                 // "今天", "一周内", "一个月内", "半年内", "长期"
}
```

---

## 3. Assessment Question (问卷题目)

### File: `data/questions.json`

```typescript
interface AssessmentQuestion {
  id: string;                    // "Q001", "Q002", etc.
  order: number;                 // Display order
  
  // Question content
  text: string;                  // Question text (Chinese)
  textEn: string;                // English translation
  
  // Classification
  constitutionType: string;      // Target constitution ID ("A"-"I")
  category: QuestionCategory;    // Question category
  
  // Answer options
  options: AnswerOption[];
  
  // Scoring
  scoring: {
    method: "simple" | "weighted";  // Scoring method
    weights?: Record<string, number>; // Per-option weights
  };
  
  // Follow-up
  followUp?: {
    condition: string;           // When to show follow-up
    questionId: string;          // Follow-up question ID
  };
}

type QuestionCategory = 
  | "physical"       // 形体特征
  | "complexion"     // 面色
  | "sweat"          // 出汗
  | "cold-heat"      // 寒热
  | "sleep"          // 睡眠
  | "digestion"      // 消化
  | "excretion"      // 二便
  | "emotion"        // 情志
  | "susceptibility"; // 易感性

interface AnswerOption {
  id: string;                    // "A", "B", "C", "D"
  text: string;                  // Answer text
  textEn: string;                // English translation
  score: number;                 // Score for this answer
}
```

---

## 4. Recommendation (建议)

### File: `data/recommendations.json`

```typescript
interface Recommendation {
  id: string;
  
  // Targeting
  appliesTo: {
    constitutionTypes?: string[];   // Constitution IDs
    symptomIds?: string[];          // Symptom IDs
    patternIds?: string[];          // Pattern IDs
    seasons?: Season[];
  };
  
  // Content
  title: string;
  summary: string;
  
  // Detailed sections
  sections: RecommendationSection[];
  
  // Metadata
  priority: "high" | "medium" | "low";
  tags: string[];
}

type Season = "spring" | "summer" | "autumn" | "winter";

interface RecommendationSection {
  type: "diet" | "lifestyle" | "exercise" | "emotional" | "herbs" | "acupressure";
  title: string;
  content: string | RecommendationItem[];
}

interface RecommendationItem {
  name: string;
  description: string;
  frequency?: string;           // How often to apply
  contraindications?: string[]; // When not to use
}
```

---

## 5. User Assessment Result (用户评估结果)

### Runtime Data (stored in localStorage or session)

```typescript
interface UserAssessment {
  id: string;                    // UUID
  createdAt: string;             // ISO timestamp
  
  // Constitution assessment
  constitutionResult: {
    primary: ConstitutionResult;       // Primary constitution
    secondary?: ConstitutionResult[];  // Secondary tendencies
    scores: Record<string, number>;    // All constitution scores
  };
  
  // Symptom assessment
  symptomResult?: {
    selectedSymptoms: SelectedSymptom[];
    identifiedPatterns: PatternResult[];
  };
  
  // Generated recommendations
  recommendations: string[];     // Recommendation IDs
}

interface ConstitutionResult {
  constitutionId: string;
  score: number;
  percentage: number;            // Score as percentage
  confidence: "high" | "medium" | "low";
}

interface SelectedSymptom {
  symptomId: string;
  severity: number;              // 1-5
  duration: string;              // Duration code
  notes?: string;                // User notes
}

interface PatternResult {
  patternId: string;
  name: string;
  confidence: number;            // 0-1
  basedOn: string[];             // Symptom IDs that led to this
}
```

---

## 6. Educational Content (教育内容)

### File: `data/education.json`

```typescript
interface EducationalContent {
  id: string;
  category: EducationCategory;
  title: string;
  summary: string;
  content: string;               // Markdown content
  relatedConstitutions?: string[];
  relatedSymptoms?: string[];
  order: number;                 // Display order
}

type EducationCategory = 
  | "basics"         // 基础理论
  | "constitution"   // 体质学说
  | "organs"         // 藏象
  | "diagnosis"      // 诊断方法
  | "prevention"     // 治未病
  | "seasonal";      // 四时养生
```

---

## Entity Relationships

```
┌─────────────────┐
│  Constitution   │
│  (9 types)      │
└────────┬────────┘
         │
         │ maps to
         ▼
┌─────────────────┐      linked to       ┌─────────────────┐
│    Question     │◄─────────────────────│   Symptom       │
│  (assessment)   │                      │  (checker)      │
└────────┬────────┘                      └────────┬────────┘
         │                                        │
         │ produces                               │ identifies
         ▼                                        ▼
┌─────────────────┐                      ┌─────────────────┐
│  UserAssessment │──────────────────────│    Pattern      │
│    Result       │                      │  (diagnosis)    │
└────────┬────────┘                      └────────┬────────┘
         │                                        │
         │ generates                              │
         ▼                                        ▼
┌─────────────────────────────────────────────────────────┐
│                   Recommendation                        │
│  (based on constitution + symptoms + patterns)          │
└─────────────────────────────────────────────────────────┘
```
