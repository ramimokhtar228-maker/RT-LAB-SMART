import {
  TubeInfo,
  TestCatalogItem,
  TestPackage,
  Patient,
  Order,
  Booking,
  Reagent,
  Employee,
  Expense,
  AuditLog,
  AnalyzerDevice
} from '../types/lis';

export const TUBES_DATA: TubeInfo[] = [
  {
    id: 'tube-edta',
    name: 'EDTA Tube (K2/K3)',
    arabicName: 'أنبوبة EDTA (غطاء بنفسجي)',
    colorHex: '#8B5CF6',
    capColor: 'purple',
    additive: 'K2/K3 EDTA (مانع تجلط)',
    instructions: 'رج الأنبوبة بلطف 8-10 مرات فور السحب لمنع تكون الجلطات المجهرية.'
  },
  {
    id: 'tube-serum-gel',
    name: 'SST Gel Separator',
    arabicName: 'أنبوبة سيروم جل (غطاء ذهبي/أصفر)',
    colorHex: '#F59E0B',
    capColor: 'amber',
    additive: 'Clot Activator + Gel Separator',
    instructions: 'تترك 30 دقيقة للتجلط الكامل قبل الفصل في جهاز الطرد المركزي عند 3000 دورة/دقيقة.'
  },
  {
    id: 'tube-citrate',
    name: 'Sodium Citrate 3.2%',
    arabicName: 'أنبوبة سترات الصوديوم (غطاء أزرق فاتح)',
    colorHex: '#0EA5E9',
    capColor: 'sky',
    additive: 'Buffered Sodium Citrate 3.2% (1:9)',
    instructions: 'السحب بدقة حتى العلامة المحددة على الأنبوبة لضمان صحة نتائج التجلط (PT / INR).'
  },
  {
    id: 'tube-fluoride',
    name: 'Sodium Fluoride / Potassium Oxalate',
    arabicName: 'أنبوبة فلوريد الصوديوم (غطاء رمادي)',
    colorHex: '#64748B',
    capColor: 'slate',
    additive: 'Sodium Fluoride (Glycolysis Inhibitor)',
    instructions: 'تثبيط تحلل الجلوكوز، مخصصة لقياس سكر الدم الدقيق.'
  },
  {
    id: 'tube-heparin',
    name: 'Lithium Heparin',
    arabicName: 'أنبوبة ليثيوم هيبارين (غطاء أخضر)',
    colorHex: '#10B981',
    capColor: 'emerald',
    additive: 'Lithium Heparin',
    instructions: 'لفحوصات الإنزيمات السريعة وغازات الدم والأملاح STAT.'
  },
  {
    id: 'tube-plain-red',
    name: 'Plain Clot Activator',
    arabicName: 'أنبوبة عادية جافة (غطاء أحمر)',
    colorHex: '#EF4444',
    capColor: 'red',
    additive: 'No Additive / Silica Clot Activator',
    instructions: 'لفحوصات المناعة والأمصال والأدوية العلاجية.'
  },
  {
    id: 'cup-urine',
    name: 'Sterile Urine Container',
    arabicName: 'وعاء بول معقم',
    colorHex: '#EAB308',
    capColor: 'yellow',
    additive: 'None (Sterile)',
    instructions: 'عينة منتصف التبول الصباحية في وعاء معقم مغلق بإحكام.'
  },
  {
    id: 'cup-stool',
    name: 'Sterile Stool Container',
    arabicName: 'وعاء براز معقم مع ملعقة',
    colorHex: '#B45309',
    capColor: 'amber',
    additive: 'None',
    instructions: 'عينة براز طازجة خالية من البول أو الماء.'
  },
  {
    id: 'cup-semen',
    name: 'Sterile Semen Container',
    arabicName: 'وعاء سائل منوي معقم',
    colorHex: '#6366F1',
    capColor: 'indigo',
    additive: 'None',
    instructions: 'امتناع 3-5 أيام عن الجماع، وإيصال العينة للمعمل خلال 30 دقيقة بدرجة حرارة الجسم.'
  }
];

