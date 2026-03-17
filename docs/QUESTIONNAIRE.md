# Constitution Assessment Questionnaire Specification

## Overview

Based on the "中华中医药学会标准" (Chinese Association of Chinese Medicine Standard) for 9 constitution types assessment.

---

## Scoring Methodology

### Scoring Rules

1. **Each question has 5 answer options** with scores 1-5:
   - 1分 = "没有(根本不/从来没有)" (Never)
   - 2分 = "很少(有一点/偶尔)" (Rarely)
   - 3分 = "有时(有些/少数时间)" (Sometimes)
   - 4分 = "经常(相当/多数时间)" (Often)
   - 5分 = "总是(非常/每天)" (Always)

2. **Conversion Formula**:
   ```
   原始分 = 各条目分数之和
   转化分 = (原始分 - 条目数) / (条目数 × 4) × 100
   ```

3. **Determination Criteria**:
   | Constitution | Determination |
   |--------------|---------------|
   | 平和质 (A) | 转化分≥60分，且其他8种体质转化分均<30分 |
   | Other types | 转化分≥40分 |
   | 倾向是 | 转化分30-39分 |

---

## Questionnaire Sections

### Section 1: 平和质 (Balanced Constitution)

Questions to identify balanced constitution (control questions - answered inversely for other types).

| ID | Question | Category |
|----|----------|----------|
| A1 | 您精力充沛吗？(Do you feel energetic?) | physical |
| A2 | 您容易疲乏吗？*(Do you get tired easily?) | physical |
| A3 | 您说话声音低弱无力吗？*(Do you speak in a weak voice?) | physical |
| A4 | 您感到闷闷不乐、情绪低沉吗？*(Do you feel depressed?) | emotion |
| A5 | 比一般人容易受到惊吓吗？*(Are you more easily frightened than others?) | emotion |
| A6 | 您容易忘事(健忘)吗？*(Do you tend to be forgetful?) | mental |
| A7 | 您容易失眠吗？*(Do you have trouble sleeping?) | sleep |
| A8 | 您容易心慌吗？*(Do you get heart palpitations easily?) | physical |
| A9 | 您容易气短(呼吸短促)吗？*(Do you get short of breath easily?) | physical |
| A10 | 您容易心烦吗？*(Do you get irritated easily?) | emotion |

*Note: Questions marked with * are reverse-scored for 平和质 (higher score = less balanced)*

---

### Section 2: 气虚质 (Qi Deficiency Constitution)

| ID | Question | Category |
|----|----------|----------|
| B1 | 您容易疲乏吗？ | physical |
| B2 | 您容易气短(呼吸短促)吗？ | physical |
| B3 | 您容易心慌吗？ | physical |
| B4 | 您容易头晕或站起时晕眩吗？ | physical |
| B5 | 您比别人容易患感冒吗？ | susceptibility |
| B6 | 您喜欢安静、懒得说话吗？ | emotion |
| B7 | 您说话声音低弱无力吗？ | physical |
| B8 | 您活动量稍大就容易出虚汗吗？ | sweat |

---

### Section 3: 阳虚质 (Yang Deficiency Constitution)

| ID | Question | Category |
|----|----------|----------|
| C1 | 您手脚发凉吗？ | cold-heat |
| C2 | 您胃脘部、背部或腰膝部怕冷吗？ | cold-heat |
| C3 | 您感到怕冷、衣服比别人穿得多吗？ | cold-heat |
| C4 | 您比一般人耐受不了冬天寒冷吗？ | susceptibility |
| C5 | 您比别人容易患感冒吗？ | susceptibility |
| C6 | 您吃(喝)凉的东西会感到不舒服或者怕吃(喝)凉的吗？ | digestion |
| C7 | 您受凉或吃(喝)凉的东西后，容易腹泻、拉肚子吗？ | excretion |
| C8 | 您小肚子怕冷吗？ | cold-heat |

---

### Section 4: 阴虚质 (Yin Deficiency Constitution)

