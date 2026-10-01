import React, { useState } from 'react';
import { Booking, Order, TestPackage, TestCatalogItem } from '../types/lis';
import { RT_LAB_INFO } from '../data/labInfo';
import { 
  Globe2, 
  Search, 
  Calendar, 
  Home, 
  Building, 
  FileText, 
  CheckCircle2, 
  Phone, 
  Printer, 
  Sparkles,
  Clock,
  MapPin,
  ShieldCheck,
  Send
} from 'lucide-react';

interface PatientPortalViewProps {
  orders: Order[];
  packages: TestPackage[];
  tests: TestCatalogItem[];
  onAddBooking: (booking: Booking) => void;
  onOpenPrintReport: (order: Order) => void;
}

export const PatientPortalView: React.FC<PatientPortalViewProps> = ({
  orders,
  packages,
  tests,
  onAddBooking,
  onOpenPrintReport
}) => {
  const [activePortalTab, setActivePortalTab] = useState<'track' | 'book'>('track');
  
  // Track inquiry
  const [inquiryCode, setInquiryCode] = useState('');
  const [searchResult, setSearchResult] = useState<Order | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // New Booking State
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [address, setAddress] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().substring(0, 10));
  const [timeSlot, setTimeSlot] = useState('09:00 ص - 10:30 ص');
  const [bookingType, setBookingType] = useState<'Home Visit' | 'Lab Branch Visit'>('Home Visit');
  const [selectedPackageId, setSelectedPackageId] = useState(packages[0]?.id || '');
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
  const [customTests, setCustomTests] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingSuccessCode, setBookingSuccessCode] = useState<string | null>(null);

  const handleToggleTest = (testId: string) => {
    setSelectedTestIds(prev => 
      prev.includes(testId) ? prev.filter(id => id !== testId) : [...prev, testId]
    );
  };

  const selectedPackage = packages.find(p => p.id === selectedPackageId) || packages[0];

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAttempted(true);
    const clean = inquiryCode.trim().toLowerCase();
    const found = orders.find(o => 
      o.orderNumber.toLowerCase() === clean ||
      o.barcode.toLowerCase() === clean ||
      o.patientPhone === clean
    );
    setSearchResult(found || null);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const code = 'BK-RT-' + Math.floor(Math.random() * 900 + 100);
    const now = new Date();
    const createdStr = now.toISOString().replace('T', ' ').substring(0, 16);

    const newBooking: Booking = {
      id: 'book-' + Date.now(),
      bookingCode: code,
      patientName,
      phone,
      age,
      gender,
      address: bookingType === 'Home Visit' ? address : 'فرع المعمل الرئيسي - مدينة نصر',
      bookingDate,
      timeSlot,
      type: bookingType,
      packageId: selectedPackage?.id,
      packageName: selectedPackage?.arabicName,
      estimatedPrice: selectedPackage?.packagePrice || 350,
      status: 'Pending',
      notes,
      createdAt: createdStr
    };

    onAddBooking(newBooking);
    setBookingSuccessCode(code);
    
    // Reset form
    setPatientName('');
    setPhone('');
    setAddress('');
    setNotes('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Portal Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-6 rounded-2xl border border-blue-800/40 shadow-sm text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-200">
          <Globe2 className="w-3.5 h-3.5" />
          <span>بوابة المرضى الإلكترونية · معامل RT للتحاليل الطبية</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          الاستعلام عن النتائج وحجز الزيارات المنزلية
        </h1>
        <p className="text-xs text-blue-100/80 max-w-xl mx-auto leading-relaxed">
          يمكنك الحصول على تقريرك الطبي المعتمد فور اعتماده، أو حجز موعد لسحب العينات من منزلك براحة تامة.
        </p>
      </div>

      {/* Switcher Buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setActivePortalTab('track')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activePortalTab === 'track'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>الاستعلام عن نتيجة التحليل</span>
        </button>

        <button
          onClick={() => setActivePortalTab('book')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activePortalTab === 'book'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>حجز زيارة منزلية / موعد</span>
        </button>
      </div>

      {/* Mode 1: Track Results */}
      {activePortalTab === 'track' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="text-center max-w-md mx-auto space-y-1">
            <h2 className="text-base font-bold text-slate-900">
              أدخل رقم الباركود أو رقم الطلب أو رقم الهاتف
            </h2>
            <p className="text-xs text-slate-500">
              ستظهر نتيجتك وحالة التقرير فوراً مع إمكانية التحميل والطباعة.
            </p>
          </div>

          <form onSubmit={handleSearchOrder} className="max-w-md mx-auto flex gap-2">
            <input
              type="text"
              required
              value={inquiryCode}
              onChange={(e) => setInquiryCode(e.target.value)}
              placeholder="مثال: RT-26-8941 أو RT26894101 أو 01012345678"
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-mono text-center font-bold"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              بحث
            </button>
          </form>

          {/* Search Result Display */}
          {searchAttempted && (
            <div className="pt-4 border-t border-slate-100 max-w-xl mx-auto">
              {searchResult ? (
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">رقم التقرير</span>
                      <div className="font-mono font-bold text-base text-blue-900">
                        {searchResult.orderNumber}
                      </div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">
                        {searchResult.patientName}
                      </div>
                    </div>

                    <div className="text-left" dir="ltr">
                      {searchResult.reportStatus === 'Approved' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Report Ready</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Clock className="w-3.5 h-3.5" />
                          <span>In Processing</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                    <div>تاريخ الفحص: <strong className="font-mono">{searchResult.createdAt}</strong></div>
                    <div>عدد الفحوصات: <strong className="font-mono">{searchResult.results.length}</strong></div>
                    <div>حالة العينة: <strong>{searchResult.specimenStatus}</strong></div>
                    <div>الفرع: <strong>{searchResult.branch}</strong></div>
                  </div>

                  {searchResult.reportStatus === 'Approved' ? (
                    <div className="pt-2">
                      <button
                        onClick={() => onOpenPrintReport(searchResult)}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors flex items-center justify-center gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        <span>تحميل ومعاينة التقرير الرسمي المعتمد (PDF)</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-lg text-center font-medium">
                      التحاليل قيد المعالجة المخبرية وسيتم إصدار التقرير الطبي فور اعتماده من الاستشاري.
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-6 bg-slate-50 rounded-xl text-xs text-slate-500">
                  لم يتم العثور على تقرير مطابق لهذا الرقم. يرجى التأكد من الرقم أو التواصل مع الخط الساخن {RT_LAB_INFO.hotline}.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Home Visit & Branch Booking */}
      {activePortalTab === 'book' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
          <div className="text-center max-w-md mx-auto space-y-1">
            <h2 className="text-base font-bold text-slate-900">
              طلب حجز زيارة منزلية أو فحص بالمعمل
            </h2>
            <p className="text-xs text-slate-500">
              فريق تمريض متخصص لسحب العينات بأمان تام في منزلك مع حفظ العينات في حقائب مبردة معتمدة.
            </p>
          </div>

          {bookingSuccessCode && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="text-sm font-bold text-emerald-950">
                تم تسجيل طلب حجزك بنجاح!
              </div>
              <div className="text-xs text-slate-600">
                كود الحجز الخاص بك هو: <strong className="font-mono text-blue-900 text-sm font-extrabold">{bookingSuccessCode}</strong>
              </div>
              <p className="text-[11px] text-slate-500">
                سيقوم فريق خدمة عملاء معامل RT بالتواصل معكم هاتفياً أو عبر WhatsApp لتأكيد تفاصيل الموعد.
              </p>
            </div>
          )}

          <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
            
            {/* Visit Type selection */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">نوع الخدمة المطلوبة</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBookingType('Home Visit')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    bookingType === 'Home Visit'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Home className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                  <span>زيارة منزلية (سحب بالمنزل)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingType('Lab Branch Visit')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    bookingType === 'Lab Branch Visit'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                  <span>زيارة فرع المعمل</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم المريض بالكامل</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  placeholder="الاسم الثلاثي..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">رقم الهاتف / واتساب</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">العمر (سنوات)</label>
                <input
                  type="number"
                  required
                  value={age}
                  onChange={e => setAge(parseInt(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">النوع</label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                >
                  <option value="Male">ذكر</option>
                  <option value="Female">أنثى</option>
                </select>
              </div>
            </div>

            {bookingType === 'Home Visit' && (
              <div>
                <label className="block text-slate-700 font-bold mb-1">عنوان المنزل بالتفصيل</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="المنطقة، الشارع، رقم العمارة والشقة، علامة مميزة..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">تاريخ الموعد المفضل</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={e => setBookingDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">الفترة الزمنية</label>
                <select
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                >
                  <option value="08:00 ص - 09:30 ص">08:00 ص - 09:30 ص (صيام باكر)</option>
                  <option value="09:30 ص - 11:00 ص">09:30 ص - 11:00 ص</option>
                  <option value="11:00 ص - 01:00 م">11:00 ص - 01:00 م</option>
                  <option value="04:00 م - 06:00 م">04:00 م - 06:00 م (مسائي)</option>
                </select>
              </div>
            </div>

            {/* Package Selection */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">اختر باقة الفحص أو التحليل المطلوب</label>
              <select
                value={selectedPackageId}
                onChange={e => setSelectedPackageId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer font-bold text-slate-800"
              >
                {packages.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.arabicName} ({p.packagePrice} ج.م بدلاً من {p.originalPrice} ج.م)
                  </option>
                ))}
              </select>
              {selectedPackage && (
                <div className="text-[11px] text-slate-500 mt-1 bg-slate-50 p-2 rounded">
                  {selectedPackage.description}
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">التحاليل الفردية (اختر من القائمة)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
                {tests.map(test => (
                  <label key={test.id} className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded cursor-pointer text-xs">
                    <input 
                      type="checkbox" 
                      checked={selectedTestIds.includes(test.id)} 
                      onChange={() => handleToggleTest(test.id)}
                      className="rounded text-blue-600"
                    />
                    <span className="truncate">{test.arabicName}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">تحاليل أخرى غير موجودة بالقائمة</label>
              <input
                type="text"
                value={customTests}
                onChange={e => setCustomTests(e.target.value)}
                placeholder="اكتب أسماء التحاليل هنا..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">ملاحظات إضافية (أدوية، صعوبة في السحب، صيام)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="أية ملاحظات لطاقم التمريض..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>تأكيد طلب الحجز وإرساله للمعمل</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