export const INITIAL_TESTS: TestCatalogItem[] = [
  // ==========================================
  // PROFILE 1: HEMATOLOGY & COMPLETE BLOOD COUNT
  // ==========================================
  {
    id: 't-cbc',
    code: 'CBC',
    name: 'Complete Blood Count (CBC with 5-Part Diff)',
    arabicName: 'صورة دم كاملة مع العد التفريقي (5 أجزاء)',
    category: 'Hematology',
    profileCategory: 'Hematology Profile',
    price: 180,
    specimenType: 'Whole Blood EDTA',
    tubeId: 'tube-edta',
    unit: 'cells/mcL',
    method: 'Automated Flow Cytometry & Impedance',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'Male', min: 13.0, max: 17.5, textualRange: 'Hb: 13.0 - 17.5 g/dL | WBC: 4,000 - 11,000 | PLT: 150 - 450 k/mcL', criticalLow: 7.0, criticalHigh: 20.0 },
      { gender: 'Female', min: 12.0, max: 15.5, textualRange: 'Hb: 12.0 - 15.5 g/dL | WBC: 4,000 - 11,000 | PLT: 150 - 450 k/mcL', criticalLow: 7.0, criticalHigh: 20.0 }
    ]
  },
  {
    id: 't-hb',
    code: 'HB',
    name: 'Hemoglobin (Hgb)',
    arabicName: 'الهيموجلوبين في الدم',
    category: 'Hematology',
    profileCategory: 'Hematology Profile',
    price: 60,
    specimenType: 'Whole Blood EDTA',
    tubeId: 'tube-edta',
    unit: 'g/dL',
    method: 'Photometric Cyanmethemoglobin / SLS',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'Male', min: 13.0, max: 17.5, textualRange: '13.0 - 17.5 g/dL', criticalLow: 7.0, criticalHigh: 20.0 },
      { gender: 'Female', min: 12.0, max: 15.5, textualRange: '12.0 - 15.5 g/dL', criticalLow: 7.0, criticalHigh: 20.0 }
    ]
  },
  {
    id: 't-rbc',
    code: 'RBC',
    name: 'Red Blood Cell Count (RBCs)',
    arabicName: 'كرات الدم الحمراء',
    category: 'Hematology',
    profileCategory: 'Hematology Profile',
    price: 60,
    specimenType: 'Whole Blood EDTA',
    tubeId: 'tube-edta',
    unit: 'x10^6/mcL',
    method: 'Impedance',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'Male', min: 4.5, max: 5.9, textualRange: '4.50 - 5.90 x10^6/mcL' },
      { gender: 'Female', min: 4.0, max: 5.2, textualRange: '4.00 - 5.20 x10^6/mcL' }
    ]
  },
  {
    id: 't-hct',
    code: 'HCT',
    name: 'Hematocrit (PCV)',
    arabicName: 'حجم الخلايا المكدسة (الهيماتوكريت)',
    category: 'Hematology',
    profileCategory: 'Hematology Profile',
    price: 60,
    specimenType: 'Whole Blood EDTA',
    tubeId: 'tube-edta',
    unit: '%',
    method: 'Automated Calculation / Microhematocrit',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'Male', min: 40.0, max: 52.0, textualRange: '40.0 - 52.0 %' },
      { gender: 'Female', min: 36.0, max: 48.0, textualRange: '36.0 - 48.0 %' }
    ]
  },
  {
    id: 't-mcv',
    code: 'MCV',
    name: 'Mean Corpuscular Volume (MCV)',
    arabicName: 'متوسط حجم الكرية الحمراء MCV',
    category: 'Hematology',
    profileCategory: 'Hematology Profile',
    price: 50,
    specimenType: 'Whole Blood EDTA',
    tubeId: 'tube-edta',
    unit: 'fL',
    method: 'Auto Calculated (HCT x 10 / RBC)',
    isAutoCalculated: true,
    formulaDescription: '(HCT% × 10) ÷ RBC',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 80.0, max: 96.0, textualRange: '80.0 - 96.0 fL' }
    ]
  },
  {
    id: 't-mch',
    code: 'MCH',
    name: 'Mean Corpuscular Hemoglobin (MCH)',
    arabicName: 'متوسط وزن الهيموجلوبين بالكرية MCH',
    category: 'Hematology',
    profileCategory: 'Hematology Profile',
    price: 50,
    specimenType: 'Whole Blood EDTA',
    tubeId: 'tube-edta',
    unit: 'pg',
    method: 'Auto Calculated (Hb x 10 / RBC)',
    isAutoCalculated: true,
    formulaDescription: '(Hb × 10) ÷ RBC',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 27.0, max: 33.0, textualRange: '27.0 - 33.0 pg' }
    ]
  },
  {
    id: 't-mchc',
    code: 'MCHC',
    name: 'Mean Corpuscular Hb Concentration (MCHC)',
    arabicName: 'متوسط تركيز الهيموجلوبين MCHC',
    category: 'Hematology',
    profileCategory: 'Hematology Profile',
    price: 50,
    specimenType: 'Whole Blood EDTA',
    tubeId: 'tube-edta',
    unit: 'g/dL',
    method: 'Auto Calculated (Hb x 100 / HCT)',
    isAutoCalculated: true,
    formulaDescription: '(Hb × 100) ÷ HCT',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 32.0, max: 36.0, textualRange: '32.0 - 36.0 g/dL' }
    ]
  },
  {
    id: 't-rdw',
    code: 'RDW',
    name: 'Red Cell Distribution Width (RDW-CV)',
    arabicName: 'سعة توزيع كرات الدم الحمراء RDW',
    category: 'Hematology',
    profileCategory: 'Hematology Profile',
    price: 50,
    specimenType: 'Whole Blood EDTA',
    tubeId: 'tube-edta',
    unit: '%',
    method: 'Impedance Histogram',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 11.5, max: 14.5, textualRange: '11.5 - 14.5 %' }
    ]
  },
  {
    id: 't-wbc',
    code: 'WBC',
    name: 'Total Leukocyte Count (WBC)',
    arabicName: 'كرات الدم البيضاء الكلية',
    category: 'Hematology',
    profileCategory: 'Hematology Profile',
    price: 70,
    specimenType: 'Whole Blood EDTA',
    tubeId: 'tube-edta',
    unit: 'x10^3/mcL',
    method: 'Flow Cytometry / Impedance',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 4.0, max: 11.0, textualRange: '4.0 - 11.0 x10^3/mcL', criticalLow: 2.0, criticalHigh: 30.0 }
    ]
  },
  {
    id: 't-neut',
    code: 'NEUT',
    name: 'Neutrophils % (Segs)',
    arabicName: 'الخلايا المتعادلة (النيتروفيل)',
    category: 'Hematology',
    profileCategory: 'Hematology Profile',
    price: 50,
    specimenType: 'Whole Blood EDTA',
    tubeId: 'tube-edta',
    unit: '%',
    method: 'Flow Cytometry Laser Scatter',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 40.0, max: 70.0, textualRange: '40.0 - 70.0 %' }
    ]
  },
  {
    id: 't-lymph',
    code: 'LYMPH',
    name: 'Lymphocytes %',
    arabicName: 'الخلايا الليمفاوية',
    category: 'Hematology',
    profileCategory: 'Hematology Profile',
    price: 50,
    specimenType: 'Whole Blood EDTA',
    tubeId: 'tube-edta',
    unit: '%',
    method: 'Flow Cytometry Laser Scatter',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 20.0, max: 45.0, textualRange: '20.0 - 45.0 %' }
    ]
  },
  {
    id: 't-mono',
    code: 'MONO',
    name: 'Monocytes %',
    arabicName: 'الخلايا وحيدة النواة (المونوسايت)',
    category: 'Hematology',
    profileCategory: 'Hematology Profile',
    price: 50,
    specimenType: 'Whole Blood EDTA',
    tubeId: 'tube-edta',
    unit: '%',
    method: 'Flow Cytometry Laser Scatter',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 2.0, max: 8.0, textualRange: '2.0 - 8.0 %' }
    ]
  },
  {
    id: 't-eos',
    code: 'EOS',
    name: 'Eosinophils %',
    arabicName: 'الخلايا الحمضية (الإيوزينوفيل)',
    category: 'Hematology',
    profileCategory: 'Hematology Profile',
    price: 50,
    specimenType: 'Whole Blood EDTA',
    tubeId: 'tube-edta',
    unit: '%',
    method: 'Flow Cytometry Laser Scatter',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 1.0, max: 5.0, textualRange: '1.0 - 5.0 %' }
    ]
  },
  {
    id: 't-baso',
    code: 'BASO',
    name: 'Basophils %',
    arabicName: 'الخلايا القاعدية (البازوفيل)',
    category: 'Hematology',
    profileCategory: 'Hematology Profile',
    price: 50,
    specimenType: 'Whole Blood EDTA',
    tubeId: 'tube-edta',
    unit: '%',
    method: 'Flow Cytometry Laser Scatter',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 0.0, max: 1.0, textualRange: '0.0 - 1.0 %' }
    ]
  },
  {
    id: 't-plt',
    code: 'PLT',
    name: 'Platelet Count (PLT)',
    arabicName: 'الصفائح الدموية',
    category: 'Hematology',
    profileCategory: 'Hematology Profile',
    price: 70,
    specimenType: 'Whole Blood EDTA',
    tubeId: 'tube-edta',
    unit: 'x10^3/mcL',
    method: 'Electrical Impedance',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 150, max: 450, textualRange: '150 - 450 x10^3/mcL', criticalLow: 30, criticalHigh: 1000 }
    ]
  },
  {
    id: 't-esr',
    code: 'ESR',
    name: 'Erythrocyte Sedimentation Rate (ESR 1st & 2nd Hr)',
    arabicName: 'سرعة الترسيب ESR (الساعة الأولى والثانية)',
    category: 'Hematology',
    profileCategory: 'Inflammatory Markers',
    price: 70,
    specimenType: 'Whole Blood Sodium Citrate / EDTA',
    tubeId: 'tube-citrate',
    unit: 'mm/hr',
    method: 'Westergren Method Automated',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'Male', min: 0, max: 15, textualRange: '1st Hr: 0 - 15 mm | 2nd Hr: up to 25 mm' },
      { gender: 'Female', min: 0, max: 20, textualRange: '1st Hr: 0 - 20 mm | 2nd Hr: up to 35 mm' }
    ]
  },
  {
    id: 't-retic',
    code: 'RETIC',
    name: 'Reticulocyte Count',
    arabicName: 'الخلايا الشبكية بالدم',
    category: 'Hematology',
    profileCategory: 'Hematology Profile',
    price: 90,
    specimenType: 'Whole Blood EDTA',
    tubeId: 'tube-edta',
    unit: '%',
    method: 'Supravital Brilliant Cresyl Blue',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 0.5, max: 2.0, textualRange: '0.5 - 2.0 %' }
    ]
  },
  {
    id: 't-blood-film',
    code: 'BLOOD_FILM',
    name: 'Peripheral Blood Smear Examination',
    arabicName: 'فحص لطاخة الدم المحيطي المجهرية',
    category: 'Hematology',
    profileCategory: 'Hematology Profile',
    price: 130,
    specimenType: 'Whole Blood EDTA',
    tubeId: 'tube-edta',
    unit: 'Microscopy',
    method: 'Leishman / Wright Stain Microscopy',
    estimatedHours: 3,
    referenceRanges: [
      { gender: 'All', min: 0, max: 0, textualRange: 'Normocytic Normochromic, Normal Morphology' }
    ]
  },

  // ==========================================
  // PROFILE 2: COAGULATION & HEMOSTASIS
  // ==========================================
  {
    id: 't-pt',
    code: 'PT',
    name: 'Prothrombin Time & INR (PT/INR)',
    arabicName: 'زمن البروثرومبين والنسبة المعيارية الدولية (PT / INR)',
    category: 'Coagulation',
    profileCategory: 'Coagulation Profile',
    price: 110,
    specimenType: 'Citrated Plasma',
    tubeId: 'tube-citrate',
    unit: 'Seconds & Ratio',
    method: 'Electromechanical Clot Detection / Optical',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 11.0, max: 13.5, textualRange: 'PT: 11.0 - 13.5 sec | INR: 0.85 - 1.15 (Warfarin: 2.0 - 3.0)', criticalHigh: 5.0 }
    ]
  },
  {
    id: 't-ptt',
    code: 'PTT',
    name: 'Activated Partial Thromboplastin Time (APTT)',
    arabicName: 'زمن الثرومبوبلاستين الجزئي المنشط (APTT)',
    category: 'Coagulation',
    profileCategory: 'Coagulation Profile',
    price: 110,
    specimenType: 'Citrated Plasma',
    tubeId: 'tube-citrate',
    unit: 'Seconds',
    method: 'Optical Clotting Assay',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 26.0, max: 38.0, textualRange: '26.0 - 38.0 sec', criticalHigh: 70.0 }
    ]
  },
  {
    id: 't-d-dimer',
    code: 'D_DIMER',
    name: 'D-Dimer (Quantitative)',
    arabicName: 'دي-دايمر كمي (مؤشر التجلط والانسداد الرئوي)',
    category: 'Coagulation',
    profileCategory: 'Coagulation Profile',
    price: 240,
    specimenType: 'Citrated Plasma',
    tubeId: 'tube-citrate',
    unit: 'ng/mL DDU',
    method: 'Latex Enhanced Immunoturbidimetric',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 0, max: 500, textualRange: '< 500 ng/mL DDU (Negative for VTE/PE)' }
    ]
  },
  {
    id: 't-fibrinogen',
    code: 'FIBRINOGEN',
    name: 'Plasma Fibrinogen (Clauss Method)',
    arabicName: 'الفيبرينوجين في البلازما',
    category: 'Coagulation',
    profileCategory: 'Coagulation Profile',
    price: 160,
    specimenType: 'Citrated Plasma',
    tubeId: 'tube-citrate',
    unit: 'mg/dL',
    method: 'Clauss Coagulometric Assay',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 200, max: 400, textualRange: '200 - 400 mg/dL' }
    ]
  },

  // ==========================================
  // PROFILE 3: DIABETES & METABOLIC
  // ==========================================
  {
    id: 't-fbs',
    code: 'FBS',
    name: 'Fasting Blood Sugar (FBS)',
    arabicName: 'سكر الدم الصائم (FBS)',
    category: 'Biochemistry',
    profileCategory: 'Diabetes Profile',
    price: 50,
    specimenType: 'Fluoride Plasma / Serum',
    tubeId: 'tube-fluoride',
    unit: 'mg/dL',
    method: 'Hexokinase / Glucose Oxidase',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 70, max: 100, textualRange: 'Normal: 70 - 99 | Prediabetes: 100 - 125 | Diabetic: >= 126 mg/dL', criticalLow: 50, criticalHigh: 400 }
    ]
  },
  {
    id: 't-2hpp',
    code: '2HPP',
    name: '2-Hour Postprandial Glucose (2HPP)',
    arabicName: 'سكر الدم بعد الأكل بساعتين (2HPP)',
    category: 'Biochemistry',
    profileCategory: 'Diabetes Profile',
    price: 50,
    specimenType: 'Fluoride Plasma / Serum',
    tubeId: 'tube-fluoride',
    unit: 'mg/dL',
    method: 'Glucose Oxidase / Peroxidase (GOD-POD)',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 70, max: 140, textualRange: 'Normal: < 140 | Impaired: 140 - 199 | Diabetic: >= 200 mg/dL' }
    ]
  },
  {
    id: 't-rbs',
    code: 'RBS',
    name: 'Random Blood Sugar (RBS)',
    arabicName: 'سكر الدم العشوائي (RBS)',
    category: 'Biochemistry',
    profileCategory: 'Diabetes Profile',
    price: 50,
    specimenType: 'Fluoride Plasma / Serum',
    tubeId: 'tube-fluoride',
    unit: 'mg/dL',
    method: 'Enzymatic Photometric',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 70, max: 140, textualRange: 'Normal: 70 - 140 mg/dL' }
    ]
  },
  {
    id: 't-hba1c',
    code: 'HBA1C',
    name: 'Glycated Hemoglobin (HbA1c NGSP/IFCC)',
    arabicName: 'السكر التراكمي (الهيموجلوبين السكري HbA1c)',
    category: 'Biochemistry',
    profileCategory: 'Diabetes Profile',
    price: 150,
    specimenType: 'Whole Blood EDTA',
    tubeId: 'tube-edta',
    unit: '%',
    method: 'HPLC / Immunoassay (NGSP Certified)',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 4.0, max: 5.6, textualRange: 'Non-Diabetic: < 5.7% | Prediabetes: 5.7 - 6.4% | Diabetes: >= 6.5%', criticalHigh: 12.0 }
    ]
  },
  {
    id: 't-insulin',
    code: 'INSULIN',
    name: 'Fasting Insulin (CLIA)',
    arabicName: 'الأنسولين الصائم في الدم',
    category: 'Hormones',
    profileCategory: 'Diabetes Profile',
    price: 190,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'μIU/mL',
    method: 'Chemiluminescence Immunoassay (CLIA)',
    estimatedHours: 3,
    referenceRanges: [
      { gender: 'All', min: 2.6, max: 24.9, textualRange: '2.6 - 24.9 μIU/mL' }
    ]
  },
  {
    id: 't-c-peptide',
    code: 'C_PEPTIDE',
    name: 'C-Peptide (Fasting)',
    arabicName: 'فحص السي-ببتيد (C-Peptide)',
    category: 'Hormones',
    profileCategory: 'Diabetes Profile',
    price: 210,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'ng/mL',
    method: 'Chemiluminescence Immunoassay (CLIA)',
    estimatedHours: 3,
    referenceRanges: [
      { gender: 'All', min: 1.1, max: 4.4, textualRange: '1.10 - 4.40 ng/mL' }
    ]
  },

  // ==========================================
  // PROFILE 4: LIPID PROFILE & CARDIOVASCULAR
  // ==========================================
  {
    id: 't-chol',
    code: 'CHOL',
    name: 'Total Cholesterol',
    arabicName: 'الكوليسترول الكلي في الدم',
    category: 'Biochemistry',
    profileCategory: 'Lipid Profile',
    price: 75,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mg/dL',
    method: 'CHOD-PAP Enzymatic Colorimetric',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 100, max: 200, textualRange: 'Desirable: < 200 | Borderline: 200 - 239 | High: >= 240 mg/dL' }
    ]
  },
  {
    id: 't-trig',
    code: 'TRIG',
    name: 'Triglycerides (TG)',
    arabicName: 'الدهون الثلاثية (الترايجليسريد)',
    category: 'Biochemistry',
    profileCategory: 'Lipid Profile',
    price: 75,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mg/dL',
    method: 'GPO-PAP Enzymatic',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 40, max: 150, textualRange: 'Normal: < 150 | Borderline: 150 - 199 | High: >= 200 mg/dL' }
    ]
  },
  {
    id: 't-hdl',
    code: 'HDL',
    name: 'High-Density Lipoprotein (HDL Good Cholesterol)',
    arabicName: 'الكوليسترول عالي الكثافة (HDL النافع)',
    category: 'Biochemistry',
    profileCategory: 'Lipid Profile',
    price: 85,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mg/dL',
    method: 'Direct Enzymatic Clear Clearance',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'Male', min: 40, max: 65, textualRange: 'Desirable: >= 40 mg/dL' },
      { gender: 'Female', min: 50, max: 75, textualRange: 'Desirable: >= 50 mg/dL' }
    ]
  },
  {
    id: 't-ldl',
    code: 'LDL',
    name: 'Low-Density Lipoprotein (LDL Bad Cholesterol)',
    arabicName: 'الكوليسترول منخفض الكثافة (LDL الضار)',
    category: 'Biochemistry',
    profileCategory: 'Lipid Profile',
    price: 85,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mg/dL',
    method: 'Calculated (Friedewald) / Direct',
    isAutoCalculated: true,
    formulaDescription: 'Friedewald: (Total Chol - HDL - Trig/5)',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 0, max: 100, textualRange: 'Optimal: < 100 | Near Optimal: 100 - 129 | High: >= 160 mg/dL' }
    ]
  },
  {
    id: 't-vldl',
    code: 'VLDL',
    name: 'Very Low-Density Lipoprotein (VLDL)',
    arabicName: 'الكوليسترول شديد انخفاض الكثافة VLDL',
    category: 'Biochemistry',
    profileCategory: 'Lipid Profile',
    price: 50,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mg/dL',
    method: 'Calculated: (Triglycerides / 5)',
    isAutoCalculated: true,
    formulaDescription: 'Triglycerides ÷ 5',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 5, max: 30, textualRange: '5.0 - 30.0 mg/dL' }
    ]
  },

  // ==========================================
  // PROFILE 5: LIVER FUNCTION TESTS
  // ==========================================
  {
    id: 't-alt',
    code: 'ALT',
    name: 'ALT (SGPT) - Alanine Aminotransferase',
    arabicName: 'إنزيم الكبد ALT (SGPT)',
    category: 'Biochemistry',
    profileCategory: 'Liver Function Profile',
    price: 80,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'U/L',
    method: 'IFCC UV with Pyridoxal Phosphate',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'Male', min: 0, max: 45, textualRange: 'Up to 45 U/L', criticalHigh: 500 },
      { gender: 'Female', min: 0, max: 35, textualRange: 'Up to 35 U/L', criticalHigh: 400 }
    ]
  },
  {
    id: 't-ast',
    code: 'AST',
    name: 'AST (SGOT) - Aspartate Aminotransferase',
    arabicName: 'إنزيم الكبد AST (SGOT)',
    category: 'Biochemistry',
    profileCategory: 'Liver Function Profile',
    price: 80,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'U/L',
    method: 'IFCC UV with Pyridoxal Phosphate',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'Male', min: 0, max: 40, textualRange: 'Up to 40 U/L', criticalHigh: 500 },
      { gender: 'Female', min: 0, max: 32, textualRange: 'Up to 32 U/L', criticalHigh: 400 }
    ]
  },
  {
    id: 't-tbil',
    code: 'TBIL',
    name: 'Total Bilirubin',
    arabicName: 'الصفراء الكلية في الدم (بيليروبين كلي)',
    category: 'Biochemistry',
    profileCategory: 'Liver Function Profile',
    price: 75,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mg/dL',
    method: 'Diazo Method (Jendrassik-Grof)',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 0.2, max: 1.2, textualRange: '0.20 - 1.20 mg/dL', criticalHigh: 15.0 }
    ]
  },
  {
    id: 't-dbil',
    code: 'DBIL',
    name: 'Direct Bilirubin (Conjugated)',
    arabicName: 'الصفراء المباشرة (بيليروبين مباشر)',
    category: 'Biochemistry',
    profileCategory: 'Liver Function Profile',
    price: 75,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mg/dL',
    method: 'Diazo without Accelerator',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 0.0, max: 0.3, textualRange: '0.0 - 0.30 mg/dL' }
    ]
  },
  {
    id: 't-alp',
    code: 'ALP',
    name: 'Alkaline Phosphatase (ALP)',
    arabicName: 'الفوسفاتاز القلوي ALP',
    category: 'Biochemistry',
    profileCategory: 'Liver Function Profile',
    price: 90,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'U/L',
    method: 'IFCC p-Nitrophenyl Phosphate',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 40, max: 130, textualRange: 'Adults: 40 - 130 U/L (Higher in growing children)' }
    ]
  },
  {
    id: 't-ggt',
    code: 'GGT',
    name: 'Gamma-Glutamyl Transferase (GGT)',
    arabicName: 'إنزيم جاما جي تي (GGT)',
    category: 'Biochemistry',
    profileCategory: 'Liver Function Profile',
    price: 110,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'U/L',
    method: 'Szasz L-gamma-glutamyl-3-carboxy-4-nitroanilide',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'Male', min: 10, max: 60, textualRange: '10 - 60 U/L' },
      { gender: 'Female', min: 7, max: 40, textualRange: '7 - 40 U/L' }
    ]
  },
  {
    id: 't-tp',
    code: 'TP',
    name: 'Total Protein (Serum)',
    arabicName: 'البروتين الكلي في مصل الدم',
    category: 'Biochemistry',
    profileCategory: 'Liver Function Profile',
    price: 70,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'g/dL',
    method: 'Biuret Colorimetric',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 6.4, max: 8.3, textualRange: '6.4 - 8.3 g/dL' }
    ]
  },
  {
    id: 't-alb',
    code: 'ALB',
    name: 'Serum Albumin',
    arabicName: 'الألبيومين في مصل الدم',
    category: 'Biochemistry',
    profileCategory: 'Liver Function Profile',
    price: 70,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'g/dL',
    method: 'Bromocresol Green (BCG)',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 3.5, max: 5.2, textualRange: '3.5 - 5.2 g/dL', criticalLow: 2.0 }
    ]
  },

  // ==========================================
  // PROFILE 6: RENAL FUNCTION TESTS & ELECTROLYTES
  // ==========================================
  {
    id: 't-creat',
    code: 'CREAT',
    name: 'Serum Creatinine (IDMS Standardized)',
    arabicName: 'الكرياتينين في الدم (وظائف الكلى)',
    category: 'Biochemistry',
    profileCategory: 'Kidney Function Profile',
    price: 75,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mg/dL',
    method: 'Enzymatic / Buffered Kinetic Jaffe',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'Male', min: 0.7, max: 1.3, textualRange: '0.70 - 1.30 mg/dL', criticalHigh: 5.0 },
      { gender: 'Female', min: 0.5, max: 1.1, textualRange: '0.50 - 1.10 mg/dL', criticalHigh: 5.0 }
    ]
  },
  {
    id: 't-urea',
    code: 'UREA',
    name: 'Blood Urea',
    arabicName: 'البولينا في الدم (Urea)',
    category: 'Biochemistry',
    profileCategory: 'Kidney Function Profile',
    price: 75,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mg/dL',
    method: 'Urease-GLDH UV Kinetic',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 15, max: 45, textualRange: '15.0 - 45.0 mg/dL', criticalHigh: 150 }
    ]
  },
  {
    id: 't-uric',
    code: 'URIC',
    name: 'Uric Acid (Serum)',
    arabicName: 'حمض البوليك / اليوريك أسيد (النقرس)',
    category: 'Biochemistry',
    profileCategory: 'Kidney Function Profile',
    price: 75,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mg/dL',
    method: 'Uricase Enzymatic Colorimetric',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'Male', min: 3.5, max: 7.2, textualRange: '3.5 - 7.2 mg/dL' },
      { gender: 'Female', min: 2.6, max: 6.0, textualRange: '2.6 - 6.0 mg/dL' }
    ]
  },
  {
    id: 't-na',
    code: 'NA',
    name: 'Serum Sodium (Na+)',
    arabicName: 'الصوديوم في الدم (Na+)',
    category: 'Biochemistry',
    profileCategory: 'Electrolytes Profile',
    price: 80,
    specimenType: 'Serum / Lithium Heparin',
    tubeId: 'tube-serum-gel',
    unit: 'mmol/L',
    method: 'Ion Selective Electrode (ISE Direct)',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 135, max: 145, textualRange: '135 - 145 mmol/L', criticalLow: 120, criticalHigh: 160 }
    ]
  },
  {
    id: 't-k',
    code: 'K',
    name: 'Serum Potassium (K+)',
    arabicName: 'البوتاسيوم في الدم (K+)',
    category: 'Biochemistry',
    profileCategory: 'Electrolytes Profile',
    price: 80,
    specimenType: 'Serum (Unhemolyzed)',
    tubeId: 'tube-serum-gel',
    unit: 'mmol/L',
    method: 'Ion Selective Electrode (ISE Direct)',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 3.5, max: 5.1, textualRange: '3.5 - 5.1 mmol/L', criticalLow: 2.8, criticalHigh: 6.2 }
    ]
  },
  {
    id: 't-cl',
    code: 'CL',
    name: 'Serum Chloride (Cl-)',
    arabicName: 'الكلوريد في الدم (Cl-)',
    category: 'Biochemistry',
    profileCategory: 'Electrolytes Profile',
    price: 80,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mmol/L',
    method: 'Ion Selective Electrode (ISE)',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 96, max: 106, textualRange: '96 - 106 mmol/L' }
    ]
  },
  {
    id: 't-ca',
    code: 'CA',
    name: 'Total Calcium (Serum)',
    arabicName: 'الكالسيوم الكلي في الدم',
    category: 'Biochemistry',
    profileCategory: 'Minerals & Bone Profile',
    price: 80,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mg/dL',
    method: 'Arsenazo III / CPC Method',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 8.6, max: 10.3, textualRange: '8.60 - 10.30 mg/dL', criticalLow: 6.5, criticalHigh: 13.0 }
    ]
  },
  {
    id: 't-phos',
    code: 'PHOS',
    name: 'Serum Phosphorus (Inorganic)',
    arabicName: 'الفوسفور غير العضوي في الدم',
    category: 'Biochemistry',
    profileCategory: 'Minerals & Bone Profile',
    price: 80,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mg/dL',
    method: 'Phosphomolybdate UV',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 2.5, max: 4.5, textualRange: '2.50 - 4.50 mg/dL' }
    ]
  },
  {
    id: 't-mg',
    code: 'MG',
    name: 'Serum Magnesium (Mg++)',
    arabicName: 'المغنيسيوم في الدم',
    category: 'Biochemistry',
    profileCategory: 'Minerals & Bone Profile',
    price: 90,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mg/dL',
    method: 'Xylidyl Blue Colorimetric',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 1.7, max: 2.6, textualRange: '1.70 - 2.60 mg/dL' }
    ]
  },

  // ==========================================
  // PROFILE 7: THYROID & HORMONES
  // ==========================================
  {
    id: 't-tsh',
    code: 'TSH',
    name: 'TSH (Thyroid Stimulating Hormone 3rd Gen Ultra-sensitive)',
    arabicName: 'هرمون الغدة الدرقية المنبه (TSH فائق الحساسية)',
    category: 'Hormones',
    profileCategory: 'Thyroid Function Profile',
    price: 130,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'μIU/mL',
    method: 'Chemiluminescence Immunoassay (CLIA 3rd Gen)',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 0.27, max: 4.2, textualRange: '0.27 - 4.20 μIU/mL (Pregnancy 1st Tri: 0.1 - 2.5)' }
    ]
  },
  {
    id: 't-ft3',
    code: 'FT3',
    name: 'Free Triiodothyronine (Free T3)',
    arabicName: 'هرمون الغدة الدرقية الحر FT3',
    category: 'Hormones',
    profileCategory: 'Thyroid Function Profile',
    price: 130,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'pg/mL',
    method: 'Competitive CLIA',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 2.0, max: 4.4, textualRange: '2.00 - 4.40 pg/mL' }
    ]
  },
  {
    id: 't-ft4',
    code: 'FT4',
    name: 'Free Thyroxine (Free T4)',
    arabicName: 'هرمون الغدة الدرقية الحر FT4',
    category: 'Hormones',
    profileCategory: 'Thyroid Function Profile',
    price: 130,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'ng/dL',
    method: 'Competitive CLIA',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 0.93, max: 1.7, textualRange: '0.93 - 1.70 ng/dL' }
    ]
  },
  {
    id: 't-anti-tpo',
    code: 'ANTI_TPO',
    name: 'Anti-TPO (Thyroid Peroxidase Antibodies)',
    arabicName: 'الأجسام المضادة لإنزيم الغدة الدرقية (Anti-TPO هاشيموتو)',
    category: 'Hormones',
    profileCategory: 'Thyroid Function Profile',
    price: 240,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'IU/mL',
    method: 'CLIA Immunoassay',
    estimatedHours: 3,
    referenceRanges: [
      { gender: 'All', min: 0, max: 34, textualRange: '< 34 IU/mL (Negative)' }
    ]
  },
  {
    id: 't-fsh',
    code: 'FSH',
    name: 'Follicle Stimulating Hormone (FSH)',
    arabicName: 'هرمون تحفيز التبويض (FSH)',
    category: 'Hormones',
    profileCategory: 'Fertility & Reproductive',
    price: 140,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mIU/mL',
    method: 'CLIA Two-Site Sandwich',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'Female', min: 3.5, max: 12.5, textualRange: 'Follicular: 3.5 - 12.5 | Midcycle: 4.7 - 21.5 | Postmenopausal: 25.8 - 134.8' },
      { gender: 'Male', min: 1.5, max: 12.4, textualRange: '1.5 - 12.4 mIU/mL' }
    ]
  },
  {
    id: 't-lh',
    code: 'LH',
    name: 'Luteinizing Hormone (LH)',
    arabicName: 'هرمون الملوتن (LH)',
    category: 'Hormones',
    profileCategory: 'Fertility & Reproductive',
    price: 140,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mIU/mL',
    method: 'CLIA Immunoassay',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'Female', min: 2.4, max: 12.6, textualRange: 'Follicular: 2.4 - 12.6 | Midcycle Peak: 14.0 - 95.6 | Luteal: 1.0 - 11.4' },
      { gender: 'Male', min: 1.7, max: 8.6, textualRange: '1.7 - 8.6 mIU/mL' }
    ]
  },
  {
    id: 't-prl',
    code: 'PRL',
    name: 'Prolactin (PRL Milk Hormone)',
    arabicName: 'هرمون اللبن / البرولاكتين (Prolactin)',
    category: 'Hormones',
    profileCategory: 'Fertility & Reproductive',
    price: 150,
    specimenType: 'Serum (Resting 30 min)',
    tubeId: 'tube-serum-gel',
    unit: 'ng/mL',
    method: 'CLIA Sandwich',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'Female', min: 4.8, max: 23.3, textualRange: 'Non-pregnant: 4.8 - 23.3 ng/mL' },
      { gender: 'Male', min: 4.0, max: 15.2, textualRange: '4.0 - 15.2 ng/mL' }
    ]
  },
  {
    id: 't-testo',
    code: 'TESTO',
    name: 'Total Testosterone (Serum)',
    arabicName: 'هرمون الذكورة الكلي (التستوستيرون)',
    category: 'Hormones',
    profileCategory: 'Fertility & Reproductive',
    price: 170,
    specimenType: 'Serum (Morning specimen)',
    tubeId: 'tube-serum-gel',
    unit: 'ng/dL',
    method: 'Competitive CLIA',
    estimatedHours: 3,
    referenceRanges: [
      { gender: 'Male', min: 280, max: 800, textualRange: 'Adult Males: 280 - 800 ng/dL' },
      { gender: 'Female', min: 8, max: 60, textualRange: 'Adult Females: 8 - 60 ng/dL' }
    ]
  },
  {
    id: 't-amh',
    code: 'AMH',
    name: 'Anti-Müllerian Hormone (AMH Ovarian Reserve)',
    arabicName: 'هرمون مخزون المبيض (AMH)',
    category: 'Hormones',
    profileCategory: 'Fertility & Reproductive',
    price: 360,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'ng/mL',
    method: 'Electrochemiluminescence (ECLIA)',
    estimatedHours: 4,
    referenceRanges: [
      { gender: 'Female', min: 1.0, max: 3.5, textualRange: 'Optimal Reserve: 1.0 - 3.5 ng/mL | Low: < 1.0 | High (PCOS): > 3.5 ng/mL' }
    ]
  },
  {
    id: 't-bhcg',
    code: 'BHCG',
    name: 'Beta-hCG (Total Quantitative Pregnancy Hormone)',
    arabicName: 'هرمون الحمل الرقمي الكمي (Beta-hCG)',
    category: 'Hormones',
    profileCategory: 'Fertility & Reproductive',
    price: 160,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mIU/mL',
    method: 'CLIA Two-Site Immunometric',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'Female', min: 0, max: 5.0, textualRange: 'Non-Pregnant: < 5.0 mIU/mL | Pregnant: >= 25 mIU/mL' }
    ]
  },

  // ==========================================
  // PROFILE 8: IRON & ANEMIA PROFILE
  // ==========================================
  {
    id: 't-iron',
    code: 'IRON',
    name: 'Serum Iron',
    arabicName: 'الحديد في مصل الدم',
    category: 'Biochemistry',
    profileCategory: 'Iron & Anemia Profile',
    price: 90,
    specimenType: 'Serum (Morning fasting)',
    tubeId: 'tube-serum-gel',
    unit: 'mcg/dL',
    method: 'Ferene / Ferrozine Photometric',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'Male', min: 65, max: 175, textualRange: '65 - 175 mcg/dL' },
      { gender: 'Female', min: 50, max: 170, textualRange: '50 - 170 mcg/dL' }
    ]
  },
  {
    id: 't-tibc',
    code: 'TIBC',
    name: 'Total Iron Binding Capacity (TIBC)',
    arabicName: 'السعة الكلية لربط الحديد (TIBC)',
    category: 'Biochemistry',
    profileCategory: 'Iron & Anemia Profile',
    price: 90,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mcg/dL',
    method: 'Direct Saturation & Photometry',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 250, max: 450, textualRange: '250 - 450 mcg/dL' }
    ]
  },
  {
    id: 't-ferritin',
    code: 'FERRITIN',
    name: 'Serum Ferritin',
    arabicName: 'مخزون الحديد في الدم (الفيريتين)',
    category: 'Immunology',
    profileCategory: 'Iron & Anemia Profile',
    price: 170,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'ng/mL',
    method: 'Chemiluminescence Immunoassay (CLIA)',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'Male', min: 30, max: 400, textualRange: '30 - 400 ng/mL' },
      { gender: 'Female', min: 15, max: 150, textualRange: '15 - 150 ng/mL' }
    ]
  },
  {
    id: 't-b12',
    code: 'VIT_B12',
    name: 'Vitamin B12 (Cobalamin)',
    arabicName: 'فيتامين ب12 (كوبالامين)',
    category: 'Biochemistry',
    profileCategory: 'Iron & Anemia Profile',
    price: 240,
    specimenType: 'Serum (Protected from light)',
    tubeId: 'tube-serum-gel',
    unit: 'pg/mL',
    method: 'ECLIA Immunoassay',
    estimatedHours: 3,
    referenceRanges: [
      { gender: 'All', min: 211, max: 911, textualRange: 'Normal: 211 - 911 pg/mL | Deficient: < 200 pg/mL' }
    ]
  },
  {
    id: 't-vit-d',
    code: 'VIT_D',
    name: 'Vitamin D (25-Hydroxy Total)',
    arabicName: 'فيتامين د3 الكلي (25-OH Vitamin D)',
    category: 'Biochemistry',
    profileCategory: 'Minerals & Bone Profile',
    price: 260,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'ng/mL',
    method: 'Chemiluminescence Immunoassay (CLIA)',
    estimatedHours: 3,
    referenceRanges: [
      { gender: 'All', min: 30, max: 100, textualRange: 'Deficient: < 20 | Insufficient: 20 - 29 | Sufficient: 30 - 100 ng/mL' }
    ]
  },

  // ==========================================
  // PROFILE 9: IMMUNOLOGY & INFLAMMATORY
  // ==========================================
  {
    id: 't-crp',
    code: 'CRP',
    name: 'C-Reactive Protein (CRP Quantitative Turbidimetric)',
    arabicName: 'بروتين سي التفاعلي كمي (CRP)',
    category: 'Immunology',
    profileCategory: 'Inflammatory Markers',
    price: 90,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mg/L',
    method: 'Latex Enhanced Immunoturbidimetric',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 0, max: 6.0, textualRange: '< 6.0 mg/L' }
    ]
  },
  {
    id: 't-hs-crp',
    code: 'HS_CRP',
    name: 'High-Sensitivity CRP (Cardiovascular hs-CRP)',
    arabicName: 'بروتين سي التفاعلي فائق الحساسية (مؤشر شرايين القلب)',
    category: 'Immunology',
    profileCategory: 'Inflammatory Markers',
    price: 150,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'mg/L',
    method: 'High-Sensitivity Turbidimetry',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 0, max: 1.0, textualRange: 'Low CV Risk: < 1.0 | Average Risk: 1.0 - 3.0 | High Risk: > 3.0 mg/L' }
    ]
  },
  {
    id: 't-asot',
    code: 'ASOT',
    name: 'Antistreptolysin O Titer (ASOT Quantitative)',
    arabicName: 'ميكروب السبحي / سرعة التريتر ASOT كمي',
    category: 'Immunology',
    profileCategory: 'Inflammatory Markers',
    price: 90,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'IU/mL',
    method: 'Latex Immunoturbidimetry',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 0, max: 200, textualRange: 'Adults: < 200 IU/mL | Children: < 400 IU/mL' }
    ]
  },
  {
    id: 't-rf',
    code: 'RF',
    name: 'Rheumatoid Factor (RF Quantitative)',
    arabicName: 'معامل الروماتويد كمي (RF)',
    category: 'Immunology',
    profileCategory: 'Autoimmune Profile',
    price: 90,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'IU/mL',
    method: 'Latex Immunoturbidimetric',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 0, max: 14, textualRange: '< 14 IU/mL (Negative)' }
    ]
  },
  {
    id: 't-anti-ccp',
    code: 'ANTI_CCP',
    name: 'Anti-Cyclic Citrullinated Peptide (Anti-CCP)',
    arabicName: 'الأجسام المضادة لـ CCP (تشخيص الروماتويد المبكر الدقيق)',
    category: 'Immunology',
    profileCategory: 'Autoimmune Profile',
    price: 340,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'U/mL',
    method: 'CLIA 3rd Generation',
    estimatedHours: 3,
    referenceRanges: [
      { gender: 'All', min: 0, max: 17, textualRange: 'Negative: < 17 U/mL | Positive: >= 17 U/mL' }
    ]
  },
  {
    id: 't-ana',
    code: 'ANA',
    name: 'Antinuclear Antibodies (ANA IFA / Multiplex)',
    arabicName: 'الأجسام المضادة للنواة (ANA للأمراض المناعية والذئبة)',
    category: 'Immunology',
    profileCategory: 'Autoimmune Profile',
    price: 240,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'Titer / Index',
    method: 'Indirect Immunofluorescence (IIF) / ELISA',
    estimatedHours: 4,
    referenceRanges: [
      { gender: 'All', min: 0, max: 1.0, textualRange: 'Negative (< 1:80 Titer)' }
    ]
  },

  // ==========================================
  // PROFILE 10: VIRAL & INFECTIOUS SEROLOGY
  // ==========================================
  {
    id: 't-hbsag',
    code: 'HBSAG',
    name: 'Hepatitis B Surface Antigen (HBsAg Rapid & CLIA)',
    arabicName: 'فيروس بي الكبدي (HBsAg المستضد السطحي)',
    category: 'Immunology',
    profileCategory: 'Infectious Diseases',
    price: 120,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'S/CO Ratio',
    method: 'CLIA / Chemiluminescent Microparticle',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 0, max: 1.0, textualRange: 'Non-Reactive (< 1.0 S/CO)' }
    ]
  },
  {
    id: 't-hcv-ab',
    code: 'HCV_AB',
    name: 'Hepatitis C Virus Antibodies (Anti-HCV)',
    arabicName: 'الأجسام المضادة لفيروس سي (Anti-HCV)',
    category: 'Immunology',
    profileCategory: 'Infectious Diseases',
    price: 120,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'S/CO Ratio',
    method: 'CLIA 4th Generation',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 0, max: 1.0, textualRange: 'Non-Reactive (< 1.0 S/CO)' }
    ]
  },
  {
    id: 't-hiv',
    code: 'HIV_COMBO',
    name: 'HIV 1&2 Ab/Ag p24 4th Gen Combo',
    arabicName: 'فيروس نقص المناعة البشري (الإيدز الجيل الرابع HIV 4th Gen)',
    category: 'Immunology',
    profileCategory: 'Infectious Diseases',
    price: 180,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'Index',
    method: 'CLIA 4th Gen Antigen + Antibody Combo',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 0, max: 1.0, textualRange: 'Non-Reactive (< 0.90)' }
    ]
  },
  {
    id: 't-hpylori-ag',
    code: 'HPYLORI_AG',
    name: 'Helicobacter Pylori Antigen in Stool',
    arabicName: 'جرثومة المعدة في البراز (H. Pylori Stool Ag)',
    category: 'Urine & Stool',
    profileCategory: 'Gastrointestinal Profile',
    price: 140,
    specimenType: 'Fresh Stool',
    tubeId: 'cup-stool',
    unit: 'Qualitative',
    method: 'Immunochromatographic / ELISA',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'All', min: 0, max: 0, textualRange: 'Negative' }
    ]
  },

  // ==========================================
  // PROFILE 11: TUMOR MARKERS
  // ==========================================
  {
    id: 't-psa',
    code: 'PSA',
    name: 'Total PSA (Prostate Specific Antigen)',
    arabicName: 'دلالات أورام البروستاتا الكلية (Total PSA)',
    category: 'Immunology',
    profileCategory: 'Tumor Markers Profile',
    price: 160,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'ng/mL',
    method: 'Chemiluminescence Immunoassay (CLIA)',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'Male', min: 0, max: 4.0, textualRange: '< 4.0 ng/mL' }
    ]
  },
  {
    id: 't-fpsa',
    code: 'FPSA',
    name: 'Free PSA (Prostate Specific Antigen)',
    arabicName: 'دلالات أورام البروستاتا الحرة (Free PSA)',
    category: 'Immunology',
    profileCategory: 'Tumor Markers Profile',
    price: 180,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'ng/mL',
    method: 'CLIA Two-Site Sandwich',
    estimatedHours: 2,
    referenceRanges: [
      { gender: 'Male', min: 0, max: 0.9, textualRange: 'Clinical interpretation in ratio with Total PSA' }
    ]
  },
  {
    id: 't-cea',
    code: 'CEA',
    name: 'Carcinoembryonic Antigen (CEA)',
    arabicName: 'دلالات أورام القولون والجهاز الهضمي (CEA)',
    category: 'Immunology',
    profileCategory: 'Tumor Markers Profile',
    price: 190,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'ng/mL',
    method: 'CLIA Sandwich',
    estimatedHours: 3,
    referenceRanges: [
      { gender: 'All', min: 0, max: 3.0, textualRange: 'Non-Smokers: < 3.0 ng/mL | Smokers: < 5.0 ng/mL' }
    ]
  },
  {
    id: 't-ca19-9',
    code: 'CA19_9',
    name: 'Cancer Antigen 19-9 (Pancreas & Biliary)',
    arabicName: 'دلالات أورام البنكرياس والمرارة (CA 19-9)',
    category: 'Immunology',
    profileCategory: 'Tumor Markers Profile',
    price: 240,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'U/mL',
    method: 'CLIA Sandwich',
    estimatedHours: 3,
    referenceRanges: [
      { gender: 'All', min: 0, max: 37, textualRange: '< 37 U/mL' }
    ]
  },
  {
    id: 't-ca125',
    code: 'CA125',
    name: 'Cancer Antigen 125 (Ovarian Marker)',
    arabicName: 'دلالات أورام المبيضين والرحم (CA 125)',
    category: 'Immunology',
    profileCategory: 'Tumor Markers Profile',
    price: 240,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'U/mL',
    method: 'CLIA Sandwich',
    estimatedHours: 3,
    referenceRanges: [
      { gender: 'Female', min: 0, max: 35, textualRange: '< 35 U/mL' }
    ]
  },
  {
    id: 't-ca15-3',
    code: 'CA15_3',
    name: 'Cancer Antigen 15-3 (Breast Marker)',
    arabicName: 'دلالات أورام الثدي (CA 15-3)',
    category: 'Immunology',
    profileCategory: 'Tumor Markers Profile',
    price: 240,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'U/mL',
    method: 'CLIA Sandwich',
    estimatedHours: 3,
    referenceRanges: [
      { gender: 'Female', min: 0, max: 31, textualRange: '< 31 U/mL' }
    ]
  },
  {
    id: 't-afp',
    code: 'AFP',
    name: 'Alpha-Fetoprotein (AFP Liver Marker)',
    arabicName: 'دلالات أورام الكبد والأجنة (AFP)',
    category: 'Immunology',
    profileCategory: 'Tumor Markers Profile',
    price: 190,
    specimenType: 'Serum',
    tubeId: 'tube-serum-gel',
    unit: 'ng/mL',
    method: 'CLIA Immunoassay',
    estimatedHours: 3,
    referenceRanges: [
      { gender: 'All', min: 0, max: 8.5, textualRange: '< 8.5 ng/mL' }
    ]
  },

  // ==========================================
  // PROFILE 12: MICROSCOPY (URINE, STOOL, SEMEN)
  // ==========================================
  {
    id: 't-urine',
    code: 'URINE_ROUTINE',
    name: 'Complete Urine Analysis (Physical, Chemical & Microscopic)',
    arabicName: 'تحليل البول الكامل (فحص كيميائي ومجهري شامل)',
    category: 'Urine & Stool',
    profileCategory: 'Urine & Body Fluids',
    price: 60,
    specimenType: 'Fresh Midstream Urine',
    tubeId: 'cup-urine',
    unit: 'Field HPF',
    method: 'Automated Test Strip + Automated Flow / Light Microscopy',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 0, max: 0, textualRange: 'Color: Amber Yellow | Aspect: Clear | Pus Cells: 0-5 /HPF | RBCs: 0-3 /HPF' }
    ]
  },
  {
    id: 't-stool',
    code: 'STOOL_ROUTINE',
    name: 'Complete Stool Analysis & Parasitology',
    arabicName: 'تحليل البراز الكامل والطفيليات',
    category: 'Urine & Stool',
    profileCategory: 'Gastrointestinal Profile',
    price: 60,
    specimenType: 'Fresh Stool',
    tubeId: 'cup-stool',
    unit: 'Microscopy',
    method: 'Direct Wet Mount (Saline & Iodine)',
    estimatedHours: 1,
    referenceRanges: [
      { gender: 'All', min: 0, max: 0, textualRange: 'Formed/Soft, No parasitic ova, cysts or trophozoites seen' }
    ]
  },
  {
    id: 't-semen',
    code: 'SEMEN_ANALYSIS',
    name: 'Complete Semen Analysis (WHO 6th Manual Edition)',
    arabicName: 'تحليل السائل المنوي الشامل (معايير منظمة الصحة العالمية WHO 6th)',
    category: 'Biochemistry',
    profileCategory: 'Fertility & Reproductive',
    price: 180,
    specimenType: 'Semen (Strict 3-5 days abstinence)',
    tubeId: 'cup-semen',
    unit: 'WHO 6th Criteria',
    method: 'Automated CASA / Manual Makler Chamber & Papanicolaou Stain',
    estimatedHours: 3,
    referenceRanges: [
      { gender: 'Male', min: 15, max: 200, textualRange: 'Volume: >= 1.5 mL | Count: >= 15 M/mL | Total Motility: >= 42% | Normal Forms: >= 4%' }
    ]
  },
  {
    id: 't-urine-culture',
    code: 'URINE_CULTURE',
    name: 'Urine Culture & Sensitivity (Identification + MIC)',
    arabicName: 'مزرعة بول وحساسية للمضادات الحيوية (تحديد الميكروب و MIC)',
    category: 'Biochemistry',
    profileCategory: 'Microbiology & Cultures',
    price: 220,
    specimenType: 'Clean Catch Midstream Sterile Urine',
    tubeId: 'cup-urine',
    unit: 'CFU/mL',
    method: 'Chromogenic Media & Automated Kirby-Bauer / VITEK 2',
    estimatedHours: 48,
    referenceRanges: [
      { gender: 'All', min: 0, max: 0, textualRange: 'No significant bacterial growth after 48 hours incubation (< 10^3 CFU/mL)' }
    ]
  }
];

