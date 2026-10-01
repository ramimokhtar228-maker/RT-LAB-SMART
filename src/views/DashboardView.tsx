import React from 'react';
import { Order, Booking } from '../types/lis';
import { RT_LAB_INFO } from '../data/labInfo';
import { 
  Users, 
  TestTube, 
  Microscope, 
  FileCheck2, 
  DollarSign, 
  AlertOctagon, 
  ArrowLeft, 
  ArrowRight,
  PlusCircle, 
  FileSpreadsheet, 
  Barcode, 
  Printer, 
  Sparkles,
  CalendarCheck,
  CheckCircle2,
  TrendingUp,
  Clock
} from 'lucide-react';

interface DashboardViewProps {
  orders: Order[];
  bookings: Booking[];
  onNavigate: (tab: any) => void;
  onOpenNewOrder: () => void;
  onOpenPrintReport: (order: Order) => void;
  onOpenBarcode: (order: Order) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  orders,
  bookings,
  onNavigate,
  onOpenNewOrder,
  onOpenPrintReport,
  onOpenBarcode
}) => {
  // Compute operational indicators
  const totalOrders = orders.length;
  const waitingCollectionCount = orders.filter(o => o.specimenStatus === 'Waiting Collection').length;
  const collectedCount = orders.filter(o => o.specimenStatus === 'Collected').length;
  const inProcessingCount = orders.filter(o => o.specimenStatus === 'In Processing').length;
  const approvedReportsCount = orders.filter(o => o.reportStatus === 'Approved').length;
  const criticalCount = orders.filter(o => o.hasCriticalValue || o.reportStatus === 'Critical Alert').length;

  const totalRevenue = orders.reduce((sum, o) => sum + o.paidAmount, 0);
  const totalRemaining = orders.reduce((sum, o) => sum + o.remainingAmount, 0);

  const pendingBookingsCount = bookings.filter(b => b.status === 'Pending').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Hero with RT LAB branding & today's brief */}
      <div className="bg-gradient-to-l from-rose-950 via-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-rose-900/40 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 text-xs text-rose-200 font-semibold mb-3 border border-rose-800/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{RT_LAB_INFO.nameArabic}</span>
              <span aria-hidden="true">·</span>
              <span>غرفة العمليات المركزية</span>
            </div>
            
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white mb-2">
              لوحة تحكم معامل RT - إدارة المختبر الطبي الذكي LIS
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              متابعة شاملة لسير العمل المخبري من لحظة استقبال وتسجيل المريض، سحب العينات، المعالجة الآلية على أجهزة التحاليل، حتى الاعتماد الطبي النهائي وإصدار التقارير المعتمدة.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenNewOrder}
                className="flex items-center gap-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إنشاء طلب فحص جديد (New Order)</span>
              </button>

              <button
                onClick={() => onNavigate('worklist')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-4 py-2.5 rounded-lg border border-white/15 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-sky-400" />
                <span>قائمة العمل (Worklist)</span>
              </button>

              <button
                onClick={() => onNavigate('bookings')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-4 py-2.5 rounded-lg border border-white/15 transition-colors cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4 text-amber-400" />
                <span>حجوزات الزيارات المنزلية ({pendingBookingsCount})</span>
              </button>
            </div>
          </div>

          {/* Brand Logo Presentation Box */}
          <div className="shrink-0 flex items-center gap-4 bg-black/40 border border-rose-900/50 p-4 rounded-xl shadow-lg backdrop-blur-xs">
            <img 
              src={RT_LAB_INFO.logoUrl} 
              alt="معامل رامي مختار RT LAB" 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-contain shadow-md border border-rose-900/40 p-1 bg-black/80"
              referrerPolicy="no-referrer"
            />
            <div className="text-right">
              <div className="text-sm font-extrabold text-white">معامل رامي مختار</div>
              <div className="text-xs font-mono font-bold text-rose-400 tracking-wider">RT LAB LABORATORIES</div>
              <div className="text-[11px] text-slate-400 mt-1">فرع بهتيم المركزي وفرع الشارع الجديد</div>
              <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>النظام جاهز ومفعل للعمل اللحظي</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Operational Indicators: Section 1 Metrics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span>مؤشرات التشغيل اليومية (Daily Operations KPIs)</span>
            <span className="text-xs font-normal text-slate-500">· تحديث لحظي مباشر</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Card 1: Total Orders */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>إجمالي الطلبات</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {totalOrders}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              كل الحالات المسجلة
            </div>
          </div>

          {/* Card 2: Waiting Collection */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>بانتظار السحب</span>
              <TestTube className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
              {waitingCollectionCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              عينات لم يتم سحبها
            </div>
          </div>

          {/* Card 3: In Processing */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>قيد الفحص المخبري</span>
              <Microscope className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-indigo-600 tabular-nums">
              {inProcessingCount + collectedCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              على الأجهزة / قيد النتائج
            </div>
          </div>

          {/* Card 4: Approved Reports */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>تقارير معتمدة</span>
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
              {approvedReportsCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              جاهزة للتسليم والطباعة
            </div>
          </div>

          {/* Card 5: Critical Alert Values */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>قيم حرجة (Panic)</span>
              <AlertOctagon className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-rose-600 tabular-nums">
              {criticalCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              تتطلب إبلاغ عاجل للطبيب
            </div>
          </div>

          {/* Card 6: Treasury Revenue */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>إيرادات الخزينة</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
              {totalRevenue.toLocaleString()} <span className="text-xs font-normal font-sans">ج.م</span>
            </div>
            <div className="text-[11px] text-amber-700 mt-1 font-mono">
              متبقي: {totalRemaining} ج.م
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Workflow Chain (سير العمل: استقبال -> سحب -> معالجة -> اعتماد -> إصدار) */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              سير العمل المخبري المباشر (Laboratory Workflow Stages)
            </h3>
            <p className="text-xs text-slate-500">
              مسار العينة والطلب من لحظة التسجيل وحتى تسليم التقرير النهائي
            </p>
          </div>
          <button
            onClick={() => onNavigate('workflow')}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
          >
            عرض الشرح التفصيلي لجميع المراحل الـ 17 ←
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 relative">
          
          {/* Step 1 */}
          <div 
            onClick={() => onNavigate('orders')}
            className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 hover:bg-blue-100/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-blue-900">1. استقبال الطلب</span>
              <span className="text-[10px] font-mono bg-blue-200 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                {totalOrders}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              تسجيل المريض، اختيار التحاليل أو الباقات، وتحديد الأنابيب المطلوبة.
            </p>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => onNavigate('orders')}
            className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 hover:bg-amber-100/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-amber-900">2. سحب العينة</span>
              <span className="text-[10px] font-mono bg-amber-200 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                {waitingCollectionCount}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              فحص شروط الصيام، سحب الأنابيب، طباعة ملصق الباركود ولصقه.
            </p>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => onNavigate('worklist')}
            className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-200 hover:bg-indigo-100/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-indigo-900">3. المعالجة المخبرية</span>
              <span className="text-[10px] font-mono bg-indigo-200 text-indigo-800 px-1.5 py-0.2 rounded font-bold">
                {inProcessingCount + collectedCount}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              إدخال العينات على أجهزة السيسماكس والروش، ومراجعة النتائج كمسودة.
            </p>
          </div>

          {/* Step 4 */}
          <div 
            onClick={() => onNavigate('flags')}
            className="p-3 rounded-lg bg-purple-50/60 border border-purple-200 hover:bg-purple-100/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-purple-900">4. الاعتماد الطبي</span>
              <span className="text-[10px] font-mono bg-purple-200 text-purple-800 px-1.5 py-0.2 rounded font-bold">
                دكتور
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              فحص دلتا تشيك Delta Check، مراجعة القيم الحرجة، والتفسير السريري.
            </p>
          </div>

          {/* Step 5 */}
          <div 
            onClick={() => onNavigate('reports')}
            className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 hover:bg-emerald-100/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-emerald-900">5. إصدار التقرير</span>
              <span className="text-[10px] font-mono bg-emerald-200 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                {approvedReportsCount}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              طباعة التقرير الرسمي بلوجو وتوقيع المعمل، أو إرساله عبر WhatsApp.
            </p>
          </div>

        </div>
      </div>

      {/* Two columns: Recent Orders & Quick Actions / Tech Note */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">أحدث الطلبات والفحوصات المسجلة</h3>
              <p className="text-xs text-slate-500">متابعة حالة العينات وإجراءات الطباعة السريعة</p>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              عرض جميع الطلبات ({orders.length}) ←
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">رقم الطلب / الباركود</th>
                  <th className="py-2.5 px-3">المريض</th>
                  <th className="py-2.5 px-3">التحاليل</th>
                  <th className="py-2.5 px-3">حالة العينة</th>
                  <th className="py-2.5 px-3">التقرير</th>
                  <th className="py-2.5 px-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-mono font-bold text-slate-900">{order.orderNumber}</div>
                      <div className="font-mono text-[10px] text-slate-400">{order.barcode}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800">{order.patientName}</div>
                      <div className="text-[11px] text-slate-400">
                        {order.patientAge} {order.patientAgeUnit === 'Years' ? 'سنة' : 'شهر'} · {order.patientGender === 'Male' ? 'ذكر' : 'أنثى'}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        {order.testIds.length} تحاليل
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded ${
                        order.specimenStatus === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : order.specimenStatus === 'In Processing'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {order.specimenStatus === 'Completed' ? 'تم الفحص' :
                         order.specimenStatus === 'In Processing' ? 'قيد الفحص' :
                         order.specimenStatus === 'Collected' ? 'تم السحب' : 'بانتظار السحب'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {order.reportStatus === 'Approved' ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" />
                          معتمد
                        </span>
                      ) : order.reportStatus === 'Critical Alert' ? (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 flex items-center gap-1 w-fit animate-pulse">
                          <AlertOctagon className="w-3 h-3" />
                          قيمة حرجة
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          قيد الإعداد
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onOpenBarcode(order)}
                          title="طباعة باركود العينة"
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                        >
                          <Barcode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenPrintReport(order)}
                          title="معاينة وطباعة التقرير الطبي"
                          className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & Technical Note from Doc */}
        <div className="space-y-4">
          
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              الإجراءات السريعة (Quick Actions)
            </h3>
            <div className="space-y-2">
              <button
                onClick={onOpenNewOrder}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-blue-50 text-blue-900 hover:bg-blue-100 transition-colors text-xs font-semibold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-blue-600" />
                  <span>إنشاء طلب فحص جديد (New Order)</span>
                </div>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('worklist')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-indigo-50 text-indigo-900 hover:bg-indigo-100 transition-colors text-xs font-semibold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                  <span>قائمة العمل وإدخال النتائج (Worklist)</span>
                </div>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('smart-reports')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-purple-50 text-purple-900 hover:bg-purple-100 transition-colors text-xs font-semibold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>التقارير الذكية والتفسير السريري</span>
                </div>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('devices')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition-colors text-xs font-semibold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Microscope className="w-4 h-4 text-emerald-600" />
                  <span>مزامنة نتائج أجهزة المعمل (ASTM/HL7)</span>
                </div>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Technical Note from PDF Page 1 & 2 */}
          <div className="bg-slate-900 text-slate-200 rounded-xl p-4 border border-slate-800 text-xs leading-relaxed">
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-1.5">
              <span>ملاحظة تقنية موثقة من ملف النظام</span>
            </div>
            <p className="text-slate-300 text-[11px] mb-2">
              تعتمد هذه النسخة من LIS على واجهة React سريعة مع تخزين محلي متكامل localStorage، ومجهزة بجميع الجداول ونماذج البيانات للربط السحابي مع PostgreSQL / Supabase Realtime عند تفعيل الربط المركزي للربط بين الفروع المتعددة.
            </p>
            <button
              onClick={() => onNavigate('architecture')}
              className="text-sky-400 hover:text-sky-300 font-semibold text-[11px] underline cursor-pointer"
            >
              مراجعة مخطط المعمارية وقواعد الأمان RLS ←
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
