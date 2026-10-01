import React, { useState, useEffect } from 'react';
import { Order, OrderTestResult, ResultFlag, UserRole, TestCatalogItem } from '../types/lis';
import { StorageService } from '../services/storage';
import { MedicalCalculations } from '../services/medicalCalculations';
import { RT_LAB_INFO } from '../data/labInfo';
import { COMPOSITE_PROFILES, expandCompositeTest, getNormalPresetValues } from '../data/compositeTestProfiles';
import { CompositeResultEntryModal } from '../modals/CompositeResultEntryModal';
import { 
  FileSpreadsheet, 
  Search, 
  Save, 
  CheckCircle, 
  AlertTriangle, 
  AlertOctagon, 
  History, 
  User, 
  Stethoscope, 
  ShieldCheck, 
  Printer,
  Sparkles,
  ArrowUpDown,
  Calculator,
  Plus,
  Trash2,
  RefreshCw,
  Layers,
  Wand2,
  ListPlus
} from 'lucide-react';

interface WorklistViewProps {
  orders: Order[];
  currentUserRole: UserRole;
  onUpdateOrder: (order: Order) => void;
  onOpenPrintReport: (order: Order) => void;
  onDeleteOrder?: (orderId: string) => void;
}

export const WorklistView: React.FC<WorklistViewProps> = ({
  orders,
  currentUserRole,
  onUpdateOrder,
  onOpenPrintReport,
  onDeleteOrder
}) => {
  const allCatalogTests = StorageService.getTests();

  // Active orders in worklist
  const activeOrders = orders.filter(o => 
    o.specimenStatus === 'Collected' || 
    o.specimenStatus === 'In Processing' || 
    o.specimenStatus === 'Completed' ||
    o.orderStatus === 'Results Entered' ||
    o.orderStatus === 'Sample Collected'
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string>(activeOrders[0]?.id || orders[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  
  const selectedOrder = orders.find(o => o.id === selectedOrderId) || activeOrders[0] || orders[0];
  const [workingResults, setWorkingResults] = useState<OrderTestResult[]>(selectedOrder?.results || []);
  const [interpretation, setInterpretation] = useState<string>(selectedOrder?.clinicalInterpretation || '');
  const [comment, setComment] = useState<string>(selectedOrder?.clinicalComment || '');
  const [recommendations, setRecommendations] = useState<string>(selectedOrder?.recommendations || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Add test modal inside worklist
  const [isAddTestOpen, setIsAddTestOpen] = useState(false);
  const [selectedTestToAdd, setSelectedTestToAdd] = useState<string>(allCatalogTests[0]?.id || '');
  const [isCompositeModalOpen, setIsCompositeModalOpen] = useState(false);

  // Keep state synced when selected order changes & auto expand composite profiles
  useEffect(() => {
    if (selectedOrder) {
      let rawResults = selectedOrder.results || [];
      const needsExpand = rawResults.some(r => {
        const codeUpper = r.testCode?.toUpperCase().trim() || '';
        return codeUpper === 'CBC' || codeUpper === 'URINE_ROUTINE' || codeUpper === 'STOOL_ROUTINE' || codeUpper === 'SEMEN_ANALYSIS';
      });

      if (needsExpand) {
        let expandedList: OrderTestResult[] = [];
        for (const r of rawResults) {
          const codeUpper = r.testCode?.toUpperCase().trim() || '';
          if (codeUpper === 'CBC' || codeUpper === 'URINE_ROUTINE' || codeUpper === 'STOOL_ROUTINE' || codeUpper === 'SEMEN_ANALYSIS') {
            const sub = expandCompositeTest(codeUpper);
            if (sub && sub.length > 0) {
              expandedList.push(...sub);
              continue;
            }
          }
          expandedList.push(r);
        }
        setWorkingResults(expandedList);
      } else {
        setWorkingResults(rawResults);
      }

      setInterpretation(selectedOrder.clinicalInterpretation || '');
      setComment(selectedOrder.clinicalComment || '');
      setRecommendations(selectedOrder.recommendations || '');
      setSaveSuccessMsg(null);
    }
  }, [selectedOrderId, selectedOrder]);

  const handleSelectOrder = (order: Order) => {
    setSelectedOrderId(order.id);
  };

  // Change individual test result value
  const handleResultChange = (testId: string, valStr: string) => {
    if (!selectedOrder) return;
    const testCatalog = allCatalogTests.find(t => t.id === testId);
    
    setWorkingResults(prev => prev.map(item => {
      if (item.testId !== testId) return item;
      
      let flag: ResultFlag = item.flag;
      if (testCatalog && valStr.trim() !== '') {
        flag = StorageService.evaluateResultFlag(testCatalog, valStr, selectedOrder.patientGender);
      } else if (valStr.trim() !== '') {
        // Direct range evaluation for composite sub-tests
        const num = parseFloat(valStr);
        const rangeMatch = item.referenceRangeText?.match(/([0-9.]+)\s*[-–]\s*([0-9.]+)/);
        if (!isNaN(num) && rangeMatch) {
          const min = parseFloat(rangeMatch[1]);
          const max = parseFloat(rangeMatch[2]);
          if (!isNaN(min) && !isNaN(max)) {
            if (num < min) flag = 'Low';
            else if (num > max) flag = 'High';
            else flag = 'Normal';
          }
        } else {
          const lower = valStr.toLowerCase();
          if (lower.includes('+') || lower.includes('pos') || lower.includes('turbid') || lower.includes('large') || lower.includes('many')) {
            flag = 'High';
          } else if (lower.includes('nil') || lower.includes('neg') || lower.includes('clear') || lower.includes('normal')) {
            flag = 'Normal';
          }
        }
      }

      // Delta check if previous value exists
      let deltaPercent: number | undefined = undefined;
      let deltaAlert = false;
      if (item.previousValue) {
        const prevNum = parseFloat(item.previousValue.replace(/[^0-9.]/g, ''));
        const currNum = parseFloat(valStr.replace(/[^0-9.]/g, ''));
        if (!isNaN(prevNum) && !isNaN(currNum) && prevNum !== 0) {
          deltaPercent = Number((((currNum - prevNum) / prevNum) * 100).toFixed(1));
          if (Math.abs(deltaPercent) >= 30) {
            deltaAlert = true;
          }
        }
      }

      return {
        ...item,
        resultValue: valStr,
        flag,
        deltaChangePercent: deltaPercent,
        deltaAlert
      };
    }));
  };

  // Expand composite tests (CBC, Urine, Stool, Semen) into full sub-fields
  const handleExpandAllComposites = () => {
    let expandedList: OrderTestResult[] = [];
    let count = 0;

    for (const r of workingResults) {
      const codeUpper = r.testCode.toUpperCase().trim();
      const isParent = codeUpper === 'CBC' || codeUpper === 'URINE_ROUTINE' || codeUpper === 'STOOL_ROUTINE' || codeUpper === 'SEMEN_ANALYSIS';
      
      if (isParent) {
        const expanded = expandCompositeTest(codeUpper);
        if (expanded && expanded.length > 0) {
          expandedList.push(...expanded);
          count++;
          continue;
        }
      }
      expandedList.push(r);
    }

    setWorkingResults(expandedList);
    setSaveSuccessMsg(`تم تفريغ وتفكيك حقول الفحص المجمع بنجاح إلى ${expandedList.length} حقل إدخال تفصيلي!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Quick fill normal preset values
  const handleQuickFillNormal = (profileKey: string) => {
    const normalMap = getNormalPresetValues(profileKey);
    setWorkingResults(prev => prev.map(r => {
      const preset = normalMap[r.testId] || normalMap[r.testCode];
      if (preset !== undefined) {
        return {
          ...r,
          resultValue: preset,
          flag: 'Normal'
        };
      }
      return r;
    }));
    setSaveSuccessMsg(`تم تعبئة القيم والمعدلات الطبيعية المعتمدة لـ ${profileKey} بنجاح!`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Run Medical Calculations Engine (CBC, Lipid, Ca Ionized, HbA1c, HOMA-IR, Liver, eGFR)
  const handleTriggerAutoCalculations = () => {
    if (!selectedOrder) return;

    // Collect all current inputs as code -> value
    const inputMap: Record<string, string> = {};
    for (const r of workingResults) {
      if (r.resultValue) {
        inputMap[r.testCode.toUpperCase()] = r.resultValue;
      }
    }

    const calculatedOutputs = MedicalCalculations.computeAllCalculations(
      inputMap,
      selectedOrder.patientAge,
      selectedOrder.patientGender
    );

    let updatedCount = 0;
    let newResultsList = [...workingResults];

    for (const [code, calc] of Object.entries(calculatedOutputs)) {
      const existingIdx = newResultsList.findIndex(r => r.testCode.toUpperCase() === code);
      if (existingIdx >= 0) {
        newResultsList[existingIdx] = {
          ...newResultsList[existingIdx],
          resultValue: calc.value,
          isAutoCalculated: true,
          formulaDescription: calc.formulaDescription
        };
        updatedCount++;
      } else {
        // Append newly calculated parameter if not already in order
        newResultsList.push({
          testId: 'calc-' + code.toLowerCase() + '-' + Date.now(),
          testName: calc.testName,
          testCode: calc.testCode,
          profileCategory: 'Calculated Diagnostic Indices',
          resultValue: calc.value,
          unit: calc.unit,
          referenceRangeText: calc.referenceRangeText,
          flag: 'Normal',
          isAutoCalculated: true,
          formulaDescription: calc.formulaDescription
        });
        updatedCount++;
      }
    }

    setWorkingResults(newResultsList);
    setSaveSuccessMsg(`تم تطبيق وحساب ${updatedCount} معادلة طبية بنجاح (Lipid, Ca, HOMA, eAG, CBC)!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Flag manual toggle
  const handleFlagChange = (testId: string, flag: ResultFlag) => {
    setWorkingResults(prev => prev.map(item => 
      item.testId === testId ? { ...item, flag } : item
    ));
  };

  // Add new test into this order
  const handleAddTestToOrder = () => {
    const catalogItem = allCatalogTests.find(t => t.id === selectedTestToAdd);
    if (!catalogItem || !selectedOrder) return;

    if (workingResults.some(r => r.testId === catalogItem.id || r.testCode === catalogItem.code)) {
      alert('هذا التحليل موجود بالفعل في قائمة الطلب.');
      return;
    }

    const ref = catalogItem.referenceRanges.find(r => r.gender === selectedOrder.patientGender || r.gender === 'All') || catalogItem.referenceRanges[0];

    const newRes: OrderTestResult = {
      testId: catalogItem.id,
      testName: catalogItem.arabicName,
      testCode: catalogItem.code,
      profileCategory: catalogItem.profileCategory || 'General Profile',
      resultValue: '',
      unit: catalogItem.unit,
      referenceRangeText: ref?.textualRange || `${ref?.min} - ${ref?.max}`,
      flag: 'Normal'
    };

    setWorkingResults(prev => [...prev, newRes]);
    setIsAddTestOpen(false);
  };

  // Remove test from order
  const handleRemoveTest = (testId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التحليل من الطلب؟')) {
      setWorkingResults(prev => prev.filter(r => r.testId !== testId));
    }
  };

  // Save as Draft
  const handleSaveDraft = () => {
    if (!selectedOrder) return;
    const hasCritical = workingResults.some(r => r.flag === 'Critical/Panic');
    const updated: Order = {
      ...selectedOrder,
      results: workingResults,
      testIds: workingResults.map(r => r.testId),
      orderStatus: 'Results Entered',
      reportStatus: hasCritical ? 'Critical Alert' : (selectedOrder.reportStatus === 'Approved' ? 'Approved' : 'In Progress'),
      hasCriticalValue: hasCritical,
      clinicalInterpretation: interpretation,
      clinicalComment: comment,
      recommendations: recommendations
    };
    onUpdateOrder(updated);
    setSaveSuccessMsg('تم حفظ وتحديث النتائج والمسودة ومزامنتها بنجاح.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Final Approval
  const handleFinalApproval = () => {
    if (!selectedOrder) return;
    
    const hasCritical = workingResults.some(r => r.flag === 'Critical/Panic');
    const now = new Date();
    const formatted = now.toISOString().replace('T', ' ').substring(0, 16);

    const updated: Order = {
      ...selectedOrder,
      results: workingResults,
      testIds: workingResults.map(r => r.testId),
      orderStatus: 'Approved',
      reportStatus: hasCritical ? 'Critical Alert' : 'Approved',
      specimenStatus: 'Completed',
      hasCriticalValue: hasCritical,
      approvedBy: `${RT_LAB_INFO.technicalDirectorArabic} (${RT_LAB_INFO.technicalDirectorTitleArabic})`,
      approvedAt: formatted,
      clinicalInterpretation: interpretation,
      clinicalComment: comment,
      recommendations: recommendations
    };

    onUpdateOrder(updated);
    setSaveSuccessMsg('تم الاعتماد الطبي النهائي بنجاح للتقرير وجاهز للطباعة والتسليم.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const filteredActiveOrders = activeOrders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.barcode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-700 mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>قائمة العمل وإدخال النتائج والحسابات الطبية (LIS Worklist & Calculation Engine)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            إدخال النتائج، الحسابات الآلية (CBC/Lipid/Ca/HOMA/eAG)، والاعتماد الطبي
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {RT_LAB_INFO.nameArabic} · إشراف {RT_LAB_INFO.technicalDirectorArabic} و {RT_LAB_INFO.ceoArabic}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleTriggerAutoCalculations}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-red-700 to-blue-900 hover:from-red-800 hover:to-blue-950 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-colors"
            title="تفعيل الحسابات الآلية لمعادلات فريدوالد والكالسيوم المصحح ومقاومة الأنسولين وeAG ومؤشرات صورة الدم"
          >
            <Calculator className="w-4 h-4 text-amber-300" />
            <span>تفعيل الحسابات الطبية الآلية</span>
          </button>

          {selectedOrder && (
            <button
              onClick={() => setIsAddTestOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>إضافة فحص للطلب</span>
            </button>
          )}
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
          {selectedOrder?.reportStatus === 'Approved' && (
            <button
              onClick={() => onOpenPrintReport(selectedOrder)}
              className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 cursor-pointer"
            >
              معاينة وطباعة التقرير الرسمي A4 ←
            </button>
          )}
        </div>
      )}

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Right column: Orders in worklist (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[750px]">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span>طلبات العينات الجاهزة للنتائج</span>
              <span className="font-mono text-[11px] bg-red-100 text-red-900 px-1.5 py-0.5 rounded font-bold">
                {activeOrders.length}
              </span>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث برقم الطلب، الباركود، الاسم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-2 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredActiveOrders.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                لا توجد طلبات عينات بانتظار إدخال النتائج.
              </div>
            ) : (
              filteredActiveOrders.map((order) => {
                const isSelected = order.id === selectedOrderId;
                const hasCritical = order.hasCriticalValue;

                return (
                  <button
                    key={order.id}
                    onClick={() => handleSelectOrder(order)}
                    className={`w-full text-right p-3.5 transition-colors cursor-pointer border-r-4 ${
                      isSelected 
                        ? 'bg-red-50/80 border-red-700' 
                        : hasCritical
                        ? 'bg-rose-50/50 border-rose-500 hover:bg-slate-50'
                        : 'border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {order.orderNumber}
                      </span>
                      {order.urgency === 'STAT' && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded animate-pulse">
                          STAT
                        </span>
                      )}
                    </div>

                    <div className="font-bold text-xs text-slate-800 truncate">
                      {order.patientName}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span className="font-mono text-[10px] bg-slate-100 px-1 rounded">
                        {order.barcode}
                      </span>
                      <span>{order.results?.length || order.testIds.length} فحص</span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100/60 text-[10px]">
                      <span className="text-slate-400">
                        {order.patientAge} سنة · {order.patientGender === 'Male' ? 'ذكر' : 'أنثى'}
                      </span>
                      <span className={`font-semibold px-1.5 py-0.2 rounded ${
                        order.orderStatus === 'Approved'
                          ? 'text-emerald-700 bg-emerald-50'
                          : order.orderStatus === 'Results Entered'
                          ? 'text-purple-700 bg-purple-50'
                          : 'text-amber-700 bg-amber-50'
                      }`}>
                        {order.orderStatus === 'Approved' ? 'معتمد' :
                         order.orderStatus === 'Results Entered' ? 'مدخل' : 'قيد الفحص'}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Left column: Results entry & Auto Calculations (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {selectedOrder ? (
            <>
              {/* Order Header Card */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900">
                        {selectedOrder.patientName}
                      </span>
                      <span className="text-xs font-mono font-bold text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        {selectedOrder.orderNumber}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        ({selectedOrder.barcode})
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                      <span>العمر: {selectedOrder.patientAge} سنة</span>
                      <span>·</span>
                      <span>النوع: {selectedOrder.patientGender === 'Male' ? 'ذكر' : 'أنثى'}</span>
                      <span>·</span>
                      <span>الطبيب: {selectedOrder.referringDoctor}</span>
                      <span>·</span>
                      <span>الفرع: {selectedOrder.branch}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsCompositeModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      title="نافذة ذكية متخصصة لتفريغ وإدخال نتائج الفحوصات المجمعة CBC وبول وبراز وسيّال"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>نافذة تفريغ CBC وبول وبراز الذكية</span>
                    </button>

                    <button
                      onClick={handleTriggerAutoCalculations}
                      className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      title="حساب معادلات Lipid و Calcium و HOMA و eAG و CBC تلقائياً"
                    >
                      <Calculator className="w-3.5 h-3.5 text-amber-700" />
                      <span>حساب المعادلات</span>
                    </button>

                    <button
                      onClick={handleSaveDraft}
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>حفظ مسودة</span>
                    </button>

                    <button
                      onClick={handleFinalApproval}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>الاعتماد الطبي</span>
                    </button>

                    {onDeleteOrder && (
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من الحذف النهائي للطلب ${selectedOrder.orderNumber}؟ لا يمكن التراجع عن هذا الإجراء.`)) {
                            onDeleteOrder(selectedOrder.id);
                          }
                        }}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        title="حذف نهائي للطلب"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Delta check warning banner if triggered */}
                {workingResults.some(r => r.deltaAlert) && (
                  <div className="mt-3 p-2.5 bg-amber-50 border border-amber-300 rounded-lg flex items-center gap-2 text-xs text-amber-900 font-semibold">
                    <ArrowUpDown className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      تنبيه دلتا تشيك (Delta Check Alert): تم رصد تغير كبير يزيد عن ±30% مقارنة بالنتيجة السابقة للمريض. يرجى المراجعة والتأكد قبل الاعتماد.
                    </span>
                  </div>
                )}
              </div>

              {/* Tests Results Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                
                {/* Header row */}
                <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      جدول النتائج المخبرية ({workingResults.length} حقل فحص)
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      تتحدث المعادلات التلقائية والأعلام والألوان فورياً
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExpandAllComposites}
                      className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded text-xs font-bold hover:bg-indigo-100 cursor-pointer"
                      title="تفكيك CBC وبول وبراز وسائل منوي إلى كافة حقولها التفصيلية"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>تفريغ الفحوصات المجمعة</span>
                    </button>

                    <button
                      onClick={() => setIsAddTestOpen(true)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-bold hover:bg-blue-100 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>إضافة فحص</span>
                    </button>
                  </div>
                </div>

                {/* Composite Unpack Notification Banner if detected */}
                {(() => {
                  const unexpanded = workingResults
                    .map(r => r.testCode.toUpperCase().trim())
                    .filter(c => c === 'CBC' || c === 'URINE_ROUTINE' || c === 'STOOL_ROUTINE' || c === 'SEMEN_ANALYSIS');
                  if (unexpanded.length === 0) return null;
                  return (
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-700" />
                        <div>
                          <span className="text-xs font-bold text-blue-950 block">
                            فحوصات مجمعة بانتظار التفريغ: {unexpanded.join(' · ')}
                          </span>
                          <span className="text-[10px] text-blue-800">
                            اضغط لتفكيك الفحص إلى كافة حقوله الفرعية (الهيموجلوبين، الصفائح، كرات الدم، الصديد، الأملاح، المظهر...)
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleExpandAllComposites}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                      >
                        <ListPlus className="w-4 h-4" />
                        <span>تفريغ وتجهيز حقول النتيجة الآن</span>
                      </button>
                    </div>
                  );
                })()}

                {/* Quick Fill Toolbar */}
                <div className="px-3.5 py-2 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <Wand2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>تعبئة سريعة للقيم الطبيعية:</span>
                  </span>

                  <button
                    onClick={() => handleQuickFillNormal('CBC')}
                    className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded text-[11px] font-semibold cursor-pointer"
                    title="تعبئة معدلات صورة دم طبيعية"
                  >
                    صورة دم CBC طبيعية
                  </button>

                  <button
                    onClick={() => handleQuickFillNormal('URINE_ROUTINE')}
                    className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded text-[11px] font-semibold cursor-pointer"
                    title="تعبئة فحص بول طبيعي"
                  >
                    بول روتيني طبيعي
                  </button>

                  <button
                    onClick={() => handleQuickFillNormal('STOOL_ROUTINE')}
                    className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded text-[11px] font-semibold cursor-pointer"
                    title="تعبئة فحص براز طبيعي"
                  >
                    براز روتيني طبيعي
                  </button>

                  <button
                    onClick={() => handleQuickFillNormal('SEMEN_ANALYSIS')}
                    className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded text-[11px] font-semibold cursor-pointer"
                    title="تعبئة سائل منوي طبيعي"
                  >
                    سائل منوي طبيعي
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">اسم التحليل والكود</th>
                        <th className="py-2.5 px-3 min-w-[200px]">النتيجة (Result)</th>
                        <th className="py-2.5 px-3">الوحدة</th>
                        <th className="py-2.5 px-3">المعدل الطبيعي</th>
                        <th className="py-2.5 px-3">السابق (Delta)</th>
                        <th className="py-2.5 px-3 text-center">العلم</th>
                        <th className="py-2.5 px-2 text-center w-10">حذف</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {workingResults.map((result) => {
                        const isCritical = result.flag === 'Critical/Panic';
                        const isHigh = result.flag === 'High';
                        const isLow = result.flag === 'Low';

                        // Lookup predefined options for qualitative sub-tests
                        let subOptions: string[] | undefined = undefined;
                        for (const prof of Object.values(COMPOSITE_PROFILES)) {
                          const found = prof.subTests.find(s => s.testCode.toUpperCase() === result.testCode.toUpperCase() || s.testId.toLowerCase() === result.testId.toLowerCase());
                          if (found && found.options) {
                            subOptions = found.options;
                            break;
                          }
                        }

                        return (
                          <tr key={result.testId} className={`hover:bg-slate-50/70 transition-colors ${
                            isCritical ? 'bg-rose-50/40' : ''
                          }`}>
                            
                            {/* Test Name & Code */}
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-slate-900">{result.testName}</div>
                              <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                                <span>{result.testCode}</span>
                                {result.isAutoCalculated && (
                                  <span className="text-blue-700 bg-blue-50 px-1 rounded font-sans font-semibold">
                                    حساب آلي
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Result Input + Quick Select Chips */}
                            <td className="py-2.5 px-3">
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  value={result.resultValue}
                                  onChange={(e) => handleResultChange(result.testId, e.target.value)}
                                  placeholder="اكتب النتيجة أو اختر..."
                                  className={`w-full px-2.5 py-1 text-xs font-mono font-bold rounded border transition-colors ${
                                    isCritical 
                                      ? 'border-rose-400 bg-rose-50 text-rose-900 focus:border-rose-600'
                                      : isHigh || isLow
                                      ? 'border-amber-400 bg-amber-50/50 text-amber-900 focus:border-amber-600'
                                      : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500'
                                  } focus:outline-hidden`}
                                />

                                {/* Sub-test options quick click chips */}
                                {subOptions && (
                                  <div className="flex flex-wrap gap-1 max-w-xs">
                                    {subOptions.slice(0, 4).map(opt => (
                                      <button
                                        key={opt}
                                        type="button"
                                        onClick={() => handleResultChange(result.testId, opt)}
                                        className={`text-[9.5px] px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                                          result.resultValue === opt
                                            ? 'bg-blue-700 text-white font-bold'
                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        }`}
                                      >
                                        {opt}
                                      </button>
                                    ))}
                                    {subOptions.length > 4 && (
                                      <select
                                        value={subOptions.includes(result.resultValue) ? result.resultValue : ''}
                                        onChange={e => handleResultChange(result.testId, e.target.value)}
                                        className="text-[9.5px] bg-slate-100 border border-slate-200 rounded px-1 py-0.5 cursor-pointer text-slate-700"
                                      >
                                        <option value="">خيارات أخرى...</option>
                                        {subOptions.map(opt => (
                                          <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                      </select>
                                    )}
                                  </div>
                                )}

                                {result.formulaDescription && (
                                  <div className="text-[9px] text-blue-700 truncate mt-0.5" title={result.formulaDescription}>
                                    {result.formulaDescription}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Unit */}
                            <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                              {result.unit}
                            </td>

                            {/* Reference Range */}
                            <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px] max-w-xs">
                              {result.referenceRangeText}
                            </td>

                            {/* Previous Value & Delta */}
                            <td className="py-2.5 px-3">
                              {result.previousValue ? (
                                <div className="space-y-0.5">
                                  <div className="font-mono text-[11px] text-slate-600">
                                    {result.previousValue}
                                  </div>
                                  {result.deltaChangePercent !== undefined && (
                                    <div className={`font-mono text-[10px] font-bold ${
                                      result.deltaAlert ? 'text-rose-600' : 'text-slate-500'
                                    }`}>
                                      Δ {result.deltaChangePercent > 0 ? `+${result.deltaChangePercent}` : result.deltaChangePercent}%
                                      {result.deltaAlert && ' ⚠'}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-400">---</span>
                              )}
                            </td>

                            {/* Flag Selector */}
                            <td className="py-2.5 px-3 text-center">
                              <select
                                value={result.flag}
                                onChange={(e) => handleFlagChange(result.testId, e.target.value as ResultFlag)}
                                className={`text-[11px] font-bold px-2 py-1 rounded border cursor-pointer focus:outline-hidden ${
                                  result.flag === 'Normal' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  result.flag === 'High' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                                  result.flag === 'Low' ? 'bg-sky-50 text-sky-800 border-sky-300' :
                                  'bg-rose-100 text-rose-800 border-rose-300 font-extrabold animate-pulse'
                                }`}
                              >
                                <option value="Normal">Normal</option>
                                <option value="High">High</option>
                                <option value="Low">Low</option>
                                <option value="Critical/Panic">Critical / Panic</option>
                              </select>
                            </td>

                            {/* Delete single test from order */}
                            <td className="py-2.5 px-2 text-center">
                              <button
                                onClick={() => handleRemoveTest(result.testId)}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer transition-colors"
                                title="حذف هذا الفحص من الطلب"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Clinical Interpretation & Notes */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <h3 className="text-xs font-bold text-slate-900">
                      التفسير السريري والملاحظات الطبية (إشراف {RT_LAB_INFO.technicalDirectorArabic})
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    تظهر هذه الملاحظات في التقرير النهائي المعتمد
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      التفسير الطبي (Clinical Interpretation)
                    </label>
                    <textarea
                      rows={3}
                      value={interpretation}
                      onChange={(e) => setInterpretation(e.target.value)}
                      placeholder="التفسير السريري للنتائج ودلالاتها..."
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      التعليق والربط السريري (Comment / Correlation)
                    </label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="ملاحظات العينة، إخطار الطبيب بالقيمة الحرجة، ظروف الصيام..."
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      التوصيات الطبية (Recommendations)
                    </label>
                    <textarea
                      rows={3}
                      value={recommendations}
                      onChange={(e) => setRecommendations(e.target.value)}
                      placeholder="إعادة الفحص، فحوصات تأكيدية إضافية، استشارة الطبيب..."
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-slate-500">
                    {selectedOrder.approvedBy ? (
                      <span className="text-emerald-700 font-semibold">
                        معتمد بواسطة: {selectedOrder.approvedBy} في {selectedOrder.approvedAt}
                      </span>
                    ) : (
                      <span>لم يتم الاعتماد النهائي بعد.</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveDraft}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      حفظ المسودة
                    </button>
                    <button
                      onClick={handleFinalApproval}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                    >
                      اعتماد وإصدار التقرير
                    </button>
                  </div>
                </div>

              </div>

            </>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 text-slate-400">
              اختر طلباً من قائمة الطلبات للبدء في إدخال النتائج وتفعيل الحسابات الآلية.
            </div>
          )}

        </div>

      </div>

      {/* Add Test to Order Modal */}
      {isAddTestOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4 text-xs text-right">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              إضافة فحص مخبري إضافي لهذا الطلب
            </h3>

            <div>
              <label className="block text-slate-700 font-bold mb-1">اختر التحليل من الدليل الشامل</label>
              <select
                value={selectedTestToAdd}
                onChange={e => setSelectedTestToAdd(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold"
              >
                {allCatalogTests.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.arabicName} ({t.code}) - {t.price} ج.م [{t.category}]
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsAddTestOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleAddTestToOrder}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 cursor-pointer"
              >
                إضافة إلى قائمة النتائج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Composite Results Entry Modal */}
      {isCompositeModalOpen && selectedOrder && (
        <CompositeResultEntryModal
          order={selectedOrder}
          isOpen={isCompositeModalOpen}
          onClose={() => setIsCompositeModalOpen(false)}
          onSaveOrder={(updated) => {
            onUpdateOrder(updated);
            setWorkingResults(updated.results);
            setIsCompositeModalOpen(false);
          }}
          onOpenPrintReport={onOpenPrintReport}
        />
      )}

    </div>
  );
};
