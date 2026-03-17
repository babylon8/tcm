# Streamlined TCM Constitution Assessment Plan

## Overview
Reduce the 70-question assessment to 30-35 questions while maintaining diagnostic accuracy through:
- Initial screening questions (5-8)
- Adaptive questioning based on early responses
- Dynamic assessment paths
- Intelligent question filtering

## Assessment Structure

### Stage 1: Initial Screening (8 questions)
**Purpose:** Identify primary constitution tendencies
**Questions:**
1. Q_A01 - Energy level (All constitutions)
2. Q_A02 - Fatigue (All constitutions)
3. Q_C01 - Cold hands/feet (C, B)
4. Q_D01 - Hot palms/soles (D)
5. Q_E01 - Chest tightness (E)
6. Q_F01 - Oily skin (F)
7. Q_G01 - Easy bruising (G)
8. Q_H01 - Depression (H, A)

### Stage 2: Adaptive Flow (22-27 questions)
Based on screening responses, show only relevant follow-up questions:

#### Balanced Constitution Path (A):
- Q_A03 - Weak voice (A, B)
- Q_A04 - Depression (A, H)
- Q_A05 - Easily frightened (A)
- Q_A06 - Forgetfulness (A, G)
- Q_A07 - Insomnia (A)
- Q_A08 - Heart palpitations (A, B)
- Q_A09 - Shortness of breath (A, B)
- Q_A10 - Irritability (A)

#### Qi Deficiency Path (B):
- Q_B04 - Dizziness (B)
- Q_B05 - Cold susceptibility (B, C)
- Q_B06 - Quiet/lazy talker (B)
- Q_B07 - Weak voice (B, A)
- Q_B08 - Easy sweating (B)

#### Yang Deficiency Path (C):
- Q_C02 - Stomach/back/knee cold (C)
- Q_C03 - Feels cold, wears more clothes (C)
- Q_C04 - Winter cold intolerance (C)
- Q_C05 - Cold susceptibility (C, B)
- Q_C06 - Dislikes cold food/drink (C)
- Q_C07 - Diarrhea after cold (C)
- Q_C08 - Lower abdomen cold (C)

#### Yin Deficiency Path (D):
- Q_D02 - Body/face heat (D)
- Q_D03 - Dry skin/lips (D)
- Q_D04 - Red lips (D)
- Q_D05 - Constipation (D)
- Q_D06 - Flushed cheeks (D)
- Q_D07 - Dry eyes (D)
- Q_D08 - Dry mouth/throat (D)

#### Phlegm-Dampness Path (E):
- Q_E02 - Heavy/uncomfortable body (E)
- Q_E03 - Fat/soft abdomen (E)
- Q_E04 - Forehead oil (E)
- Q_E05 - Swollen eyelids (E)
- Q_E06 - Sticky mouth (E)
- Q_E07 - Phlegm (E)
- Q_E08 - Thick tongue coating (E)

#### Damp-Heat Path (F):
- Q_F02 - Acne/boils (F)
- Q_F03 - Bitter taste/bad breath (F)
- Q_F04 - Sticky stools (F)
- Q_F05 - Burning urination (F)
- Q_F06 - Yellow discharge (F)
- Q_F07 - Damp scrotum (F)

#### Blood Stasis Path (G):
- Q_G02 - Fine red lines on cheeks (G)
- Q_G03 - Body pain (G)
- Q_G04 - Dull complexion/brown spots (G)
- Q_G05 - Dark circles (G)
- Q_G06 - Forgetfulness (G, A)
- Q_G07 - Dark lips (G)

#### Qi Stagnation Path (H):
- Q_H02 - Nervous/anxious (H)
- Q_H03 - Sentimental/emotional (H)
- Q_H04 - Easily scared (H)
- Q_H05 - Rib/side pain (H)
- Q_H06 - Sighing (H)
- Q_H07 - Throat sensation (H)

#### Allergic Constitution Path (I):
- Q_I01 - Sneezing without cold (I)
- Q_I02 - Stuffy/runny nose without cold (I)
- Q_I03 - Cough/wheeze from triggers (I)
- Q_I04 - Allergies (I)
- Q_I05 - Hives (I)
- Q_I06 - Allergic purpura (I)
- Q_I07 - Scratch marks (I)

## Adaptive Logic

### Initial Screening Decision Tree
1. If responses show strong A tendencies (Balanced) → Show A path questions
2. If responses show strong B tendencies (Qi Deficiency) → Show B path questions
3. If responses show strong C tendencies (Yang Deficiency) → Show C path questions
4. If responses show strong D tendencies (Yin Deficiency) → Show D path questions
5. If responses show strong E tendencies (Phlegm-Dampness) → Show E path questions
6. If responses show strong F tendencies (Damp-Heat) → Show F path questions
7. If responses show strong G tendencies (Blood Stasis) → Show G path questions
8. If responses show strong H tendencies (Qi Stagnation) → Show H path questions
9. If responses show strong I tendencies (Allergic) → Show I path questions
10. If mixed tendencies → Show top 2-3 constitution paths

### Early Termination Conditions
- High confidence in primary constitution (≥70% confidence)
- Sufficient questions answered for secondary constitution determination
- User can choose to complete full assessment

## Question Reduction Strategy

### Removed Questions (40 removed from 70):
- Highly redundant questions (shared across types)
- Questions with low diagnostic value
- Questions that don't add unique information
- Questions that can be inferred from other responses

### Key Reduction Principles:
1. Keep questions that uniquely identify constitution types
2. Remove questions that are highly correlated
3. Maintain scoring accuracy with fewer questions
4. Ensure adaptive logic can still make accurate determinations

## Implementation Plan

### 1. Data Structure Updates
- Create new streamlined question set (30-35 questions)
- Add adaptive flow metadata to questions
- Update scoring logic for reduced question count

### 2. Assessment Flow Changes
- Implement initial screening stage
- Create adaptive branching logic
- Add early termination conditions
- Update progress indicators

### 3. UI/UX Updates
- Dynamic question display based on responses
- Skip logic visualization
- Confidence meter
- Adaptive progress bar

### 4. Scoring Logic Updates
- Adjust scoring formula for fewer questions
- Implement confidence-based scoring
- Handle missing questions appropriately
- Update constitution determination thresholds

## Benefits

### User Experience
- Assessment time: 5-7 minutes (vs 15-20 minutes)
- Reduced user fatigue
- More engaging adaptive experience
- Clear progress indicators
- Transparent assessment logic

### Diagnostic Accuracy
- Maintains or improves constitution determination
- Better focus on relevant questions
- More accurate for mixed constitution cases
- Reduced noise from redundant questions

### Technical Improvements
- More efficient assessment process
- Better user completion rates
- Improved data quality
- Scalable for future enhancements

## Next Steps

1. Implement streamlined question set
2. Update assessment scoring logic
3. Create adaptive UI components
4. Add progress indicators
5. Test with various user profiles
6. Validate accuracy vs. original assessment
7. Optimize based on user feedback

This plan reduces assessment time by 60% while maintaining or improving diagnostic accuracy through intelligent question filtering and adaptive questioning.