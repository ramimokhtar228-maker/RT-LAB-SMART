import React, { useState } from 'react';
import { Patient, Order } from '../types/lis';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  FileText, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldAlert, 
  HeartPulse, 
  ArrowLeft,
  ArrowUpDown,
  History,
  CheckCircle2,
  Printer,
  Trash2,
  X,
  UserPlus
} from 'lucide-react';

interface PatientsViewProps {
  patients: Patient[];
  orders: Order[];
  onSavePatient: (patient: Patient) => void;
  onOpenNewOrderForPatient: (patient: Patient) => void;
  onOpenPrintReport: (order: Order) => void;
  onDeletePatient?: (patientId: string) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  orders,
  onSavePatient,
  onOpenNewOrderForPatient,
  onOpenPrintReport,
  onDeletePatient
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Partial<Patient> | null>(null);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const patientOrders = orders.filter(o => o.patientId === selectedPatient?.id);

  const handleOpenAdd = () => {
    setEditingPatient({
      id: 'p-' + Date.now(),
      name: '',
      phone: '',
      gender: 'Male',
      age: 30,
      nationalId: '',
      address: '',
      notes: '',
      allergies: [],
      chronicDiseases: [],
      createdAt: new Date().toISOString().substring(0, 10)
    });
    setIsEditModalOpen(true);
  };

