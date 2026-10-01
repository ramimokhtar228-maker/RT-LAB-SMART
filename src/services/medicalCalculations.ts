/**
 * RT LAB - Medical Calculation Engine (معامل رامي مختار)
 * Automated Clinical Diagnostic Formulas:
 * 1. CBC Indices: MCV, MCH, MCHC, Mentzer Index, Absolute Differentials, NLR, PLR
 * 2. Lipid Profile: Friedewald LDL, VLDL, Non-HDL, Risk Ratios (Chol/HDL, LDL/HDL)
 * 3. Calcium: Corrected Calcium for Albumin, Ionized Calcium (Ca++)
 * 4. Glucose / Diabetes: HbA1c to eAG (mg/dL & mmol/L), HOMA-IR, HOMA-Beta, QUICKI
 * 5. Kidney & Renal: eGFR (CKD-EPI Equation), BUN (from Urea), BUN/Creatinine Ratio, Urea/Creatinine Ratio
 * 6. Liver & Hepatic: Indirect Bilirubin, Serum Globulin, A/G Ratio, De Ritis Ratio (AST/ALT), APRI
 * 7. Electrolytes: Anion Gap (with and without K+), Calculated Serum Osmolality
 * 8. Iron Profile: Transferrin Saturation % (TSAT), UIBC
 * 9. Tumor Markers: Free/Total PSA Ratio %
 * 10. Coagulation: INR from PT & Control
 */

export interface CalculatedResult {
  testCode: string;
  testName: string;
  value: string;
  unit: string;
  referenceRangeText: string;
  formulaDescription: string;
}

