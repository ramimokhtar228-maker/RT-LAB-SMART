import { OrderTestResult, ResultFlag } from '../types/lis';

export interface SubTestDefinition {
  testId: string;
  testCode: string;
  testName: string;
  profileCategory: string;
  unit: string;
  referenceRangeText: string;
  defaultNormalValue: string;
  options?: string[]; // for select dropdowns
  formulaDescription?: string;
  isAutoCalculated?: boolean;
}

export interface CompositeProfileDefinition {
  parentCode: string;
  parentName: string;
  profileCategory: string;
  subTests: SubTestDefinition[];
}

export const COMPOSITE_PROFILES: Record<string, CompositeProfileDefinition> = {
  // 1. COMPLETE BLOOD COUNT (CBC)
  CBC: {
    parentCode: 'CBC',
    parentName: 'صورة دم كاملة (Complete Blood Count)',
    profileCategory: 'Hematology Profile',
    subTests: [
      {
        testId: 'cbc-hb',
        testCode: 'HB',
        testName: 'Hemoglobin (Hb)',
        profileCategory: 'Hematology Profile',
        unit: 'g/dL',
        referenceRangeText: '13.0 - 17.5 g/dL (M) | 12.0 - 15.5 (F)',
        defaultNormalValue: '14.2'
      },
      {
        testId: 'cbc-rbc',
        testCode: 'RBC',
        testName: 'Red Blood Cells (RBCs)',
        profileCategory: 'Hematology Profile',
        unit: 'x10^6/mcL',
        referenceRangeText: '4.50 - 5.90 x10^6/mcL',
        defaultNormalValue: '4.85'
      },
      {
        testId: 'cbc-hct',
        testCode: 'HCT',
        testName: 'Hematocrit (PCV)',
        profileCategory: 'Hematology Profile',
        unit: '%',
        referenceRangeText: '40.0 - 52.0 %',
        defaultNormalValue: '42.5'
      },
      {
        testId: 'cbc-mcv',
        testCode: 'MCV',
        testName: 'Mean Corpuscular Volume (MCV)',
        profileCategory: 'Hematology Profile',
        unit: 'fL',
        referenceRangeText: '80.0 - 96.0 fL',
        defaultNormalValue: '87.6',
        isAutoCalculated: true,
        formulaDescription: '(HCT × 10) / RBC'
      },
      {
        testId: 'cbc-mch',
        testCode: 'MCH',
        testName: 'Mean Corpuscular Hemoglobin (MCH)',
        profileCategory: 'Hematology Profile',
        unit: 'pg',
        referenceRangeText: '27.0 - 33.0 pg',
        defaultNormalValue: '29.3',
        isAutoCalculated: true,
        formulaDescription: '(Hb × 10) / RBC'
      },
      {
        testId: 'cbc-mchc',
        testCode: 'MCHC',
        testName: 'Mean Corpuscular Hb Conc. (MCHC)',
        profileCategory: 'Hematology Profile',
        unit: 'g/dL',
        referenceRangeText: '32.0 - 36.0 g/dL',
        defaultNormalValue: '33.4',
        isAutoCalculated: true,
        formulaDescription: '(Hb × 100) / HCT'
      },
      {
        testId: 'cbc-rdw',
        testCode: 'RDW',
        testName: 'Red Cell Dist. Width (RDW-CV)',
        profileCategory: 'Hematology Profile',
        unit: '%',
        referenceRangeText: '11.5 - 14.5 %',
        defaultNormalValue: '12.8'
      },
      {
        testId: 'cbc-wbc',
        testCode: 'WBC',
        testName: 'Total Leucocytic Count (WBCs)',
        profileCategory: 'Hematology Profile',
        unit: 'x10^3/mcL',
        referenceRangeText: '4.00 - 11.00 x10^3/mcL',
        defaultNormalValue: '6.80'
      },
      {
        testId: 'cbc-neut',
        testCode: 'NEUT_PCT',
        testName: 'Neutrophils % (العدلات)',
        profileCategory: 'Hematology Profile',
        unit: '%',
        referenceRangeText: '40.0 - 75.0 %',
        defaultNormalValue: '58.0'
      },
      {
        testId: 'cbc-lymph',
        testCode: 'LYMPH_PCT',
        testName: 'Lymphocytes % (الليمفاويات)',
        profileCategory: 'Hematology Profile',
        unit: '%',
        referenceRangeText: '20.0 - 45.0 %',
        defaultNormalValue: '32.0'
      },
      {
        testId: 'cbc-mono',
        testCode: 'MONO_PCT',
        testName: 'Monocytes % (الوحيدات)',
        profileCategory: 'Hematology Profile',
        unit: '%',
        referenceRangeText: '2.0 - 8.0 %',
        defaultNormalValue: '5.5'
      },
      {
        testId: 'cbc-eos',
        testCode: 'EOS_PCT',
        testName: 'Eosinophils % (الحمضات)',
        profileCategory: 'Hematology Profile',
        unit: '%',
        referenceRangeText: '1.0 - 4.0 %',
        defaultNormalValue: '2.5'
      },
      {
        testId: 'cbc-baso',
        testCode: 'BASO_PCT',
        testName: 'Basophils % (القاعديات)',
        profileCategory: 'Hematology Profile',
        unit: '%',
        referenceRangeText: '0.0 - 1.0 %',
        defaultNormalValue: '0.5'
      },
      {
        testId: 'cbc-plt',
        testCode: 'PLT',
        testName: 'Platelet Count (PLT)',
        profileCategory: 'Hematology Profile',
        unit: 'x10^3/mcL',
        referenceRangeText: '150 - 450 x10^3/mcL',
        defaultNormalValue: '265'
      }
    ]
  },

  // 2. COMPLETE URINE ANALYSIS
  URINE_ROUTINE: {
    parentCode: 'URINE_ROUTINE',
    parentName: 'تحليل البول الكامل (Complete Urine Analysis)',
    profileCategory: 'Urine & Body Fluids',
    subTests: [
      {
        testId: 'urine-color',
        testCode: 'U_COLOR',
        testName: 'Color (لون البول)',
        profileCategory: 'Urine & Body Fluids',
        unit: 'Physical',
        referenceRangeText: 'Amber Yellow / Yellow',
        defaultNormalValue: 'Amber Yellow',
        options: ['Amber Yellow', 'Pale Yellow', 'Yellow', 'Dark Yellow', 'Orange', 'Reddish', 'Brown', 'Cloudy Yellow']
      },
      {
        testId: 'urine-aspect',
        testCode: 'U_ASPECT',
        testName: 'Aspect / Clarity (المظهر والشفافية)',
        profileCategory: 'Urine & Body Fluids',
        unit: 'Physical',
        referenceRangeText: 'Clear',
        defaultNormalValue: 'Clear',
        options: ['Clear', 'Slightly Turbid', 'Turbid', 'Hazy']
      },
      {
        testId: 'urine-sp-grav',
        testCode: 'U_SG',
        testName: 'Specific Gravity (الكثافة النوعية)',
        profileCategory: 'Urine & Body Fluids',
        unit: 'Ratio',
        referenceRangeText: '1.015 - 1.025',
        defaultNormalValue: '1.020'
      },
      {
        testId: 'urine-ph',
        testCode: 'U_PH',
        testName: 'Reaction (pH الرقم الهيدروجيني)',
        profileCategory: 'Urine & Body Fluids',
        unit: 'pH',
        referenceRangeText: '5.0 - 7.5 (Acidic)',
        defaultNormalValue: '6.0'
      },
      {
        testId: 'urine-prot',
        testCode: 'U_PROT',
        testName: 'Protein / Albumin (الزلال)',
        profileCategory: 'Urine & Body Fluids',
        unit: 'Chemical',
        referenceRangeText: 'Nil / Negative',
        defaultNormalValue: 'Nil',
        options: ['Nil', 'Trace', '+ (30 mg/dL)', '++ (100 mg/dL)', '+++ (300 mg/dL)', '++++ (>500 mg/dL)']
      },
      {
        testId: 'urine-glu',
        testCode: 'U_GLU',
        testName: 'Glucose / Sugar (السكر)',
        profileCategory: 'Urine & Body Fluids',
        unit: 'Chemical',
        referenceRangeText: 'Nil / Negative',
        defaultNormalValue: 'Nil',
        options: ['Nil', 'Trace', '+ (100 mg/dL)', '++ (250 mg/dL)', '+++ (500 mg/dL)', '++++ (>=1000 mg/dL)']
      },
      {
        testId: 'urine-ket',
        testCode: 'U_KET',
        testName: 'Ketone Bodies (الأسيتون)',
        profileCategory: 'Urine & Body Fluids',
        unit: 'Chemical',
        referenceRangeText: 'Nil / Negative',
        defaultNormalValue: 'Nil',
        options: ['Nil', 'Trace', '+ (Small)', '++ (Moderate)', '+++ (Large)']
      },
      {
        testId: 'urine-bil',
        testCode: 'U_BIL',
        testName: 'Bilirubin (الصفراء)',
        profileCategory: 'Urine & Body Fluids',
        unit: 'Chemical',
        referenceRangeText: 'Negative',
        defaultNormalValue: 'Negative',
        options: ['Negative', '+ (Small)', '++ (Moderate)', '+++ (Large)']
      },
      {
        testId: 'urine-uro',
        testCode: 'U_URO',
        testName: 'Urobilinogen (اليوروبيلينوجين)',
        profileCategory: 'Urine & Body Fluids',
        unit: 'mg/dL',
        referenceRangeText: 'Normal (0.2 - 1.0 mg/dL)',
        defaultNormalValue: 'Normal',
        options: ['Normal', '+ (2.0 mg/dL)', '++ (4.0 mg/dL)', '+++ (8.0 mg/dL)']
      },
      {
        testId: 'urine-nit',
        testCode: 'U_NIT',
        testName: 'Nitrite (النيتريت)',
        profileCategory: 'Urine & Body Fluids',
        unit: 'Chemical',
        referenceRangeText: 'Negative',
        defaultNormalValue: 'Negative',
        options: ['Negative', 'Positive']
      },
      {
        testId: 'urine-leuk',
        testCode: 'U_LEUK',
        testName: 'Leukocyte Esterase',
        profileCategory: 'Urine & Body Fluids',
        unit: 'Chemical',
        referenceRangeText: 'Negative',
        defaultNormalValue: 'Negative',
        options: ['Negative', 'Trace', '+ (Small)', '++ (Moderate)', '+++ (Large)']
      },
      {
        testId: 'urine-pus',
        testCode: 'U_PUS',
        testName: 'Pus Cells / WBCs (خلايا الصديد)',
        profileCategory: 'Urine & Body Fluids',
        unit: '/HPF',
        referenceRangeText: '0 - 5 /HPF',
        defaultNormalValue: '1 - 3'
      },
      {
        testId: 'urine-rbcs',
        testCode: 'U_RBC',
        testName: 'Red Blood Cells (كرات الدم الحمراء)',
        profileCategory: 'Urine & Body Fluids',
        unit: '/HPF',
        referenceRangeText: '0 - 3 /HPF',
        defaultNormalValue: '0 - 2'
      },
      {
        testId: 'urine-epith',
        testCode: 'U_EPITH',
        testName: 'Epithelial Cells (الخلايا الظهارية)',
        profileCategory: 'Urine & Body Fluids',
        unit: 'Microscopy',
        referenceRangeText: 'Few / Nil',
        defaultNormalValue: 'Few',
        options: ['Nil', 'Few', 'Moderate', 'Many', 'Overloaded']
      },
      {
        testId: 'urine-cryst',
        testCode: 'U_CRYST',
        testName: 'Crystals (الأملاح والبلورات)',
        profileCategory: 'Urine & Body Fluids',
        unit: 'Microscopy',
        referenceRangeText: 'Nil / Normal',
        defaultNormalValue: 'Nil',
        options: [
          'Nil',
          'Calcium Oxalate (+)',
          'Calcium Oxalate (++)',
          'Uric Acid (+)',
          'Uric Acid (++)',
          'Triple Phosphate (+)',
          'Triple Phosphate (++)',
          'Amorphous Urates (+)',
          'Amorphous Urates (++)',
          'Amorphous Phosphates (+)'
        ]
      },
      {
        testId: 'urine-casts',
        testCode: 'U_CASTS',
        testName: 'Casts (الاسطوانات المجهرية)',
        profileCategory: 'Urine & Body Fluids',
        unit: 'Microscopy',
        referenceRangeText: 'Nil',
        defaultNormalValue: 'Nil',
        options: ['Nil', 'Hyaline Casts (0-1 /LPF)', 'Granular Casts (+)', 'Cellular Casts (+)', 'RBC Casts (+)', 'WBC Casts (+)']
      },
      {
        testId: 'urine-muc',
        testCode: 'U_MUC',
        testName: 'Mucus Threads (المخاط)',
        profileCategory: 'Urine & Body Fluids',
        unit: 'Microscopy',
        referenceRangeText: 'Nil / Trace',
        defaultNormalValue: 'Nil',
        options: ['Nil', 'Trace', '+ (Moderate)', '++ (Many)']
      },
      {
        testId: 'urine-bact',
        testCode: 'U_BACT',
        testName: 'Bacteria (البكتيريا)',
        profileCategory: 'Urine & Body Fluids',
        unit: 'Microscopy',
        referenceRangeText: 'Nil',
        defaultNormalValue: 'Nil',
        options: ['Nil', 'Few (+)', 'Moderate (++)', 'Many (+++)']
      },
      {
        testId: 'urine-paras',
        testCode: 'U_PARAS',
        testName: 'Parasites & Ova (الطفيليات والديدان)',
        profileCategory: 'Urine & Body Fluids',
        unit: 'Microscopy',
        referenceRangeText: 'Nil / Not Seen',
        defaultNormalValue: 'Nil',
        options: ['Nil', 'Trichomonas vaginalis seen', 'Schistosoma haematobium ova seen', 'Yeast Cells (Candida) seen']
      }
    ]
  },

  // 3. COMPLETE STOOL ANALYSIS
  STOOL_ROUTINE: {
    parentCode: 'STOOL_ROUTINE',
    parentName: 'تحليل البراز الكامل والطفيليات (Complete Stool Analysis)',
    profileCategory: 'Gastrointestinal Profile',
    subTests: [
      {
        testId: 'stool-color',
        testCode: 'ST_COLOR',
        testName: 'Color (اللون)',
        profileCategory: 'Gastrointestinal Profile',
        unit: 'Physical',
        referenceRangeText: 'Brown',
        defaultNormalValue: 'Brown',
        options: ['Brown', 'Dark Brown', 'Light Brown', 'Yellowish', 'Greenish', 'Clay / Pale', 'Black / Tar']
      },
      {
        testId: 'stool-cons',
        testCode: 'ST_CONS',
        testName: 'Consistency (القوام)',
        profileCategory: 'Gastrointestinal Profile',
        unit: 'Physical',
        referenceRangeText: 'Formed / Soft',
        defaultNormalValue: 'Formed',
        options: ['Formed', 'Semi-formed', 'Soft', 'Loose / Diarrhea', 'Watery', 'Hard']
      },
      {
        testId: 'stool-muc',
        testCode: 'ST_MUC',
        testName: 'Mucus (المخاط)',
        profileCategory: 'Gastrointestinal Profile',
        unit: 'Physical',
        referenceRangeText: 'Nil',
        defaultNormalValue: 'Nil',
        options: ['Nil', '+ (Small Amount)', '++ (Moderate)', '+++ (Large Amount)']
      },
      {
        testId: 'stool-bld',
        testCode: 'ST_BLD',
        testName: 'Blood (الدم الظاهري)',
        profileCategory: 'Gastrointestinal Profile',
        unit: 'Physical',
        referenceRangeText: 'Nil',
        defaultNormalValue: 'Nil',
        options: ['Nil', 'Present (+)', 'Trace']
      },
      {
        testId: 'stool-pus',
        testCode: 'ST_PUS',
        testName: 'Pus Cells (خلايا الصديد)',
        profileCategory: 'Gastrointestinal Profile',
        unit: '/HPF',
        referenceRangeText: '0 - 2 /HPF',
        defaultNormalValue: '0 - 2'
      },
      {
        testId: 'stool-rbcs',
        testCode: 'ST_RBC',
        testName: 'Red Blood Cells (كرات الدم الحمراء)',
        profileCategory: 'Gastrointestinal Profile',
        unit: '/HPF',
        referenceRangeText: '0 - 2 /HPF',
        defaultNormalValue: '0 - 1'
      },
      {
        testId: 'stool-ova',
        testCode: 'ST_OVA',
        testName: 'Helminths & Ova (بويضات الديدان)',
        profileCategory: 'Gastrointestinal Profile',
        unit: 'Microscopy',
        referenceRangeText: 'No parasitic ova seen',
        defaultNormalValue: 'No parasitic ova seen',
        options: [
          'No parasitic ova seen',
          'Ascaris lumbricoides ova seen',
          'Enterobius vermicularis (Oxyuris) seen',
          'Ancylostoma duodenale ova seen',
          'Trichuris trichiura ova seen',
          'Hymenolepis nana ova seen',
          'Fasciola hepatica ova seen'
        ]
      },
      {
        testId: 'stool-proto',
        testCode: 'ST_PROTO',
        testName: 'Protozoa & Cysts (الحويصلات الأولية)',
        profileCategory: 'Gastrointestinal Profile',
        unit: 'Microscopy',
        referenceRangeText: 'No protozoa or cysts seen',
        defaultNormalValue: 'No protozoa seen',
        options: [
          'No protozoa seen',
          'Entamoeba histolytica cysts seen (+)',
          'Entamoeba histolytica cysts seen (++)',
          'Giardia lamblia cysts seen (+)',
          'Giardia lamblia cysts seen (++)',
          'Blastocystis hominis seen (+)',
          'Blastocystis hominis seen (++)',
          'Entamoeba coli cysts seen'
        ]
      },
      {
        testId: 'stool-troph',
        testCode: 'ST_TROPH',
        testName: 'Trophozoites (الأطوار النشطة)',
        profileCategory: 'Gastrointestinal Profile',
        unit: 'Microscopy',
        referenceRangeText: 'Not seen',
        defaultNormalValue: 'Not seen',
        options: ['Not seen', 'Entamoeba histolytica trophozoite seen (+)', 'Giardia lamblia trophozoite seen (+)']
      },
      {
        testId: 'stool-food',
        testCode: 'ST_FOOD',
        testName: 'Undigested Food Particles (طعام غير مهضوم)',
        profileCategory: 'Gastrointestinal Profile',
        unit: 'Microscopy',
        referenceRangeText: 'Nil / Few',
        defaultNormalValue: 'Few',
        options: ['Nil', 'Few', 'Moderate (+)', 'Many (++)']
      },
      {
        testId: 'stool-starch',
        testCode: 'ST_STARCH',
        testName: 'Starch Granules (حبيبات النشا)',
        profileCategory: 'Gastrointestinal Profile',
        unit: 'Microscopy',
        referenceRangeText: 'Nil / Few',
        defaultNormalValue: 'Few',
        options: ['Nil', 'Few', 'Moderate (+)', 'Many (++)']
      },
      {
        testId: 'stool-fat',
        testCode: 'ST_FAT',
        testName: 'Fat Droplets (قطرات الدهون)',
        profileCategory: 'Gastrointestinal Profile',
        unit: 'Microscopy',
        referenceRangeText: 'Nil / Few',
        defaultNormalValue: 'Nil',
        options: ['Nil', 'Few', 'Moderate (+)', 'Many (++)']
      }
    ]
  },

  // 4. COMPLETE SEMEN ANALYSIS
  SEMEN_ANALYSIS: {
    parentCode: 'SEMEN_ANALYSIS',
    parentName: 'تحليل السائل المنوي الشامل (Semen Analysis WHO 6th)',
    profileCategory: 'Fertility & Reproductive',
    subTests: [
      {
        testId: 'semen-vol',
        testCode: 'SEM_VOL',
        testName: 'Volume (الحجم)',
        profileCategory: 'Fertility & Reproductive',
        unit: 'mL',
        referenceRangeText: '>= 1.5 mL',
        defaultNormalValue: '3.2'
      },
      {
        testId: 'semen-liq',
        testCode: 'SEM_LIQ',
        testName: 'Liquefaction Time (زمن السيولة)',
        profileCategory: 'Fertility & Reproductive',
        unit: 'Minutes',
        referenceRangeText: '<= 30 minutes',
        defaultNormalValue: '25'
      },
      {
        testId: 'semen-color',
        testCode: 'SEM_COLOR',
        testName: 'Color & Appearance (اللون والمظهر)',
        profileCategory: 'Fertility & Reproductive',
        unit: 'Physical',
        referenceRangeText: 'Greyish-white, Homogeneous',
        defaultNormalValue: 'Greyish-white',
        options: ['Greyish-white', 'Yellowish', 'Reddish-brown']
      },
      {
        testId: 'semen-visc',
        testCode: 'SEM_VISC',
        testName: 'Viscosity (اللزوجة)',
        profileCategory: 'Fertility & Reproductive',
        unit: 'Physical',
        referenceRangeText: 'Normal (Thread <= 2cm)',
        defaultNormalValue: 'Normal',
        options: ['Normal', 'High', 'Very High']
      },
      {
        testId: 'semen-ph',
        testCode: 'SEM_PH',
        testName: 'pH (الرقم الهيدروجيني)',
        profileCategory: 'Fertility & Reproductive',
        unit: 'pH',
        referenceRangeText: '7.2 - 8.0',
        defaultNormalValue: '7.8'
      },
      {
        testId: 'semen-conc',
        testCode: 'SEM_CONC',
        testName: 'Sperm Concentration (التركيز)',
        profileCategory: 'Fertility & Reproductive',
        unit: 'Million/mL',
        referenceRangeText: '>= 15.0 Million/mL',
        defaultNormalValue: '55.0'
      },
      {
        testId: 'semen-total-count',
        testCode: 'SEM_TOTAL_COUNT',
        testName: 'Total Sperm Count (العدد الكلي)',
        profileCategory: 'Fertility & Reproductive',
        unit: 'Million/Ejaculate',
        referenceRangeText: '>= 39.0 Million',
        defaultNormalValue: '176.0',
        isAutoCalculated: true,
        formulaDescription: 'Volume × Concentration'
      },
      {
        testId: 'semen-prog-mot',
        testCode: 'SEM_PROG',
        testName: 'Progressive Motility (الحركة التقدمية السريعة PR)',
        profileCategory: 'Fertility & Reproductive',
        unit: '%',
        referenceRangeText: '>= 32.0 %',
        defaultNormalValue: '48.0'
      },
      {
        testId: 'semen-nonprog-mot',
        testCode: 'SEM_NONPROG',
        testName: 'Non-Progressive Motility (حركة موضعية NP)',
        profileCategory: 'Fertility & Reproductive',
        unit: '%',
        referenceRangeText: '10.0 - 20.0 %',
        defaultNormalValue: '12.0'
      },
      {
        testId: 'semen-immot',
        testCode: 'SEM_IMMOT',
        testName: 'Immotile (عديم الحركة IM)',
        profileCategory: 'Fertility & Reproductive',
        unit: '%',
        referenceRangeText: '<= 58.0 %',
        defaultNormalValue: '40.0'
      },
      {
        testId: 'semen-total-mot',
        testCode: 'SEM_TOTAL_MOT',
        testName: 'Total Motility PR + NP (الحركة الكلية)',
        profileCategory: 'Fertility & Reproductive',
        unit: '%',
        referenceRangeText: '>= 42.0 %',
        defaultNormalValue: '60.0',
        isAutoCalculated: true,
        formulaDescription: 'PR% + NP%'
      },
      {
        testId: 'semen-morph-norm',
        testCode: 'SEM_MORPH_NORM',
        testName: 'Normal Forms (الأشكال الطبيعية Kruger Strict)',
        profileCategory: 'Fertility & Reproductive',
        unit: '%',
        referenceRangeText: '>= 4.0 % (WHO Strict Criteria)',
        defaultNormalValue: '14.0'
      },
      {
        testId: 'semen-morph-abn',
        testCode: 'SEM_MORPH_ABN',
        testName: 'Abnormal Forms (الأشكال المشوهة)',
        profileCategory: 'Fertility & Reproductive',
        unit: '%',
        referenceRangeText: '<= 96.0 %',
        defaultNormalValue: '86.0'
      },
      {
        testId: 'semen-pus',
        testCode: 'SEM_PUS',
        testName: 'Pus Cells / Round Cells (خلايا الصديد)',
        profileCategory: 'Fertility & Reproductive',
        unit: '/HPF',
        referenceRangeText: '< 1.0 M/mL (0 - 4 /HPF)',
        defaultNormalValue: '1 - 2'
      }
    ]
  }
};

