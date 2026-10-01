import React, { useState } from 'react';
import { Booking, Order, Patient, OrderTestResult } from '../types/lis';
import { StorageService } from '../services/storage';
import { RT_LAB_INFO } from '../data/labInfo';
import { ArrowRightCircle, X, Check, User, Phone, MapPin } from 'lucide-react';

interface ConvertBookingModalProps {
  booking: Booking | null;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
}

export const ConvertBookingModal: React.FC<ConvertBookingModalProps> = ({
  booking,
  onClose,
  onOrderCreated
}) => {
  if (!booking) return null;

  const allPatients = StorageService.getPatients();
  const allPackages = StorageService.getPackages();
  const allTests = StorageService.getTests();

  // Search if patient already exists by phone or name
  const existingPatient = allPatients.find(p => p.phone === booking.phone || p.name === booking.patientName);

  const [useExisting, setUseExisting] = useState<boolean>(!!existingPatient);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(existingPatient?.id || '');

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();

    let targetPatient: Patient;
    if (useExisting && selectedPatientId) {
      targetPatient = allPatients.find(p => p.id === selectedPatientId)!;
    } else {
      // Create new patient
      targetPatient = {
        id: 'pat-' + Date.now().toString().slice(-4),
        name: booking.patientName,
        phone: booking.phone,
        age: booking.age,
        ageUnit: 'Years',
        gender: booking.gender,
        address: booking.address,
        registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      StorageService.savePatient(targetPatient);
    }

    // Determine tests from package
    const pkg = allPackages.find(p => p.id === booking.packageId) || allPackages[0];
    const testIds = pkg ? pkg.testIds : ['t-cbc', 't-fbs'];

    const initialResults: OrderTestResult[] = testIds.map(tid => {
      const t = allTests.find(x => x.id === tid)!;
      const ref = t?.referenceRanges.find(r => r.gender === targetPatient.gender || r.gender === 'All') || t?.referenceRanges[0];
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

    const orderNum = 'RT-26-' + Math.floor(Math.random() * 9000 + 1000);
    const barcodeStr = 'RT' + Math.floor(Math.random() * 899999 + 100000);
    const now = new Date();
    const createdStr = now.toISOString().replace('T', ' ').substring(0, 16);

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: orderNum,
      patientId: targetPatient.id,
      patientName: targetPatient.name,
      patientAge: targetPatient.age,
      patientAgeUnit: targetPatient.ageUnit,
      patientGender: targetPatient.gender,
      patientPhone: targetPatient.phone,
      referringDoctor: 'حجز زيارة منزلية / إلكتروني',
      urgency: 'Routine',
      branch: RT_LAB_INFO.branches[0].arabicName,
      createdAt: createdStr,
      testIds,
      packageIds: pkg ? [pkg.id] : [],
      results: initialResults,
      specimenStatus: 'Waiting Collection',
      orderStatus: 'Pending',
      reportStatus: 'In Progress',
      totalAmount: booking.estimatedPrice,
      discount: 0,
      netAmount: booking.estimatedPrice,
      paidAmount: 0,
      remainingAmount: booking.estimatedPrice,
      paymentMethod: 'Cash',
      barcode: barcodeStr
    };

    // Mark booking as confirmed & link order ID
    const updatedBooking: Booking = {
      ...booking,
      status: 'Confirmed',
      convertedToOrderId: newOrder.id
    };
    StorageService.saveBooking(updatedBooking);

    onOrderCreated(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <form onSubmit={handleConvert} className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 text-xs text-right">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ArrowRightCircle className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                تحويل الحجز إلى طلب فحص فعلي (Convert to Order)
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                كود الحجز: {booking.bookingCode}
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Booking summary */}
        <div className="bg-slate-50 p-3 rounded-lg space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">اسم المريض:</span>
            <strong className="text-slate-900">{booking.patientName}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">الهاتف:</span>
            <span className="font-mono text-slate-800">{booking.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">العمر / النوع:</span>
            <span>{booking.age} سنة · {booking.gender === 'Male' ? 'ذكر' : 'أنثى'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">نوع الخدمة:</span>
            <span className="font-semibold text-blue-700">{booking.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">الباقة المطلوبة:</span>
            <span className="font-semibold text-purple-700">{booking.packageName}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-slate-200">
            <span className="text-slate-500">السعر التقديري:</span>
            <span className="font-mono font-bold text-slate-900">{booking.estimatedPrice} ج.م</span>
          </div>
        </div>

        {/* Patient link decision */}
        <div className="space-y-2">
          <label className="block text-slate-700 font-bold">ربط ملف المريض</label>
          {existingPatient ? (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
              تم العثور على مريض مسجل مسبقاً بنفس رقم الهاتف: <strong>{existingPatient.name}</strong>
              <div className="mt-2 flex gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                  <input
                    type="radio"
                    name="linkPatient"
                    checked={useExisting}
                    onChange={() => setUseExisting(true)}
                  />
                  <span>ربط بالملف الحالي</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="linkPatient"
                    checked={!useExisting}
                    onChange={() => setUseExisting(false)}
                  />
                  <span>إنشاء ملف جديد</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="text-slate-600">
              سيتم إنشاء ملف مريض جديد تلقائياً وتوليد كود طبي وسجل تاريخي.
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
          >
            تأكيد وإنشاء الـ Order
          </button>
        </div>

      </form>
    </div>
  );
};
