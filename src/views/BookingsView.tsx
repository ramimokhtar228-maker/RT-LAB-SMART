import React, { useState } from 'react';
import { Booking, BookingStatus, BookingType } from '../types/lis';
import { RT_LAB_INFO } from '../data/labInfo';
import { 
  CalendarClock, 
  Search, 
  Filter, 
  Check, 
  X, 
  Send, 
  ArrowRightCircle, 
  Home, 
  Building, 
  Phone, 
  Clock, 
  MapPin, 
  Plus, 
  MessageSquare,
  Edit,
  Trash2
} from 'lucide-react';

interface BookingsViewProps {
  bookings: Booking[];
  onSaveBooking: (booking: Booking) => void;
  onConvertBookingToOrder: (booking: Booking) => void;
  onDeleteBooking?: (bookingId: string) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  onSaveBooking,
  onConvertBookingToOrder,
  onDeleteBooking
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | BookingStatus>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | BookingType>('All');
  const [whatsappModalBooking, setWhatsappModalBooking] = useState<Booking | null>(null);

  // Edit/Add modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Partial<Booking> | null>(null);

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.packageName && b.packageName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesType = typeFilter === 'All' || b.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleUpdateStatus = (booking: Booking, newStatus: BookingStatus) => {
    const updated: Booking = { ...booking, status: newStatus };
    onSaveBooking(updated);
  };

