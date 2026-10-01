import React, { useState } from 'react';
import { Order, SpecimenStatus, Urgency } from '../types/lis';
import { 
  TestTube2, 
  Search, 
  Filter, 
  Barcode, 
  Check, 
  Play, 
  Printer, 
  FileText, 
  Clock, 
  User, 
  Stethoscope, 
  AlertTriangle,
  ArrowRightCircle,
  Plus,
  Edit,
  Trash2,
  X,
  Save
} from 'lucide-react';

interface OrdersSamplingViewProps {
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
  onOpenNewOrder: () => void;
  onOpenPrintReport: (order: Order) => void;
  onOpenBarcode: (order: Order) => void;
  onDeleteOrder?: (orderId: string) => void;
}

export const OrdersSamplingView: React.FC<OrdersSamplingViewProps> = ({
  orders,
  onUpdateOrder,
  onOpenNewOrder,
  onOpenPrintReport,
  onOpenBarcode,
  onDeleteOrder
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Waiting' | 'Processing' | 'Approved'>('All');
  const [urgencyFilter, setUrgencyFilter] = useState<'All' | Urgency>('All');
  
  // Edit modal
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Mark sample as collected
  const handleMarkCollected = (order: Order) => {
    const now = new Date();
    const formatted = now.toISOString().replace('T', ' ').substring(0, 16);
    const updated: Order = {
      ...order,
      specimenStatus: 'Collected',
      orderStatus: 'Sample Collected',
      collectedAt: formatted,
      collectedBy: 'أخصائي السحب: م. كريم حسام'
    };
    onUpdateOrder(updated);
  };

  // Move collected sample into Processing
  const handleMoveToProcessing = (order: Order) => {
    const updated: Order = {
      ...order,
      specimenStatus: 'In Processing'
    };
    onUpdateOrder(updated);
  };

  const handleDelete = (order: Order) => {
    if (confirm(`هل أنت متأكد من الحذف النهائي للطلب رقم ${order.orderNumber} الخاص بالمريض (${order.patientName})؟\nهذا الإجراء سيحذف كافة النتائج نهائياً وسيعكس على جميع الأجهزة فوراً.`)) {
      if (onDeleteOrder) {
        onDeleteOrder(order.id);
      }
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    onUpdateOrder(editingOrder);
    setEditingOrder(null);
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.patientPhone.includes(searchQuery) ||
      o.referringDoctor.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === 'Waiting') matchesStatus = o.specimenStatus === 'Waiting Collection';
    if (statusFilter === 'Processing') matchesStatus = o.specimenStatus === 'In Processing' || o.specimenStatus === 'Collected';
    if (statusFilter === 'Approved') matchesStatus = o.reportStatus === 'Approved';

    const matchesUrgency = urgencyFilter === 'All' || o.urgency === urgencyFilter;

    return matchesSearch && matchesStatus && matchesUrgency;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-800 mb-1">
            <TestTube2 className="w-4 h-4" />
            <span>محطة سحب العينات واستقبال الطلبات (Phlebotomy & Sampling Station)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            سجل طلبات الفحص وتأكيد سحب العينات
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            متابعة حالة العينات المخبرية، تسجيل وقت السحب، توليد وطباعة ملصقات الباركود، وتحويل العينات للفحص الآلي.
          </p>
        </div>

        <button
          onClick={onOpenNewOrder}
          className="flex items-center gap-2 bg-rose-900 hover:bg-rose-950 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء طلب فحص جديد (New Order)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث برقم الطلب، الباركود، اسم المريض، الهاتف، الطبيب المعالج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-800 transition-colors"
          />
        </div>

        {/* Section 3 Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                statusFilter === 'All' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الكل ({orders.length})
            </button>
            <button
              onClick={() => setStatusFilter('Waiting')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                statusFilter === 'Waiting' ? 'bg-white text-amber-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              بانتظار السحب ({orders.filter(o => o.specimenStatus === 'Waiting Collection').length})
            </button>
            <button
              onClick={() => setStatusFilter('Processing')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                statusFilter === 'Processing' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              قيد الفحص ({orders.filter(o => o.specimenStatus === 'In Processing' || o.specimenStatus === 'Collected').length})
            </button>
            <button
              onClick={() => setStatusFilter('Approved')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                statusFilter === 'Approved' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              معتمدة ({orders.filter(o => o.reportStatus === 'Approved').length})
            </button>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setUrgencyFilter('All')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${
                urgencyFilter === 'All' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setUrgencyFilter('STAT')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                urgencyFilter === 'STAT' ? 'bg-rose-600 text-white shadow-2xs' : 'text-rose-700'
              }`}
            >
              طوارئ STAT
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">رقم الطلب / الباركود</th>
                <th className="py-3 px-4">المريض</th>
                <th className="py-3 px-4">الطبيب المعالج</th>
                <th className="py-3 px-4">الفحوصات المطلوبة</th>
                <th className="py-3 px-4">الأولوية</th>
                <th className="py-3 px-4">حالة العينة</th>
                <th className="py-3 px-4">حالة الطلب</th>
                <th className="py-3 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    لا توجد طلبات فحص مطابقة لمعايير البحث الحالية
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Order Number & Barcode */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">{order.orderNumber}</div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono mt-0.5">
                        <Barcode className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.barcode}</span>
                      </div>
                    </td>

                    {/* Patient */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{order.patientName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {order.patientAge} سنة · {order.patientGender === 'Male' ? 'ذكر' : 'أنثى'} · {order.patientPhone}
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="py-3 px-4 text-slate-700">
                      <div className="flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                        <span>{order.referringDoctor || 'طبيب خارجي'}</span>
                      </div>
                    </td>

                    {/* Tests List */}
                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="font-medium text-slate-800 truncate">
                        {order.results.length} فحص مخبري
                      </div>
                      <div className="text-[10px] text-slate-500 truncate" title={order.results.map(r => r.testName).join(', ')}>
                        {order.results.map(r => r.testCode).join(' · ')}
                      </div>
                    </td>

                    {/* Urgency */}
                    <td className="py-3 px-4">
                      {order.urgency === 'STAT' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          طوارئ STAT
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                          روتيني Routine
                        </span>
                      )}
                    </td>

                    {/* Specimen Status */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.specimenStatus === 'Waiting Collection'
                            ? 'bg-amber-50 text-amber-800 border border-amber-300'
                            : order.specimenStatus === 'Collected'
                            ? 'bg-sky-50 text-sky-800 border border-sky-300'
                            : order.specimenStatus === 'In Processing'
                            ? 'bg-indigo-50 text-indigo-800 border border-indigo-300'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        }`}>
                          {order.specimenStatus === 'Waiting Collection' ? 'بانتظار السحب' :
                           order.specimenStatus === 'Collected' ? 'تم السحب' :
                           order.specimenStatus === 'In Processing' ? 'قيد الفحص' : 'مكتملة الفحص'}
                        </span>
                        {order.collectedAt && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            {order.collectedAt}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Order Status */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                        order.orderStatus === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : order.orderStatus === 'Results Entered'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : order.orderStatus === 'Sample Collected'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {order.orderStatus === 'Approved' ? 'معتمد نهائياً' :
                         order.orderStatus === 'Results Entered' ? 'تم إدخال النتائج' :
                         order.orderStatus === 'Sample Collected' ? 'تم استلام العينة' : 'قيد الانتظار'}
                      </span>
                    </td>

                    {/* Actions: Edit, Delete, Phlebotomy, Barcode, Print */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* Sample Collection Action Button */}
                        {order.specimenStatus === 'Waiting Collection' && (
                          <button
                            onClick={() => handleMarkCollected(order)}
                            title="تأكيد سحب العينة الآن"
                            className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>سحب العينة</span>
                          </button>
                        )}

                        {order.specimenStatus === 'Collected' && (
                          <button
                            onClick={() => handleMoveToProcessing(order)}
                            title="تحويل العينة لجهاز الفحص (In Processing)"
                            className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>بدء الفحص</span>
                          </button>
                        )}

                        {/* Barcode Print */}
                        <button
                          onClick={() => onOpenBarcode(order)}
                          title="طباعة ملصق الباركود للأنابيب"
                          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded border border-slate-200 transition-colors cursor-pointer"
                        >
                          <Barcode className="w-4 h-4" />
                        </button>

                        {/* Official Report Print Preview */}
                        <button
                          onClick={() => onOpenPrintReport(order)}
                          title="معاينة وحفظ PDF / طباعة التقرير الطبي A4"
                          className="p-1.5 text-slate-600 hover:text-rose-900 hover:bg-rose-50 rounded border border-slate-200 transition-colors cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Edit Order */}
                        <button
                          onClick={() => setEditingOrder({ ...order })}
                          title="تعديل بيانات الطلب"
                          className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded border border-slate-200 transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Order */}
                        <button
                          onClick={() => handleDelete(order)}
                          title="حذف نهائي للطلب"
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded border border-slate-200 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-right space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">
                تعديل بيانات الطلب: {editingOrder.orderNumber}
              </h3>
              <button onClick={() => setEditingOrder(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم المريض</label>
                <input
                  type="text"
                  value={editingOrder.patientName}
                  onChange={(e) => setEditingOrder({ ...editingOrder, patientName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">هاتف المريض</label>
                  <input
                    type="text"
                    value={editingOrder.patientPhone}
                    onChange={(e) => setEditingOrder({ ...editingOrder, patientPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الطبيب المعالج</label>
                  <input
                    type="text"
                    value={editingOrder.referringDoctor}
                    onChange={(e) => setEditingOrder({ ...editingOrder, referringDoctor: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الأولوية</label>
                  <select
                    value={editingOrder.urgency}
                    onChange={(e) => setEditingOrder({ ...editingOrder, urgency: e.target.value as Urgency })}
                    className="w-full px-3 py-2 text-xs border rounded-lg bg-white"
                  >
                    <option value="Routine">روتيني Routine</option>
                    <option value="STAT">طوارئ STAT عاجل</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">حالة العينة</label>
                  <select
                    value={editingOrder.specimenStatus}
                    onChange={(e) => setEditingOrder({ ...editingOrder, specimenStatus: e.target.value as SpecimenStatus })}
                    className="w-full px-3 py-2 text-xs border rounded-lg bg-white"
                  >
                    <option value="Waiting Collection">بانتظار السحب</option>
                    <option value="Collected">تم السحب</option>
                    <option value="In Processing">قيد الفحص</option>
                    <option value="Completed">مكتملة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات إكلينيكية</label>
                <textarea
                  rows={2}
                  value={editingOrder.clinicalNotes || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, clinicalNotes: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-900 hover:bg-rose-950 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