| ID | Question | Category |
|----|----------|----------|
| D1 | 您感到手脚心发热吗？ | cold-heat |
| D2 | 您感觉身体、脸上发热吗？ | cold-heat |
| D3 | 您皮肤或口唇干吗？ | physical |
| D4 | 您口唇颜色比一般人红吗？ | complexion |
| D5 | 您容易便秘或大便干燥吗？ | excretion |
| D6 | 您面部两颧潮红或偏红吗？ | complexion |
| D7 | 您感到眼睛干涩吗？ | physical |
| D8 | 您感到口干咽燥、总想喝水吗？ | digestion |

---

### Section 5: 痰湿质 (Phlegm-Dampness Constitution)

| ID | Question | Category |
|----|----------|----------|
| E1 | 您感到胸闷或腹部胀满吗？ | physical |
| E2 | 您感到身体沉重不轻松或不爽快吗？ | physical |
| E3 | 您腹部肥满松软吗？ | physical |
| E4 | 您有额部油脂分泌多的现象吗？ | complexion |
| E5 | 您上眼睑比别人肿(上眼睑有轻微隆起的现象)吗？ | complexion |
| E6 | 您嘴里有黏黏的感觉吗？ | digestion |
| E7 | 您平时痰多，特别是感到咽喉部有痰堵着吗？ | respiration |
| E8 | 您舌苔厚腻或有舌苔厚厚的感觉吗？ | physical |

---

### Section 6: 湿热质 (Damp-Heat Constitution)

| ID | Question | Category |
|----|----------|----------|
| F1 | 您面部或鼻部有油腻感或者油亮发光吗？ | complexion |
| F2 | 您容易生痤疮或疮疖吗？ | skin |
| F3 | 您感到口苦或嘴里有异味吗？ | digestion |
| F4 | 您大便黏滞不爽、有解不尽的感觉吗？ | excretion |
| F5 | 您小便时尿道有发热感、尿色深(黄)吗？ | excretion |
| F6 | 您带下色黄(白带颜色发黄)吗？(限女性) | excretion |
| F7 | 您阴囊部位潮湿吗？(限男性) | physical |

---

### Section 7: 血瘀质 (Blood Stasis Constitution)

| ID | Question | Category |
|----|----------|----------|
| G1 | 您的皮肤在不知不觉中会出现青紫瘀斑(皮下出血)吗？ | skin |
| G2 | 您两颧部有细微红丝吗？ | complexion |
| G3 | 您身体上有哪里疼痛吗？ | pain |
| G4 | 您面色晦暗或容易出现褐斑吗？ | complexion |
| G5 | 您容易有黑眼圈吗？ | complexion |
| G6 | 您容易忘事(健忘)吗？ | mental |
| G7 | 您口唇颜色偏暗吗？ | complexion |

---

### Section 8: 气郁质 (Qi Stagnation Constitution)

| ID | Question | Category |
|----|----------|----------|
| H1 | 您感到闷闷不乐、情绪低沉吗？ | emotion |
| H2 | 您容易精神紧张、焦虑不安吗？ | emotion |
| H3 | 您多愁善感、感情脆弱吗？ | emotion |
| H4 | 您容易感到害怕或受到惊吓吗？ | emotion |
| H5 | 您胁肋部或乳房胀痛吗？ | pain |
| H6 | 您无缘无故叹气吗？ | emotion |
| H7 | 您咽喉部有异物感(梅核气)吗？ | physical |

---

### Section 9: 特禀质 (Special/Allergic Constitution)

| ID | Question | Category |
|----|----------|----------|
| I1 | 您不感冒也会打喷嚏吗？ | susceptibility |
| I2 | 您不感冒也会鼻塞、流鼻涕吗？ | susceptibility |
| I3 | 您有因季节变化、温度变化或异味等原因而咳喘的现象吗？ | susceptibility |
| I4 | 您容易过敏(药物、食物、气味、花粉)吗？ | susceptibility |
| I5 | 您的皮肤起荨麻疹(风团、风疹块、风疙瘩)吗？ | skin |
| I6 | 您的皮肤因过敏出现过紫癜(紫红色瘀点、瘀斑)吗？ | skin |
| I7 | 您的皮肤一抓就红，并出现抓痕吗？ | skin |