export const INITIAL_PACKAGES: TestPackage[] = [
  {
    id: 'pkg-comprehensive-health',
    code: 'PKG-COMPREHENSIVE',
    name: 'RT LAB Executive Comprehensive Health Checkup',
    arabicName: 'باقة الفحص الشامل VIP (معامل رامي مختار)',
    description: 'فحص متكامل للاطمئنان الشامل: صورة دم كاملة، سكر صائم، تراكمي، وظائف كبد وكلى كاملة، دهون كاملة، أملاح ونقرس وفيتامين د وبول وبراز.',
    originalPrice: 1680,
    packagePrice: 990,
    testIds: ['t-cbc', 't-fbs', 't-hba1c', 't-alt', 't-ast', 't-tbil', 't-creat', 't-urea', 't-uric', 't-chol', 't-trig', 't-hdl', 't-ldl', 't-vit-d', 't-urine', 't-stool']
  },
  {
    id: 'pkg-diabetes-followup',
    code: 'PKG-DIABETES',
    name: 'Diabetes & Insulin Resistance Follow-up Package',
    arabicName: 'باقة متابعة السكر ومقاومة الأنسولين والكلى',
    description: 'تحاليل السكر التراكمي، السكر الصائم وساعتين، الأنسولين ومقاومة HOMA-IR، وظائف كلى ودهون متكاملة.',
    originalPrice: 850,
    packagePrice: 550,
    testIds: ['t-fbs', 't-2hpp', 't-hba1c', 't-insulin', 't-creat', 't-urea', 't-chol', 't-trig', 't-urine']
  },
  {
    id: 'pkg-liver-kidney',
    code: 'PKG-LIVER-KIDNEY',
    name: 'Liver & Renal Functional Profile',
    arabicName: 'باقة وظائف الكبد والكلى والأملاح الشاملة',
    description: 'إنزيمات كبد ALT و AST، صفراء كلية ومباشرة، بروتين وألبيومين، كرياتينين وبولينا ويوريك أسيد وصوديوم وبوتاسيوم.',
    originalPrice: 780,
    packagePrice: 480,
    testIds: ['t-alt', 't-ast', 't-tbil', 't-dbil', 't-tp', 't-alb', 't-creat', 't-urea', 't-uric', 't-na', 't-k']
  },
  {
    id: 'pkg-thyroid-fertility',
    code: 'PKG-THYROID',
    name: 'Thyroid & Hormonal Health Panel',
    arabicName: 'باقة الغدة الدرقية والهرمونات المتكاملة',
    description: 'تحاليل TSH فائق الحساسية، FT3، FT4، برولاكتين والأجسام المضادة للغدة.',
    originalPrice: 650,
    packagePrice: 450,
    testIds: ['t-tsh', 't-ft3', 't-ft4', 't-prl']
  },
  {
    id: 'pkg-anemia-iron',
    code: 'PKG-ANEMIA',
    name: 'Complete Anemia & Iron Deficiency Workup',
    arabicName: 'باقة فقر الدم وتساقط الشعر والحديد المتكاملة',
    description: 'صورة دم كاملة CBC، حديد مصل، سعة ربط الحديد TIBC، مخزون الحديد فيريتين، وفيتامين ب12.',
    originalPrice: 750,
    packagePrice: 490,
    testIds: ['t-cbc', 't-iron', 't-tibc', 't-ferritin', 't-b12']
  },
  {
    id: 'pkg-premarital',
    code: 'PKG-PREMARITAL',
    name: 'Premarital Screening & Viral Package',
    arabicName: 'باقة الفحص الطبي للمقبلين على الزواج',
    description: 'صورة دم كاملة، فيروس بي وفيروس سي، الإيدز، الزهري، وتحليل البول وفصيلة الدم.',
    originalPrice: 720,
    packagePrice: 480,
    testIds: ['t-cbc', 't-hbsag', 't-hcv-ab', 't-hiv', 't-urine']
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p-101',
    name: 'محمد أحمد إبراهيم خليل',
    phone: '01012345678',
    gender: 'Male',
    age: 48,
    dateOfBirth: '1978-04-12',
    nationalId: '27804120102938',
    address: 'شبرا الخيمة - شارع 15 مايو',
    notes: 'مريض سكر نوع ثان وضغط دم مرتفع، يتابع كل 3 أشهر.',
    allergies: ['Penicillin', 'Sulfa'],
    chronicDiseases: ['Type 2 Diabetes', 'Hypertension'],
    registeredBranch: 'الفرع الرئيسي - ميدان بهتيم',
    createdAt: '2026-03-15',
    loyaltyCardNumber: 'RT-5678-VIP',
    loyaltyTier: 'VIP',
    loyaltyPoints: 340
  },
  {
    id: 'p-102',
    name: 'نادية محمود عبدالفتاح',
    phone: '01123456789',
    gender: 'Female',
    age: 34,
    dateOfBirth: '1992-08-20',
    nationalId: '29208200105432',
    address: 'بهتيم - بجوار مسجد الرحمن',
    notes: 'متابعة حمل في الشهر الخامس، فحص فقر دم وسكر حمل.',
    chronicDiseases: ['Gestational Diabetes Risk'],
    registeredBranch: 'الفرع الرئيسي - ميدان بهتيم',
    createdAt: '2026-03-20',
    loyaltyCardNumber: 'RT-6789-GOLD',
    loyaltyTier: 'Gold',
    loyaltyPoints: 180
  },
  {
    id: 'p-103',
    name: 'محمود عصام رضوان',
    phone: '01234567890',
    gender: 'Male',
    age: 62,
    dateOfBirth: '1964-11-05',
    nationalId: '26411050101122',
    address: 'الشارع الجديد - محطة النص',
    notes: 'متابعة وظائف كلى وبروستاتا دورية.',
    chronicDiseases: ['BPH', 'Dyslipidemia'],
    registeredBranch: 'فرع الشارع الجديد',
    createdAt: '2026-03-25',
    loyaltyCardNumber: 'RT-7890-PLATINUM',
    loyaltyTier: 'Platinum',
    loyaltyPoints: 260
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'RT-2026-1001',
    patientId: 'p-101',
    patientName: 'محمد أحمد إبراهيم خليل',
    patientPhone: '01012345678',
    patientAge: 48,
    patientGender: 'Male',
    barcode: 'RT8291001',
    tubesNeeded: ['tube-edta', 'tube-fluoride', 'tube-serum-gel'],
    urgency: 'STAT',
    specimenStatus: 'Collected',
    orderStatus: 'Results Entered',
    reportStatus: 'Approved',
    registeredBranch: 'الفرع الرئيسي - ميدان بهتيم (شبرا الخيمة)',
    referringDoctor: 'د. خالد عبدالمقصود - باطنة وسكر',
    clinicalNotes: 'مريض سكر غير منضبط، يشكو من إجهاد وعطش متكرر.',
    createdAt: '2026-09-30 09:30',
    collectedAt: '2026-09-30 09:40',
    collectedBy: 'م. كريم حسام - أخصائي السحب',
    verifiedBy: 'د. رحاب عبدالحميد',
    approvedBy: 'د. رامي مختار',
    clinicalInterpretation: 'ارتفاع ملحوظ في سكر الدم الصائم والسكر التراكمي (HbA1c = 8.6%) مما يشير إلى عدم انضباط السكر في الأشهر الثلاثة السابقة. وظائف الكلى (الكرياتينين) ضمن المعدل الطبيعي.',
    clinicalComment: 'يوصى بضبط الجرعة العلاجية ومتابعة فحص زلال البول المجهري (Microalbuminuria).',
    recommendations: 'إعادة قياس السكر التراكمي بعد 3 أشهر مع الالتزام بالحمية الغذائية والنشاط البدني.',
    totalAmount: 380,
    discount: 0,
    netAmount: 380,
    paidAmount: 380,
    remainingAmount: 0,
    paymentMethod: 'Cash',
    testIds: ['t-fbs', 't-hba1c', 't-creat', 't-urea'],
    results: [
      {
        testId: 't-fbs',
        testCode: 'FBS',
        testName: 'Fasting Blood Sugar (FBS)',
        profileCategory: 'Diabetes Profile',
        resultValue: '185',
        unit: 'mg/dL',
        referenceRangeText: '70 - 100 mg/dL',
        flag: 'High',
        previousValue: '160',
        deltaChangePercent: 15.6
      },
      {
        testId: 't-hba1c',
        testCode: 'HBA1C',
        testName: 'Glycated Hemoglobin (HbA1c)',
        profileCategory: 'Diabetes Profile',
        resultValue: '8.6',
        unit: '%',
        referenceRangeText: 'Non-Diabetic: < 5.7% | Target Diabetic: < 7.0%',
        flag: 'High',
        previousValue: '7.9',
        deltaChangePercent: 8.8
      },
      {
        testId: 't-creat',
        testCode: 'CREAT',
        testName: 'Serum Creatinine',
        profileCategory: 'Kidney Function Profile',
        resultValue: '0.95',
        unit: 'mg/dL',
        referenceRangeText: '0.70 - 1.30 mg/dL',
        flag: 'Normal',
        previousValue: '0.92'
      },
      {
        testId: 't-urea',
        testCode: 'UREA',
        testName: 'Blood Urea',
        profileCategory: 'Kidney Function Profile',
        resultValue: '32',
        unit: 'mg/dL',
        referenceRangeText: '15.0 - 45.0 mg/dL',
        flag: 'Normal'
      },
      {
        testId: 'calc-eag',
        testCode: 'EAG',
        testName: 'Estimated Average Glucose (eAG)',
        profileCategory: 'Calculated Diagnostic Indices',
        resultValue: '200 mg/dL (11.1 mmol/L)',
        unit: 'mg/dL',
        referenceRangeText: '< 117 mg/dL',
        flag: 'High',
        isAutoCalculated: true,
        formulaDescription: '28.7 × HbA1c - 46.7'
      }
    ]
  },
  {
    id: 'ord-1002',
    orderNumber: 'RT-2026-1002',
    patientId: 'p-102',
    patientName: 'نادية محمود عبدالفتاح',
    patientPhone: '01123456789',
    patientAge: 34,
    patientGender: 'Female',
    barcode: 'RT8291002',
    tubesNeeded: ['tube-edta', 'tube-serum-gel'],
    urgency: 'Routine',
    specimenStatus: 'Collected',
    orderStatus: 'Results Entered',
    reportStatus: 'Approved',
    registeredBranch: 'الفرع الرئيسي - ميدان بهتيم (شبرا الخيمة)',
    referringDoctor: 'د. إيمان الشريف - نساء وتوليد',
    clinicalNotes: 'متابعة حمل، دوخة وضعف عام.',
    createdAt: '2026-09-30 10:15',
    collectedAt: '2026-09-30 10:25',
    collectedBy: 'م. كريم حسام',
    verifiedBy: 'د. رحاب عبدالحميد',
    approvedBy: 'د. رامي مختار',
    clinicalInterpretation: 'أنيميا نقص الحديد من الدرجة المتوسطة (Hb = 9.8 g/dL مع انخفاض MCV = 71 fL وانخفاض فيريتين الدم إلى 9 ng/mL).',
    clinicalComment: 'ينصح بالعلاج التعويضي للحديد عن طريق الفم أو الوريد حسب توصية الطبيب المعالج.',
    recommendations: 'إعادة تحليل صورة الدم وفيريتين بعد 4 أسابيع من بدء العلاج.',
    totalAmount: 490,
    discount: 0,
    netAmount: 490,
    paidAmount: 400,
    remainingAmount: 90,
    paymentMethod: 'Vodafone Cash',
    testIds: ['t-hb', 't-rbc', 't-hct', 't-mcv', 't-mch', 't-ferritin', 't-tsh'],
    results: [
      {
        testId: 't-hb',
        testCode: 'HB',
        testName: 'Hemoglobin (Hgb)',
        profileCategory: 'Hematology Profile',
        resultValue: '9.8',
        unit: 'g/dL',
        referenceRangeText: '12.0 - 15.5 g/dL',
        flag: 'Low'
      },
      {
        testId: 't-rbc',
        testCode: 'RBC',
        testName: 'Red Blood Cell Count (RBCs)',
        profileCategory: 'Hematology Profile',
        resultValue: '4.1',
        unit: 'x10^6/mcL',
        referenceRangeText: '4.00 - 5.20 x10^6/mcL',
        flag: 'Normal'
      },
      {
        testId: 't-hct',
        testCode: 'HCT',
        testName: 'Hematocrit (PCV)',
        profileCategory: 'Hematology Profile',
        resultValue: '29.1',
        unit: '%',
        referenceRangeText: '36.0 - 48.0 %',
        flag: 'Low'
      },
      {
        testId: 't-mcv',
        testCode: 'MCV',
        testName: 'Mean Corpuscular Volume (MCV)',
        profileCategory: 'Hematology Profile',
        resultValue: '71.0',
        unit: 'fL',
        referenceRangeText: '80.0 - 96.0 fL',
        flag: 'Low',
        isAutoCalculated: true,
        formulaDescription: '(HCT × 10) ÷ RBC'
      },
      {
        testId: 't-mch',
        testCode: 'MCH',
        testName: 'Mean Corpuscular Hemoglobin (MCH)',
        profileCategory: 'Hematology Profile',
        resultValue: '23.9',
        unit: 'pg',
        referenceRangeText: '27.0 - 33.0 pg',
        flag: 'Low',
        isAutoCalculated: true,
        formulaDescription: '(Hb × 10) ÷ RBC'
      },
      {
        testId: 't-ferritin',
        testCode: 'FERRITIN',
        testName: 'Serum Ferritin',
        profileCategory: 'Iron & Anemia Profile',
        resultValue: '9.2',
        unit: 'ng/mL',
        referenceRangeText: '15.0 - 150.0 ng/mL',
        flag: 'Low'
      },
      {
        testId: 't-tsh',
        testCode: 'TSH',
        testName: 'TSH (Thyroid Stimulating Hormone)',
        profileCategory: 'Thyroid Function Profile',
        resultValue: '1.85',
        unit: 'μIU/mL',
        referenceRangeText: '0.27 - 4.20 μIU/mL',
        flag: 'Normal'
      }
    ]
  },
  {
    id: 'ord-1003',
    orderNumber: 'RT-2026-1003',
    patientId: 'p-101',
    patientName: 'محمد أحمد إبراهيم خليل',
    patientPhone: '01012345678',
    patientAge: 48,
    patientGender: 'Male',
    barcode: 'RT8291003',
    tubesNeeded: ['tube-edta', 'cup-urine'],
    urgency: 'STAT',
    specimenStatus: 'Completed',
    orderStatus: 'Approved',
    reportStatus: 'Approved',
    registeredBranch: 'الفرع الرئيسي - ميدان بهتيم (شبرا الخيمة)',
    referringDoctor: 'د. سامح المنشاوي - مسالك بولية',
    clinicalNotes: 'فحص دوري كامل: صورة دم كاملة وتحليل بول شامل مع شكوى من حرقان خفيف بالتبول.',
    createdAt: '2026-09-30 11:30',
    collectedAt: '2026-09-30 11:40',
    collectedBy: 'م. كريم حسام',
    verifiedBy: 'د. رحاب عبدالحميد',
    approvedBy: 'د. رامي مختار',
    clinicalInterpretation: 'صورة الدم طبيعية تماماً دون أنيميا. تحليل البول يظهر التهاب بكتيري خفيف مع وجود خلايا صديد (10-12 /HPF) ونسب أملاح أوكسالات كالسيوم قليلة.',
    clinicalComment: 'ينصح بشرب كميات وافرة من السوائل وإعادة الفحص بعد العلاج.',
    recommendations: 'تناول فوار سترات المغنيسيوم وكورس مضاد حيوي مناسب وفق إرشادات الطبيب المعالج.',
    totalAmount: 240,
    discount: 20,
    netAmount: 220,
    paidAmount: 220,
    remainingAmount: 0,
    paymentMethod: 'Cash',
    loyaltyPointsEarned: 22,
    testIds: ['t-cbc', 't-urine'],
    results: [
      // 1. COMPLETE BLOOD COUNT (CBC)
      { testId: 'cbc-hb', testCode: 'HB', testName: 'Hemoglobin (Hb)', profileCategory: 'Hematology Profile', resultValue: '14.6', unit: 'g/dL', referenceRangeText: '13.0 - 17.5 g/dL', flag: 'Normal' },
      { testId: 'cbc-rbc', testCode: 'RBC', testName: 'Red Blood Cells (RBCs)', profileCategory: 'Hematology Profile', resultValue: '4.95', unit: 'x10^6/mcL', referenceRangeText: '4.50 - 5.90 x10^6/mcL', flag: 'Normal' },
      { testId: 'cbc-hct', testCode: 'HCT', testName: 'Hematocrit (PCV)', profileCategory: 'Hematology Profile', resultValue: '43.8', unit: '%', referenceRangeText: '40.0 - 52.0 %', flag: 'Normal' },
      { testId: 'cbc-mcv', testCode: 'MCV', testName: 'Mean Corpuscular Volume (MCV)', profileCategory: 'Hematology Profile', resultValue: '88.5', unit: 'fL', referenceRangeText: '80.0 - 96.0 fL', flag: 'Normal', isAutoCalculated: true, formulaDescription: '(HCT × 10) / RBC' },
      { testId: 'cbc-mch', testCode: 'MCH', testName: 'Mean Corpuscular Hemoglobin (MCH)', profileCategory: 'Hematology Profile', resultValue: '29.5', unit: 'pg', referenceRangeText: '27.0 - 33.0 pg', flag: 'Normal', isAutoCalculated: true, formulaDescription: '(Hb × 10) / RBC' },
      { testId: 'cbc-mchc', testCode: 'MCHC', testName: 'Mean Corpuscular Hb Conc. (MCHC)', profileCategory: 'Hematology Profile', resultValue: '33.3', unit: 'g/dL', referenceRangeText: '32.0 - 36.0 g/dL', flag: 'Normal', isAutoCalculated: true, formulaDescription: '(Hb × 100) / HCT' },
      { testId: 'cbc-rdw', testCode: 'RDW', testName: 'Red Cell Dist. Width (RDW-CV)', profileCategory: 'Hematology Profile', resultValue: '12.4', unit: '%', referenceRangeText: '11.5 - 14.5 %', flag: 'Normal' },
      { testId: 'cbc-wbc', testCode: 'WBC', testName: 'Total Leucocytic Count (WBCs)', profileCategory: 'Hematology Profile', resultValue: '7.40', unit: 'x10^3/mcL', referenceRangeText: '4.00 - 11.00 x10^3/mcL', flag: 'Normal' },
      { testId: 'cbc-neut', testCode: 'NEUT_PCT', testName: 'Neutrophils % (العدلات)', profileCategory: 'Hematology Profile', resultValue: '61.0', unit: '%', referenceRangeText: '40.0 - 75.0 %', flag: 'Normal' },
      { testId: 'cbc-lymph', testCode: 'LYMPH_PCT', testName: 'Lymphocytes % (الليمفاويات)', profileCategory: 'Hematology Profile', resultValue: '30.0', unit: '%', referenceRangeText: '20.0 - 45.0 %', flag: 'Normal' },
      { testId: 'cbc-mono', testCode: 'MONO_PCT', testName: 'Monocytes % (الوحيدات)', profileCategory: 'Hematology Profile', resultValue: '5.5', unit: '%', referenceRangeText: '2.0 - 8.0 %', flag: 'Normal' },
      { testId: 'cbc-eos', testCode: 'EOS_PCT', testName: 'Eosinophils % (الحمضات)', profileCategory: 'Hematology Profile', resultValue: '2.5', unit: '%', referenceRangeText: '1.0 - 4.0 %', flag: 'Normal' },
      { testId: 'cbc-baso', testCode: 'BASO_PCT', testName: 'Basophils % (القاعديات)', profileCategory: 'Hematology Profile', resultValue: '1.0', unit: '%', referenceRangeText: '0.0 - 1.0 %', flag: 'Normal' },
      { testId: 'cbc-plt', testCode: 'PLT', testName: 'Platelet Count (PLT)', profileCategory: 'Hematology Profile', resultValue: '275', unit: 'x10^3/mcL', referenceRangeText: '150 - 450 x10^3/mcL', flag: 'Normal' },

      // 2. COMPLETE URINE ANALYSIS
      { testId: 'urine-color', testCode: 'U_COLOR', testName: 'Color (لون البول)', profileCategory: 'Urine & Body Fluids', resultValue: 'Amber Yellow', unit: 'Physical', referenceRangeText: 'Amber Yellow / Yellow', flag: 'Normal' },
      { testId: 'urine-aspect', testCode: 'U_ASPECT', testName: 'Aspect / Clarity (المظهر والشفافية)', profileCategory: 'Urine & Body Fluids', resultValue: 'Slightly Turbid', unit: 'Physical', referenceRangeText: 'Clear', flag: 'High' },
      { testId: 'urine-sp-grav', testCode: 'U_SG', testName: 'Specific Gravity (الكثافة النوعية)', profileCategory: 'Urine & Body Fluids', resultValue: '1.022', unit: 'Ratio', referenceRangeText: '1.015 - 1.025', flag: 'Normal' },
      { testId: 'urine-ph', testCode: 'U_PH', testName: 'Reaction (pH الرقم الهيدروجيني)', profileCategory: 'Urine & Body Fluids', resultValue: '6.0', unit: 'pH', referenceRangeText: '5.0 - 7.5 (Acidic)', flag: 'Normal' },
      { testId: 'urine-prot', testCode: 'U_PROT', testName: 'Protein / Albumin (الزلال)', profileCategory: 'Urine & Body Fluids', resultValue: 'Trace', unit: 'Chemical', referenceRangeText: 'Nil / Negative', flag: 'High' },
      { testId: 'urine-glu', testCode: 'U_GLU', testName: 'Glucose / Sugar (السكر)', profileCategory: 'Urine & Body Fluids', resultValue: 'Nil', unit: 'Chemical', referenceRangeText: 'Nil / Negative', flag: 'Normal' },
      { testId: 'urine-ket', testCode: 'U_KET', testName: 'Ketone Bodies (الأسيتون)', profileCategory: 'Urine & Body Fluids', resultValue: 'Nil', unit: 'Chemical', referenceRangeText: 'Nil / Negative', flag: 'Normal' },
      { testId: 'urine-bil', testCode: 'U_BIL', testName: 'Bilirubin (الصفراء)', profileCategory: 'Urine & Body Fluids', resultValue: 'Negative', unit: 'Chemical', referenceRangeText: 'Negative', flag: 'Normal' },
      { testId: 'urine-uro', testCode: 'U_URO', testName: 'Urobilinogen (اليوروبيلينوجين)', profileCategory: 'Urine & Body Fluids', resultValue: 'Normal', unit: 'mg/dL', referenceRangeText: 'Normal (0.2 - 1.0 mg/dL)', flag: 'Normal' },
      { testId: 'urine-nit', testCode: 'U_NIT', testName: 'Nitrite (النيتريت)', profileCategory: 'Urine & Body Fluids', resultValue: 'Positive', unit: 'Chemical', referenceRangeText: 'Negative', flag: 'High' },
      { testId: 'urine-leuk', testCode: 'U_LEUK', testName: 'Leukocyte Esterase', profileCategory: 'Urine & Body Fluids', resultValue: '+ (Small)', unit: 'Chemical', referenceRangeText: 'Negative', flag: 'High' },
      { testId: 'urine-pus', testCode: 'U_PUS', testName: 'Pus Cells / WBCs (خلايا الصديد)', profileCategory: 'Urine & Body Fluids', resultValue: '10 - 12', unit: '/HPF', referenceRangeText: '0 - 5 /HPF', flag: 'High' },
      { testId: 'urine-rbcs', testCode: 'U_RBC', testName: 'Red Blood Cells (كرات الدم الحمراء)', profileCategory: 'Urine & Body Fluids', resultValue: '2 - 3', unit: '/HPF', referenceRangeText: '0 - 3 /HPF', flag: 'Normal' },
      { testId: 'urine-epith', testCode: 'U_EPITH', testName: 'Epithelial Cells (الخلايا الظهارية)', profileCategory: 'Urine & Body Fluids', resultValue: 'Few', unit: 'Microscopy', referenceRangeText: 'Few / Nil', flag: 'Normal' },
      { testId: 'urine-cryst', testCode: 'U_CRYST', testName: 'Crystals (الأملاح والبلورات)', profileCategory: 'Urine & Body Fluids', resultValue: 'Calcium Oxalate (+)', unit: 'Microscopy', referenceRangeText: 'Nil / Normal', flag: 'High' },
      { testId: 'urine-casts', testCode: 'U_CASTS', testName: 'Casts (الاسطوانات المجهرية)', profileCategory: 'Urine & Body Fluids', resultValue: 'Nil', unit: 'Microscopy', referenceRangeText: 'Nil', flag: 'Normal' },
      { testId: 'urine-bact', testCode: 'U_BACT', testName: 'Bacteria (البكتيريا)', profileCategory: 'Urine & Body Fluids', resultValue: 'Few (+)', unit: 'Microscopy', referenceRangeText: 'Nil', flag: 'High' },
      { testId: 'urine-paras', testCode: 'U_PARAS', testName: 'Parasites & Ova (الطفيليات)', profileCategory: 'Urine & Body Fluids', resultValue: 'Nil', unit: 'Microscopy', referenceRangeText: 'Nil / Not Seen', flag: 'Normal' }
    ]
  },
  {
    id: 'ord-1004',
    orderNumber: 'RT-2026-1004',
    patientId: 'p-103',
    patientName: 'محمود عصام رضوان',
    patientPhone: '01234567890',
    patientAge: 62,
    patientGender: 'Male',
    barcode: 'RT8291004',
    tubesNeeded: ['cup-stool'],
    urgency: 'Routine',
    specimenStatus: 'Completed',
    orderStatus: 'Approved',
    reportStatus: 'Approved',
    registeredBranch: 'فرع الشارع الجديد',
    referringDoctor: 'د. حازم القاضي - باطنة وجهاز هضمي',
    clinicalNotes: 'شكوى من اضطرابات هضمية وتقلصات معوية متكررة، طلب فحص براز وطفيليات كامل.',
    createdAt: '2026-09-30 14:00',
    collectedAt: '2026-09-30 14:15',
    collectedBy: 'م. كريم حسام',
    verifiedBy: 'د. رحاب عبدالحميد',
    approvedBy: 'د. رامي مختار',
    clinicalInterpretation: 'تحليل البراز يظهر وجود حويصلات أميبا الدوسنتاريا (Entamoeba histolytica cysts ++) مع مخاط وخلايا صديد بنسبة معتدلة (8-10 /HPF). لا توجد بويضات ديدان.',
    clinicalComment: 'عينة براز طازجة، تم الفحص المجهري المباشر بالمحلول الملحي ومحلول اليود Lugols Iodine.',
    recommendations: 'يوصى بالعلاج بمضاد الطفيليات المعوية (Metronidazole / Tinidazole) وتكرار التحليل بعد أسبوعين.',
    totalAmount: 180,
    discount: 0,
    netAmount: 180,
    paidAmount: 180,
    remainingAmount: 0,
    paymentMethod: 'InstaPay',
    loyaltyPointsEarned: 18,
    testIds: ['t-stool'],
    results: [
      { testId: 'stool-color', testCode: 'ST_COLOR', testName: 'Color (اللون)', profileCategory: 'Gastrointestinal Profile', resultValue: 'Dark Brown', unit: 'Physical', referenceRangeText: 'Brown', flag: 'Normal' },
      { testId: 'stool-cons', testCode: 'ST_CONS', testName: 'Consistency (القوام)', profileCategory: 'Gastrointestinal Profile', resultValue: 'Semi-formed', unit: 'Physical', referenceRangeText: 'Formed / Soft', flag: 'Normal' },
      { testId: 'stool-muc', testCode: 'ST_MUC', testName: 'Mucus (المخاط)', profileCategory: 'Gastrointestinal Profile', resultValue: '++ (Moderate)', unit: 'Physical', referenceRangeText: 'Nil', flag: 'High' },
      { testId: 'stool-bld', testCode: 'ST_BLD', testName: 'Blood (الدم الظاهري)', profileCategory: 'Gastrointestinal Profile', resultValue: 'Trace', unit: 'Physical', referenceRangeText: 'Nil', flag: 'High' },
      { testId: 'stool-pus', testCode: 'ST_PUS', testName: 'Pus Cells (خلايا الصديد)', profileCategory: 'Gastrointestinal Profile', resultValue: '8 - 10', unit: '/HPF', referenceRangeText: '0 - 2 /HPF', flag: 'High' },
      { testId: 'stool-rbcs', testCode: 'ST_RBC', testName: 'Red Blood Cells (كرات الدم الحمراء)', profileCategory: 'Gastrointestinal Profile', resultValue: '4 - 6', unit: '/HPF', referenceRangeText: '0 - 2 /HPF', flag: 'High' },
      { testId: 'stool-ova', testCode: 'ST_OVA', testName: 'Helminths & Ova (بويضات الديدان)', profileCategory: 'Gastrointestinal Profile', resultValue: 'No parasitic ova seen', unit: 'Microscopy', referenceRangeText: 'No parasitic ova seen', flag: 'Normal' },
      { testId: 'stool-proto', testCode: 'ST_PROTO', testName: 'Protozoa & Cysts (الحويصلات الأولية)', profileCategory: 'Gastrointestinal Profile', resultValue: 'Entamoeba histolytica cysts seen (++)', unit: 'Microscopy', referenceRangeText: 'No protozoa or cysts seen', flag: 'High' },
      { testId: 'stool-troph', testCode: 'ST_TROPH', testName: 'Trophozoites (الأطوار النشطة)', profileCategory: 'Gastrointestinal Profile', resultValue: 'Entamoeba histolytica trophozoite seen (+)', unit: 'Microscopy', referenceRangeText: 'Not seen', flag: 'High' },
      { testId: 'stool-food', testCode: 'ST_FOOD', testName: 'Undigested Food Particles (طعام غير مهضوم)', profileCategory: 'Gastrointestinal Profile', resultValue: 'Moderate (+)', unit: 'Microscopy', referenceRangeText: 'Nil / Few', flag: 'High' },
      { testId: 'stool-starch', testCode: 'ST_STARCH', testName: 'Starch Granules (حبيبات النشا)', profileCategory: 'Gastrointestinal Profile', resultValue: 'Few', unit: 'Microscopy', referenceRangeText: 'Nil / Few', flag: 'Normal' },
      { testId: 'stool-fat', testCode: 'ST_FAT', testName: 'Fat Droplets (قطرات الدهون)', profileCategory: 'Gastrointestinal Profile', resultValue: 'Nil', unit: 'Microscopy', referenceRangeText: 'Nil / Few', flag: 'Normal' }
    ]
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bkg-101',
    bookingCode: 'RT-BKG-881',
    patientName: 'علاء الدين فتحي القاضي',
    phone: '01099887766',
    address: 'ميدان بهتيم - عمارة الأمل الدور الرابع',
    type: 'Home Visit',
    bookingDate: '2026-10-01',
    bookingTime: '09:00 ص',
    status: 'Pending',
    packageId: 'pkg-comprehensive-health',
    packageName: 'باقة الفحص الشامل VIP (معامل رامي مختار)',
    fastingRequired: true,
    estimatedAmount: 990,
    notes: 'مريض مسن يحتاج أخصائي سحب ماهر، يفضل الحضور في الموعد تماماً.',
    createdAt: '2026-09-30'
  },
  {
    id: 'bkg-102',
    bookingCode: 'RT-BKG-882',
    patientName: 'سمية طارق عبدالمعطي',
    phone: '01155443322',
    address: 'شبرا الخيمة - شارع أحمد عرابي',
    type: 'Lab Visit',
    bookingDate: '2026-10-01',
    bookingTime: '11:30 ص',
    status: 'Confirmed',
    packageId: 'pkg-thyroid-fertility',
    packageName: 'باقة الغدة الدرقية والهرمونات المتكاملة',
    fastingRequired: false,
    estimatedAmount: 450,
    notes: 'حجز فرع ميدان بهتيم الرئيسي.',
    createdAt: '2026-09-30'
  }
];