// Helper function to expand composite test into its full parameters
export function expandCompositeTest(parentCode: string): OrderTestResult[] | null {
  const normalized = parentCode.toUpperCase().trim();
  const profile = COMPOSITE_PROFILES[normalized] || 
    (normalized.includes('CBC') ? COMPOSITE_PROFILES.CBC : null) ||
    (normalized.includes('URINE') ? COMPOSITE_PROFILES.URINE_ROUTINE : null) ||
    (normalized.includes('STOOL') ? COMPOSITE_PROFILES.STOOL_ROUTINE : null) ||
    (normalized.includes('SEMEN') ? COMPOSITE_PROFILES.SEMEN_ANALYSIS : null);

  if (!profile) return null;

  return profile.subTests.map(sub => ({
    testId: sub.testId,
    testCode: sub.testCode,
    testName: sub.testName,
    profileCategory: sub.profileCategory,
    resultValue: '',
    unit: sub.unit,
    referenceRangeText: sub.referenceRangeText,
    flag: 'Normal' as ResultFlag,
    isAutoCalculated: sub.isAutoCalculated,
    formulaDescription: sub.formulaDescription
  }));
}

// Helper to fill normal presets
export function getNormalPresetValues(parentCode: string): Record<string, string> {
  const normalized = parentCode.toUpperCase().trim();
  const profile = COMPOSITE_PROFILES[normalized] || 
    (normalized.includes('CBC') ? COMPOSITE_PROFILES.CBC : null) ||
    (normalized.includes('URINE') ? COMPOSITE_PROFILES.URINE_ROUTINE : null) ||
    (normalized.includes('STOOL') ? COMPOSITE_PROFILES.STOOL_ROUTINE : null) ||
    (normalized.includes('SEMEN') ? COMPOSITE_PROFILES.SEMEN_ANALYSIS : null);

  if (!profile) return {};

  const map: Record<string, string> = {};
  for (const s of profile.subTests) {
    map[s.testId] = s.defaultNormalValue;
    map[s.testCode] = s.defaultNormalValue;
  }
  return map;
}
