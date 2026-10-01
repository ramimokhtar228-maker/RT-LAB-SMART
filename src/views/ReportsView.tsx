import React, { useState } from 'react';
import { Order, ReportStatus } from '../types/lis';
import { 
  FileText, 
  Search, 
  Printer, 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  Download, 
  Eye, 
  Share2,
  Calendar,
  Filter
} from 'lucide-react';

interface ReportsViewProps {
  orders: Order[];
  onOpenPrintReport: (order: Order) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  orders,
  onOpenPrintReport
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ReportStatus>('All');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.patientPhone.includes(searchQuery);

    const matchesStatus = statusFilter === 'All' || o.reportStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
            <FileText className="w-4 h-4" />
            <span>سجل التقارير الطبية الرسمية (Official Medical Diagnostic Reports)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            أرشيف وتقارير نتائج الفحوصات المخبرية
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            معاينة وطباعة التقارير المعتمدة بلوجو وترخيص معامل RT، وتتبع حالات التقارير الحرجة وقيد الفحص.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
            <div className="text-[10px] text-emerald-700 font-semibold">معتمدة نهائياً</div>
            <div className="text-lg font-bold font-mono text-emerald-800">
              {orders.filter(o => o.reportStatus === 'Approved').length}
            </div>
          </div>
          <div className="px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-center">
            <div className="text-[10px] text-rose-700 font-semibold">قيم حرجة (Panic)</div>
            <div className="text-lg font-bold font-mono text-rose-800">
              {orders.filter(o => o.reportStatus === 'Critical Alert' || o.hasCriticalValue).length}
            </div>
          </div>
          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <div className="text-[10px] text-slate-600 font-semibold">إجمالي التقارير</div>
            <div className="text-lg font-bold font-mono text-slate-800">
              {orders.length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث برقم التقرير، اسم المريض، الباركود، الهاتف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
          {(['All', 'Approved', 'Critical Alert', 'In Progress'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                statusFilter === st 
                  ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'All' ? 'جميع التقارير' :
               st === 'Approved' ? 'معتمد نهائياً' :
               st === 'Critical Alert' ? 'قيمة حرجة (Panic)' : 'قيد الفحص'}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold">
              <tr>
                <th className="py-3 px-4">رقم التقرير / الباركود</th>
                <th className="py-3 px-4">المريض</th>
                <th className="py-3 px-4">العمر / النوع</th>
                <th className="py-3 px-4">الهاتف</th>
                <th className="py-3 px-4">التحاليل المشمولة</th>
                <th className="py-3 px-4">تاريخ الفحص</th>
                <th className="py-3 px-4">حالة التقرير</th>
                <th className="py-3 px-4 text-center">معاينة وطباعة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    لا توجد تقارير مطابقة للفلاتر المحددة.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900 text-sm">{order.orderNumber}</div>
                      <div className="font-mono text-[10px] text-slate-400">{order.barcode}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{order.patientName}</div>
                      <div className="text-[10px] text-slate-400">{order.referringDoctor || 'بدون تحويل'}</div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-700">
                      {order.patientAge} {order.patientAgeUnit === 'Years' ? 'سنة' : 'شهر'} · {order.patientGender === 'Male' ? 'ذكر' : 'أنثى'}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">
                      {order.patientPhone}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-800">{order.testIds.length} فحص</div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {order.results.map(r => r.testCode).join(' · ')}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">
                      {order.createdAt}
                    </td>

                    <td className="py-3 px-4">
                      {order.reportStatus === 'Approved' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          معتمد نهائياً
                        </span>
                      ) : order.reportStatus === 'Critical Alert' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                          <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                          قيمة حرجة (Panic)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          قيد الفحص
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onOpenPrintReport(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>معاينة وطباعة التقرير</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
