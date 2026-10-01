import React, { useState } from 'react';
import { 
  Order, 
  Patient, 
  TestCatalogItem, 
  TestPackage, 
  PaymentMethod, 
  Urgency,
  OrderTestResult 
} from '../types/lis';
import { StorageService } from '../services/storage';
import { RT_LAB_INFO } from '../data/labInfo';
import { 
  PlusCircle, 
  Search, 
  TestTube2, 
  Boxes, 
  Calculator, 
  CreditCard, 
  AlertTriangle, 
  Check, 
  X,
  User,
  Phone,
  Stethoscope,
  Building
} from 'lucide-react';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveOrder: (order: Order) => void;
  preselectedPatient?: Patient | null;
  preselectedPackageId?: string | null;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  onSaveOrder,
  preselectedPatient,
  preselectedPackageId
}) => {
  if (!isOpen) return null;

  const allPatients = StorageService.getPatients();
  const allTests = StorageService.getTests();
  const allPackages = StorageService.getPackages();

  // Mode: existing patient search vs new patient entry
  const [patientSearchMode, setPatientSearchMode] = useState<boolean>(!preselectedPatient);
  const [patientQuery, setPatientQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(preselectedPatient || null);

  // New patient fields if creating new
  const [name, setName] = useState(preselectedPatient?.name || '');
  const [phone, setPhone] = useState(preselectedPatient?.phone || '');
  const [age, setAge] = useState(preselectedPatient?.age || 35);
  const [ageUnit, setAgeUnit] = useState<'Years' | 'Months' | 'Days'>('Years');
  const [gender, setGender] = useState<'Male' | 'Female'>(preselectedPatient?.gender || 'Male');
  const [nationalId, setNationalId] = useState(preselectedPatient?.nationalId || '');
  const [referringDoctor, setReferringDoctor] = useState(preselectedPatient?.referringDoctor || '');
  const [branch, setBranch] = useState(RT_LAB_INFO.branches[0].arabicName);

  // Tests & Packages selected
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>(
    preselectedPackageId ? [preselectedPackageId] : []
  );

  // Urgency & Financials
  const [urgency, setUrgency] = useState<Urgency>('Routine');
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');

  // Handle preselected package if passed
  React.useEffect(() => {
    if (preselectedPackageId) {
      const pkg = allPackages.find(p => p.id === preselectedPackageId);
      if (pkg) {
        setSelectedPackageIds([pkg.id]);
        setSelectedTestIds(Array.from(new Set(pkg.testIds)));
      }
    }
  }, [preselectedPackageId]);

  // When clicking on a package, toggle its tests
  const handleTogglePackage = (pkg: TestPackage) => {
    if (selectedPackageIds.includes(pkg.id)) {
      setSelectedPackageIds(prev => prev.filter(id => id !== pkg.id));
    } else {
      setSelectedPackageIds(prev => [...prev, pkg.id]);
      // Add all tests of this package
      setSelectedTestIds(prev => Array.from(new Set([...prev, ...pkg.testIds])));
    }
  };

  const handleToggleTest = (testId: string) => {
    if (selectedTestIds.includes(testId)) {
      setSelectedTestIds(prev => prev.filter(id => id !== testId));
    } else {
      setSelectedTestIds(prev => [...prev, testId]);
    }
  };

  // Calculate gross total
  // If packages are selected, calculate discounted package price plus any extra standalone tests
  const packageTotal = selectedPackageIds.reduce((sum, pkgId) => {
    const pkg = allPackages.find(p => p.id === pkgId);
    return sum + (pkg?.packagePrice || 0);
  }, 0);

  // Tests that are NOT in the selected packages
  const packageTestIds = new Set(
    selectedPackageIds.flatMap(pkgId => allPackages.find(p => p.id === pkgId)?.testIds || [])
  );
  const standaloneTestIds = selectedTestIds.filter(tid => !packageTestIds.has(tid));
  const standaloneTotal = standaloneTestIds.reduce((sum, tid) => {
    const t = allTests.find(x => x.id === tid);
    return sum + (t?.price || 0);
  }, 0);

  const grossTotal = packageTotal + standaloneTotal;
  const netTotal = Math.max(0, grossTotal - discount);
  const remaining = Math.max(0, netTotal - paidAmount);

  // Tube requirement calculation
  const requiredTubes = StorageService.calculateRequiredTubes(selectedTestIds);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTestIds.length === 0) {
      alert('يرجى اختيار تحليل واحد على الأقل للمتابعة.');
      return;
    }

    let finalPatient: Patient;
    if (selectedPatient) {
      finalPatient = selectedPatient;
    } else {
      if (!name || !phone) {
        alert('يرجى إدخال اسم المريض ورقم الهاتف.');
        return;
      }
      finalPatient = {
        id: 'pat-' + Date.now().toString().slice(-4),
        name,
        phone,
        age,
        ageUnit,
        gender,
        nationalId,
        referringDoctor,
        registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      StorageService.savePatient(finalPatient);
    }

    const orderNum = 'RT-26-' + Math.floor(Math.random() * 9000 + 1000);
    const barcodeStr = 'RT' + Math.floor(Math.random() * 899999 + 100000);
    const now = new Date();
    const createdStr = now.toISOString().replace('T', ' ').substring(0, 16);

    // Prepare initial test results
    const initialResults: OrderTestResult[] = selectedTestIds.map(tid => {
      const t = allTests.find(x => x.id === tid)!;
      const ref = t.referenceRanges.find(r => r.gender === finalPatient.gender || r.gender === 'All') || t.referenceRanges[0];
      return {
        testId: t.id,
        testCode: t.code,
        testName: t.arabicName,
        resultValue: '',
        unit: t.unit,
        referenceRangeText: ref?.textualRange || `${ref?.min} - ${ref?.max}`,
        flag: 'Normal'
      };
    });

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: orderNum,
      patientId: finalPatient.id,
      patientName: finalPatient.name,
      patientAge: finalPatient.age,
      patientAgeUnit: finalPatient.ageUnit,
      patientGender: finalPatient.gender,
      patientPhone: finalPatient.phone,
      patientNationalId: finalPatient.nationalId,
      referringDoctor: referringDoctor || finalPatient.referringDoctor || 'فحص ذاتي',
      urgency,
      branch,
      createdAt: createdStr,
      testIds: selectedTestIds,
      packageIds: selectedPackageIds,
      results: initialResults,
      specimenStatus: 'Waiting Collection',
      orderStatus: 'Pending',
      reportStatus: 'In Progress',
      totalAmount: grossTotal,
      discount,
      netAmount: netTotal,
      paidAmount: paidAmount > 0 ? paidAmount : netTotal, // default to full pay if desired or user entered
      remainingAmount: paidAmount > 0 ? Math.max(0, netTotal - paidAmount) : 0,
      paymentMethod,
      barcode: barcodeStr
    };

    onSaveOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[96vh] flex flex-col shadow-2xl border border-slate-200 text-xs text-right">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                تسجيل طلب فحص مخبري جديد (New Diagnostic Order)
              </h2>
              <p className="text-[11px] text-slate-500">
                حساب الأنابيب المطلوبة آلياً، اختيار الباقات، وتوليد الباركود
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Section 4: Patient Selection or Entry */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>بيانات المريض (Patient Information)</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPatientSearchMode(true);
                    setSelectedPatient(null);
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    patientSearchMode ? 'bg-blue-600 text-white font-bold' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  بحث عن مريض مسجل
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPatientSearchMode(false);
                    setSelectedPatient(null);
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    !patientSearchMode ? 'bg-blue-600 text-white font-bold' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  تسجيل مريض جديد
                </button>
              </div>
            </div>

            {/* Mode A: Search Existing Patient */}
            {patientSearchMode ? (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={patientQuery}
                    onChange={e => setPatientQuery(e.target.value)}
                    placeholder="ابحث باسم المريض أو رقم الهاتف أو الرقم القومي..."
                    className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-hidden"
                  />
                </div>

                {patientQuery && (
                  <div className="max-h-36 overflow-y-auto bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
                    {allPatients
                      .filter(p => p.name.includes(patientQuery) || p.phone.includes(patientQuery))
                      .map(p => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setSelectedPatient(p);
                            setName(p.name);
                            setPhone(p.phone);
                            setAge(p.age);
                            setGender(p.gender);
                            setReferringDoctor(p.referringDoctor || '');
                            setPatientQuery('');
                          }}
                          className="p-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <strong className="text-slate-900">{p.name}</strong>
                            <span className="text-slate-500 font-mono text-[10px] mr-2">{p.phone}</span>
                          </div>
                          <span className="text-slate-400 text-[10px]">
                            {p.age} سنة · {p.gender === 'Male' ? 'ذكر' : 'أنثى'}
                          </span>
                        </div>
                      ))}
                  </div>
                )}

                {selectedPatient && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900">
                    <div>
                      تم اختيار المريض: <strong className="font-bold">{selectedPatient.name}</strong> ({selectedPatient.phone})
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPatient(null)}
                      className="text-xs text-rose-600 hover:underline cursor-pointer"
                    >
                      تغيير
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Mode B: Enter New Patient Data */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="lg:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">اسم المريض بالكامل</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="الاسم الرباعي للمريض..."
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">الهاتف / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-slate-700 font-bold mb-1">العمر</label>
                    <input
                      type="number"
                      required
                      value={age}
                      onChange={e => setAge(parseInt(e.target.value) || 0)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">النوع</label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value as any)}
                      className="p-2 bg-white border border-slate-200 rounded-lg cursor-pointer"
                    >
                      <option value="Male">ذكر</option>
                      <option value="Female">أنثى</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">الرقم القومي (اختياري)</label>
                  <input
                    type="text"
                    value={nationalId}
                    onChange={e => setNationalId(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">الطبيب المعالج</label>
                  <input
                    type="text"
                    value={referringDoctor}
                    onChange={e => setReferringDoctor(e.target.value)}
                    placeholder="د. ..."
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">الفرع المسجل</label>
                  <select
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg cursor-pointer"
                  >
                    {RT_LAB_INFO.branches.map(b => (
                      <option key={b.id} value={b.arabicName}>
                        {b.arabicName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Section 4 & 13: Packages Selection */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <Boxes className="w-4 h-4 text-purple-600" />
              <span>باقات الفحص الشامل (Packages) - أسعار خاصة</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {allPackages.map(pkg => {
                const isSelected = selectedPackageIds.includes(pkg.id);
                return (
                  <div
                    key={pkg.id}
                    onClick={() => handleTogglePackage(pkg)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold shadow-2xs' 
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">{pkg.arabicName}</span>
                      <span className="font-mono text-purple-700">{pkg.packagePrice} ج.م</span>
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">
                      {pkg.testIds.length} فحص مدمج
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual Tests Selection */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <TestTube2 className="w-4 h-4 text-blue-600" />
              <span>التحاليل الفردية (Individual Tests Catalog)</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
              {allTests.map(test => {
                const isSelected = selectedTestIds.includes(test.id);
                return (
                  <label
                    key={test.id}
                    className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-blue-50 border-blue-400 text-blue-950 font-bold' 
                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleTest(test.id)}
                        className="rounded text-blue-600 shrink-0"
                      />
                      <span className="truncate">{test.arabicName}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 shrink-0 mr-1">
                      {test.price} ج.م
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 4 & 5: Auto Tube Cap Calculation Display (Required Tubes) */}
          {selectedTestIds.length > 0 && (
            <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <TestTube2 className="w-4 h-4 text-amber-600" />
                  <span>أنابيب السحب المطلوبة تلقائياً (Tubes Required Calculator)</span>
                </span>
                <span className="text-[11px] font-mono text-amber-800">
                  إجمالي: {requiredTubes.reduce((sum, t) => sum + t.count, 0)} أنابيب سحب
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {requiredTubes.map(({ tube, count, tests }) => (
                  <div 
                    key={tube.id}
                    className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
                  >
                    <span 
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: tube.colorHex }}
                      title={tube.arabicName}
                    />
                    <div>
                      <strong className="text-slate-900 text-xs">
                        {count} × {tube.arabicName}
                      </strong>
                      <div className="text-[10px] text-slate-400">
                        {tests.map(t => t.code).join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Urgency & Financials (STAT / Routine & Calculations) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Urgency */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">أولوية الفحص (Urgency)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUrgency('Routine')}
                    className={`py-2 px-3 rounded-lg border text-center font-bold cursor-pointer transition-colors ${
                      urgency === 'Routine'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    روتيني (Routine)
                  </button>

                  <button
                    type="button"
                    onClick={() => setUrgency('STAT')}
                    className={`py-2 px-3 rounded-lg border text-center font-bold cursor-pointer transition-colors flex items-center justify-center gap-1 ${
                      urgency === 'STAT'
                        ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                        : 'bg-white text-rose-700 border-slate-200'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>طوارئ عاجل (STAT)</span>
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">طريقة الدفع في الخزينة</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg cursor-pointer font-semibold"
                >
                  <option value="Cash">Cash (نقدي)</option>
                  <option value="InstaPay">InstaPay (إنستاباي)</option>
                  <option value="Wallet">Mobile Wallet (فودافون / اتصالات كاش)</option>
                  <option value="Card">Visa / MasterCard</option>
                  <option value="Bank Transfer">Bank Transfer (تحويل بنكي)</option>
                </select>
              </div>

            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">إجمالي التحاليل:</span>
                <strong className="font-mono text-slate-900 text-sm">{grossTotal} ج.م</strong>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">الخصم الممنوح:</span>
                <input
                  type="number"
                  min={0}
                  max={grossTotal}
                  value={discount}
                  onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-20 font-mono font-bold text-center text-xs p-1 border border-slate-200 rounded mt-0.5"
                />
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">السعر الصافي (Net):</span>
                <strong className="font-mono text-blue-900 text-sm">{netTotal} ج.م</strong>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">المسدد نقداً (Paid):</span>
                <input
                  type="number"
                  min={0}
                  value={paidAmount}
                  onChange={e => setPaidAmount(parseFloat(e.target.value) || 0)}
                  placeholder={`${netTotal}`}
                  className="w-20 font-mono font-bold text-center text-xs p-1 border border-slate-200 rounded mt-0.5 text-emerald-700"
                />
              </div>
            </div>

            {remaining > 0 && (
              <div className="text-right text-[11px] text-rose-700 font-bold bg-rose-50 p-2 rounded border border-rose-200">
                المبلغ المتبقي على المريض: {remaining} ج.م
              </div>
            )}
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md cursor-pointer transition-colors"
            >
              حفظ الطلب وتوليد الباركود
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