export const INITIAL_REAGENTS: Reagent[] = [
  {
    id: 'reg-01',
    name: 'Glucose Hexokinase Reagent Kit (Biolis 50i)',
    arabicName: 'كاشف قياس سكر الدم هيكسوكيناز',
    category: 'Biochemistry',
    supplier: 'شركة النصر للتوريدات الطبية',
    code: 'REG-GLU-01',
    catalogNumber: 'CAT-HEX-902',
    manufacturer: 'Roche Diagnostics / Human Germany',
    lotNumber: 'LT-84920-A',
    expiryDate: '2027-02-15',
    currentStock: 14,
    minimumStock: 4,
    unit: 'Kits (4x100 mL)',
    costPerUnit: 480,
    storageTemperature: '2 - 8 °C',
    status: 'Sufficient'
  },
  {
    id: 'reg-02',
    name: 'CBC 5-Part Diluent & Lyse (Mindray BC-5000)',
    arabicName: 'محاليل التخفيف والتكسير لجهاز صورة الدم',
    category: 'Hematology',
    supplier: 'وكيل ميندراي مصر',
    code: 'REG-CBC-02',
    catalogNumber: 'MND-BC50-DIL',
    manufacturer: 'Mindray Medical',
    lotNumber: 'LT-77312',
    expiryDate: '2026-12-10',
    currentStock: 3,
    minimumStock: 3,
    unit: 'Cubitaners (20L)',
    costPerUnit: 1250,
    storageTemperature: '15 - 30 °C',
    status: 'Low Stock'
  },
  {
    id: 'reg-03',
    name: 'HbA1c HPLC Ion-Exchange Columns Kit',
    arabicName: 'كواشف وأعمدة السكر التراكمي HPLC',
    category: 'Biochemistry',
    supplier: 'توسو اليابانية للتشخيصات',
    code: 'REG-A1C-03',
    catalogNumber: 'TOS-A1C-COL',
    manufacturer: 'Tosoh Corporation Japan',
    lotNumber: 'LT-99120',
    expiryDate: '2027-05-20',
    currentStock: 8,
    minimumStock: 2,
    unit: 'Boxes',
    costPerUnit: 3200,
    storageTemperature: '2 - 8 °C',
    status: 'Sufficient'
  },
  {
    id: 'reg-04',
    name: 'Total Cholesterol & Triglycerides Enzymatic',
    arabicName: 'كواشف الكوليسترول والدهون الثلاثية',
    category: 'Biochemistry',
    supplier: 'سبينرياكت إسبانيا - مصر',
    code: 'REG-LIP-04',
    catalogNumber: 'SPN-LIP-KIT',
    manufacturer: 'Spinreact Spain',
    lotNumber: 'LT-55102',
    expiryDate: '2026-11-01',
    currentStock: 6,
    minimumStock: 3,
    unit: 'Kits',
    costPerUnit: 650,
    storageTemperature: '2 - 8 °C',
    status: 'Expiring Soon'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'رحاب عبدالحميد',
    jobTitle: 'المدير الفني - أخصائي الباثولوجيا الإكلينيكية والتحاليل الطبية',
    nationalId: '28005120104829',
    phone: '01100874444',
    shift: 'Full Time',
    basicSalary: 28000,
    incentives: 5000,
    deductions: 0,
    overtimeHours: 12,
    attendanceDays: 26,
    absenceDays: 0,
    joinedDate: '2019-06-01',
    role: 'LabManager'
  },
  {
    id: 'emp-2',
    name: 'د. رامي مختار',
    jobTitle: 'رئيس مجلس الإدارة (CEO) - طبيب الباثولوجيا الإكلينيكية والكيميائية طب قصر العيني',
    nationalId: '27609180103948',
    phone: '01100046841',
    shift: 'Full Time',
    basicSalary: 35000,
    incentives: 8000,
    deductions: 0,
    overtimeHours: 20,
    attendanceDays: 26,
    absenceDays: 0,
    joinedDate: '2019-01-01',
    role: 'Pathologist'
  },
  {
    id: 'emp-3',
    name: 'كريم حسام الدين',
    jobTitle: 'أخصائي سحب العينات والتحاليل الطبية (Phlebotomist)',
    nationalId: '29503150102918',
    phone: '01023456789',
    shift: 'Morning',
    basicSalary: 8500,
    incentives: 1800,
    deductions: 150,
    overtimeHours: 16,
    attendanceDays: 26,
    absenceDays: 0,
    joinedDate: '2022-03-01',
    role: 'Technologist'
  },
  {
    id: 'emp-4',
    name: 'مروة فتحي البنا',
    jobTitle: 'مسؤولة الاستقبال وخدمة عملاء المرضى',
    nationalId: '29811200103948',
    phone: '01234567891',
    shift: 'Evening',
    basicSalary: 6500,
    incentives: 1200,
    deductions: 0,
    overtimeHours: 8,
    attendanceDays: 25,
    absenceDays: 1,
    joinedDate: '2023-01-15',
    role: 'Receptionist'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    description: 'شراء شحنة كواشف كيمياء دم وأنابيب EDTA وأنابيب سيروم جل',
    category: 'Reagents & Supplies',
    amount: 14500,
    recordedBy: 'المدير المالي - أحمد فاروق',
    date: '2026-09-28',
    notes: 'فاتورة شركة النصر للتوريدات الطبية رقم 84920'
  },
  {
    id: 'exp-2',
    description: 'إيجار مقر الفرع الرئيسي بميدان بهتيم برج صيدلية العزبي الدور الثالث',
    category: 'Rent',
    amount: 22000,
    recordedBy: 'المدير المالي',
    date: '2026-09-01',
    notes: 'إيجار شهر سبتمبر 2026'
  },
  {
    id: 'exp-3',
    description: 'صيانة دورية ومعايرة سنوية لجهاز Biolis 50i وجهاز Mindray BC-5000',
    category: 'Maintenance',
    amount: 6800,
    recordedBy: 'د. رحاب عبدالحميد',
    date: '2026-09-15',
    notes: 'عقد صيانة معتمد وشهادة معايرة الجودة CAP'
  }
];