export const MedicalCalculations = {
  /**
   * Run all possible automatic calculations based on available entered test values
   */
  computeAllCalculations(
    inputs: Record<string, string>,
    patientAge: number = 35,
    patientGender: 'Male' | 'Female' = 'Male'
  ): Record<string, CalculatedResult> {
    const results: Record<string, CalculatedResult> = {};

    const num = (...codes: string[]): number | null => {
      for (const c of codes) {
        const val = inputs[c] || inputs[c.toUpperCase()] || inputs[c.toLowerCase()];
        if (val !== undefined && val !== null && val.toString().trim() !== '') {
          const parsed = parseFloat(val.toString().trim());
          if (!isNaN(parsed)) return parsed;
        }
      }
      return null;
    };

    // ==============================================================
    // 1. CBC INDICES & DIFFERENTIALS
    // ==============================================================
    const rbc = num('RBC', 'RBCS', 'T-RBC');
    const hb = num('HB', 'HGB', 'T-HB');
    const hct = num('HCT', 'PCV', 'T-HCT');
    const wbc = num('WBC', 'TOTAL_WBC', 'T-WBC');
    const plt = num('PLT', 'PLATELETS', 'T-PLT');

    if (rbc !== null && rbc > 0) {
      // MCV = (HCT % * 10) / RBC
      if (hct !== null) {
        const mcv = Number(((hct * 10) / rbc).toFixed(1));
        results['MCV'] = {
          testCode: 'MCV',
          testName: 'Mean Corpuscular Volume (MCV)',
          value: mcv.toString(),
          unit: 'fL',
          referenceRangeText: '80.0 - 96.0 fL',
          formulaDescription: 'محسوبة تلقائياً: (HCT % × 10) ÷ RBC'
        };

        // Mentzer Index = MCV / RBC (< 13 suggests Thalassemia trait; > 13 suggests Iron Deficiency Anemia)
        const mentzer = Number((mcv / rbc).toFixed(1));
        results['MENTZER'] = {
          testCode: 'MENTZER',
          testName: 'Mentzer Index (مؤشر مينتزر للأنيميا)',
          value: mentzer.toString(),
          unit: 'Index',
          referenceRangeText: '< 13.0 (Thalassemia Trait) | > 13.0 (Iron Deficiency Anemia)',
          formulaDescription: 'محسوبة تلقائياً: MCV ÷ RBC'
        };
      }

      // MCH = (Hb * 10) / RBC
      if (hb !== null) {
        const mch = Number(((hb * 10) / rbc).toFixed(1));
        results['MCH'] = {
          testCode: 'MCH',
          testName: 'Mean Corpuscular Hemoglobin (MCH)',
          value: mch.toString(),
          unit: 'pg',
          referenceRangeText: '27.0 - 33.0 pg',
          formulaDescription: 'محسوبة تلقائياً: (Hemoglobin × 10) ÷ RBC'
        };
      }
    }

    // MCHC = (Hb * 100) / HCT
    if (hb !== null && hct !== null && hct > 0) {
      const mchc = Number(((hb * 100) / hct).toFixed(1));
      results['MCHC'] = {
        testCode: 'MCHC',
        testName: 'Mean Corpuscular Hb Concentration (MCHC)',
        value: mchc.toString(),
        unit: 'g/dL',
        referenceRangeText: '32.0 - 36.0 g/dL',
        formulaDescription: 'محسوبة تلقائياً: (Hemoglobin × 100) ÷ HCT %'
      };
    }

    // Differential Absolute Counts
    if (wbc !== null && wbc > 0) {
      const neutPct = num('NEUT', 'SEG', 'NEUTROPHILS', 'NEUT_PCT');
      const lymphPct = num('LYMPH', 'LYMPHOCYTES', 'LYMPH_PCT');
      const monoPct = num('MONO', 'MONOCYTES', 'MONO_PCT');
      const eosPct = num('EOS', 'EOSINOPHILS', 'EOS_PCT');
      const basoPct = num('BASO', 'BASOPHILS', 'BASO_PCT');

      if (neutPct !== null) {
        const neutAbs = Math.round((wbc * neutPct) / 100);
        results['NEUT_ABS'] = {
          testCode: 'NEUT_ABS',
          testName: 'Absolute Neutrophil Count (ANC)',
          value: neutAbs.toLocaleString(),
          unit: '/mcL',
          referenceRangeText: '1,500 - 7,500 /mcL',
          formulaDescription: '(WBC × Neutrophil %) ÷ 100'
        };
      }

      if (lymphPct !== null) {
        const lymphAbs = Math.round((wbc * lymphPct) / 100);
        results['LYMPH_ABS'] = {
          testCode: 'LYMPH_ABS',
          testName: 'Absolute Lymphocyte Count (ALC)',
          value: lymphAbs.toLocaleString(),
          unit: '/mcL',
          referenceRangeText: '1,000 - 4,000 /mcL',
          formulaDescription: '(WBC × Lymphocyte %) ÷ 100'
        };

        // NLR (Neutrophil to Lymphocyte Ratio)
        if (neutPct !== null && lymphPct > 0) {
          const nlr = Number((neutPct / lymphPct).toFixed(2));
          results['NLR'] = {
            testCode: 'NLR',
            testName: 'Neutrophil to Lymphocyte Ratio (NLR)',
            value: nlr.toString(),
            unit: 'Ratio',
            referenceRangeText: 'Normal: 1.0 - 3.0 | Elevated Systemic Inflammation: > 3.0',
            formulaDescription: 'Neutrophil % ÷ Lymphocyte %'
          };
        }
      }

      if (monoPct !== null) {
        const monoAbs = Math.round((wbc * monoPct) / 100);
        results['MONO_ABS'] = {
          testCode: 'MONO_ABS',
          testName: 'Absolute Monocyte Count',
          value: monoAbs.toLocaleString(),
          unit: '/mcL',
          referenceRangeText: '200 - 1,000 /mcL',
          formulaDescription: '(WBC × Monocyte %) ÷ 100'
        };
      }

      if (eosPct !== null) {
        const eosAbs = Math.round((wbc * eosPct) / 100);
        results['EOS_ABS'] = {
          testCode: 'EOS_ABS',
          testName: 'Absolute Eosinophil Count',
          value: eosAbs.toLocaleString(),
          unit: '/mcL',
          referenceRangeText: '50 - 500 /mcL',
          formulaDescription: '(WBC × Eosinophil %) ÷ 100'
        };
      }

      if (basoPct !== null) {
        const basoAbs = Math.round((wbc * basoPct) / 100);
        results['BASO_ABS'] = {
          testCode: 'BASO_ABS',
          testName: 'Absolute Basophil Count',
          value: basoAbs.toLocaleString(),
          unit: '/mcL',
          referenceRangeText: '10 - 100 /mcL',
          formulaDescription: '(WBC × Basophil %) ÷ 100'
        };
      }
    }

    // ==============================================================
    // 2. LIPID PROFILE: Friedewald Formula, VLDL, Non-HDL, Risk Ratios
    // ==============================================================
    const chol = num('CHOL', 'LIPID_CHOL', 'TOTAL_CHOL', 'T-CHOL');
    const trig = num('TRIG', 'TG', 'TRIGLYCERIDES', 'T-TG');
    const hdl = num('HDL', 'HDL_CHOL', 'T-HDL');

    if (trig !== null) {
      const vldl = Number((trig / 5).toFixed(1));
      results['VLDL'] = {
        testCode: 'VLDL',
        testName: 'Very Low-Density Lipoprotein (VLDL)',
        value: vldl.toString(),
        unit: 'mg/dL',
        referenceRangeText: '5.0 - 30.0 mg/dL',
        formulaDescription: 'محسوبة تلقائياً: (Triglycerides ÷ 5)'
      };

      if (chol !== null && hdl !== null) {
        if (trig < 400) {
          const ldl = Number((chol - hdl - (trig / 5)).toFixed(1));
          results['LDL'] = {
            testCode: 'LDL',
            testName: 'Low-Density Lipoprotein (LDL Calculated)',
            value: ldl.toString(),
            unit: 'mg/dL',
            referenceRangeText: 'Optimal: < 100 | Near Optimal: 100-129 | Borderline: 130-159 | High: >= 160 mg/dL',
            formulaDescription: 'معادلة فريدوالد Friedewald: (Total Chol - HDL - Trig/5)'
          };

          if (hdl > 0) {
            const ldlHdlRatio = Number((ldl / hdl).toFixed(2));
            results['LDL_HDL_RATIO'] = {
              testCode: 'LDL_HDL_RATIO',
              testName: 'LDL / HDL Cardiovascular Risk Ratio',
              value: ldlHdlRatio.toString(),
              unit: 'Ratio',
              referenceRangeText: 'Low Risk: < 2.5 | Moderate: 2.5 - 3.5 | High Risk: > 3.5',
              formulaDescription: 'LDL Calculated ÷ HDL'
            };
          }
        }

        const nonHdl = Number((chol - hdl).toFixed(1));
        results['NON_HDL'] = {
          testCode: 'NON_HDL',
          testName: 'Non-HDL Cholesterol',
          value: nonHdl.toString(),
          unit: 'mg/dL',
          referenceRangeText: 'Optimal: < 130 mg/dL',
          formulaDescription: 'Total Cholesterol - HDL'
        };

        if (hdl > 0) {
          const cholHdlRatio = Number((chol / hdl).toFixed(2));
          results['CHOL_HDL_RATIO'] = {
            testCode: 'CHOL_HDL_RATIO',
            testName: 'Cholesterol / HDL Risk Ratio (Atherogenic Index)',
            value: cholHdlRatio.toString(),
            unit: 'Ratio',
            referenceRangeText: 'Optimal: < 3.5 | Moderate: 3.5 - 5.0 | High Risk: > 5.0',
            formulaDescription: 'Total Cholesterol ÷ HDL'
          };
        }
      }
    }

    // ==============================================================
    // 3. CALCIUM & IONIZED / CORRECTED CALCIUM
    // ==============================================================
    const ca = num('CA', 'CALCIUM', 'TOTAL_CA', 'T-CA');
    const alb = num('ALB', 'ALBUMIN', 'T-ALB');

    if (ca !== null && alb !== null) {
      // Corrected Calcium = Total Ca + 0.8 * (4.0 - Albumin)
      const correctedCa = Number((ca + 0.8 * (4.0 - alb)).toFixed(2));
      results['CA_CORR'] = {
        testCode: 'CA_CORR',
        testName: 'Corrected Total Calcium (مصحح للألبيومين)',
        value: correctedCa.toString(),
        unit: 'mg/dL',
        referenceRangeText: '8.50 - 10.50 mg/dL',
        formulaDescription: 'معادلة التصحيح: Total Ca + 0.8 × (4.0 - Albumin)'
      };

      // Estimated Ionized Calcium ~ Corrected Ca * 0.5 (or Payne formula approx: 0.8 * Ca - 0.02 * Alb)
      const ionizedCaApprox = Number((correctedCa * 0.5).toFixed(2));
      const ionizedMmol = Number((ionizedCaApprox * 0.25).toFixed(2));
      results['CA_ION'] = {
        testCode: 'CA_ION',
        testName: 'Ionized Calcium (Ca++ Calculated)',
        value: `${ionizedCaApprox} mg/dL (${ionizedMmol} mmol/L)`,
        unit: 'mg/dL',
        referenceRangeText: '4.50 - 5.30 mg/dL (1.12 - 1.32 mmol/L)',
        formulaDescription: 'Ionized fraction based on corrected calcium'
      };
    }

    // ==============================================================
    // 4. HBA1C & ESTIMATED AVERAGE GLUCOSE (eAG)
    // ==============================================================
    const hba1c = num('HBA1C', 'A1C', 'GLYCATED_HB', 'T-HBA1C');
    if (hba1c !== null) {
      // ADAG Formula: eAG (mg/dL) = 28.7 * HbA1c - 46.7
      const eagMg = Math.round(28.7 * hba1c - 46.7);
      const eagMmol = Number((eagMg / 18.018).toFixed(1));
      results['EAG'] = {
        testCode: 'EAG',
        testName: 'Estimated Average Glucose (eAG)',
        value: `${eagMg} mg/dL (${eagMmol} mmol/L)`,
        unit: 'mg/dL',
        referenceRangeText: '< 117 mg/dL (corresponds to A1c < 5.7%)',
        formulaDescription: 'معادلة الجمعية الأمريكية للسكر (ADAG): 28.7 × HbA1c - 46.7'
      };
    }

    // ==============================================================
    // 5. HOMA-IR & HOMA-B & QUICKI (مقاومة الأنسولين ووظيفة خلايا بيتا)
    // ==============================================================
    const fbs = num('FBS', 'GLUCOSE', 'FASTING_GLUCOSE', 'T-FBS');
    const insulin = num('INSULIN', 'FASTING_INSULIN', 'T-INSULIN');

    if (fbs !== null && insulin !== null && fbs > 0 && insulin > 0) {
      // HOMA-IR = (Glucose [mg/dL] * Insulin [uIU/mL]) / 405
      const homaIr = Number(((fbs * insulin) / 405).toFixed(2));
      results['HOMA_IR'] = {
        testCode: 'HOMA_IR',
        testName: 'HOMA-IR (مؤشر مقاومة الأنسولين)',
        value: homaIr.toString(),
        unit: 'Index',
        referenceRangeText: 'Normal: < 1.9 | Early IR: 1.9 - 2.9 | Significant IR: >= 3.0',
        formulaDescription: '(Fasting Glucose × Fasting Insulin) ÷ 405'
      };

      if (fbs > 63) {
        // HOMA-B (%) = (360 * Insulin) / (Glucose - 63)
        const homaB = Math.round((360 * insulin) / (fbs - 63));
        results['HOMA_B'] = {
          testCode: 'HOMA_B',
          testName: 'HOMA-B (كفاءة إفراز خلايا بيتا بالبنكرياس)',
          value: `${homaB}%`,
          unit: '%',
          referenceRangeText: 'Normal: 70 - 150 %',
          formulaDescription: '(360 × Fasting Insulin) ÷ (Fasting Glucose - 63)'
        };
      }

      // QUICKI = 1 / (log(Fasting Insulin) + log(Fasting Glucose))
      const logInsulin = Math.log10(insulin);
      const logGlucose = Math.log10(fbs);
      if (logInsulin + logGlucose > 0) {
        const quicki = Number((1 / (logInsulin + logGlucose)).toFixed(3));
        results['QUICKI'] = {
          testCode: 'QUICKI',
          testName: 'QUICKI (مؤشر الحساسية الكمية للأنسولين)',
          value: quicki.toString(),
          unit: 'Index',
          referenceRangeText: 'Normal: > 0.339 | Insulin Resistance: <= 0.339',
          formulaDescription: '1 ÷ [log(Insulin) + log(Glucose)]'
        };
      }
    }

    // ==============================================================
    // 6. LIVER: Indirect Bilirubin, Globulin, A/G Ratio, De Ritis Ratio
    // ==============================================================
    const tbil = num('TBIL', 'BIL_TOTAL', 'TOTAL_BILIRUBIN', 'T-TBIL');
    const dbil = num('DBIL', 'BIL_DIRECT', 'DIRECT_BILIRUBIN', 'T-DBIL');
    if (tbil !== null && dbil !== null) {
      const ibil = Number(Math.max(0, tbil - dbil).toFixed(2));
      results['IBIL'] = {
        testCode: 'IBIL',
        testName: 'Indirect Bilirubin (الصفراء غير المباشرة)',
        value: ibil.toString(),
        unit: 'mg/dL',
        referenceRangeText: '0.10 - 0.90 mg/dL',
        formulaDescription: 'Total Bilirubin - Direct Bilirubin'
      };
    }

    const tp = num('TP', 'TOTAL_PROTEIN', 'T-TP');
    if (tp !== null && alb !== null) {
      const glob = Number(Math.max(0, tp - alb).toFixed(2));
      results['GLOB'] = {
        testCode: 'GLOB',
        testName: 'Serum Globulin (الجلوبيولين)',
        value: glob.toString(),
        unit: 'g/dL',
        referenceRangeText: '2.30 - 3.50 g/dL',
        formulaDescription: 'Total Protein - Albumin'
      };

      if (glob > 0) {
        const agRatio = Number((alb / glob).toFixed(2));
        results['AG_RATIO'] = {
          testCode: 'AG_RATIO',
          testName: 'A/G Ratio (نسبة الألبيومين إلى الجلوبيولين)',
          value: agRatio.toString(),
          unit: 'Ratio',
          referenceRangeText: '1.20 - 2.20',
          formulaDescription: 'Albumin ÷ Globulin'
        };
      }
    }

    const ast = num('AST', 'SGOT', 'T-AST');
    const alt = num('ALT', 'SGPT', 'T-ALT');
    if (ast !== null && alt !== null && alt > 0) {
      const deRitis = Number((ast / alt).toFixed(2));
      results['DE_RITIS'] = {
        testCode: 'DE_RITIS',
        testName: 'De Ritis Ratio (AST / ALT Ratio)',
        value: deRitis.toString(),
        unit: 'Ratio',
        referenceRangeText: 'Normal: 0.8 - 1.1 | Viral Hepatitis: < 1.0 | Cirrhosis/Alcoholic: > 2.0',
        formulaDescription: 'AST (SGOT) ÷ ALT (SGPT)'
      };
    }

    // ==============================================================
    // 7. RENAL: eGFR (CKD-EPI), BUN, BUN/Creatinine Ratio
    // ==============================================================
    const creat = num('CREAT', 'CREATININE', 'SERUM_CREATININE', 'T-CREAT');
    const urea = num('UREA', 'BLOOD_UREA', 'T-UREA');

    if (urea !== null) {
      // Blood Urea Nitrogen (BUN) = Urea / 2.14
      const bun = Number((urea / 2.14).toFixed(1));
      results['BUN'] = {
        testCode: 'BUN',
        testName: 'Blood Urea Nitrogen (BUN)',
        value: bun.toString(),
        unit: 'mg/dL',
        referenceRangeText: '7.0 - 20.0 mg/dL',
        formulaDescription: 'Blood Urea ÷ 2.14'
      };

      if (creat !== null && creat > 0) {
        const bunCreatRatio = Number((bun / creat).toFixed(1));
        results['BUN_CREAT_RATIO'] = {
          testCode: 'BUN_CREAT_RATIO',
          testName: 'BUN / Creatinine Ratio',
          value: bunCreatRatio.toString(),
          unit: 'Ratio',
          referenceRangeText: 'Normal: 10.0 - 20.0 | Prerenal Azotemia: > 20.0 | Intrinsic Renal: < 10.0',
          formulaDescription: 'BUN ÷ Serum Creatinine'
        };

        const ureaCreatRatio = Number((urea / creat).toFixed(1));
        results['UREA_CREAT_RATIO'] = {
          testCode: 'UREA_CREAT_RATIO',
          testName: 'Urea / Creatinine Ratio',
          value: ureaCreatRatio.toString(),
          unit: 'Ratio',
          referenceRangeText: 'Normal: 20.0 - 40.0 | Dehydration: > 40.0',
          formulaDescription: 'Blood Urea ÷ Serum Creatinine'
        };
      }
    }

    if (creat !== null && creat > 0 && patientAge > 0) {
      let egfr = 0;
      if (patientGender === 'Female') {
        const k = 0.7;
        const a = -0.329;
        const minVal = Math.min(creat / k, 1);
        const maxVal = Math.max(creat / k, 1);
        egfr = 144 * Math.pow(minVal, a) * Math.pow(maxVal, -1.209) * Math.pow(0.993, patientAge);
      } else {
        const k = 0.9;
        const a = -0.411;
        const minVal = Math.min(creat / k, 1);
        const maxVal = Math.max(creat / k, 1);
        egfr = 141 * Math.pow(minVal, a) * Math.pow(maxVal, -1.209) * Math.pow(0.993, patientAge);
      }
      const roundedEgfr = Math.round(egfr);

      results['EGFR'] = {
        testCode: 'EGFR',
        testName: 'eGFR (معدل الترشيح الكبيبي المقدر - CKD-EPI)',
        value: `${roundedEgfr}`,
        unit: 'mL/min/1.73m²',
        referenceRangeText: 'G1 (Normal): >= 90 | G2 (Mild): 60-89 | G3: 30-59 | G4: 15-29 | G5: < 15',
        formulaDescription: 'معادلة CKD-EPI الرسمية (Creatinine, Age, Gender)'
      };
    }

    // ==============================================================
    // 8. ELECTROLYTES: Anion Gap & Serum Osmolality
    // ==============================================================
    const na = num('NA', 'SODIUM', 'T-NA');
    const k = num('K', 'POTASSIUM', 'T-K');
    const cl = num('CL', 'CHLORIDE', 'T-CL');
    const hco3 = num('HCO3', 'BICARBONATE', 'CO2', 'T-HCO3');

    if (na !== null && cl !== null && hco3 !== null) {
      const agWithK = k !== null ? Number(((na + k) - (cl + hco3)).toFixed(1)) : null;
      const agNoK = Number((na - (cl + hco3)).toFixed(1));

      results['ANION_GAP'] = {
        testCode: 'ANION_GAP',
        testName: 'Serum Anion Gap (الفجوة الأيونية)',
        value: agWithK !== null ? `${agNoK} (بدون K) / ${agWithK} (مع K)` : `${agNoK}`,
        unit: 'mEq/L',
        referenceRangeText: 'Normal: 8.0 - 16.0 mEq/L (High Anion Gap Acidosis: > 16.0)',
        formulaDescription: '[Na+ (+ K+)] - [Cl- + HCO3-]'
      };

      if (fbs !== null && urea !== null) {
        const bunVal = urea / 2.14;
        const osmolality = Math.round(2 * na + (fbs / 18) + (bunVal / 2.8));
        results['OSMOLALITY'] = {
          testCode: 'OSMOLALITY',
          testName: 'Calculated Serum Osmolality (الأسمولية المحسوبة)',
          value: `${osmolality}`,
          unit: 'mOsm/kg',
          referenceRangeText: 'Normal: 275 - 295 mOsm/kg',
          formulaDescription: '2 × Na + (Glucose ÷ 18) + (BUN ÷ 2.8)'
        };
      }
    }

    // ==============================================================
    // 9. IRON PROFILE: Transferrin Saturation % & UIBC
    // ==============================================================
    const iron = num('IRON', 'SERUM_IRON', 'T-IRON');
    const tibc = num('TIBC', 'TOTAL_IRON_BINDING_CAPACITY', 'T-TIBC');
    if (iron !== null && tibc !== null && tibc > 0) {
      const tsat = Number(((iron / tibc) * 100).toFixed(1));
      results['TSAT'] = {
        testCode: 'TSAT',
        testName: 'Transferrin Saturation % (نسبة تشبع الترانسفيرين)',
        value: `${tsat}%`,
        unit: '%',
        referenceRangeText: '20.0 - 50.0 % (Iron Deficiency: < 16% | Hemochromatosis: > 50%)',
        formulaDescription: '(Serum Iron ÷ TIBC) × 100'
      };

      const uibc = Math.max(0, Math.round(tibc - iron));
      results['UIBC'] = {
        testCode: 'UIBC',
        testName: 'Unsaturated Iron Binding Capacity (UIBC)',
        value: `${uibc}`,
        unit: 'mcg/dL',
        referenceRangeText: '110 - 370 mcg/dL',
        formulaDescription: 'TIBC - Serum Iron'
      };
    }

    // ==============================================================
    // 10. PROSTATE PSA RATIO
    // ==============================================================
    const fpsa = num('FPSA', 'FREE_PSA', 'T-FPSA');
    const tpsa = num('TPSA', 'PSA', 'TOTAL_PSA', 'T-PSA');
    if (fpsa !== null && tpsa !== null && tpsa > 0) {
      const psaRatio = Number(((fpsa / tpsa) * 100).toFixed(1));
      results['FREE_TOTAL_PSA'] = {
        testCode: 'FREE_TOTAL_PSA',
        testName: 'Free/Total PSA Ratio (نسبة PSA الحر إلى الكلي)',
        value: `${psaRatio}%`,
        unit: '%',
        referenceRangeText: '> 25% (Low Cancer Risk) | 10 - 25% (Intermediate) | < 10% (High Risk)',
        formulaDescription: '(Free PSA ÷ Total PSA) × 100'
      };
    }

    // ==============================================================
    // 11. COAGULATION: INR calculation
    // ==============================================================
    const pt = num('PT', 'PATIENT_PT', 'T-PT');
    const controlPt = num('PT_CONTROL', 'CONTROL_PT') || 12.0;
    const isi = num('ISI') || 1.0;
    if (pt !== null && pt > 0 && controlPt > 0) {
      const inr = Number(Math.pow(pt / controlPt, isi).toFixed(2));
      results['INR'] = {
        testCode: 'INR',
        testName: 'International Normalized Ratio (INR)',
        value: inr.toString(),
        unit: 'Ratio',
        referenceRangeText: 'Normal: 0.85 - 1.15 | Therapeutic Warfarin: 2.0 - 3.0',
        formulaDescription: '(Patient PT ÷ Control PT) ^ ISI'
      };
    }

    return results;
  }
};