  const handleOpenAdd = () => {
    setEditingBooking({
      id: 'bkg-' + Date.now(),
      bookingCode: 'RT-BKG-' + Math.floor(Math.random() * 900 + 100),
      patientName: '',
      phone: '',
      address: 'شبرا الخيمة',
      type: 'Home Visit',
      bookingDate: new Date().toISOString().substring(0, 10),
      bookingTime: '10:00 ص',
      status: 'Pending',
      packageName: 'باقة الفحص الشامل VIP (معامل رامي مختار)',
      estimatedAmount: 990,
      fastingRequired: true,
      notes: '',
      createdAt: new Date().toISOString().substring(0, 10)
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Booking) => {
    setEditingBooking({ ...b });
    setIsModalOpen(true);
  };

  const handleDelete = (b: Booking) => {
    if (confirm(`هل أنت متأكد من الحذف النهائي للحجز رقم (${b.bookingCode}) للمريض (${b.patientName})؟\nسيتم حذفه من كافة الأجهزة فوراً.`)) {
      if (onDeleteBooking) {
        onDeleteBooking(b.id);
      }
    }
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking || !editingBooking.patientName || !editingBooking.phone) return;
    onSaveBooking(editingBooking as Booking);
    setIsModalOpen(false);
    setEditingBooking(null);
  };

  const handleGenerateWhatsAppText = (booking: Booking) => {
    return `أهلاً بك أستاذ/ة ${booking.patientName}، 
تم تأكيد موعدكم مع معامل رامي مختار RT LAB للتحاليل الطبية.
📌 كود الحجز: ${booking.bookingCode}
📅 التاريخ: ${booking.bookingDate}
⏰ الوقت: ${booking.bookingTime}
🔬 نوع الزيارة: ${booking.type === 'Home Visit' ? 'زيارة منزلية لسحب العينات' : 'زيارة الفرع الرئيسي بميدان بهتيم'}
📋 الفحص/الباقة: ${booking.packageName || 'تحاليل طبية متنوعة'}
${booking.fastingRequired ? '⚠️ تنبيه طبي: يُرجى الصيام من 8 إلى 12 ساعة قبل موعد سحب العينة (يُسمح بشرب الماء فقط).' : ''}
📍 الفرع الرئيسي: ${RT_LAB_INFO.branches[0].address}
📞 للاستفسار أو تعديل الموعد: ${RT_LAB_INFO.hotline} / ${RT_LAB_INFO.phone2}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-800 mb-1">
            <CalendarClock className="w-4 h-4" />
            <span>نظام الحجوزات والزيارات المنزلية (Section 2: Bookings & Home Visits)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            جدول مواعيد الحجوزات والزيارات المنزلية
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إدارة الحجوزات الواردة من بوابة المرضى والهاتف، إرسال رسائل التأكيد عبر WhatsApp، وتحويل الحجز إلى طلب فحص.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-rose-900 hover:bg-rose-950 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>حجز جديد (Add Booking)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث برقم الحجز، اسم المريض، الهاتف، الباقة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-900"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                statusFilter === 'All' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setStatusFilter('Pending')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                statusFilter === 'Pending' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              قيد الانتظار
            </button>
            <button
              onClick={() => setStatusFilter('Confirmed')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                statusFilter === 'Confirmed' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              مؤكد
            </button>
          </div>

          {/* Type filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setTypeFilter('All')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${
                typeFilter === 'All' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setTypeFilter('Home Visit')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                typeFilter === 'Home Visit' ? 'bg-rose-900 text-white shadow-2xs' : 'text-rose-900'
              }`}
            >
              منزلي
            </button>
            <button
              onClick={() => setTypeFilter('Lab Visit')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                typeFilter === 'Lab Visit' ? 'bg-blue-700 text-white shadow-2xs' : 'text-blue-700'
              }`}
            >
              معمل
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">كود الحجز</th>
                <th className="py-3 px-4">المريض</th>
                <th className="py-3 px-4">النوع / الموعد</th>
                <th className="py-3 px-4">الباقة / الفحوصات</th>
                <th className="py-3 px-4">المبلغ المتوقع</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    لا توجد حجوزات مطابقة لمعايير البحث
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    <td className="py-3 px-4 font-mono font-bold text-rose-950">
                      {booking.bookingCode}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{booking.patientName}</div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{booking.phone}</span>
                      </div>
                      {booking.address && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{booking.address}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {booking.type === 'Home Visit' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            <Home className="w-3 h-3" />
                            زيارة منزلية
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Building className="w-3 h-3" />
                            زيارة الفرع
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono mt-1">
                        {booking.bookingDate} · {booking.bookingTime}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">
                        {booking.packageName || 'تحاليل فردية'}
                      </div>
                      {booking.fastingRequired && (
                        <span className="inline-block text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded mt-1">
                          يتطلب صيام
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {booking.estimatedAmount || 0} ج.م
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                        booking.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : booking.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {booking.status === 'Confirmed' ? 'مؤكد' :
                         booking.status === 'Pending' ? 'قيد الانتظار' : 'ملغي'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        
                        {/* Status toggles */}
                        {booking.status !== 'Confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(booking, 'Confirmed')}
                            title="تأكيد الحجز"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        {/* WhatsApp modal */}
                        <button
                          onClick={() => setWhatsappModalBooking(booking)}
                          title="إرسال تأكيد WhatsApp"
                          className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        {/* Convert to Order */}
                        {!booking.convertedToOrderId ? (
                          <button
                            onClick={() => onConvertBookingToOrder(booking)}
                            title="تحويل الحجز إلى طلب فحص Order فعلي"
                            className="flex items-center gap-1 px-2 py-1 bg-rose-900 hover:bg-rose-950 text-white rounded text-[11px] font-semibold cursor-pointer"
                          >
                            <ArrowRightCircle className="w-3.5 h-3.5" />
                            <span>تحويل لطلب</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            تم التحويل
                          </span>
                        )}

                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEdit(booking)}
                          title="تعديل الحجز"
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(booking)}
                          title="حذف نهائي للحجز"
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* WhatsApp Modal */}
      {whatsappModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  إرسال رسالة تأكيد الحجز للمريض عبر WhatsApp
                </h3>
              </div>
              <button 
                onClick={() => setWhatsappModalBooking(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-800">
              {handleGenerateWhatsAppText(whatsappModalBooking)}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-mono">
                رقم المستلم: {whatsappModalBooking.phone}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWhatsappModalBooking(null)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  إغلاق
                </button>
                <a
                  href={`https://wa.me/20${whatsappModalBooking.phone.replace(/^0+/, '')}?text=${encodeURIComponent(handleGenerateWhatsAppText(whatsappModalBooking))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>فتح في WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Booking Modal */}
      {isModalOpen && editingBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSubmitModal} className="bg-white rounded-xl max-w-lg w-full p-5 border border-slate-200 shadow-xl space-y-4 text-xs text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingBooking.patientName ? `تعديل الحجز: ${editingBooking.bookingCode}` : 'إنشاء حجز جديد'}
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
                <label className="block text-slate-700 font-bold mb-1">اسم المريض</label>
                <input
                  type="text"
                  required
                  value={editingBooking.patientName || ''}
                  onChange={e => setEditingBooking({ ...editingBooking, patientName: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  required
                  value={editingBooking.phone || ''}
                  onChange={e => setEditingBooking({ ...editingBooking, phone: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">نوع الزيارة</label>
                <select
                  value={editingBooking.type || 'Home Visit'}
                  onChange={e => setEditingBooking({ ...editingBooking, type: e.target.value as BookingType })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Home Visit">زيارة منزلية (سحب بالمنزل)</option>
                  <option value="Lab Visit">زيارة المعمل (الفرع الرئيسي)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">حالة الحجز</label>
                <select
                  value={editingBooking.status || 'Pending'}
                  onChange={e => setEditingBooking({ ...editingBooking, status: e.target.value as BookingStatus })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Pending">قيد الانتظار</option>
                  <option value="Confirmed">مؤكد</option>
                  <option value="Cancelled">ملغي</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">تاريخ الحجز</label>
                <input
                  type="date"
                  value={editingBooking.bookingDate || ''}
                  onChange={e => setEditingBooking({ ...editingBooking, bookingDate: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">الوقت المفضل</label>
                <input
                  type="text"
                  value={editingBooking.bookingTime || ''}
                  onChange={e => setEditingBooking({ ...editingBooking, bookingTime: e.target.value })}
                  placeholder="مثال: 10:00 ص"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">العنوان بالتفصيل (للزياة المنزلية)</label>
              <input
                type="text"
                value={editingBooking.address || ''}
                onChange={e => setEditingBooking({ ...editingBooking, address: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">الباقة أو الفحوصات المطلوبة</label>
              <input
                type="text"
                value={editingBooking.packageName || ''}
                onChange={e => setEditingBooking({ ...editingBooking, packageName: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">ملاحظات إضافية</label>
              <textarea
                rows={2}
                value={editingBooking.notes || ''}
                onChange={e => setEditingBooking({ ...editingBooking, notes: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
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
                حفظ الحجز
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
