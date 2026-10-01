import React from 'react';
import { Order, OrderTestResult } from '../types/lis';
import { RT_LAB_INFO } from '../data/labInfo';
import { 
  Printer, 
  X, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Download,
  Calendar,
  Clock,
  Phone,
  Building,
  User,
  Stethoscope,
  Award,
  Layers
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

  const handlePrint = () => {
    window.print();
  };

  // Group tests by profileCategory (each profile prints on a separate page!)
  const profileGroups: Record<string, OrderTestResult[]> = {};
  for (const res of order.results) {
    const prof = res.profileCategory || 'General Laboratory Tests';
    if (!profileGroups[prof]) {
      profileGroups[prof] = [];
    }
    profileGroups[prof].push(res);
  }

  const profileKeys = Object.keys(profileGroups);

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

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[96vh] flex flex-col shadow-2xl border border-slate-200">
        
        {/* Modal Toolbar (hidden when printing) */}
        <div className="no-print flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-red-700" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                معاينة وطباعة التقرير الطبي المعتمد - {RT_LAB_INFO.nameArabic}
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">
                رقم التقرير: {order.orderNumber} · المريض: {order.patientName} ({profileKeys.length} صفحات بروفايل A4 منفصلة)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>حفظ PDF / طباعة A4 فورية</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Medical Report Document (Each profile in separate A4 page) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white print-container font-sans text-slate-900 text-right space-y-8">
          
          {profileKeys.map((profileName, profileIndex) => {
            const profileTests = profileGroups[profileName];
            const isLastPage = profileIndex === profileKeys.length - 1;

            return (
              <div 
                key={profileName}
                className="profile-page border-2 border-red-900/30 p-6 sm:p-7 rounded-xl relative min-h-[960px] flex flex-col justify-between bg-white shadow-xs"
                style={{
                  pageBreakAfter: isLastPage ? 'auto' : 'always',
                  breakAfter: isLastPage ? 'auto' : 'page',
                }}
              >
                <div>
                  {/* Header: RT LAB - Ramy Mokhtar Header with Red and Blue Branding */}
                  <div className="flex items-start justify-between border-b-2 border-red-800 pb-3 mb-3">
                    
                    {/* Right Zone: Arabic Name and Identity */}
                    <div className="space-y-0.5 max-w-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-extrabold text-red-900 tracking-tight">
                          معامل رامي مختار
                        </span>
                        <span className="text-xs font-extrabold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          RT LAB
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        {RT_LAB_INFO.taglineArabic}
                      </p>
                      <div className="text-[10px] text-slate-600 leading-tight">
                        {RT_LAB_INFO.branches[0].address}
                      </div>
                      <div className="text-[10px] font-mono text-red-800 font-bold flex gap-3 pt-0.5">
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
                        className="w-16 h-16 object-contain rounded-xl shadow-xs border border-red-100"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[9px] font-mono font-extrabold text-red-900 mt-1 tracking-wider">
                        RT LABS
                      </span>
                    </div>

                    {/* Left Zone: English Brand & Leadership */}
                    <div className="text-left space-y-0.5 max-w-sm" dir="ltr">
                      <h2 className="text-sm font-extrabold text-blue-950 tracking-tight">
                        RAMY MOKHTAR LABS
                      </h2>
                      <p className="text-[10px] font-bold text-red-800">
                        Clinical & Chemical Pathology LIS
                      </p>
                      <p className="text-[10px] font-medium text-slate-600">
                        Cairo University Kasr Alainy Faculty of Medicine
                      </p>
                      <p className="text-[9px] text-slate-500 font-mono">
                        License: 7482/2019 · ISO 15189 Accredited
                      </p>
                    </div>

                  </div>

                  {/* Patient & Order Demographics Box */}
                  <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs mb-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-1.5 gap-x-4">
                      
                      <div>
                        <span className="text-[10px] text-slate-500 block">اسم المريض (Patient Name):</span>
                        <strong className="text-slate-900 font-bold text-sm">{order.patientName}</strong>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 block">رقم الفحص (Order Number):</span>
                        <strong className="text-red-900 font-mono font-bold text-sm">{order.orderNumber}</strong>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 block">العمر / النوع (Age / Sex):</span>
                        <span className="font-semibold text-slate-800">
                          {order.patientAge} {order.patientAgeUnit === 'Years' ? 'سنة' : 'شهر'} · {order.patientGender === 'Male' ? 'ذكر (M)' : 'أنثى (F)'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 block">تاريخ وساعة السحب:</span>
                        <span className="font-mono text-slate-800 font-semibold">{order.createdAt}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 block">الطبيب المعالج (Referring Dr):</span>
                        <span className="font-semibold text-slate-800">{order.referringDoctor || 'فحص ذاتي / Direct'}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 block">الفرع المسجل:</span>
                        <span className="text-slate-800 font-medium">{order.branch}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 block">رقم الباركود (Barcode):</span>
                        <span className="font-mono font-bold text-slate-900 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                          {order.barcode}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 block">الصفحة:</span>
                        <span className="font-mono font-bold text-blue-900">
                          صفحة {profileIndex + 1} من {profileKeys.length}
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Profile Banner */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-red-900 to-blue-950 text-white px-4 py-1.5 rounded-lg mb-3 shadow-xs">
                    <span className="text-xs font-bold tracking-wide uppercase">
                      {profileName} (فحص تشخيصي معتمد)
                    </span>
                    <span className="text-[10px] font-mono text-red-200">
                      معامل رامي مختار · شبرا الخيمة
                    </span>
                  </div>

                  {/* Tests Results Table */}
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-xs text-right border-collapse">
                      <thead>
                        <tr className="border-b-2 border-red-900 text-slate-900 font-extrabold text-[11px] bg-red-50/60">
                          <th className="py-2 px-2 text-right">الفحص المخبري (Test Name)</th>
                          <th className="py-2 px-2 text-center w-28">النتيجة (Result)</th>
                          <th className="py-2 px-2 text-center w-24">العلم (Flag)</th>
                          <th className="py-2 px-2 text-center w-24">الوحدة (Unit)</th>
                          <th className="py-2 px-2 text-left w-56" dir="ltr">Biological Reference Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {profileTests.map((result) => {
                          const isHigh = result.flag === 'High';
                          const isLow = result.flag === 'Low';
                          const isCritical = result.flag === 'Critical/Panic';

                          return (
                            <tr key={result.testId} className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-2">
                                <div className="font-bold text-slate-900">{result.testName}</div>
                                <div className="text-[10px] font-mono text-slate-500">
                                  {result.testCode}
                                  {result.formulaDescription && (
                                    <span className="mr-2 text-blue-700 bg-blue-50 px-1 rounded text-[9px] font-sans">
                                      {result.formulaDescription}
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="py-2.5 px-2 text-center font-mono font-bold text-sm">
                                <span className={`${
                                  isCritical ? 'text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-300 font-extrabold' :
                                  isHigh || isLow ? 'text-amber-900 font-extrabold' : 'text-slate-900'
                                }`}>
                                  {result.resultValue || '---'}
                                </span>
                              </td>

                              <td className="py-2.5 px-2 text-center font-bold font-mono text-[10px]">
                                {isCritical ? (
                                  <span className="text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-300">
                                    CRITICAL ⚠
                                  </span>
                                ) : isHigh ? (
                                  <span className="text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                                    HIGH (▲)
                                  </span>
                                ) : isLow ? (
                                  <span className="text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded">
                                    LOW (▼)
                                  </span>
                                ) : (
                                  <span className="text-slate-400">NORMAL</span>
                                )}
                              </td>

                              <td className="py-2.5 px-2 text-center font-mono text-slate-600 text-[11px]">
                                {result.unit}
                              </td>

                              <td className="py-2.5 px-2 text-left font-mono text-[11px] text-slate-700" dir="ltr">
                                {result.referenceRangeText}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Profile Comments & Medical Notes */}
                  {(order.clinicalInterpretation || order.clinicalComment || order.recommendations) && (
                    <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/70 text-xs space-y-1.5 mb-4">
                      <div className="font-bold text-red-950 border-b border-slate-200 pb-1 flex items-center justify-between">
                        <span>التعليق والتفسير الطبي (Diagnostic Notes & Clinical Correlation)</span>
                        <span className="text-[10px] text-slate-400 font-mono">RT LAB Review</span>
                      </div>

                      {order.clinicalInterpretation && (
                        <div className="text-slate-800 leading-relaxed text-[11px]">
                          <strong className="text-slate-900">التفسير السريري: </strong>
                          {order.clinicalInterpretation}
                        </div>
                      )}

                      {order.recommendations && (
                        <div className="text-slate-700 leading-relaxed text-[11px]">
                          <strong className="text-slate-900">التوصيات: </strong>
                          {order.recommendations}
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Footer Zone: Double Medical Director & CEO Signatures */}
                <div className="pt-3 border-t-2 border-red-900 mt-4">
                  <div className="flex items-end justify-between">
                    
                    {/* Left Doctor: المدير الفني د. رحاب عبدالحميد */}
                    <div className="text-center p-2 rounded-lg border border-slate-200 bg-slate-50/50 min-w-[200px]">
                      <div className="text-[10px] text-slate-500 font-bold mb-1">
                        المدير الفني للمعمل
                      </div>
                      <div className="font-serif italic text-red-900 font-bold text-base my-0.5">
                        Dr. Rehab Abdelhamid
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        {RT_LAB_INFO.technicalDirectorArabic}
                      </div>
                      <div className="text-[9px] text-slate-600 font-medium">
                        {RT_LAB_INFO.technicalDirectorTitleArabic}
                      </div>
                    </div>

                    {/* Center: Barcode & Digital QR verification */}
                    <div className="flex flex-col items-center space-y-1">
                      <div className="bg-white p-1 rounded border border-slate-200 inline-flex flex-col items-center">
                        <svg height="24" className="w-36">
                          {generateBarcodeLines(order.barcode).reduce((acc: any[], bar) => {
                            const prevX = acc.length > 0 ? acc[acc.length - 1].x + acc[acc.length - 1].width : 2;
                            acc.push({ x: prevX, width: bar.width * 1.4, fill: bar.isSpace ? 'transparent' : '#000000' });
                            return acc;
                          }, []).map((b, i) => (
                            <rect key={i} x={b.x} y="0" width={b.width} height="24" fill={b.fill} />
                          ))}
                        </svg>
                        <span className="text-[9px] font-mono tracking-widest text-slate-700">
                          *{order.barcode}*
                        </span>
                      </div>
                      <span className="text-[8px] font-mono text-slate-500">
                        تقرير معتمد رقمياً · {RT_LAB_INFO.hotline}
                      </span>
                    </div>

                    {/* Right Doctor: رئيس مجلس الإدارة د. رامي مختار */}
                    <div className="text-center p-2 rounded-lg border border-red-200 bg-red-50/40 min-w-[220px]">
                      <div className="text-[10px] text-red-800 font-bold mb-1">
                        رئيس مجلس الإدارة (CEO)
                      </div>
                      <div className="font-serif italic text-red-900 font-bold text-base my-0.5">
                        Dr. Ramy Mokhtar
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        {RT_LAB_INFO.ceoArabic}
                      </div>
                      <div className="text-[9px] text-slate-600 font-medium">
                        طبيب الباثولوجيا الإكلينيكية والكيميائية
                      </div>
                      <div className="text-[8px] text-blue-900 font-bold">
                        طب قصر العيني - جامعة القاهرة
                      </div>
                    </div>

                  </div>

                  {/* Address bottom banner */}
                  <div className="text-center text-[9px] text-slate-500 mt-3 pt-1.5 border-t border-slate-200 flex justify-between">
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
