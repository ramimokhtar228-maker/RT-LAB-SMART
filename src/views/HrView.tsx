import React, { useState } from 'react';
import { Employee } from '../types/lis';
import { RT_LAB_INFO } from '../data/labInfo';
import { 
  UserCog, 
  Search, 
  Plus, 
  Printer, 
  DollarSign, 
  Calendar, 
  Phone, 
  Clock, 
  FileText, 
  CheckCircle,
  X,
  Edit,
  Trash2
} from 'lucide-react';

interface HrViewProps {
  employees: Employee[];
  onSaveEmployee: (employee: Employee) => void;
  onDeleteEmployee?: (empId: string) => void;
}

export const HrView: React.FC<HrViewProps> = ({
  employees,
  onSaveEmployee,
  onDeleteEmployee
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayslipEmployee, setSelectedPayslipEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Partial<Employee> | null>(null);

  const calculateNetSalary = (emp: Employee) => {
    const overtimeRate = (emp.basicSalary / (emp.attendanceDays || 26) / 8) * 1.5;
    const overtimePay = Math.round(emp.overtimeHours * overtimeRate);
    const dayRate = emp.basicSalary / 26;
    const absenceDeduction = Math.round(emp.absenceDays * dayRate);

    return emp.basicSalary + emp.incentives + overtimePay - emp.deductions - absenceDeduction;
  };

  const handleOpenAdd = () => {
    setEditingEmp({
      id: 'emp-' + Date.now(),
      name: '',
      jobTitle: 'أخصائي تحاليل طبية',
      nationalId: '',
      phone: '',
      shift: 'Morning',
      basicSalary: 8000,
      incentives: 1500,
      deductions: 0,
      overtimeHours: 0,
      attendanceDays: 26,
      absenceDays: 0,
      joinedDate: new Date().toISOString().substring(0, 10),
      role: 'Technologist'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmp({ ...emp });
    setIsModalOpen(true);
  };

  const handleDelete = (emp: Employee) => {
    if (confirm(`هل أنت متأكد من الحذف النهائي لملف الموظف (${emp.name} - ${emp.jobTitle})؟\nسيتم حذفه من سجل الرواتب وسينعكس ذلك على باقي الأجهزة فوراً.`)) {
      if (onDeleteEmployee) {
        onDeleteEmployee(emp.id);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmp || !editingEmp.name || !editingEmp.jobTitle) return;
    onSaveEmployee(editingEmp as Employee);
    setIsModalOpen(false);
  };

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.phone.includes(searchQuery)
  );

  const totalPayroll = employees.reduce((sum, e) => sum + calculateNetSalary(e), 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-800 mb-1">
            <UserCog className="w-4 h-4" />
            <span>إدارة الموارد البشرية وشؤون العاملين (Section 16: HR & Payroll Engine)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            سجل الموظفين، الرواتب، النوبتجيات، وكشوف المرتبات (Payslips)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            حساب الرواتب الأساسية، الساعات الإضافية، الحوافز، الخصومات وأيام الغياب، مع طباعة كشف مفردات المرتب.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-rose-900 hover:bg-rose-950 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة موظف جديد (Add Employee)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 mb-1">إجمالي العاملين بالمعمل</div>
          <div className="text-2xl font-bold font-mono text-slate-900">{employees.length} موظف</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 mb-1">إجمالي فاتورة الرواتب الشهرية</div>
          <div className="text-2xl font-bold font-mono text-rose-950">{totalPayroll.toLocaleString()} ج.م</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 mb-1">المدير الفني المعتمد</div>
          <div className="text-sm font-bold text-blue-900">{RT_LAB_INFO.technicalDirectorArabic}</div>
          <div className="text-[10px] text-slate-500">{RT_LAB_INFO.technicalDirectorTitleArabic}</div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="بحث بالاسم، الوظيفة، أو الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-9 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">الموظف / الوظيفة</th>
                <th className="py-3 px-4">النوبة / الحضور</th>
                <th className="py-3 px-4">الراتب الأساسي</th>
                <th className="py-3 px-4">الحوافز والإضافي</th>
                <th className="py-3 px-4">الاستقطاعات والغياب</th>
                <th className="py-3 px-4">صافي الراتب المستحق</th>
                <th className="py-3 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map(emp => {
                const netSalary = calculateNetSalary(emp);

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{emp.name}</div>
                      <div className="text-[11px] text-slate-500">{emp.jobTitle} · <span className="font-mono">{emp.phone}</span></div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                        {emp.shift === 'Morning' ? 'صباحي' : emp.shift === 'Evening' ? 'مسائي' : 'دوام كامل'}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        {emp.attendanceDays} يوم حضور
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {emp.basicSalary.toLocaleString()} ج.م
                    </td>

                    <td className="py-3 px-4 font-mono text-emerald-700">
                      +{emp.incentives} ج.م ({emp.overtimeHours} س إضافي)
                    </td>

                    <td className="py-3 px-4 font-mono text-rose-700">
                      -{emp.deductions} ج.م ({emp.absenceDays} أيام غياب)
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 text-sm bg-emerald-50 text-emerald-800 px-2 py-1 rounded border border-emerald-200">
                        {netSalary.toLocaleString()} ج.م
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedPayslipEmployee(emp)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs font-semibold cursor-pointer transition-colors"
                          title="عرض وطباعة مفردات المرتب"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Payslip</span>
                        </button>

                        <button
                          onClick={() => handleOpenEdit(emp)}
                          className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded border border-slate-200 cursor-pointer transition-colors"
                          title="تعديل بيانات الموظف"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(emp)}
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded border border-slate-200 cursor-pointer transition-colors"
                          title="حذف نهائي للموظف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Modal */}
      {selectedPayslipEmployee && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl text-xs space-y-4 text-right">
            
            <div className="flex items-center justify-between pb-3 border-b-2 border-rose-900">
              <div className="flex items-center gap-2">
                <img 
                  src={RT_LAB_INFO.logoUrl} 
                  alt="RT LAB" 
                  className="w-10 h-10 object-contain rounded"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-sm font-extrabold text-rose-950">
                    كشف مفردات المرتب الشهري (Monthly Payslip)
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono">
                    معامل رامي مختار RT LAB · قسم الحسابات والموارد البشرية
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedPayslipEmployee(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Employee Info Header */}
            <div className="bg-slate-50 p-3 rounded-lg grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">اسم الموظف:</span>
                <strong className="text-slate-900">{selectedPayslipEmployee.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">الوظيفة:</span>
                <span className="font-semibold text-slate-800">{selectedPayslipEmployee.jobTitle}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">الرقم القومي:</span>
                <span className="font-mono text-slate-700">{selectedPayslipEmployee.nationalId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">نوبة العمل:</span>
                <span className="text-slate-700">{selectedPayslipEmployee.shift}</span>
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-100 font-bold p-2 text-slate-800">
                بنود الاستحقاقات والاستقطاعات
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">الراتب الأساسي:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedPayslipEmployee.basicSalary.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>حوافز وبدلات إنتاج:</span>
                  <span className="font-mono font-bold">+{selectedPayslipEmployee.incentives.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>ساعات عمل إضافية ({selectedPayslipEmployee.overtimeHours} ساعة):</span>
                  <span className="font-mono font-bold">
                    +{Math.round(selectedPayslipEmployee.overtimeHours * ((selectedPayslipEmployee.basicSalary / 26 / 8) * 1.5))} ج.م
                  </span>
                </div>
                <div className="flex justify-between text-rose-700 border-t border-slate-100 pt-2">
                  <span>استقطاعات وخصومات جزاءات:</span>
                  <span className="font-mono font-bold">-{selectedPayslipEmployee.deductions.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>خصم أيام الغياب ({selectedPayslipEmployee.absenceDays} يوم):</span>
                  <span className="font-mono font-bold">
                    -{Math.round(selectedPayslipEmployee.absenceDays * (selectedPayslipEmployee.basicSalary / 26))} ج.م
                  </span>
                </div>
              </div>

              {/* Total Net */}
              <div className="bg-rose-50/80 p-3 border-t-2 border-rose-900 flex justify-between items-center text-sm font-extrabold text-rose-950">
                <span>صافي الراتب المستحق للصرف:</span>
                <span className="font-mono text-base">{calculateNetSalary(selectedPayslipEmployee).toLocaleString()} ج.م</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[10px] text-slate-400">
                توقيع المستلم: ...............................
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-900 hover:bg-rose-950 text-white rounded-lg font-bold cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة Payslip</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Add / Edit Employee Modal */}
      {isModalOpen && editingEmp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl max-w-lg w-full p-5 border border-slate-200 shadow-xl space-y-4 text-xs text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingEmp.name ? `تعديل بيانات الموظف: ${editingEmp.name}` : 'إضافة موظف جديد إلى الكادر المخبري'}
              </h3>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم الموظف</label>
                <input
                  type="text"
                  required
                  value={editingEmp.name || ''}
                  onChange={e => setEditingEmp({ ...editingEmp, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">المسمى الوظيفي</label>
                <input
                  type="text"
                  required
                  value={editingEmp.jobTitle || ''}
                  onChange={e => setEditingEmp({ ...editingEmp, jobTitle: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">الرقم القومي</label>
                <input
                  type="text"
                  value={editingEmp.nationalId || ''}
                  onChange={e => setEditingEmp({ ...editingEmp, nationalId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  value={editingEmp.phone || ''}
                  onChange={e => setEditingEmp({ ...editingEmp, phone: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">الراتب الأساسي (ج.م)</label>
                <input
                  type="number"
                  required
                  value={editingEmp.basicSalary || 0}
                  onChange={e => setEditingEmp({ ...editingEmp, basicSalary: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">الحوافز والبدلات</label>
                <input
                  type="number"
                  value={editingEmp.incentives || 0}
                  onChange={e => setEditingEmp({ ...editingEmp, incentives: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">ساعات عمل إضافية</label>
                <input
                  type="number"
                  value={editingEmp.overtimeHours || 0}
                  onChange={e => setEditingEmp({ ...editingEmp, overtimeHours: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">أيام الغياب</label>
                <input
                  type="number"
                  value={editingEmp.absenceDays || 0}
                  onChange={e => setEditingEmp({ ...editingEmp, absenceDays: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">الاستقطاعات والخصومات</label>
                <input
                  type="number"
                  value={editingEmp.deductions || 0}
                  onChange={e => setEditingEmp({ ...editingEmp, deductions: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer font-semibold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-rose-900 hover:bg-rose-950 text-white rounded-lg cursor-pointer font-bold"
              >
                حفظ بيانات الموظف
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