---

## Scoring Algorithm Implementation

```typescript
// Scoring calculation
interface ConstitutionScore {
  constitutionId: string;
  rawScore: number;
  convertedScore: number;
  determination: "definite" | "tendency" | "none";
}

function calculateScore(
  questions: Question[],
  answers: Record<string, number>
): ConstitutionScore {
  const relevantQuestions = questions.filter(q => 
    q.constitutionType === constitutionId
  );
  
  // Calculate raw score
  const rawScore = relevantQuestions.reduce((sum, q) => {
    return sum + (answers[q.id] || 1);
  }, 0);
  
  // Calculate converted score
  const questionCount = relevantQuestions.length;
  const convertedScore = ((rawScore - questionCount) / (questionCount * 4)) * 100;
  
  // Determine result
  let determination: "definite" | "tendency" | "none";
  if (constitutionId === "A") {
    determination = convertedScore >= 60 ? "definite" : "none";
  } else {
    if (convertedScore >= 40) determination = "definite";
    else if (convertedScore >= 30) determination = "tendency";
    else determination = "none";
  }
  
  return {
    constitutionId,
    rawScore,
    convertedScore,
    determination
  };
}

// Final assessment logic
function assessConstitution(allScores: ConstitutionScore[]): AssessmentResult {
  // Check for balanced constitution first
  const balancedScore = allScores.find(s => s.constitutionId === "A");
  const otherScores = allScores.filter(s => s.constitutionId !== "A");
  
  const isBalanced = 
    balancedScore && 
    balancedScore.convertedScore >= 60 &&
    otherScores.every(s => s.convertedScore < 30);
  
  if (isBalanced) {
    return {
      primary: { constitutionId: "A", ...balancedScore },
      secondary: [],
      isBalanced: true
    };
  }
  
  // Sort other scores to find primary and secondary
  const sortedScores = otherScores
    .filter(s => s.determination !== "none")
    .sort((a, b) => b.convertedScore - a.convertedScore);
  
  return {
    primary: sortedScores[0] || null,
    secondary: sortedScores.slice(1, 3),
    isBalanced: false
  };
}
```

---

## Question Flow Design

### Multi-step Form Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Step 1: Introduction & Consent                             │
│  - Brief explanation of TCM constitution                    │
│  - Medical disclaimer                                        │
│  - Privacy notice                                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Basic Information                                  │
│  - Age group (affects interpretation)                        │
│  - Biological sex (some questions differ)                   │
│  - Current season (context for recommendations)             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 3: Core Questions (Grouped by Category)               │
│                                                             │
│  [Category Tabs: Physical | Emotion | Sleep | Digestion...] │
│                                                             │
│  Progress: [████████░░░░░░░░] 50%                           │
│                                                             │
│  Question 5/33: 您手脚发凉吗？                               │
│                                                             │
│  ○ 没有  ○ 很少  ● 有时  ○ 经常  ○ 总是                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 4: Results                                            │
│  - Primary constitution with description                    │
│  - Secondary tendencies                                     │
│  - Score breakdown visualization                            │
│  - Personalized recommendations                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Total Question Count

| Constitution | Questions |
|--------------|-----------|
| 平和质 (A) | 10 |
| 气虚质 (B) | 8 |
| 阳虚质 (C) | 8 |
| 阴虚质 (D) | 8 |
| 痰湿质 (E) | 8 |
| 湿热质 (F) | 7 |
| 血瘀质 (G) | 7 |
| 气郁质 (H) | 7 |
| 特禀质 (I) | 7 |
| **Total** | **~60-70** |

*Note: Some questions are shared across constitutions and will only be asked once.*

---

## Optimization: Shared Questions

The following questions appear in multiple constitution assessments and should be asked once:

| Shared Question | Appears In |
|-----------------|------------|
| 您容易疲乏吗？ | A (reverse), B |
| 您容易气短吗？ | A (reverse), B |
| 您容易心慌吗？ | A (reverse), B |
| 您感到闷闷不乐吗？ | A (reverse), H |
| 您容易忘事吗？ | A (reverse), G |

This reduces total unique questions to approximately **60**.
