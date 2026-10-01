import React, { useState } from 'react';
import { Patient, Order } from '../types/lis';
import { RT_LAB_INFO } from '../data/labInfo';
import { StorageService } from '../services/storage';
import { 
  Award, 
  Search, 
  Plus, 
  CreditCard, 
  Gift, 
  Sparkles, 
  Printer, 
  QrCode, 
  CheckCircle2, 
  Star, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Coins, 
  TrendingUp, 
  ShieldCheck, 
  X,
  UserCheck
} from 'lucide-react';

interface LoyaltyViewProps {
  patients: Patient[];
  orders: Order[];
  onSavePatient: (patient: Patient) => void;
}

export const LoyaltyView: React.FC<LoyaltyViewProps> = ({
  patients,
  orders,
  onSavePatient
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  
  // Lab Management Loyalty Settings
  const [loyaltySettings, setLoyaltySettings] = useState(() => StorageService.getLoyaltySettings());
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState<string | null>(null);

  // Points Modal State
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
  const [exactPointsValue, setExactPointsValue] = useState<number>(0);
  const [editTierValue, setEditTierValue] = useState<'Silver' | 'Gold' | 'Platinum' | 'VIP'>('Gold');
  const [editCardNumber, setEditCardNumber] = useState<string>('');
  const [pointsAdjustment, setPointsAdjustment] = useState<number>(50);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('مكافأة زيارة متكررة');

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Open modal and prepopulate
  const handleOpenEditModal = () => {
    if (!selectedPatient) return;
    setExactPointsValue(selectedPatient.loyaltyPoints || 0);
    setEditTierValue((selectedPatient.loyaltyTier as any) || 'Gold');
    setEditCardNumber(selectedPatient.loyaltyCardNumber || `RT-${selectedPatient.phone.slice(-4) || '9999'}-GOLD`);
    setIsPointsModalOpen(true);
  };

  // Save Loyalty Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveLoyaltySettings(loyaltySettings);
    setSettingsSuccessMsg('تم حفظ وتحديث تسعير وقواعد كروت الولاء على مستوى المعمل بنجاح!');
    setTimeout(() => setSettingsSuccessMsg(null), 3500);
  };

  // Filter patients with loyalty search
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    (p.loyaltyCardNumber && p.loyaltyCardNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Stats
  const totalPointsInCirculation = patients.reduce((acc, p) => acc + (p.loyaltyPoints || 0), 0);
  const totalValueInEGP = totalPointsInCirculation * (loyaltySettings.pointValueEGP || 0.5);
  const vipCount = patients.filter(p => p.loyaltyTier === 'VIP' || p.loyaltyTier === 'Platinum').length;

  const handleSaveExactPoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const updated: Patient = {
      ...selectedPatient,
      loyaltyPoints: Math.max(0, exactPointsValue),
      loyaltyCardNumber: editCardNumber.trim() || selectedPatient.loyaltyCardNumber || `RT-${selectedPatient.phone.slice(-4) || '9999'}-GOLD`,
      loyaltyTier: editTierValue
    };

    onSavePatient(updated);
    setIsPointsModalOpen(false);
    alert(`تم تحديث رصيد النقاط للمريض (${selectedPatient.name}) إلى ${exactPointsValue} نقطة بنجاح.`);
  };

  const handleAdjustPoints = (type: 'add' | 'deduct') => {
    if (!selectedPatient) return;
    const current = selectedPatient.loyaltyPoints || 0;
    const change = type === 'add' ? pointsAdjustment : -pointsAdjustment;
    const newTotal = Math.max(0, current + change);

    const updated: Patient = {
      ...selectedPatient,
      loyaltyPoints: newTotal,
      loyaltyCardNumber: selectedPatient.loyaltyCardNumber || `RT-${selectedPatient.phone.slice(-4) || '9999'}-GOLD`,
      loyaltyTier: selectedPatient.loyaltyTier || (newTotal > 300 ? 'VIP' : newTotal > 150 ? 'Platinum' : 'Gold')
    };

    onSavePatient(updated);
    setIsPointsModalOpen(false);
    alert(`تم ${type === 'add' ? 'إضافة' : 'خصم'} ${pointsAdjustment} نقطة للمريض ${selectedPatient.name} بنجاح.`);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Official RT LAB Visual Identity */}
      <div className="bg-gradient-to-r from-red-950 via-rose-900 to-blue-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-2 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/20">
              <img 
                src={RT_LAB_INFO.logoUrl} 
                alt="RT LAB Logo" 
                className="w-20 h-20 object-contain rounded-xl shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>برنامج كروت الولاء ونقاط المكافآت RT LAB Rewards</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                كروت الولاء الذهبية ورصيد النقاط لعملاء معامل رامي مختار
              </h1>
              <p className="text-xs text-rose-100 max-w-xl leading-relaxed">
                منظومة مكافآت متكاملة تمنح المرضى نقاطاً مع كل فحص واستبدالها بخصومات فورية، مع إصدار كارت ولاء معتمد ذكي لكل مريض.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowSettingsPanel(!showSettingsPanel)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors backdrop-blur-xs border border-white/30"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>{showSettingsPanel ? 'إخفاء إعدادات الأسعار' : 'إدارة أسعار وسياسات النقاط'}</span>
            </button>

            <button
              onClick={handlePrintCard}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة كارت المريض الحالي</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Lab Management: Loyalty Pricing & Rules Panel */}
      {showSettingsPanel && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-xl p-5 border-2 border-amber-300 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-amber-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-600" />
                <span>إدارة أسعار وسياسات منظومة كروت الولاء (Lab Loyalty Pricing & Policy)</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                التحكم المالي والإداري في تسعير النقاط ومعدلات الخصم على مستوى كافة فروع معامل رامي مختار
              </p>
            </div>
            {settingsSuccessMsg && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                {settingsSuccessMsg}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-200">
              <label className="block text-slate-700 font-bold mb-1">
                سعر النقطة عند الخصم للمريض (ج.م)
              </label>
              <input
                type="number"
                step="0.05"
                min="0.05"
                value={loyaltySettings.pointValueEGP}
                onChange={e => setLoyaltySettings({ ...loyaltySettings, pointValueEGP: parseFloat(e.target.value) || 0.5 })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-amber-900 text-sm"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                مثال: 0.5 ج.م تعني كل 100 نقطة = 50 ج.م خصم
              </span>
            </div>

            <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-200">
              <label className="block text-slate-700 font-bold mb-1">
                معدل اكتساب النقاط مع الفحوصات
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={loyaltySettings.pointsPerEGPSpent}
                onChange={e => setLoyaltySettings({ ...loyaltySettings, pointsPerEGPSpent: parseFloat(e.target.value) || 0.1 })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-blue-900 text-sm"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                مثال: 0.1 تعني نقطة واحدة لكل 10 جنيه مدفوعة
              </span>
            </div>

            <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-200">
              <label className="block text-slate-700 font-bold mb-1">
                رصيد ترحيبي عند فتح ملف جديد
              </label>
              <input
                type="number"
                min="0"
                value={loyaltySettings.welcomeBonusPoints}
                onChange={e => setLoyaltySettings({ ...loyaltySettings, welcomeBonusPoints: parseInt(e.target.value) || 50 })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-emerald-900 text-sm"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                نقاط تضاف فور تسجيل المريض لأول مرة
              </span>
            </div>

            <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-200">
              <label className="block text-slate-700 font-bold mb-1">
                الحد الأدنى للنقاط للاستبدال
              </label>
              <input
                type="number"
                min="0"
                value={loyaltySettings.minRedeemPoints}
                onChange={e => setLoyaltySettings({ ...loyaltySettings, minRedeemPoints: parseInt(e.target.value) || 20 })}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-purple-900 text-sm"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                أقل رصيد يسمح بخصمه في الفاتورة
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowSettingsPanel(false)}
              className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer"
            >
              إغلاق
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold shadow-xs cursor-pointer"
            >
              حفظ وتطبيق الأسعار على مستوى المعمل
            </button>
          </div>
        </form>
      )}

      {/* Program Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">إجمالي نقاط الولاء</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-900">
            {totalPointsInCirculation.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">نقطة نشطة لدى المرضى</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">القيمة التوفيرية (ج.م)</span>
            <Gift className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700">
            {totalValueInEGP.toLocaleString()} <span className="text-xs font-sans font-normal">ج.م</span>
          </div>
          <span className="text-[10px] text-slate-400">خصومات جاهزة للاستبدال</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">كروت VIP & بلاتينيوم</span>
            <Star className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-900">
            {vipCount}
          </div>
          <span className="text-[10px] text-slate-400">عميل مميز معتمد</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">معدل اكتساب النقاط</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg font-bold font-mono text-blue-900">
            1 نقطة / 10 ج.م
          </div>
          <span className="text-[10px] text-slate-400">كل 100 نقطة = 50 ج.م</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Digital Card Showcase (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>معاينة كارت الولاء المعتمد (RT LAB VIP Card)</span>
            </h2>

            {selectedPatient ? (
              <div className="space-y-4">
                
                {/* Luxury 3D Credit Card */}
                <div className="w-full aspect-[1.586] rounded-2xl p-5 bg-gradient-to-tr from-slate-950 via-slate-900 to-red-950 text-white shadow-xl relative overflow-hidden border border-amber-400/40 flex flex-col justify-between">
                  
                  {/* Top line: Logo & Tier */}
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={RT_LAB_INFO.logoUrl} 
                        alt="Logo" 
                        className="w-10 h-10 object-contain rounded-lg border border-amber-400/30 p-0.5 bg-black/40"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="text-xs font-black text-amber-400 tracking-wider">
                          معامل رامي مختار
                        </div>
                        <div className="text-[9px] font-mono text-slate-300">
                          RT LAB VIP REWARDS
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs">
                      {selectedPatient.loyaltyTier || 'GOLD MEMBER'}
                    </span>
                  </div>

                  {/* Center EMV Chip & QR */}
                  <div className="flex items-center justify-between relative z-10 px-1">
                    <div className="w-9 h-7 rounded bg-gradient-to-r from-amber-300 to-yellow-500 border border-amber-600 shadow-xs flex items-center justify-center">
                      <div className="w-6 h-4 border border-amber-800/40 rounded-xs" />
                    </div>

                    <div className="text-left font-mono font-bold text-lg text-amber-200 tracking-widest" dir="ltr">
                      {selectedPatient.loyaltyCardNumber || `RT-${selectedPatient.phone.slice(-4) || '9999'}-GOLD`}
                    </div>
                  </div>

                  {/* Bottom Line: Patient Name & Points */}
                  <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/10">
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-slate-400 block">CARD HOLDER</span>
                      <strong className="text-xs font-bold text-white block truncate max-w-[170px]">
                        {selectedPatient.name}
                      </strong>
                    </div>

                    <div className="text-left" dir="ltr">
                      <span className="text-[8px] uppercase tracking-wider text-slate-400 block text-right">POINTS BALANCE</span>
                      <strong className="text-base font-black text-amber-400 font-mono">
                        {selectedPatient.loyaltyPoints || 0} <span className="text-[10px] font-normal text-amber-200">PTS</span>
                      </strong>
                    </div>
                  </div>

                  {/* Subtle Background Art */}
                  <div className="absolute right-0 bottom-0 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                </div>

                {/* Patient Loyalty Controls */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">رقم الهاتف المرتبط:</span>
                    <strong className="font-mono text-slate-900">{selectedPatient.phone}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">رصيد النقاط الحالي:</span>
                    <strong className="font-mono text-amber-800 text-sm">{selectedPatient.loyaltyPoints || 0} نقطة</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">القيمة المادية التوفيرية:</span>
                    <strong className="font-mono text-emerald-700 font-bold">{((selectedPatient.loyaltyPoints || 0) * 0.5)} ج.م</strong>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleOpenEditModal}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>تعديل النقاط والفئة (إدارة المعمل)</span>
                  </button>

                  <button
                    onClick={handlePrintCard}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة الكارت A4</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                اختر مريضاً من القائمة لعرض كارت الولاء ونقاطه
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Patients Loyalty Directory (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[650px]">
          
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-bold text-slate-900">
                سجل كروت ولاء المرضى ({filteredPatients.length} مريض)
              </h2>
              <span className="text-[10px] text-slate-500">اختر مريضاً لمشاهدة رصيد المكافآت أو طباعة الكارت</span>
            </div>

            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث بالاسم أو الهاتف أو كود الكارت..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-2 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredPatients.map((patient) => {
              const isSelected = patient.id === selectedPatient?.id;
              const points = patient.loyaltyPoints || 0;
              const tier = patient.loyaltyTier || 'Gold';

              return (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-amber-50/80 border-r-4 border-amber-500' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{patient.name}</span>
                      <span className={`text-[9.5px] px-1.5 py-0.2 rounded font-black font-mono ${
                        tier === 'VIP' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        tier === 'Platinum' ? 'bg-slate-200 text-slate-800' : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}>
                        {tier}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
                      <span>{patient.phone}</span>
                      <span>·</span>
                      <span className="text-amber-800 font-semibold">{patient.loyaltyCardNumber || `RT-${patient.phone.slice(-4) || '9999'}-GOLD`}</span>
                    </div>
                  </div>

                  <div className="text-left" dir="ltr">
                    <span className="font-mono font-bold text-sm text-amber-900 block">
                      {points} PTS
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      = {(points * 0.5)} EGP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Edit Points & Loyalty Card Modal */}
      {isPointsModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-slate-200 shadow-2xl text-xs space-y-4 text-right">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  تعديل كارت وولاء المريض: {selectedPatient.name}
                </h3>
                <span className="text-[11px] text-slate-500">
                  التحكم المباشر في رصيد النقاط وفئة العضوية
                </span>
              </div>
              <button 
                onClick={() => setIsPointsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direct exact points and tier setting form */}
            <form onSubmit={handleSaveExactPoints} className="space-y-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200">
              <span className="font-bold text-amber-950 block text-[11px]">
                1. تحديد رصيد النقاط وفئة الكارت مباشرة:
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">رصيد النقاط الفعلي</label>
                  <input
                    type="number"
                    min="0"
                    value={exactPointsValue}
                    onChange={e => setExactPointsValue(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-emerald-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">فئة كارت الولاء</label>
                  <select
                    value={editTierValue}
                    onChange={e => setEditTierValue(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold cursor-pointer"
                  >
                    <option value="Silver">فضي (Silver)</option>
                    <option value="Gold">ذهبي (Gold)</option>
                    <option value="Platinum">بلاتينيوم (Platinum)</option>
                    <option value="VIP">كبار العملاء (VIP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">رقم كارت الولاء</label>
                <input
                  type="text"
                  value={editCardNumber}
                  onChange={e => setEditCardNumber(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold"
                  placeholder="RT-1234-GOLD"
                />
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-emerald-800 font-mono font-bold">
                  القيمة التوفيرية = {(exactPointsValue * (loyaltySettings.pointValueEGP || 0.5))} ج.م
                </span>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-bold text-xs shadow-xs cursor-pointer"
                >
                  حفظ وتثبيت الرصيد
                </button>
              </div>
            </form>

            {/* Quick add/deduct section */}
            <div className="space-y-2.5 pt-1 border-t border-slate-200">
              <span className="font-bold text-slate-800 block text-[11px]">
                2. أو إضافة / خصم عملية نقاط سريعة:
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">عدد النقاط:</label>
                  <input
                    type="number"
                    min={5}
                    value={pointsAdjustment}
                    onChange={e => setPointsAdjustment(parseInt(e.target.value) || 0)}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-center font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">البيان / السبب:</label>
                  <input
                    type="text"
                    value={adjustmentReason}
                    onChange={e => setAdjustmentReason(e.target.value)}
                    placeholder="مثال: بونص ترحيبي..."
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleAdjustPoints('add')}
                  className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>إضافة نقاط (+)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAdjustPoints('deduct')}
                  className="py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>خصم نقاط (-)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