export const INITIAL_DEVICES: AnalyzerDevice[] = [
  {
    id: 'dev-1',
    name: 'Mindray BC-5000 Automated 5-Part Hematology Analyzer',
    serialNumber: 'MND-BC5-99214',
    protocol: 'HL7',
    ipAddress: '192.168.1.120',
    port: 5100,
    status: 'Online',
    lastSyncTime: 'منذ 3 دقائق',
    supportedProfiles: ['Hematology Profile', 'CBC']
  },
  {
    id: 'dev-2',
    name: 'Biolis 50i Superior Clinical Chemistry Analyzer (Tokyo Boeki)',
    serialNumber: 'TB-BIO50-38102',
    protocol: 'ASTM',
    ipAddress: '192.168.1.125',
    port: 5101,
    status: 'Online',
    lastSyncTime: 'منذ دقيقة واحدة',
    supportedProfiles: ['Liver Function Profile', 'Kidney Function Profile', 'Lipid Profile', 'Electrolytes Profile']
  },
  {
    id: 'dev-3',
    name: 'Snibe Maglumi 800 Chemiluminescence Immunoassay (CLIA)',
    serialNumber: 'SNB-MAG8-48190',
    protocol: 'HL7',
    ipAddress: '192.168.1.130',
    port: 5102,
    status: 'Online',
    lastSyncTime: 'منذ 5 دقائق',
    supportedProfiles: ['Thyroid Function Profile', 'Fertility & Reproductive', 'Tumor Markers Profile', 'Infectious Diseases']
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-30 09:30',
    userName: 'مروة فتحي (استقبال)',
    action: 'تسجيل طلب فحص جديد',
    details: 'إنشاء طلب RT-2026-1001 للمريض محمد أحمد إبراهيم خليل',
    category: 'Order'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-30 09:40',
    userName: 'كريم حسام (سحب عينات)',
    action: 'تأكيد سحب العينات',
    details: 'سحب أنابيب EDTA وفلوريد وسيروم جل وطباعة ملصق الباركود RT8291001',
    category: 'Order'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-30 11:15',
    userName: 'د. رحاب عبدالحميد',
    action: 'مراجعة وتدقيق النتائج المخبرية',
    details: 'مراجعة نتائج السكر ووظائف الكلى وتطبيق الحسابات الطبية',
    category: 'Result'
  },
  {
    id: 'log-4',
    timestamp: '2026-09-30 11:20',
    userName: 'د. رامي مختار',
    action: 'اعتماد نهائي وتوقيع التقرير الطبي',
    details: 'اعتماد تقرير RT-2026-1001 وإتاحته للطباعة وحفظ PDF وإرساله للمريض',
    category: 'Result'
  }
];
