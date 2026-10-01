import React, { useState } from 'react';
import { Order, Expense, AuditLog } from '../types/lis';
import { StorageService } from '../services/storage';
import { RT_LAB_INFO } from '../data/labInfo';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  DollarSign, 
  PieChart, 
  History, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  KeyRound
} from 'lucide-react';

interface CeoShareViewProps {
  orders: Order[];
  expenses: Expense[];
  auditLogs: AuditLog[];
  onRefresh: () => void;
}

export const CeoShareView: React.FC<CeoShareViewProps> = ({
  orders,
  expenses,
  auditLogs,
  onRefresh
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [ceoSharePct, setCeoSharePct] = useState<number>(StorageService.getCeoSharePercentage());
  const [newPin, setNewPin] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);

  // Financial calculations
  const totalCollected = orders.reduce((sum, o) => sum + o.paidAmount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = Math.max(0, totalCollected - totalExpenses);

  const labSharePct = 100 - ceoSharePct;
  const ceoAmount = (netProfit * ceoSharePct) / 100;
  const labAmount = (netProfit * labSharePct) / 100;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = StorageService.getCeoPin();
    if (pinInput === correctPin) {
      setIsUnlocked(true);
      setPinError(false);
      StorageService.addAuditLog('تسجيل دخول ناجح إلى قسم الإدارة CEO', 'تم فتح لوحة الشركاء بنجاح', 'Financial');
    } else {
      setPinError(true);
      StorageService.addAuditLog('محاولة فاشلة لفتح قسم الإدارة CEO', `إدخال رمز PIN خاطئ: ${pinInput}`, 'Financial');
    }
  };

  const handleSavePercentages = () => {
    StorageService.setCeoSharePercentage(ceoSharePct);
    alert('تم حفظ وتحديث نسب توزيع الأرباح بنجاح وتوثيق التعديل في سجل الرقابة.');
    onRefresh();
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      alert('يجب أن يتكون رمز الأمان من 4 أرقام على الأقل.');
      return;
    }
    StorageService.setCeoPin(newPin);
    setIsChangingPin(false);
    setNewPin('');
    alert('تم تحديث رمز الأمان PIN بنجاح.');
    onRefresh();
  };

  // Locked Gate Screen
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center space-y-5 text-right">
        <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            منطقة الإدارة العليا والشركاء (CEO / Lab Share)
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            هذا القسم محمي برمز أمان مشفر وتدقيق أمني (Audit Log). يرجى إدخال رمز الأمان PIN للمتابعة. (الرمز الافتراضي: 7777).
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <input
              type="password"
              maxLength={8}
              autoFocus
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder="••••"
              className="w-full text-center tracking-widest text-2xl font-mono py-3 px-4 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-purple-600 focus:bg-white transition-colors"
            />
            {pinError && (
              <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>رمز الأمان PIN غير صحيح. يرجى المحاولة مرة أخرى.</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>تسجيل الدخول وفك القفل</span>
          </button>
        </form>

        <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
          معامل RT · نظام الرقابة الإدارية والمالية الصارم ISO 15189
        </div>
      </div>
    );
  }

  // Unlocked CEO View
  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-purple-900/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>حصة الإدارة والمعمل (CEO Profit Share & Stakeholder Equity)</span>
          </div>
          <h1 className="text-xl font-bold text-white">
            توزيع الأرباح الصافية وسجل التدقيق والرقابة (Audit Trail)
          </h1>
          <p className="text-xs text-purple-200/80 mt-1">
            متابعة دقيقة للأرباح الصافية المحصلة وتقسيمها التلقائي بين صندوق تطوير المعمل وحصة الإدارة / CEO.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsChangingPin(true)}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer"
          >
            تغيير رمز PIN
          </button>

          <button
            onClick={() => setIsUnlocked(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/80 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>قفل الشاشة فوراً</span>
          </button>
        </div>
      </div>

      {/* Share Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Net Profit */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-bold block mb-1">
            صافي الأرباح القابلة للتوزيع
          </span>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {netProfit.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-500">ج.م</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 space-y-0.5">
            <div>المحصل: {totalCollected.toLocaleString()} ج.م</div>
            <div>المصروفات: {totalExpenses.toLocaleString()} ج.م</div>
          </div>
        </div>

        {/* Card 2: CEO Share */}
        <div className="bg-purple-50/60 rounded-xl p-5 border border-purple-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-purple-900 font-bold">
              حصة الإدارة والشركاء (CEO Share)
            </span>
            <span className="font-mono text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
              {ceoSharePct}%
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-purple-950">
            {ceoAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-xs font-sans font-normal text-purple-700">ج.م</span>
          </div>
          <div className="text-[11px] text-purple-700 mt-2">
            الأرباح المخصصة للمدير التنفيذي والشركاء
          </div>
        </div>

        {/* Card 3: Lab Reinvestment Share */}
        <div className="bg-blue-50/60 rounded-xl p-5 border border-blue-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-blue-900 font-bold">
              حصة المعمل والتطوير (Lab Share)
            </span>
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              {labSharePct}%
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-blue-950">
            {labAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-xs font-sans font-normal text-blue-700">ج.م</span>
          </div>
          <div className="text-[11px] text-blue-700 mt-2">
            صندوق تجديد الأجهزة والكواشف وتوسعات الفروع
          </div>
        </div>

      </div>

      {/* Adjust Percentages Section */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-600" />
          <span>تعديل نسب توزيع الأرباح بين المعمل والإدارة</span>
        </h3>

        <div className="max-w-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-purple-700">حصة الإدارة (CEO): {ceoSharePct}%</span>
            <span className="text-blue-700">حصة المعمل (Lab): {labSharePct}%</span>
          </div>

          <input
            type="range"
            min={10}
            max={90}
            step={5}
            value={ceoSharePct}
            onChange={(e) => setCeoSharePct(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handleSavePercentages}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
            >
              حفظ وتثبيت النسب الجديدة
            </button>
          </div>
        </div>
      </div>

      {/* Audit Log Table (Section 15 Mandatory Requirement) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-600" />
              <span>سجل التدقيق والرقابة الأمني (System Audit Trail Log)</span>
            </h3>
            <p className="text-xs text-slate-500">
              تسجيل تلقائي لكل تغيير مالي، تعديل نسب، أو اعتماد طبي لمنع التلاعب
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {auditLogs.length} عمليات مسجلة
          </span>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold sticky top-0">
              <tr>
                <th className="py-2.5 px-4">الوقت والتاريخ</th>
                <th className="py-2.5 px-4">الإجراء (Action)</th>
                <th className="py-2.5 px-4">التصنيف</th>
                <th className="py-2.5 px-4">المسؤول والدور</th>
                <th className="py-2.5 px-4">تفاصيل العملية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      log.entityType === 'Financial' ? 'bg-purple-100 text-purple-800' :
                      log.entityType === 'Result' ? 'bg-rose-100 text-rose-800' :
                      log.entityType === 'Order' ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {log.entityType}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-700">
                    <div className="font-semibold">{log.performedBy}</div>
                    <div className="text-[10px] text-slate-400">{log.role}</div>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 leading-relaxed">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change PIN Modal */}
      {isChangingPin && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleChangePin} className="bg-white rounded-xl max-w-sm w-full p-5 border border-slate-200 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              تغيير رمز الأمان PIN لقسم الإدارة
            </h3>

            <div>
              <label className="block text-slate-700 font-bold mb-1">الرمز السري الجديد (4 أرقام على الأقل)</label>
              <input
                type="password"
                required
                minLength={4}
                value={newPin}
                onChange={e => setNewPin(e.target.value)}
                placeholder="••••"
                className="w-full text-center text-xl font-mono p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsChangingPin(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 cursor-pointer"
              >
                تحديث الرمز
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
