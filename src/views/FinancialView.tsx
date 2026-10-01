import React, { useState } from 'react';
import { Order, Expense, PaymentMethod } from '../types/lis';
import { 
  DollarSign, 
  Search, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Smartphone, 
  Receipt, 
  Wallet, 
  Check, 
  Calendar,
  X,
  Edit,
  Trash2
} from 'lucide-react';

interface FinancialViewProps {
  orders: Order[];
  expenses: Expense[];
  onUpdateOrder: (order: Order) => void;
  onAddExpense: (expense: Expense) => void;
  onDeleteExpense?: (expId: string) => void;
  onEditExpense?: (expense: Expense) => void;
}

export const FinancialView: React.FC<FinancialViewProps> = ({
  orders,
  expenses,
  onUpdateOrder,
  onAddExpense,
  onDeleteExpense,
  onEditExpense
}) => {
  const [activeTab, setActiveTab] = useState<'revenues' | 'expenses'>('revenues');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Payment modal state
  const [payingOrder, setPayingOrder] = useState<Order | null>(null);
  const [additionalPayment, setAdditionalPayment] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Cash');

  // Expense modal state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpenseItem, setEditingExpenseItem] = useState<Expense | null>(null);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    description: '',
    category: 'Reagents & Supplies',
    amount: 500,
    recordedBy: 'المسؤول المالي',
    notes: ''
  });

  // Totals
  const totalGrossRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalDiscounts = orders.reduce((sum, o) => sum + o.discount, 0);
  const totalNetRevenue = orders.reduce((sum, o) => sum + o.netAmount, 0);
  const totalCollected = orders.reduce((sum, o) => sum + o.paidAmount, 0);
  const totalOutstanding = orders.reduce((sum, o) => sum + o.remainingAmount, 0);
  const totalExpensesAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netOperatingProfit = totalCollected - totalExpensesAmount;

  // Record payment for order
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingOrder) return;

    const newPaid = payingOrder.paidAmount + additionalPayment;
    const newRemaining = Math.max(0, payingOrder.netAmount - newPaid);

    const updated: Order = {
      ...payingOrder,
      paidAmount: newPaid,
      remainingAmount: newRemaining,
      paymentMethod: payMethod
    };

    onUpdateOrder(updated);
    setPayingOrder(null);
    setAdditionalPayment(0);
  };

  // Submit expense
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) return;

    const now = new Date();
    const formatted = now.toISOString().replace('T', ' ').substring(0, 10);

    const exp: Expense = {
      id: 'exp-' + Date.now(),
      description: newExpense.description,
      category: newExpense.category as any,
      amount: newExpense.amount,
      date: formatted,
      recordedBy: newExpense.recordedBy || 'المسؤول المالي',
      notes: newExpense.notes
    };

    onAddExpense(exp);
    setIsExpenseModalOpen(false);
    setNewExpense({
      description: '',
      category: 'Reagents & Supplies',
      amount: 500,
      recordedBy: 'المسؤول المالي',
      notes: ''
    });
  };

  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.barcode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner & KPI Cards */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
              <DollarSign className="w-4 h-4" />
              <span>الخزينة والمالية (Treasury, Financial Ledger & Expenses)</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              إدارة المقبوضات اليومية، طرق الدفع المتعددة، والمصروفات
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              تتبع التحصيل النقدي والتحويلات البنكية ومحافظ الهاتف وInstaPay والمتبقي على المرضى.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-rose-600" />
              <span>تسجيل مصروف جديد</span>
            </button>
          </div>
        </div>

        {/* Financial KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          
          <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
            <div className="text-[11px] font-bold text-emerald-800 mb-1">
              إجمالي المحصل في الخزينة
            </div>
            <div className="text-xl font-extrabold font-mono text-emerald-950">
              {totalCollected.toLocaleString()} <span className="text-xs font-sans font-normal text-emerald-700">ج.م</span>
            </div>
            <div className="text-[10px] text-emerald-700 mt-1">
              صافي المبيعات: {totalNetRevenue.toLocaleString()} ج.م
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200">
            <div className="text-[11px] font-bold text-amber-800 mb-1">
              المبالغ المتبقية (آجل / ديون)
            </div>
            <div className="text-xl font-extrabold font-mono text-amber-950">
              {totalOutstanding.toLocaleString()} <span className="text-xs font-sans font-normal text-amber-700">ج.م</span>
            </div>
            <div className="text-[10px] text-amber-700 mt-1">
              مطلوبة من المرضى عند الاستلام
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-rose-50/60 border border-rose-200">
            <div className="text-[11px] font-bold text-rose-800 mb-1">
              إجمالي المصروفات المخبرية
            </div>
            <div className="text-xl font-extrabold font-mono text-rose-950">
              {totalExpensesAmount.toLocaleString()} <span className="text-xs font-sans font-normal text-rose-700">ج.م</span>
            </div>
            <div className="text-[10px] text-rose-700 mt-1">
              كواشف، إيجار، وصيانة
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200">
            <div className="text-[11px] font-bold text-blue-800 mb-1">
              صافي الفائض التشغيلي
            </div>
            <div className="text-xl font-extrabold font-mono text-blue-950">
              {netOperatingProfit.toLocaleString()} <span className="text-xs font-sans font-normal text-blue-700">ج.م</span>
            </div>
            <div className="text-[10px] text-blue-700 mt-1">
              قبل خصم نسب الشركاء
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Switcher: Revenues vs Expenses */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('revenues')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'revenues'
              ? 'border-blue-600 text-blue-900 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          سجل المقبوضات وفواتير المرضى ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'expenses'
              ? 'border-rose-600 text-rose-900 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          سجل المصروفات وفواتير الشراء ({expenses.length})
        </button>
      </div>

      {/* Tab 1: Revenues */}
      {activeTab === 'revenues' && (
        <div className="space-y-4">
          
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="بحث برقم الطلب، الباركود، اسم المريض..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-9 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden"
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold">
                  <tr>
                    <th className="py-3 px-4">رقم الطلب / الباركود</th>
                    <th className="py-3 px-4">المريض</th>
                    <th className="py-3 px-4">الإجمالي</th>
                    <th className="py-3 px-4">الخصم</th>
                    <th className="py-3 px-4">الصافي (Net)</th>
                    <th className="py-3 px-4">المدفوع (Paid)</th>
                    <th className="py-3 px-4">المتبقي (Remaining)</th>
                    <th className="py-3 px-4">طريقة الدفع</th>
                    <th className="py-3 px-4 text-center">تحصيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-900">{order.orderNumber}</div>
                        <div className="font-mono text-[10px] text-slate-400">{order.barcode}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{order.patientName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{order.createdAt}</div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600">
                        {order.totalAmount} ج.م
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-500">
                        {order.discount > 0 ? `${order.discount} ج.م` : '---'}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {order.netAmount} ج.م
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                        {order.paidAmount} ج.م
                      </td>

                      <td className="py-3 px-4">
                        {order.remainingAmount > 0 ? (
                          <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            {order.remainingAmount} ج.م
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            خالص
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[10px]">
                          {order.paymentMethod}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        {order.remainingAmount > 0 ? (
                          <button
                            onClick={() => {
                              setPayingOrder(order);
                              setAdditionalPayment(order.remainingAmount);
                              setPayMethod(order.paymentMethod);
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold cursor-pointer shadow-2xs"
                          >
                            تحصيل دفعة
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">مكتمل السداد</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Expenses */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold">
                  <tr>
                    <th className="py-3 px-4">بيان المصروف</th>
                    <th className="py-3 px-4">التصنيف</th>
                    <th className="py-3 px-4">المبلغ</th>
                    <th className="py-3 px-4">التاريخ</th>
                    <th className="py-3 px-4">المسؤول</th>
                    <th className="py-3 px-4">الملاحظات</th>
                    <th className="py-3 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {expense.description}
                      </td>

                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                          {expense.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-rose-700 text-sm">
                        {expense.amount.toLocaleString()} ج.م
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600">
                        {expense.date}
                      </td>

                      <td className="py-3 px-4 text-slate-700">
                        {expense.recordedBy}
                      </td>

                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                        {expense.notes || '---'}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setEditingExpenseItem({ ...expense })}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded border border-slate-200 cursor-pointer"
                            title="تعديل المصروف"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من الحذف النهائي لهذا المصروف (${expense.description}) بقيمة ${expense.amount} ج.م؟`)) {
                                if (onDeleteExpense) onDeleteExpense(expense.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded border border-slate-200 cursor-pointer"
                            title="حذف نهائي للمصروف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Collect Payment Modal */}
      {payingOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleRecordPayment} className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                تسجيل دفعة نقدية للطلب: {payingOrder.orderNumber}
              </h3>
              <button 
                type="button" 
                onClick={() => setPayingOrder(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">المريض:</span>
                <span className="font-bold text-slate-800">{payingOrder.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">المبلغ الصافي:</span>
                <span className="font-mono font-bold text-slate-900">{payingOrder.netAmount} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">المسدد سابقاً:</span>
                <span className="font-mono font-bold text-emerald-700">{payingOrder.paidAmount} ج.م</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 text-rose-700 font-bold">
                <span>المبلغ المتبقي الحالي:</span>
                <span className="font-mono">{payingOrder.remainingAmount} ج.م</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">المبلغ المراد تحصيله الآن (ج.م)</label>
              <input
                type="number"
                required
                max={payingOrder.remainingAmount}
                value={additionalPayment}
                onChange={e => setAdditionalPayment(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-lg text-emerald-700"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">طريقة الدفع</label>
              <select
                value={payMethod}
                onChange={e => setPayMethod(e.target.value as PaymentMethod)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
              >
                <option value="Cash">Cash (نقدي في الخزينة)</option>
                <option value="InstaPay">InstaPay (إنستاباي فوري)</option>
                <option value="Wallet">Mobile Wallet (محفظة فودافون/أورنج/اتصالات كاش)</option>
                <option value="Card">Visa / MasterCard (بطاقة ائتمان)</option>
                <option value="Bank Transfer">Bank Transfer (تحويل بنكي)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPayingOrder(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
              >
                تأكيد واستلام النقدية
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleExpenseSubmit} className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                تسجيل إيصال مصروف جديد
              </h3>
              <button 
                type="button" 
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">بيان المصروف</label>
              <input
                type="text"
                required
                value={newExpense.description}
                onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                placeholder="شراء كواشف، صيانة جهاز، إيجار..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">المبلغ (ج.م)</label>
                <input
                  type="number"
                  required
                  value={newExpense.amount}
                  onChange={e => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">التصنيف</label>
                <select
                  value={newExpense.category}
                  onChange={e => setNewExpense({ ...newExpense, category: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                >
                  <option value="Reagents & Supplies">كواشف ومستلزمات</option>
                  <option value="Equipment Maintenance">صيانة ومعايرة أجهزة</option>
                  <option value="Rent & Utilities">إيجار وكهرباء ومياه</option>
                  <option value="Salaries & Staff">رواتب ومكافآت</option>
                  <option value="Hospitality & Logistics">ضيافة ونظافة ومهمات</option>
                  <option value="Marketing">تسويق وإعلانات</option>
                  <option value="Other">أخرى</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">المسؤول عن الصرف</label>
              <input
                type="text"
                value={newExpense.recordedBy}
                onChange={e => setNewExpense({ ...newExpense, recordedBy: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">ملاحظات / رقم الفاتورة</label>
              <textarea
                rows={2}
                value={newExpense.notes || ''}
                onChange={e => setNewExpense({ ...newExpense, notes: e.target.value })}
                placeholder="رقم الفاتورة الضريبية، جهة التوريد..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
              >
                تسجيل المصروف في الخزينة
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Expense Modal */}
      {editingExpenseItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (onEditExpense && editingExpenseItem) {
                onEditExpense(editingExpenseItem);
              }
              setEditingExpenseItem(null);
            }} 
            className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4 text-xs text-right"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                تعديل بيانات المصروف
              </h3>
              <button 
                type="button" 
                onClick={() => setEditingExpenseItem(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">بيان المصروف</label>
              <input
                type="text"
                required
                value={editingExpenseItem.description}
                onChange={e => setEditingExpenseItem({ ...editingExpenseItem, description: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">المبلغ (ج.م)</label>
                <input
                  type="number"
                  required
                  value={editingExpenseItem.amount}
                  onChange={e => setEditingExpenseItem({ ...editingExpenseItem, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-rose-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">التصنيف</label>
                <select
                  value={editingExpenseItem.category}
                  onChange={e => setEditingExpenseItem({ ...editingExpenseItem, category: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                >
                  <option value="Reagents & Supplies">كواشف ومستلزمات</option>
                  <option value="Equipment Maintenance">صيانة ومعايرة أجهزة</option>
                  <option value="Rent & Utilities">إيجار وكهرباء ومياه</option>
                  <option value="Salaries & Staff">رواتب ومكافآت</option>
                  <option value="Hospitality & Logistics">ضيافة ونظافة ومهمات</option>
                  <option value="Marketing">تسويق وإعلانات</option>
                  <option value="Other">أخرى</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">المسؤول عن الصرف</label>
              <input
                type="text"
                value={editingExpenseItem.recordedBy}
                onChange={e => setEditingExpenseItem({ ...editingExpenseItem, recordedBy: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">ملاحظات / رقم الفاتورة</label>
              <textarea
                rows={2}
                value={editingExpenseItem.notes || ''}
                onChange={e => setEditingExpenseItem({ ...editingExpenseItem, notes: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingExpenseItem(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-900 hover:bg-rose-950 text-white rounded-lg font-bold shadow-xs cursor-pointer"
              >
                حفظ التعديلات
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
