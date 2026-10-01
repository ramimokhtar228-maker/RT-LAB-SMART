import React, { useState } from 'react';
import { Order, OrderTestResult } from '../types/lis';
import { RT_LAB_INFO } from '../data/labInfo';
import { StorageService } from '../services/storage';
import { 
  Printer, 
  X, 
  Download,
  Building,
  User,
  Stethoscope,
  Award,
  Layers,
  ChevronRight,
  ChevronLeft,
  FileCheck2,
  Calendar,
  Phone
} from 'lucide-react';

interface ReportPrintModalProps {
  order: Order | null;
  onClose: () => void;
}

export const ReportPrintModal: React.FC<ReportPrintModalProps> = ({
  order,
  onClose
}) => {
  if (!order) return null;

  // Active page selector for single page preview/print
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [printSinglePageOnly, setPrintSinglePageOnly] = useState<boolean>(false);

  // Group tests by profileCategory (each profile prints on a separate page!)
  const profileGroups: Record<string, OrderTestResult[]> = {};
  for (const res of order.results) {
    const prof = res.profileCategory || 'General Laboratory Investigations';
    if (!profileGroups[prof]) {
      profileGroups[prof] = [];
    }
    profileGroups[prof].push(res);
  }

  const profileKeys = Object.keys(profileGroups);
  const totalPages = profileKeys.length;

  // Retrieve patient loyalty card info
  const patientRecord = StorageService.getPatients().find(p => p.id === order.patientId || p.phone === order.patientPhone);
  const loyaltyCardStr = patientRecord?.loyaltyCardNumber || `RT-${order.patientPhone?.slice(-4) || '8888'}-GOLD`;
  const loyaltyPointsVal = patientRecord?.loyaltyPoints ?? 120;

  // Multi-page print handler
  const handlePrintAll = () => {
    setPrintSinglePageOnly(false);
    setTimeout(() => {
      window.print();
    }, 50);
  };

  // Print current page only
  const handlePrintCurrentPage = (idx: number) => {
    setActivePageIndex(idx);
    setPrintSinglePageOnly(true);
    setTimeout(() => {
      window.print();
    }, 50);
  };

  // Generate SVG Code128 Barcode lines for high-precision printing
  const generateBarcodeLines = (code: string) => {
    const bars: { width: number; isSpace: boolean }[] = [];
    bars.push({ width: 2, isSpace: false });
    bars.push({ width: 1, isSpace: true });
    bars.push({ width: 2, isSpace: false });
    bars.push({ width: 1, isSpace: true });

    for (let i = 0; i < code.length; i++) {
      const charCode = code.charCodeAt(i);
      const w1 = (charCode % 3) + 1;
      const w2 = ((charCode >> 1) % 3) + 1;
      const w3 = ((charCode >> 2) % 2) + 1;
      bars.push({ width: w1, isSpace: false });
      bars.push({ width: 1, isSpace: true });
      bars.push({ width: w2, isSpace: false });
      bars.push({ width: w3, isSpace: true });
    }

    bars.push({ width: 2, isSpace: false });
    bars.push({ width: 1, isSpace: true });
    bars.push({ width: 3, isSpace: false });

    return bars;
  };

  // Render Visual Coloured Chart Indicator for each test
  const renderColouredChart = (res: OrderTestResult) => {
    const val = parseFloat(res.resultValue);
    const refText = res.referenceRangeText || '';

    // Check for range format: min - max
    const rangeMatch = refText.match(/([0-9.]+)\s*[-–]\s*([0-9.]+)/);
    
    if (!isNaN(val) && rangeMatch) {
      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[2]);

      if (!isNaN(min) && !isNaN(max) && max > min) {
        const span = max - min;
        const lowMargin = span * 0.35;
        const highMargin = span * 0.35;
        const totalSpan = (max + highMargin) - (min - lowMargin);
        
        let pct = ((val - (min - lowMargin)) / totalSpan) * 100;
        pct = Math.max(5, Math.min(95, pct));

        const isNormal = res.flag === 'Normal';
        const isHigh = res.flag === 'High' || res.flag === 'Critical/Panic';
        const isLow = res.flag === 'Low';

        return (
          <div className="w-full flex flex-col items-center justify-center px-1">
            {/* 3-colored gauge bar: Low (Sky Blue), Normal (Emerald), High (Rose) */}
            <div className="w-28 h-2.5 bg-slate-100 rounded-full relative overflow-visible flex items-center border border-slate-300">
              <div className="h-full w-1/4 bg-sky-200 rounded-l-full" title="Low zone" />
              <div className="h-full w-2/4 bg-emerald-200 border-x border-emerald-300" title="Normal zone" />
              <div className="h-full w-1/4 bg-rose-200 rounded-r-full" title="High zone" />

              {/* Marker pin */}
              <div 
                className={`absolute w-3 h-3 rounded-full border border-white shadow-xs top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all ${
                  isNormal ? 'bg-emerald-600' :
                  isHigh ? 'bg-rose-600 ring-2 ring-rose-200' :
                  isLow ? 'bg-sky-600 ring-2 ring-sky-200' : 'bg-slate-700'
                }`}
                style={{ left: `${pct}%` }}
                title={`Value: ${val} (Range: ${min} - ${max})`}
              />
            </div>
            
            {/* Micro status text */}
            <span className={`text-[9px] font-bold font-mono mt-0.5 ${
              isNormal ? 'text-emerald-700' :
              isHigh ? 'text-rose-700' :
              isLow ? 'text-sky-700' : 'text-slate-600'
            }`}>
              {isNormal ? '● NORMAL' : isHigh ? '▲ HIGH' : isLow ? '▼ LOW' : 'ALERT'}
            </span>
          </div>
        );
      }
    }

    // Up to / Less than format: < 200
    const lessMatch = refText.match(/[<≤]\s*([0-9.]+)/);
    if (!isNaN(val) && lessMatch) {
      const limit = parseFloat(lessMatch[1]);
      const isHigh = val > limit || res.flag === 'High' || res.flag === 'Critical/Panic';
      return (
        <div className="w-full flex flex-col items-center justify-center px-1">
          <div className="w-28 h-2.5 bg-slate-100 rounded-full relative overflow-visible flex items-center border border-slate-300">
            <div className="h-full w-3/4 bg-emerald-200 rounded-l-full" />
            <div className="h-full w-1/4 bg-rose-200 rounded-r-full border-l border-rose-300" />
            <div 
              className={`absolute w-3 h-3 rounded-full border border-white shadow-xs top-1/2 -translate-y-1/2 -translate-x-1/2 ${
                isHigh ? 'bg-rose-600' : 'bg-emerald-600'
              }`}
              style={{ left: isHigh ? '88%' : '45%' }}
            />
          </div>
          <span className={`text-[9px] font-bold font-mono mt-0.5 ${isHigh ? 'text-rose-700' : 'text-emerald-700'}`}>
            {isHigh ? '▲ HIGH' : '● NORMAL'}
          </span>
        </div>
      );
    }

    // Qualitative badges (Negative / Positive)
    const valLower = (res.resultValue || '').toLowerCase();
    if (valLower.includes('neg') || valLower.includes('سلبي')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold font-mono">
          ✓ NEGATIVE
        </span>
      );
    }
    if (valLower.includes('pos') || valLower.includes('إيجابي')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold font-mono">
          ▲ POSITIVE
        </span>
      );
    }

    // Fallback based on flag
    if (res.flag === 'Normal') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold font-mono">
          ● NORMAL
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[9px] font-mono">
        —
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print-modal-overlay">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[96vh] flex flex-col shadow-2xl border border-slate-200 print-modal-content">
        
        {/* Modal Toolbar (hidden when printing) */}
        <div className="no-print flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-100 text-red-900 rounded-lg">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                معاينة وحفظ التقرير الطبي المعتمد - {RT_LAB_INFO.nameArabic}
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">
                رقم التقرير: <strong className="text-red-900">{order.orderNumber}</strong> · المريض: {order.patientName} ({totalPages} صفحات بروفايل مستقلة)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Print All Pages */}
            <button
              onClick={handlePrintAll}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-colors"
              title="طباعة جميع صفحات البروفايلات في ملف واحد أو حفظ PDF"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة كل الصفحات ({totalPages} صفحات) / PDF</span>
            </button>

            {/* Print Current Page Only */}
            {totalPages > 1 && (
              <button
                onClick={() => handlePrintCurrentPage(activePageIndex)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                title="طباعة الصفحة الحالية فقط"
              >
                <span>طباعة صفحة {activePageIndex + 1} فقط</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Multi-page Navigation Bar on Screen */}
        {totalPages > 1 && (
          <div className="no-print bg-blue-50/70 border-b border-blue-200 px-4 py-2 flex items-center justify-between text-xs">
            <span className="font-bold text-blue-950 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-700" />
              <span>فهرس صفحات الفحص ({totalPages} بروفايل مستقل):</span>
            </span>

            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              {profileKeys.map((pName, pIdx) => (
                <button
                  key={pName}
                  onClick={() => setActivePageIndex(pIdx)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${
                    activePageIndex === pIdx 
                      ? 'bg-blue-700 text-white shadow-xs' 
                      : 'bg-white text-slate-700 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  صفحة {pIdx + 1}: {pName.length > 18 ? pName.substring(0, 18) + '...' : pName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Printable Official Medical Report Document (Each profile in separate A4 page) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100 print-container font-sans space-y-6 print:space-y-0">
          
          {profileKeys.map((profileName, profileIndex) => {
            const profileTests = profileGroups[profileName];
            const isLastPage = profileIndex === totalPages - 1;

            // If user clicked print single page only, hide others when printing
            const shouldHideInPrint = printSinglePageOnly && activePageIndex !== profileIndex;

            return (
              <div 
                key={profileName}
                className={`profile-page border border-red-900/40 p-5 sm:p-6 rounded-xl bg-white shadow-sm flex flex-col justify-between ${
                  shouldHideInPrint ? 'print:hidden' : ''
                }`}
                style={{
                  pageBreakAfter: isLastPage ? 'auto' : 'always',
                  breakAfter: isLastPage ? 'auto' : 'page',
                }}
              >
                {/* TOP HALF: Header, Demographics, Profile Banner, Results Table */}
                <div className="space-y-2.5">
                  
                  {/* Official Header: RT LAB - Ramy Mokhtar Header with Red and Blue Branding */}
                  <div className="flex items-start justify-between border-b-2 border-red-800 pb-2.5">
                    
                    {/* Right Zone: Arabic Name and Identity */}
                    <div className="space-y-0.5 max-w-xs text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-extrabold text-red-900 tracking-tight">
                          معامل رامي مختار
                        </span>
                        <span className="text-[10px] font-extrabold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          RT LAB
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-800">
                        {RT_LAB_INFO.taglineArabic}
                      </p>
                      <div className="text-[9.5px] text-slate-600 leading-tight">
                        {RT_LAB_INFO.branches[0].address}
                      </div>
                      <div className="text-[9.5px] font-mono text-red-800 font-bold flex gap-2 pt-0.5">
                        <span>ت: 01100874444</span>
                        <span>·</span>
                        <span>01100046841</span>
                      </div>
                    </div>

                    {/* Center Zone: Official RT LAB Logo */}
                    <div className="flex flex-col items-center">
                      <img
                        src={RT_LAB_INFO.logoUrl}
                        alt="RT LAB Logo"
                        className="w-14 h-14 object-contain rounded-xl shadow-xs border border-red-100 p-0.5"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[8.5px] font-mono font-extrabold text-red-900 mt-0.5 tracking-wider">
                        RT LABS
                      </span>
                    </div>

                    {/* Left Zone: English Brand & Leadership (LTR) */}
                    <div className="text-left space-y-0.5 max-w-xs" dir="ltr">
                      <h2 className="text-xs sm:text-sm font-extrabold text-blue-950 tracking-tight">
                        RAMY MOKHTAR LABS
                      </h2>
                      <p className="text-[9.5px] font-bold text-red-800">
                        Clinical & Chemical Pathology LIS
                      </p>
                      <p className="text-[9px] font-medium text-slate-600">
                        Cairo University Kasr Alainy Faculty of Medicine
                      </p>
                      <p className="text-[8.5px] text-slate-500 font-mono">
                        License: 7482/2019 · ISO 15189 Accredited
                      </p>
                    </div>

                  </div>

                  {/* Patient & Order Demographics Box (Compact, balanced) */}
                  <div className="bg-slate-50/90 border border-slate-300 rounded-lg p-2.5 text-xs text-right">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-1 gap-x-3 text-[10.5px]">
                      
                      <div>
                        <span className="text-[9.5px] text-slate-500 block">اسم المريض (Patient Name):</span>
                        <strong className="text-slate-900 font-bold text-xs">{order.patientName}</strong>
                      </div>

                      <div>
                        <span className="text-[9.5px] text-slate-500 block">رقم الفحص (Order #):</span>
                        <strong className="text-red-900 font-mono font-bold text-xs">{order.orderNumber}</strong>
                      </div>

                      <div>
                        <span className="text-[9.5px] text-slate-500 block">العمر / النوع (Age / Sex):</span>
                        <span className="font-semibold text-slate-800">
                          {order.patientAge} {order.patientAgeUnit === 'Years' ? 'سنة' : 'شهر'} · {order.patientGender === 'Male' ? 'ذكر (M)' : 'أنثى (F)'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9.5px] text-slate-500 block">تاريخ وساعة السحب:</span>
                        <span className="font-mono text-slate-800 font-semibold">{order.createdAt}</span>
                      </div>

                      <div>
                        <span className="text-[9.5px] text-slate-500 block">الطبيب المعالج (Dr):</span>
                        <span className="font-semibold text-slate-800">{order.referringDoctor || 'فحص ذاتي / Direct'}</span>
                      </div>

                      <div>
                        <span className="text-[9.5px] text-slate-500 block">الفرع المسجل:</span>
                        <span className="text-slate-800 font-medium">{order.branch}</span>
                      </div>

                      <div>
                        <span className="text-[9.5px] text-slate-500 block">الباركود (Barcode):</span>
                        <span className="font-mono font-bold text-slate-900 bg-white px-1 rounded border border-slate-200">
                          {order.barcode}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9.5px] text-amber-900 block font-bold">كارت الولاء (RT Rewards):</span>
                        <span className="font-mono font-bold text-amber-950 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[10px]">
                          {loyaltyCardStr} ({loyaltyPointsVal} نقطة)
                        </span>
                      </div>

                      <div>
                        <span className="text-[9.5px] text-slate-500 block">الصفحة:</span>
                        <span className="font-mono font-bold text-blue-900">
                          صفحة {profileIndex + 1} من {totalPages}
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Profile Banner */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-red-900 via-rose-950 to-blue-950 text-white px-3.5 py-1.5 rounded-lg shadow-2xs">
                    <span className="text-xs font-bold tracking-wide uppercase font-sans">
                      {profileName} (معتمد مخبرياً)
                    </span>
                    <span className="text-[9.5px] font-mono text-red-200">
                      معامل رامي مختار RT LAB
                    </span>
                  </div>

                  {/* Tests Results Table: STRICTLY LTR (Left to Right) */}
                  {/* Columns: INVESTIGATIONS / RESULTS / FLAGS / CHART COLOURED / UNIT / REFERENCES */}
                  <div className="overflow-hidden border border-slate-200 rounded-lg">
                    <table className="w-full text-xs text-left border-collapse" dir="ltr">
                      <thead>
                        <tr className="border-b-2 border-red-900 bg-red-50 text-slate-900 font-extrabold text-[10.5px]">
                          <th className="py-2 px-2.5 text-left w-2/6">INVESTIGATIONS</th>
                          <th className="py-2 px-2 text-center w-24">RESULTS</th>
                          <th className="py-2 px-2 text-center w-20">FLAGS</th>
                          <th className="py-2 px-2 text-center w-36">CHART COLOURED</th>
                          <th className="py-2 px-2 text-center w-20">UNIT</th>
                          <th className="py-2 px-2.5 text-left w-36">REFERENCES</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {profileTests.map((result) => {
                          const isHigh = result.flag === 'High';
                          const isLow = result.flag === 'Low';
                          const isCritical = result.flag === 'Critical/Panic';

                          return (
                            <tr key={result.testId} className="hover:bg-slate-50/60 transition-colors">
                              
                              {/* 1. INVESTIGATIONS */}
                              <td className="py-1.5 px-2.5 text-left">
                                <div className="font-bold text-slate-900 text-[11px] leading-tight">
                                  {result.testName}
                                </div>
                                <div className="text-[9.5px] font-mono text-slate-500 flex items-center gap-1.5">
                                  <span>{result.testCode}</span>
                                  {result.formulaDescription && (
                                    <span className="text-blue-700 bg-blue-50 px-1 rounded text-[8.5px]">
                                      {result.formulaDescription}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* 2. RESULTS */}
                              <td className="py-1.5 px-2 text-center font-mono font-bold text-xs">
                                <span className={`${
                                  isCritical ? 'text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-300 font-extrabold' :
                                  isHigh ? 'text-red-800 font-extrabold' :
                                  isLow ? 'text-sky-800 font-extrabold' : 'text-slate-900'
                                }`}>
                                  {result.resultValue || '---'}
                                </span>
                              </td>

                              {/* 3. FLAGS */}
                              <td className="py-1.5 px-2 text-center font-mono text-[10px] font-bold">
                                {isCritical ? (
                                  <span className="text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-300 animate-pulse">
                                    PANIC ⚠
                                  </span>
                                ) : isHigh ? (
                                  <span className="text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                                    HIGH (▲)
                                  </span>
                                ) : isLow ? (
                                  <span className="text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                                    LOW (▼)
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-normal">
                                    NORMAL
                                  </span>
                                )}
                              </td>

                              {/* 4. CHART COLOURED */}
                              <td className="py-1.5 px-2 text-center">
                                {renderColouredChart(result)}
                              </td>

                              {/* 5. UNIT */}
                              <td className="py-1.5 px-2 text-center font-mono text-slate-600 text-[10.5px]">
                                {result.unit || '---'}
                              </td>

                              {/* 6. REFERENCES */}
                              <td className="py-1.5 px-2.5 text-left font-mono text-[10.5px] text-slate-700">
                                {result.referenceRangeText || '---'}
                              </td>

                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Profile Comments & Clinical Notes */}
                  {(order.clinicalInterpretation || order.clinicalComment || order.recommendations) && (
                    <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/80 text-xs text-right space-y-1">
                      <div className="font-bold text-red-950 border-b border-slate-200 pb-0.5 flex items-center justify-between text-[11px]">
                        <span>التعليق والربط السريري (Clinical Correlation & Diagnostic Notes)</span>
                        <span className="text-[9px] text-slate-400 font-mono">RT LAB Review</span>
                      </div>

                      {order.clinicalInterpretation && (
                        <div className="text-slate-800 leading-snug text-[10px]">
                          <strong className="text-slate-900">التفسير الطبي: </strong>
                          {order.clinicalInterpretation}
                        </div>
                      )}

                      {order.recommendations && (
                        <div className="text-slate-700 leading-snug text-[10px]">
                          <strong className="text-slate-900">التوصيات الطبية: </strong>
                          {order.recommendations}
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* BOTTOM HALF: Signatures & Verification Footer */}
                <div className="pt-2 border-t-2 border-red-900 mt-2 text-right">
                  <div className="flex items-end justify-between gap-3">
                    
                    {/* Left Doctor: المدير الفني د. رحاب عبدالحميد */}
                    <div className="text-center p-1.5 rounded-lg border border-slate-200 bg-slate-50/70 min-w-[180px]">
                      <div className="text-[9px] text-slate-500 font-bold mb-0.5">
                        المدير الفني للمعمل
                      </div>
                      <div className="font-serif italic text-red-900 font-bold text-sm my-0.5" dir="ltr">
                        Dr. Rehab Abdelhamid
                      </div>
                      <div className="text-[11px] font-bold text-slate-900">
                        {RT_LAB_INFO.technicalDirectorArabic}
                      </div>
                      <div className="text-[8.5px] text-slate-600 font-medium">
                        {RT_LAB_INFO.technicalDirectorTitleArabic}
                      </div>
                    </div>

                    {/* Center: Official Laboratory Stamp & Barcode Verification */}
                    <div className="flex flex-col items-center space-y-1">
                      {/* Official Round Stamp of RT LAB */}
                      <div className="w-16 h-16 rounded-full border-2 border-red-800 p-1 flex flex-col items-center justify-center text-center bg-red-50/30 shadow-2xs rotate-[-2deg]" title="ختم معتمد رسمي">
                        <img 
                          src={RT_LAB_INFO.logoUrl} 
                          alt="RT LAB Stamp" 
                          className="w-5 h-5 object-contain rounded-full opacity-90"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[6.5px] font-extrabold text-red-900 leading-tight">معامل رامي مختار</span>
                        <span className="text-[5.5px] font-mono text-red-800 font-bold">ترخيص 7482/2019</span>
                        <span className="text-[5.5px] text-blue-900 font-bold">معتمد إكلينيكياً ISO</span>
                      </div>

                      <div className="bg-white p-1 rounded border border-slate-200 inline-flex flex-col items-center">
                        <svg height="18" className="w-28">
                          {generateBarcodeLines(order.barcode).reduce((acc: any[], bar) => {
                            const prevX = acc.length > 0 ? acc[acc.length - 1].x + acc[acc.length - 1].width : 2;
                            acc.push({ x: prevX, width: bar.width * 1.2, fill: bar.isSpace ? 'transparent' : '#000000' });
                            return acc;
                          }, []).map((b, i) => (
                            <rect key={i} x={b.x} y="0" width={b.width} height="18" fill={b.fill} />
                          ))}
                        </svg>
                        <span className="text-[8px] font-mono tracking-widest text-slate-700">
                          *{order.barcode}*
                        </span>
                      </div>
                      <span className="text-[7.5px] font-mono text-slate-500">
                        تقرير معتمد رقمياً · {RT_LAB_INFO.hotline}
                      </span>
                    </div>

                    {/* Right Doctor: رئيس مجلس الإدارة د. رامي مختار */}
                    <div className="text-center p-1.5 rounded-lg border border-red-200 bg-red-50/50 min-w-[200px]">
                      <div className="text-[9px] text-red-800 font-bold mb-0.5">
                        رئيس مجلس الإدارة (CEO)
                      </div>
                      <div className="font-serif italic text-red-900 font-bold text-sm my-0.5" dir="ltr">
                        Dr. Ramy Mokhtar
                      </div>
                      <div className="text-[11px] font-bold text-slate-900">
                        {RT_LAB_INFO.ceoArabic}
                      </div>
                      <div className="text-[8.5px] text-slate-600 font-medium">
                        طبيب الباثولوجيا الإكلينيكية والكيميائية
                      </div>
                      <div className="text-[7.5px] text-blue-900 font-bold">
                        طب قصر العيني - جامعة القاهرة
                      </div>
                    </div>

                  </div>

                  {/* Address bottom banner */}
                  <div className="text-center text-[8.5px] text-slate-500 mt-2 pt-1 border-t border-slate-200 flex justify-between">
                    <span>الفرع الرئيسي: {RT_LAB_INFO.branches[0].address}</span>
                    <span className="font-mono font-bold text-red-900">الخط الساخن والحجوزات: {RT_LAB_INFO.hotline}</span>
                  </div>
                </div>

              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
};