  const handleStartEdit = (patient: Patient) => {
    setEditingPatient({ ...patient });
    setIsEditModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient || !editingPatient.name || !editingPatient.phone) return;
    onSavePatient(editingPatient as Patient);
    setSelectedPatientId(editingPatient.id!);
    setIsEditModalOpen(false);
    setEditingPatient(null);
  };

  const handleDelete = (patient: Patient) => {
    if (confirm(`هل أنت متأكد من الحذف النهائي لملف المريض (${patient.name})؟\nهذا الإجراء سيحذف ملف المريض وسيعكس على جميع الأجهزة فوراً.`)) {
      if (onDeletePatient) {
        onDeletePatient(patient.id);
        const remaining = patients.filter(p => p.id !== patient.id);
        if (remaining.length > 0) {
          setSelectedPatientId(remaining[0].id);
        }
      }
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    (p.nationalId && p.nationalId.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-800 mb-1">
            <Users className="w-4 h-4" />
            <span>سجل ملفات المرضى وتاريخ التحاليل (Patient Master & Longitudinal History)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            ملفات المرضى، التاريخ الطبي، ومقارنة النتائج التاريخية
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            عرض السجل الطبي الشامل، الحساسية والأمراض المزمنة، وتتبع تغير التحاليل عبر الزمن (Delta History).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة مريض جديد (Add Patient)</span>
          </button>

          {selectedPatient && (
            <button
              onClick={() => onOpenNewOrderForPatient(selectedPatient)}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء طلب فحص للمريض</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Patient Master List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[750px]">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث باسم المريض، الهاتف، الرقم القومي..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-2 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-hidden"
              />
            </div>
            <button
              onClick={handleOpenAdd}
              title="إضافة مريض جديد"
              className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredPatients.map(patient => {
              const isSelected = patient.id === selectedPatientId;
              const orderCount = orders.filter(o => o.patientId === patient.id).length;

              return (
                <button
                  key={patient.id}
                  onClick={() => {
                    setSelectedPatientId(patient.id);
                  }}
                  className={`w-full text-right p-3.5 transition-colors cursor-pointer border-r-4 ${
                    isSelected ? 'bg-rose-50/70 border-rose-900' : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">{patient.name}</span>
                    <span className="font-mono text-[11px] text-slate-500">{patient.phone}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      {patient.age} سنة · {patient.gender === 'Male' ? 'ذكر' : 'أنثى'}
                    </span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-700">
                      {orderCount} طلبات
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Patient Details & Longitudinal History on Left (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedPatient ? (
            <>
              {/* Profile Card */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
                <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{selectedPatient.name}</h2>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      كود المريض: {selectedPatient.id} · مسجل منذ: {selectedPatient.createdAt || '---'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(selectedPatient)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>تعديل البيانات</span>
                    </button>

                    <button
                      onClick={() => handleDelete(selectedPatient)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف نهائي</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">رقم الهاتف / واتساب:</span>
                    <span className="font-mono font-bold text-slate-800">{selectedPatient.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">العمر والنوع:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedPatient.age} سنة · {selectedPatient.gender === 'Male' ? 'ذكر' : 'أنثى'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">الرقم القومي:</span>
                    <span className="font-mono text-slate-700">{selectedPatient.nationalId || '---'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">العنوان:</span>
                    <span className="font-semibold text-slate-800">{selectedPatient.address || 'شبرا الخيمة'}</span>
                  </div>
                </div>

                {/* Chronic & Allergies */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  {selectedPatient.chronicDiseases && selectedPatient.chronicDiseases.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                      <HeartPulse className="w-3.5 h-3.5 text-amber-600" />
                      <span>الأمراض المزمنة: {selectedPatient.chronicDiseases.join('، ')}</span>
                    </div>
                  )}

                  {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-800 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                      <span>الحساسية: {selectedPatient.allergies.join('، ')}</span>
                    </div>
                  )}

                  {selectedPatient.notes && (
                    <div className="text-xs text-slate-500 w-full mt-1">
                      ملاحظة طبية: {selectedPatient.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Patient History: Orders & Previous Test Comparison */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-rose-900" />
                    <h3 className="text-sm font-bold text-slate-900">
                      سجل الفحوصات والطلبات السابقة للمريض
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {patientOrders.length} زيارات مسجلة
                  </span>
                </div>

                {patientOrders.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    لا توجد فحوصات سابقة لهذا المريض بعد.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {patientOrders.map(order => (
                      <div key={order.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-rose-950">{order.orderNumber}</span>
                            <span className="text-slate-400 font-mono text-[11px]">{order.createdAt}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              order.reportStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                              order.orderStatus === 'Results Entered' ? 'bg-purple-100 text-purple-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {order.reportStatus === 'Approved' ? 'معتمد' : order.orderStatus}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onOpenPrintReport(order)}
                              className="flex items-center gap-1 text-[11px] text-rose-900 hover:text-rose-950 font-bold cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>طباعة التقرير A4</span>
                            </button>
                          </div>
                        </div>

                        {/* Test results table */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-right text-[11px]">
                            <thead>
                              <tr className="text-slate-400 border-b border-slate-200/40">
                                <th className="pb-1">الفحص</th>
                                <th className="pb-1 text-center">النتيجة</th>
                                <th className="pb-1 text-center">الوحدة</th>
                                <th className="pb-1 text-center">الحالة</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/30">
                              {order.results.map((r, i) => (
                                <tr key={i}>
                                  <td className="py-1 font-medium text-slate-800">{r.testName} ({r.testCode})</td>
                                  <td className="py-1 text-center font-bold text-slate-900">{r.resultValue || '---'}</td>
                                  <td className="py-1 text-center text-slate-500">{r.unit}</td>
                                  <td className="py-1 text-center">
                                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                      r.flag === 'High' ? 'text-red-700 bg-red-50' :
                                      r.flag === 'Low' ? 'text-amber-700 bg-amber-50' : 'text-emerald-700'
                                    }`}>
                                      {r.flag}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center text-slate-400 border border-slate-200">
              قم باختيار مريض من القائمة أو إضافة مريض جديد لعرض التفاصيل
            </div>
          )}
        </div>

      </div>

      {/* Add / Edit Patient Modal */}
      {isEditModalOpen && editingPatient && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-right space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingPatient.name ? `تعديل ملف المريض: ${editingPatient.name}` : 'إضافة مريض جديد إلى قاعدة البيانات'}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الاسم بالكامل</label>
                <input
                  type="text"
                  value={editingPatient.name || ''}
                  onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
                  placeholder="مثال: أحمد محمد علي"
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف / واتساب</label>
                  <input
                    type="text"
                    value={editingPatient.phone || ''}
                    onChange={(e) => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                    placeholder="01xxxxxxxxx"
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الرقم القومي (14 رقم)</label>
                  <input
                    type="text"
                    value={editingPatient.nationalId || ''}
                    onChange={(e) => setEditingPatient({ ...editingPatient, nationalId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">العمر (بالسنوات)</label>
                  <input
                    type="number"
                    value={editingPatient.age || 30}
                    onChange={(e) => setEditingPatient({ ...editingPatient, age: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">النوع</label>
                  <select
                    value={editingPatient.gender || 'Male'}
                    onChange={(e) => setEditingPatient({ ...editingPatient, gender: e.target.value as 'Male' | 'Female' })}
                    className="w-full px-3 py-2 text-xs border rounded-lg bg-white"
                  >
                    <option value="Male">ذكر (Male)</option>
                    <option value="Female">أنثى (Female)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">العنوان</label>
                <input
                  type="text"
                  value={editingPatient.address || ''}
                  onChange={(e) => setEditingPatient({ ...editingPatient, address: e.target.value })}
                  placeholder="شبرا الخيمة - الشارع / المنطقة"
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات طبية / أمراض سابقة</label>
                <textarea
                  rows={2}
                  value={editingPatient.notes || ''}
                  onChange={(e) => setEditingPatient({ ...editingPatient, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-900 hover:bg-rose-950 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  حفظ في قاعدة البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
