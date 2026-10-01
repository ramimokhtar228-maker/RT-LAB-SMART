import React, { useState } from 'react';
import { Order } from '../types/lis';
import { RT_LAB_INFO } from '../data/labInfo';
import { 
  Sparkles, 
  Search, 
  Printer, 
  Send, 
  FileCheck2, 
  AlertTriangle, 
  MessageSquare, 
  Download,
  Copy,
  Check
} from 'lucide-react';

interface SmartReportsViewProps {
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
  onOpenPrintReport: (order: Order) => void;
}

export const SmartReportsView: React.FC<SmartReportsViewProps> = ({
  orders,
  onUpdateOrder,
  onOpenPrintReport
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedWA, setCopiedWA] = useState(false);

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  const [summary, setSummary] = useState(selectedOrder?.clinicalInterpretation || '');
  const [comments, setComments] = useState(selectedOrder?.clinicalComment || '');
  const [recommendations, setRecommendations] = useState(selectedOrder?.recommendations || '');

  const handleSelectOrder = (o: Order) => {
    setSelectedOrderId(o.id);
    setSummary(o.clinicalInterpretation || '');
    setComments(o.clinicalComment || '');
    setRecommendations(o.recommendations || '');
    setCopiedWA(false);
  };

  const handleSaveSmartNotes = () => {
    if (!selectedOrder) return;
    const updated: Order = {
      ...selectedOrder,
      clinicalInterpretation: summary,
      clinicalComment: comments,
      recommendations: recommendations
    };
    onUpdateOrder(updated);
    alert('تم حفظ التحليل والملخص السريري بنجاح في التقرير الطبي.');
  };

  // Auto-generate smart medical summary based on tests and flags
  const handleAutoSynthesize = () => {
    if (!selectedOrder) return;
    const abnormal = selectedOrder.results.filter(r => r.flag !== 'Normal');
    const normal = selectedOrder.results.filter(r => r.flag === 'Normal');

    let genSummary = '';
    let genComments = '';
    let genRecs = '';

    if (abnormal.length === 0) {
      genSummary = `جميع الفحوصات المخبرية للمريض/ة ${selectedOrder.patientName} تقع ضمن المعدلات الطبيعية والفسيولوجية المعتمدة لعمره وجنسه.`;
      genComments = `لا توجد أي علامات التهابية أو اضطرابات بيوكيميائية واضحة في عينة اليوم.`;
      genRecs = `يوصى بالفحص الدوري الروتيني سنوياً للحفاظ على المؤشرات الحيوية الصحية.`;
    } else {
      const highTests = abnormal.filter(r => r.flag === 'High').map(r => r.testName);
      const lowTests = abnormal.filter(r => r.flag === 'Low').map(r => r.testName);
      const criticalTests = abnormal.filter(r => r.flag === 'Critical/Panic').map(r => `${r.testName} (${r.resultValue})`);

      genSummary = `أظهرت الفحوصات المخبرية وجود حيود عن المعدلات الطبيعية في ${abnormal.length} فحص. ` +
        (criticalTests.length > 0 ? `🚨 تنبيه لقيم حرجة في: ${criticalTests.join('، ')}. ` : '') +
        (highTests.length > 0 ? `ارتفاع في مستويات: ${highTests.join('، ')}. ` : '') +
        (lowTests.length > 0 ? `انخفاض في مستويات: ${lowTests.join('، ')}. ` : '');

      genComments = `يرجى الربط السريري بين النتائج والأعراض السريرية للمريض وتاريخه الدوائي. ` +
        `الفحوصات الطبيعية الأخرى (${normal.map(n => n.testCode).join(', ')}) تشير إلى استقرار بقية المؤشرات.`;

      genRecs = `يوصى بمراجعة الطبيب المعالج ${selectedOrder.referringDoctor || 'المختص'} لتقييم النتائج، ` +
        `مع إعادة تقييم الفحوصات غير المنضبطة بعد انتهاء الخطة العلاجية المقررة.`;
    }

    setSummary(genSummary);
    setComments(genComments);
    setRecommendations(genRecs);
  };

  // WhatsApp Message
  const getWhatsAppMessage = () => {
    if (!selectedOrder) return '';
    return `مرحباً بك أستاذ/ة ${selectedOrder.patientName}،
يسر معامل RT للتحاليل الطبية إبلاغكم بأن نتائج تحاليلكم جاهزة ومعتمدة طبياً.
🔬 رقم التقرير: ${selectedOrder.orderNumber}
📋 التحاليل المنجزة: ${selectedOrder.results.map(r => r.testCode).join(' · ')}
👨‍⚕️ الاستشاري المعتمد: ${selectedOrder.approvedBy || RT_LAB_INFO.medicalDirectorArabic}
🔗 رابط تحميل التقرير الرسمي: ${RT_LAB_INFO.website}/portal/report?id=${selectedOrder.orderNumber}
للاستفسار: 19875 | واتساب: ${RT_LAB_INFO.homeVisitPhone}
معامل RT - دقة في التشخيص.. ثقة في النتائج`;
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(getWhatsAppMessage());
    setCopiedWA(true);
    setTimeout(() => setCopiedWA(false), 2500);
  };

  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.barcode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>محرك التقارير الذكية (Smart Reports Engine)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            توليد التحليل السريري الذكي وإرسال النتائج عبر WhatsApp
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            صياغة الملخص السريري التلقائي بناءً على المعدلات المرجعية، وتجهيز رسائل التقرير للمريض والأطباء.
          </p>
        </div>

        {selectedOrder && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoSynthesize}
              className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>توليد الملخص الطبي الذكي تلقائياً</span>
            </button>

            <button
              onClick={() => onOpenPrintReport(selectedOrder)}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>معاينة وطباعة التقرير</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Selector on Right (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[700px]">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث عن تقرير مريض..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-2 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredOrders.map(order => {
              const isSelected = order.id === selectedOrderId;
              const abnormalCount = order.results.filter(r => r.flag !== 'Normal').length;

              return (
                <button
                  key={order.id}
                  onClick={() => handleSelectOrder(order)}
                  className={`w-full text-right p-3.5 transition-colors cursor-pointer border-r-4 ${
                    isSelected ? 'bg-purple-50/80 border-purple-600' : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-xs text-slate-900">{order.orderNumber}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                      order.reportStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                      order.reportStatus === 'Critical Alert' ? 'bg-rose-100 text-rose-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {order.reportStatus === 'Approved' ? 'معتمد' :
                       order.reportStatus === 'Critical Alert' ? 'قيمة حرجة' : 'قيد الإعداد'}
                    </span>
                  </div>

                  <div className="font-bold text-xs text-slate-800 truncate">{order.patientName}</div>
                  
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>{order.results.length} فحص</span>
                    {abnormalCount > 0 && (
                      <span className="text-amber-600 font-bold">
                        {abnormalCount} فحص خارج المعدل
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content on Left (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedOrder ? (
            <>
              {/* Summary and synthesis */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      تقرير الحالة السريري للمريض: {selectedOrder.patientName}
                    </h3>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      رقم الطلب: {selectedOrder.orderNumber} · العمر: {selectedOrder.patientAge} سنة
                    </div>
                  </div>

                  <button
                    onClick={handleAutoSynthesize}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>توليد تلقائي ذكي</span>
                  </button>
                </div>

                {/* Section 1: Summary */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    1. ملخص الحالة السريري (Clinical Summary)
                  </label>
                  <textarea
                    rows={3}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="ملخص الحالة العام وربط الفحوصات المخبرية..."
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                {/* Section 2: Clinical Comments */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    2. التفسير والملاحظات المخبرية (Interpretation & Comments)
                  </label>
                  <textarea
                    rows={3}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="الملاحظات السريرية والفروق المعيارية..."
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                {/* Section 3: Recommendations */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    3. التوصيات الطبية والمتابعة (Recommendations)
                  </label>
                  <textarea
                    rows={3}
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    placeholder="التوصيات الموجهة للطبيب المعالج والمريض..."
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={handleSaveSmartNotes}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                  >
                    حفظ التفسير في التقرير الطبي
                  </button>
                </div>
              </div>

              {/* WhatsApp Notification Center */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold text-slate-900">
                      قالب رسالة WhatsApp المعتمدة لتسليم التقرير
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    الهاتف: {selectedOrder.patientPhone}
                  </span>
                </div>

                <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3 text-xs leading-relaxed font-sans whitespace-pre-wrap text-slate-800">
                  {getWhatsAppMessage()}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={handleCopyWhatsApp}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    {copiedWA ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedWA ? 'تم النسخ' : 'نسخ الرسالة'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const text = encodeURIComponent(getWhatsAppMessage());
                      const phoneClean = selectedOrder.patientPhone.replace(/[^0-9]/g, '');
                      const intlPhone = phoneClean.startsWith('0') ? '2' + phoneClean : phoneClean;
                      window.open(`https://api.whatsapp.com/send?phone=${intlPhone}&text=${text}`, '_blank');
                    }}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال فوري إلى WhatsApp المريض</span>
                  </button>
                </div>
              </div>

            </>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center text-slate-400">
              اختر طلباً لعرض وإنشاء التقرير الذكي.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
