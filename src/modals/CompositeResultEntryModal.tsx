import React, { useState, useEffect } from 'react';
import { Order, OrderTestResult, ResultFlag, Patient } from '../types/lis';
import { StorageService } from '../services/storage';
import { RT_LAB_INFO } from '../data/labInfo';
import { 
  COMPOSITE_PROFILES, 
  expandCompositeTest, 
  getNormalPresetValues 
} from '../data/compositeTestProfiles';
import {
  FileSpreadsheet,
  X,
  Save,
  CheckCircle2,
  Wand2,
  AlertTriangle,
  Calculator,
  RefreshCw,
  Sparkles,
  ChevronDown,
  Layers,
  Activity,
  Droplet,
  FlaskConical,
  Microscope,
  Stethoscope,
  Info
} from 'lucide-react';

interface CompositeResultEntryModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSaveOrder: (updatedOrder: Order) => void;
  onOpenPrintReport?: (order: Order) => void;
}

export const CompositeResultEntryModal: React.FC<CompositeResultEntryModalProps> = ({
  order,
  isOpen,
  onClose,
  onSaveOrder,
  onOpenPrintReport
}) => {
  if (!isOpen || !order) return null;

  // Initialize or expand results
  const [results, setResults] = useState<OrderTestResult[]>(() => {
    let current = [...order.results];
    
    // Check if any composite tests need immediate unpacking
    let needsExpansion = false;
    for (const r of current) {
      const codeUpper = r.testCode?.toUpperCase().trim() || '';
      if (codeUpper === 'CBC' || codeUpper === 'URINE_ROUTINE' || codeUpper === 'STOOL_ROUTINE' || codeUpper === 'SEMEN_ANALYSIS') {
        needsExpansion = true;
        break;
      }
    }

    if (needsExpansion) {
      let expandedList: OrderTestResult[] = [];
      for (const r of current) {
        const codeUpper = r.testCode?.toUpperCase().trim() || '';
        const isComposite = codeUpper === 'CBC' || codeUpper === 'URINE_ROUTINE' || codeUpper === 'STOOL_ROUTINE' || codeUpper === 'SEMEN_ANALYSIS';
        if (isComposite) {
          const subList = expandCompositeTest(codeUpper);
          if (subList && subList.length > 0) {
            expandedList.push(...subList);
            continue;
          }
        }
        expandedList.push(r);
      }
      return expandedList;
    }

    return current;
  });

  const [activeTab, setActiveTab] = useState<'CBC' | 'URINE' | 'STOOL' | 'SEMEN' | 'OTHER'>('CBC');
  const [clinicalNotes, setClinicalNotes] = useState(order.clinicalInterpretation || '');
  const [clinicalComment, setClinicalComment] = useState(order.clinicalComment || '');
  const [recommendations, setRecommendations] = useState(order.recommendations || '');
  const [notification, setNotification] = useState<string | null>(null);

  // Sync state if order changes
  useEffect(() => {
    let current = [...order.results];
    let needsExpansion = false;
    for (const r of current) {
      const codeUpper = r.testCode?.toUpperCase().trim() || '';
      if (codeUpper === 'CBC' || codeUpper === 'URINE_ROUTINE' || codeUpper === 'STOOL_ROUTINE' || codeUpper === 'SEMEN_ANALYSIS') {
        needsExpansion = true;
        break;
      }
    }

    if (needsExpansion) {
      let expandedList: OrderTestResult[] = [];
      for (const r of current) {
        const codeUpper = r.testCode?.toUpperCase().trim() || '';
        const isComposite = codeUpper === 'CBC' || codeUpper === 'URINE_ROUTINE' || codeUpper === 'STOOL_ROUTINE' || codeUpper === 'SEMEN_ANALYSIS';
        if (isComposite) {
          const subList = expandCompositeTest(codeUpper);
          if (subList && subList.length > 0) {
            expandedList.push(...subList);
            continue;
          }
        }
        expandedList.push(r);
      }
      setResults(expandedList);
    } else {
      setResults(current);
    }

    setClinicalNotes(order.clinicalInterpretation || '');
    setClinicalComment(order.clinicalComment || '');
    setRecommendations(order.recommendations || '');
  }, [order]);

  // Determine which composite profiles exist in this order
  const hasCbc = results.some(r => 
    r.profileCategory?.includes('Hematology') || 
    r.testCode.toUpperCase().includes('CBC') || 
    ['HB', 'RBC', 'HCT', 'MCV', 'MCH', 'MCHC', 'WBC', 'PLT'].includes(r.testCode.toUpperCase())
  );

  const hasUrine = results.some(r => 
    r.profileCategory?.includes('Urine') || 
    r.testCode.toUpperCase().includes('U_') || 
    r.testCode.toUpperCase() === 'URINE_ROUTINE'
  );

  const hasStool = results.some(r => 
    r.profileCategory?.includes('Gastrointestinal') || 
    r.testCode.toUpperCase().includes('ST_') || 
    r.testCode.toUpperCase() === 'STOOL_ROUTINE'
  );

  const hasSemen = results.some(r => 
    r.profileCategory?.includes('Fertility') || 
    r.testCode.toUpperCase().includes('SEM_') || 
    r.testCode.toUpperCase() === 'SEMEN_ANALYSIS'
  );

  // Auto set active tab on initial load
  useEffect(() => {
    if (hasCbc) setActiveTab('CBC');
    else if (hasUrine) setActiveTab('URINE');
    else if (hasStool) setActiveTab('STOOL');
    else if (hasSemen) setActiveTab('SEMEN');
    else setActiveTab('OTHER');
  }, [hasCbc, hasUrine, hasStool, hasSemen]);

  // Update a single result value & evaluate flag & auto-calculate indices
  const handleUpdateValue = (testId: string, val: string) => {
    setResults(prev => {
      const updated = prev.map(r => {
        if (r.testId !== testId) return r;

        let flag: ResultFlag = 'Normal';
        const num = parseFloat(val);
        const rangeMatch = r.referenceRangeText?.match(/([0-9.]+)\s*[-–]\s*([0-9.]+)/);
        
        if (!isNaN(num) && rangeMatch) {
          const min = parseFloat(rangeMatch[1]);
          const max = parseFloat(rangeMatch[2]);
          if (!isNaN(min) && !isNaN(max)) {
            if (num < min) flag = 'Low';
            else if (num > max) flag = 'High';
            else flag = 'Normal';
          }
        } else {
          const lower = val.toLowerCase();
          if (lower.includes('+') || lower.includes('pos') || lower.includes('turbid') || lower.includes('large') || lower.includes('many') || lower.includes('seen')) {
            flag = 'High';
          } else if (lower.includes('nil') || lower.includes('neg') || lower.includes('clear') || lower.includes('normal')) {
            flag = 'Normal';
          }
        }

        return {
          ...r,
          resultValue: val,
          flag
        };
      });

      // Automated CBC MCV, MCH, MCHC calculation if RBC/Hb/HCT updated
      const hbObj = updated.find(x => x.testCode.toUpperCase() === 'HB');
      const rbcObj = updated.find(x => x.testCode.toUpperCase() === 'RBC');
      const hctObj = updated.find(x => x.testCode.toUpperCase() === 'HCT');

      const hbVal = hbObj ? parseFloat(hbObj.resultValue) : NaN;
      const rbcVal = rbcObj ? parseFloat(rbcObj.resultValue) : NaN;
      const hctVal = hctObj ? parseFloat(hctObj.resultValue) : NaN;

      if (!isNaN(rbcVal) && rbcVal > 0) {
        if (!isNaN(hctVal)) {
          const mcvCalc = ((hctVal * 10) / rbcVal).toFixed(1);
          const mcvIdx = updated.findIndex(x => x.testCode.toUpperCase() === 'MCV');
          if (mcvIdx >= 0) {
            updated[mcvIdx] = {
              ...updated[mcvIdx],
              resultValue: mcvCalc,
              isAutoCalculated: true,
              formulaDescription: '(HCT × 10) ÷ RBC',
              flag: parseFloat(mcvCalc) < 80 ? 'Low' : parseFloat(mcvCalc) > 96 ? 'High' : 'Normal'
            };
          }
        }

        if (!isNaN(hbVal)) {
          const mchCalc = ((hbVal * 10) / rbcVal).toFixed(1);
          const mchIdx = updated.findIndex(x => x.testCode.toUpperCase() === 'MCH');
          if (mchIdx >= 0) {
            updated[mchIdx] = {
              ...updated[mchIdx],
              resultValue: mchCalc,
              isAutoCalculated: true,
              formulaDescription: '(Hb × 10) ÷ RBC',
              flag: parseFloat(mchCalc) < 27 ? 'Low' : parseFloat(mchCalc) > 33 ? 'High' : 'Normal'
            };
          }
        }
      }

      if (!isNaN(hbVal) && !isNaN(hctVal) && hctVal > 0) {
        const mchcCalc = ((hbVal * 100) / hctVal).toFixed(1);
        const mchcIdx = updated.findIndex(x => x.testCode.toUpperCase() === 'MCHC');
        if (mchcIdx >= 0) {
          updated[mchcIdx] = {
            ...updated[mchcIdx],
            resultValue: mchcCalc,
            isAutoCalculated: true,
            formulaDescription: '(Hb × 100) ÷ HCT',
            flag: parseFloat(mchcCalc) < 32 ? 'Low' : parseFloat(mchcCalc) > 36 ? 'High' : 'Normal'
          };
        }
      }

      return updated;
    });
  };

  // Quick preset loader
  const handleApplyPreset = (profileKey: string, presetType: 'NORMAL' | 'ANEMIA' | 'INFECTION' | 'UTI' | 'AMEBA' | 'CLEAR') => {
    if (presetType === 'CLEAR') {
      setResults(prev => prev.map(r => ({ ...r, resultValue: '', flag: 'Normal' })));
      setNotification('تم مسح جميع الحقول بنجاح.');
      setTimeout(() => setNotification(null), 2500);
      return;
    }

    if (presetType === 'NORMAL') {
      const normalMap = getNormalPresetValues(profileKey);
      setResults(prev => prev.map(r => {
        const preset = normalMap[r.testId] || normalMap[r.testCode];
        if (preset !== undefined) {
          return { ...r, resultValue: preset, flag: 'Normal' };
        }
        return r;
      }));
      setNotification(`تم تطبيق القيم الطبيعية المعتمدة لـ ${profileKey} بنجاح!`);
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (presetType === 'ANEMIA' && profileKey === 'CBC') {
      const custom: Record<string, { val: string; flag: ResultFlag }> = {
        HB: { val: '9.4', flag: 'Low' },
        RBC: { val: '3.8', flag: 'Low' },
        HCT: { val: '28.5', flag: 'Low' },
        MCV: { val: '75.0', flag: 'Low' },
        MCH: { val: '24.7', flag: 'Low' },
        MCHC: { val: '33.0', flag: 'Normal' },
        RDW: { val: '16.5', flag: 'High' },
        WBC: { val: '6.8', flag: 'Normal' },
        PLT: { val: '310', flag: 'Normal' },
        NEUT_PCT: { val: '60', flag: 'Normal' },
        LYMPH_PCT: { val: '30', flag: 'Normal' },
        MONO_PCT: { val: '6', flag: 'Normal' },
        EOS_PCT: { val: '3', flag: 'Normal' },
        BASO_PCT: { val: '1', flag: 'Normal' }
      };

      setResults(prev => prev.map(r => {
        const found = custom[r.testCode.toUpperCase()];
        if (found) {
          return { ...r, resultValue: found.val, flag: found.flag };
        }
        return r;
      }));
      setClinicalNotes('صورة دم تشير إلى أنيميا نقص الحديد من الدرجة المتوسطة (Microcytic Hypochromic Anemia with elevated RDW).');
      setRecommendations('ينصح بالعلاج التعويضي للحديد وفحص مخزون الحديد في الدم (Serum Ferritin) مع المتابعة بعد شهر.');
      setNotification('تم تطبيق نموذج أنيميا نقص الحديد (Microcytic Anemia) بنجاح!');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (presetType === 'INFECTION' && profileKey === 'CBC') {
      const custom: Record<string, { val: string; flag: ResultFlag }> = {
        HB: { val: '13.8', flag: 'Normal' },
        RBC: { val: '4.7', flag: 'Normal' },
        HCT: { val: '42.0', flag: 'Normal' },
        WBC: { val: '15.8', flag: 'High' },
        NEUT_PCT: { val: '82', flag: 'High' },
        LYMPH_PCT: { val: '12', flag: 'Low' },
        MONO_PCT: { val: '4', flag: 'Normal' },
        EOS_PCT: { val: '1', flag: 'Normal' },
        BASO_PCT: { val: '1', flag: 'Normal' },
        PLT: { val: '380', flag: 'Normal' }
      };

      setResults(prev => prev.map(r => {
        const found = custom[r.testCode.toUpperCase()];
        if (found) {
          return { ...r, resultValue: found.val, flag: found.flag };
        }
        return r;
      }));
      setClinicalNotes('ارتفاع واضح في كرات الدم البيضاء والعدلات (Leukocytosis with Neutrophilia - Left Shift) يشير إلى عدوى بكتيرية حادة أو التهاب نشط.');
      setRecommendations('يرجى الربط السريري مع فحص بروتين سي التفاعلي (CRP) ومزرعة الدم أو العضو المصاب.');
      setNotification('تم تطبيق نموذج العدوى والالتهاب البكتيري الحاد بنجاح!');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (presetType === 'UTI' && profileKey === 'URINE_ROUTINE') {
      const custom: Record<string, { val: string; flag: ResultFlag }> = {
        U_COLOR: { val: 'Cloudy Yellow', flag: 'Normal' },
        U_ASPECT: { val: 'Turbid', flag: 'High' },
        U_PROT: { val: '+ (30 mg/dL)', flag: 'High' },
        U_NIT: { val: 'Positive', flag: 'High' },
        U_LEUK: { val: '+++ (Large)', flag: 'High' },
        U_PUS: { val: '40 - 50', flag: 'High' },
        U_RBC: { val: '8 - 10', flag: 'High' },
        U_BACT: { val: 'Many (+++)', flag: 'High' },
        U_EPITH: { val: 'Moderate', flag: 'Normal' }
      };

      setResults(prev => prev.map(r => {
        const found = custom[r.testCode.toUpperCase()];
        if (found) {
          return { ...r, resultValue: found.val, flag: found.flag };
        }
        return r;
      }));
      setClinicalNotes('التهاب وصديد نشط في مجرى البول (Active Urinary Tract Infection - UTI) مع وجود بكتيريا ونيتريت إيجابي.');
      setRecommendations('يوصى بعمل مزرعة بول وحساسية للمضادات الحيوية (Urine Culture & Sensitivity) لتحديد العلاج الأمثل.');
      setNotification('تم تطبيق نموذج صديد والتهاب المسالك البولية UTI بنجاح!');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (presetType === 'AMEBA' && profileKey === 'STOOL_ROUTINE') {
      const custom: Record<string, { val: string; flag: ResultFlag }> = {
        ST_COLOR: { val: 'Dark Brown', flag: 'Normal' },
        ST_CONS: { val: 'Semi-formed', flag: 'Normal' },
        ST_MUC: { val: '++ (Moderate)', flag: 'High' },
        ST_BLD: { val: 'Trace', flag: 'High' },
        ST_PUS: { val: '12 - 15', flag: 'High' },
        ST_RBC: { val: '6 - 8', flag: 'High' },
        ST_PROTO: { val: 'Entamoeba histolytica cysts seen (++)', flag: 'High' },
        ST_TROPH: { val: 'Entamoeba histolytica trophozoite seen (+)', flag: 'High' }
      };

      setResults(prev => prev.map(r => {
        const found = custom[r.testCode.toUpperCase()];
        if (found) {
          return { ...r, resultValue: found.val, flag: found.flag };
        }
        return r;
      }));
      setClinicalNotes('إصابة طفيلية نشطة بأميبا الدوسنتاريا (Intestinal Amebiasis - E. Histolytica Cysts & Trophozoites seen with mucus).');
      setRecommendations('ينصح بالعلاج المضاد للأميبا (Antiprotozoal - Metronidazole) وإعادة التحليل بعد أسبوعين.');
      setNotification('تم تطبيق نموذج إصابة الأميبا المعوية بنجاح!');
      setTimeout(() => setNotification(null), 3000);
      return;
    }
  };

  // CBC Differential sum calculation
  const cbcDiffSum = (() => {
    const neut = parseFloat(results.find(r => r.testCode.toUpperCase() === 'NEUT_PCT')?.resultValue || '0') || 0;
    const lymph = parseFloat(results.find(r => r.testCode.toUpperCase() === 'LYMPH_PCT')?.resultValue || '0') || 0;
    const mono = parseFloat(results.find(r => r.testCode.toUpperCase() === 'MONO_PCT')?.resultValue || '0') || 0;
    const eos = parseFloat(results.find(r => r.testCode.toUpperCase() === 'EOS_PCT')?.resultValue || '0') || 0;
    const baso = parseFloat(results.find(r => r.testCode.toUpperCase() === 'BASO_PCT')?.resultValue || '0') || 0;
    return Number((neut + lymph + mono + eos + baso).toFixed(1));
  })();

  // Save handler
  const handleSave = (isApproval = false) => {
    const hasCritical = results.some(r => r.flag === 'Critical/Panic');
    const now = new Date();
    const formatted = now.toISOString().replace('T', ' ').substring(0, 16);

    const updatedOrder: Order = {
      ...order,
      results,
      testIds: Array.from(new Set([...order.testIds, ...results.map(r => r.testId)])),
      orderStatus: isApproval ? 'Approved' : 'Results Entered',
      reportStatus: hasCritical ? 'Critical Alert' : (isApproval ? 'Approved' : 'In Progress'),
      specimenStatus: 'Completed',
      hasCriticalValue: hasCritical,
      clinicalInterpretation: clinicalNotes,
      clinicalComment: clinicalComment,
      recommendations: recommendations,
      verifiedBy: order.verifiedBy || RT_LAB_INFO.technicalDirectorArabic,
      approvedBy: isApproval ? `${RT_LAB_INFO.technicalDirectorArabic} (${RT_LAB_INFO.technicalDirectorTitleArabic})` : order.approvedBy,
      approvedAt: isApproval ? formatted : order.approvedAt
    };

    onSaveOrder(updatedOrder);
    StorageService.saveOrder(updatedOrder);
    StorageService.addAuditLog(
      isApproval ? 'اعتماد طبي شامل للتحاليل المجمعة' : 'حفظ وتفريغ نتائج الفحوصات المجمعة',
      `الطلب: ${order.orderNumber} - المريض: ${order.patientName} (${results.length} فحص)`,
      'Result'
    );

    setNotification(isApproval ? 'تم الاعتماد الطبي النهائي بنجاح!' : 'تم حفظ النتائج وتحديث ملف المريض بنجاح!');
    setTimeout(() => {
      onClose();
      if (isApproval && onOpenPrintReport) {
        onOpenPrintReport(updatedOrder);
      }
    }, 1000);
  };

  // Filter results for current tab
  const tabResults = results.filter(r => {
    if (activeTab === 'CBC') {
      return r.profileCategory?.includes('Hematology') || 
             ['HB', 'RBC', 'HCT', 'MCV', 'MCH', 'MCHC', 'RDW', 'WBC', 'NEUT_PCT', 'LYMPH_PCT', 'MONO_PCT', 'EOS_PCT', 'BASO_PCT', 'PLT', 'MPV'].includes(r.testCode.toUpperCase());
    }
    if (activeTab === 'URINE') {
      return r.profileCategory?.includes('Urine') || r.testCode.toUpperCase().startsWith('U_') || r.testCode.toUpperCase() === 'URINE_ROUTINE';
    }
    if (activeTab === 'STOOL') {
      return r.profileCategory?.includes('Gastrointestinal') || r.testCode.toUpperCase().startsWith('ST_') || r.testCode.toUpperCase() === 'STOOL_ROUTINE';
    }
    if (activeTab === 'SEMEN') {
      return r.profileCategory?.includes('Fertility') || r.testCode.toUpperCase().startsWith('SEM_') || r.testCode.toUpperCase() === 'SEMEN_ANALYSIS';
    }
    // OTHER: individual chemistry/hormones not in CBC/Urine/Stool/Semen
    return !r.profileCategory?.includes('Hematology') && 
           !r.profileCategory?.includes('Urine') && 
           !r.profileCategory?.includes('Gastrointestinal') && 
           !r.profileCategory?.includes('Fertility');
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[96vh] flex flex-col shadow-2xl border border-slate-200 text-xs text-right overflow-hidden animate-in fade-in duration-200">
        
        {/* Modal Top Header with Brand */}
        <div className="bg-gradient-to-r from-red-950 via-rose-900 to-blue-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-red-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/10 rounded-xl backdrop-blur-xs border border-white/20">
              <img
                src={RT_LAB_INFO.logoUrl}
                alt="RT LAB Logo"
                className="w-10 h-10 object-contain rounded-lg shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight">
                  نافذة تفريغ وإدخال نتائج التحاليل المجمعة
                </h1>
                <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded shadow-xs">
                  CBC · Urine · Stool · Semen
                </span>
              </div>
              <p className="text-[11px] text-rose-100 flex items-center gap-2 mt-0.5">
                <span>المريض: <strong className="text-white">{order.patientName}</strong> ({order.patientAge} سنة · {order.patientGender === 'Male' ? 'ذكر' : 'أنثى'})</span>
                <span>·</span>
                <span className="font-mono text-amber-200 font-bold">{order.orderNumber}</span>
                <span>·</span>
                <span>الباركود: {order.barcode}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-rose-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success / Info Alert Banner */}
        {notification && (
          <div className="p-2.5 bg-emerald-500 text-white font-bold text-center text-xs shadow-inner flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* Profile Selector Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {hasCbc && (
              <button
                onClick={() => setActiveTab('CBC')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                  activeTab === 'CBC'
                    ? 'bg-rose-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <Droplet className="w-3.5 h-3.5 text-rose-400" />
                <span>صورة دم كاملة (CBC)</span>
              </button>
            )}

            {hasUrine && (
              <button
                onClick={() => setActiveTab('URINE')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                  activeTab === 'URINE'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5 text-amber-300" />
                <span>تحليل البول الكامل (Urine)</span>
              </button>
            )}

            {hasStool && (
              <button
                onClick={() => setActiveTab('STOOL')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                  activeTab === 'STOOL'
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <Microscope className="w-3.5 h-3.5 text-amber-200" />
                <span>تحليل البراز والطفيليات (Stool)</span>
              </button>
            )}

            {hasSemen && (
              <button
                onClick={() => setActiveTab('SEMEN')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                  activeTab === 'SEMEN'
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-indigo-300" />
                <span>السائل المنوي (Semen)</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('OTHER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                activeTab === 'OTHER'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-300" />
              <span>فحوصات كيميائية ومناعية أخرى ({results.filter(r => !r.profileCategory?.includes('Hematology') && !r.profileCategory?.includes('Urine') && !r.profileCategory?.includes('Gastrointestinal')).length})</span>
            </button>
          </div>

          {/* Quick Preset Buttons for current tab */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
              <Wand2 className="w-3 h-3 text-amber-600" />
              <span>تعبئة ذكية سريعة:</span>
            </span>

            {activeTab === 'CBC' && (
              <>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('CBC', 'NORMAL')}
                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-semibold text-[11px] cursor-pointer"
                >
                  طبيعي سليم 100%
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('CBC', 'ANEMIA')}
                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded font-semibold text-[11px] cursor-pointer"
                >
                  أنيميا نقص حديد
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('CBC', 'INFECTION')}
                  className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-semibold text-[11px] cursor-pointer"
                >
                  عدوى والتهاب نشط
                </button>
              </>
            )}

            {activeTab === 'URINE' && (
              <>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('URINE_ROUTINE', 'NORMAL')}
                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-semibold text-[11px] cursor-pointer"
                >
                  بول سليم طبيعي
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('URINE_ROUTINE', 'UTI')}
                  className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-semibold text-[11px] cursor-pointer"
                >
                  صديد والتهاب مسالك UTI
                </button>
              </>
            )}

            {activeTab === 'STOOL' && (
              <>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('STOOL_ROUTINE', 'NORMAL')}
                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-semibold text-[11px] cursor-pointer"
                >
                  براز سليم طبيعي
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('STOOL_ROUTINE', 'AMEBA')}
                  className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-semibold text-[11px] cursor-pointer"
                >
                  أميبا ودوسنتاريا
                </button>
              </>
            )}

            {activeTab === 'SEMEN' && (
              <button
                type="button"
                onClick={() => handleApplyPreset('SEMEN_ANALYSIS', 'NORMAL')}
                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-semibold text-[11px] cursor-pointer"
              >
                طبيعي Normozoospermia
              </button>
            )}

            <button
              type="button"
              onClick={() => handleApplyPreset('', 'CLEAR')}
              className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-semibold text-[11px] cursor-pointer"
              title="تفريغ الخانات للبدء من جديد"
            >
              مسح
            </button>
          </div>
        </div>

        {/* Modal Main Body with Input Fields */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-slate-50/50">
          
          {/* CBC Differential Check Bar (if CBC active) */}
          {activeTab === 'CBC' && (
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">
                  فحص مجموع كرات الدم البيضاء التفريقي (5-Part Diff):
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                  cbcDiffSum === 100 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  المجموع: {cbcDiffSum}% {cbcDiffSum === 100 ? '✓ متطابق تماماً' : '⚠ ينبغي أن يساوي 100%'}
                </span>
              </div>
              <span className="text-[10.5px] text-slate-500 font-mono">
                المعادلات الحسابية (MCV, MCH, MCHC) تتحدث فورياً من واقع قيم RBC و Hb و HCT
              </span>
            </div>
          )}

          {/* Sub-tests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {tabResults.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                لا توجد فحوصات تابعة لهذا القسم في طلب الفحص الحالي.
              </div>
            ) : (
              tabResults.map(res => {
                const isCritical = res.flag === 'Critical/Panic';
                const isHigh = res.flag === 'High';
                const isLow = res.flag === 'Low';

                // Look for dropdown options
                let subOptions: string[] | undefined = undefined;
                for (const prof of Object.values(COMPOSITE_PROFILES)) {
                  const found = prof.subTests.find(s => s.testCode.toUpperCase() === res.testCode.toUpperCase() || s.testId.toLowerCase() === res.testId.toLowerCase());
                  if (found && found.options) {
                    subOptions = found.options;
                    break;
                  }
                }

                return (
                  <div 
                    key={res.testId}
                    className={`bg-white p-3 rounded-xl border transition-all shadow-2xs ${
                      isCritical ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20' :
                      isHigh ? 'border-amber-400 bg-amber-50/20' :
                      isLow ? 'border-sky-300 bg-sky-50/20' :
                      'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{res.testName}</div>
                        <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
                          <span className="font-bold text-slate-700">{res.testCode}</span>
                          <span>·</span>
                          <span>{res.unit || '---'}</span>
                          {res.isAutoCalculated && (
                            <span className="text-blue-700 bg-blue-50 px-1 rounded text-[9px] font-sans font-bold">
                              حساب آلي
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Flag Pill */}
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                        isCritical ? 'bg-rose-600 text-white animate-pulse' :
                        isHigh ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        isLow ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {isCritical ? 'PANIC ⚠' : isHigh ? 'HIGH ▲' : isLow ? 'LOW ▼' : 'NORMAL'}
                      </span>
                    </div>

                    {/* Result Input Field */}
                    <div className="space-y-1.5">
                      <div className="relative">
                        <input
                          type="text"
                          value={res.resultValue}
                          onChange={(e) => handleUpdateValue(res.testId, e.target.value)}
                          placeholder="أدخل النتيجة..."
                          className={`w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border text-right transition-colors ${
                            isCritical ? 'border-rose-400 bg-rose-50 text-rose-900' :
                            isHigh ? 'border-amber-400 bg-amber-50/40 text-amber-900' :
                            isLow ? 'border-sky-300 bg-sky-50/40 text-sky-900' :
                            'border-slate-300 bg-white text-slate-900 focus:border-blue-600'
                          } focus:outline-hidden`}
                        />
                      </div>

                      {/* Dropdown Options chips if available */}
                      {subOptions && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {subOptions.slice(0, 3).map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleUpdateValue(res.testId, opt)}
                              className={`text-[9.5px] px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                                res.resultValue === opt
                                  ? 'bg-rose-900 text-white font-bold shadow-2xs'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}

                          {subOptions.length > 3 && (
                            <select
                              value={subOptions.includes(res.resultValue) ? res.resultValue : ''}
                              onChange={e => handleUpdateValue(res.testId, e.target.value)}
                              className="text-[9.5px] bg-slate-100 border border-slate-200 rounded-md px-1.5 py-0.5 cursor-pointer text-slate-700 max-w-[120px]"
                            >
                              <option value="">خيارات أخرى...</option>
                              {subOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      )}

                      {/* Reference Range */}
                      <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-0.5 border-t border-slate-100">
                        <span>المعدل الطبيعي:</span>
                        <span className="font-semibold text-slate-700" dir="ltr">
                          {res.referenceRangeText || 'Normal'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Clinical Interpretation, Comments, & Medical Recommendations */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-rose-800" />
              <span>التفسير السريري والتوصيات الطبية المعتمدة للتقرير (Clinical Interpretation & Recommendations)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  التفسير السريري للنتائج (Clinical Interpretation):
                </label>
                <textarea
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="اكتب التفسير التشخيصي للنتائج غير الطبيعية..."
                  rows={2}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  ملاحظات وتعليق المعمل (Clinical Comment):
                </label>
                <textarea
                  value={clinicalComment}
                  onChange={(e) => setClinicalComment(e.target.value)}
                  placeholder="ملاحظات جودة العينة أو شروط السحب..."
                  rows={2}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  التوصيات الطبية للمريض (Recommendations):
                </label>
                <textarea
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  placeholder="فحوصات تكميلية، موعد الإعادة، استشارة الطبيب المعالج..."
                  rows={2}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-blue-600 font-medium"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="bg-slate-100 p-3 sm:p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-medium">
              المدير الفني المعتمد: <strong className="text-slate-800">{RT_LAB_INFO.technicalDirectorArabic}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={() => handleSave(false)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>حفظ كمسودة (Save Draft)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave(true)}
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>اعتماد طبي وطباعة التقرير (Approve & Print)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
