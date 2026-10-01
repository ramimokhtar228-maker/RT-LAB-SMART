import React, { useState, useEffect } from 'react';
import { RT_LAB_INFO, LabBranch } from '../data/labInfo';
import { StorageService } from '../services/storage';
import { 
  Building, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Award, 
  Mail, 
  Globe, 
  User, 
  PhoneCall, 
  CheckCircle2, 
  Sparkles,
  QrCode,
  Plus,
  Trash2,
  X,
  PlusCircle
} from 'lucide-react';

export const LabProfileView: React.FC = () => {
  const [branches, setBranches] = useState<LabBranch[]>(StorageService.getBranches());
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [newBranch, setNewBranch] = useState<Partial<LabBranch>>({
    arabicName: '',
    name: '',
    address: '',
    phone: '',
    mobile: '',
    manager: '',
    workingHours: 'من 9:00 صباحاً حتى 11:00 مساءً',
    isMainBranch: false
  });

  useEffect(() => {
    const unsub = StorageService.subscribe(() => {
      setBranches(StorageService.getBranches());
    });
    return unsub;
  }, []);

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.arabicName || !newBranch.address) {
      alert('يرجى كتابة اسم الفرع بالعربي والعنوان بالتفصيل.');
      return;
    }

    const branch: LabBranch = {
      id: 'branch-' + Date.now(),
      name: newBranch.name || newBranch.arabicName || 'New Branch',
      arabicName: newBranch.arabicName,
      address: newBranch.address,
      phone: newBranch.phone || RT_LAB_INFO.hotline,
      mobile: newBranch.mobile || newBranch.phone || RT_LAB_INFO.hotline,
      manager: newBranch.manager || 'طبيب استشاري باثولوجيا',
      workingHours: newBranch.workingHours || 'من 9:00 صباحاً حتى 11:00 مساءً',
      isMainBranch: !!newBranch.isMainBranch
    };

    const updated = StorageService.saveBranch(branch);
    setBranches([...updated]);
    setIsAddBranchModalOpen(false);
    setNewBranch({
      arabicName: '',
      name: '',
      address: '',
      phone: '',
      mobile: '',
      manager: '',
      workingHours: 'من 9:00 صباحاً حتى 11:00 مساءً',
      isMainBranch: false
    });
  };

  const handleDeleteBranch = (branch: LabBranch) => {
    if (branches.length <= 1) {
      alert('لا يمكن حذف الفرع الوحيد المتبقي للمعمل.');
      return;
    }

    if (confirm(`هل أنت متأكد من الحذف النهائي للفرع (${branch.arabicName})؟\nسيتم حذف الفرع من جميع الأجهزة فوراً.`)) {
      const updated = StorageService.deleteBranch(branch.id);
      setBranches([...updated]);
    }
  };
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Official Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
          
          <img 
            src={RT_LAB_INFO.logoUrl} 
            alt="RT LAB Logo" 
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-contain shadow-xs border border-slate-100 p-1"
            referrerPolicy="no-referrer"
          />

          <div className="space-y-2 text-center sm:text-right flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>{RT_LAB_INFO.isoAccreditation}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {RT_LAB_INFO.nameArabic}
            </h1>

            <p className="text-sm font-semibold text-blue-800 font-sans" dir="ltr">
              {RT_LAB_INFO.nameEnglish}
            </p>

            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              {RT_LAB_INFO.taglineArabic} · {RT_LAB_INFO.taglineEnglish}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 font-mono">
              <span className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                {RT_LAB_INFO.licenseNumber}
              </span>
              <span className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                {RT_LAB_INFO.commercialRecord}
              </span>
              <span className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                {RT_LAB_INFO.taxNumber}
              </span>
            </div>
          </div>

        </div>

        {/* Contact Numbers and Medical Leadership */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          
          {/* Medical Director */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <User className="w-4 h-4 text-blue-700" />
              <span>القيادة والإدارة الطبية (Medical Leadership)</span>
            </div>
            <div className="font-extrabold text-slate-900 text-sm">
              {RT_LAB_INFO.medicalDirectorArabic}
            </div>
            <div className="text-[11px] font-bold text-blue-800">
              {RT_LAB_INFO.medicalDirectorEnglish}
            </div>
            <p className="text-slate-600 leading-relaxed">
              {RT_LAB_INFO.medicalDirectorTitleArabic}
            </p>
            <p className="text-[11px] text-slate-500 font-sans" dir="ltr">
              {RT_LAB_INFO.medicalDirectorTitleEnglish}
            </p>
          </div>

          {/* Direct Communication Channels */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>قنوات الاتصال المباشرة للمعمل</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">الخط الساخن المركزي:</span>
                <span className="font-mono font-bold text-blue-900 text-base">{RT_LAB_INFO.hotline}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">واتساب الزيارات المنزلية:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">{RT_LAB_INFO.homeVisitPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">البريد الإلكتروني:</span>
                <span className="font-mono text-slate-700">{RT_LAB_INFO.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">الموقع الإلكتروني:</span>
                <span className="font-mono text-slate-700">{RT_LAB_INFO.website}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Visual Identity Gallery */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Building className="w-4 h-4 text-rose-800" />
          <span>الهوية البصرية وتجهيزات معامل رامي مختار RT LAB</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Logo Showcase */}
          <div className="bg-slate-950 text-white rounded-xl p-4 border border-slate-800 shadow-sm flex flex-col items-center justify-between text-center group">
            <div className="p-3 bg-black/60 rounded-xl border border-red-900/40 w-full flex items-center justify-center">
              <img 
                src={RT_LAB_INFO.logoUrl} 
                alt="شعار معامل رامي مختار RT LABS" 
                className="w-36 h-36 object-contain rounded-lg shadow-lg group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="pt-3">
              <h3 className="font-bold text-white text-sm">الشعار المعتمد - RT LABS</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">قطرة الدم الياقوتية والدوائر الجزيئية المتطورة</p>
            </div>
          </div>

          {/* Reception Photo Showcase */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="rounded-lg overflow-hidden border border-slate-100 bg-slate-100 aspect-4/3 flex items-center justify-center">
              <img 
                src={RT_LAB_INFO.receptionPhotoUrl} 
                alt="استقبال معامل رامي مختار RT LAB" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="pt-3">
              <h3 className="font-bold text-slate-900 text-sm">صالة الاستقبال والانتظار</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">مقر بهتيم الرئيسي - كاونتر RT LAB وشعار معامل رامي مختار</p>
            </div>
          </div>

          {/* Medical Team Photo Showcase */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="rounded-lg overflow-hidden border border-slate-100 bg-slate-100 aspect-4/3 flex items-center justify-center">
              <img 
                src={RT_LAB_INFO.teamPhotoUrl} 
                alt="فريق أطباء واستشاريي معامل رامي مختار" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="pt-3">
              <h3 className="font-bold text-slate-900 text-sm">الفريق الطبي والاستشاري</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">نخبة من أطباء وأخصائيي التحاليل الطبية والباثولوجيا الإكلينيكية</p>
            </div>
          </div>

        </div>
      </div>

      {/* Branches Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>شبكة فروع معامل RT المعتمدة ({branches.length} فروع)</span>
            </h2>
            <p className="text-xs text-slate-500">إدارة الفروع، إضافة فرع جديد للمعمل أو حذف فرع</p>
          </div>

          <button
            onClick={() => setIsAddBranchModalOpen(true)}
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة فرع جديد (Add Branch)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map((branch) => (
            <div key={branch.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-2.5 text-xs hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {branch.arabicName}
                  </h3>
                  {branch.isMainBranch && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      المركز الرئيسي
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteBranch(branch)}
                  title="حذف هذا الفرع"
                  className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-slate-600 flex items-start gap-1.5 pt-1">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{branch.address}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-slate-600 pt-1">
                <div className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{branch.phone} {branch.mobile && branch.mobile !== branch.phone ? `/ ${branch.mobile}` : ''}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{branch.workingHours}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>مدير الفرع: <strong className="text-slate-700">{branch.manager}</strong></span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>استقبال عينات نشط</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Branch Modal */}
      {isAddBranchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleAddBranch} className="bg-white rounded-2xl max-w-lg w-full p-5 border border-slate-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  إضافة فرع جديد لمعامل رامي مختار RT LAB
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddBranchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم الفرع بالعربي *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فرع مدينة نصر - شارع عباس العقاد"
                  value={newBranch.arabicName || ''}
                  onChange={e => setNewBranch({ ...newBranch, arabicName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم الفرع بالإنجليزي (اختياري)</label>
                <input
                  type="text"
                  placeholder="e.g. Nasr City Branch"
                  value={newBranch.name || ''}
                  onChange={e => setNewBranch({ ...newBranch, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">العنوان بالتفصيل *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="العنوان، رقم المبنى، الدور، المعلم البارز..."
                  value={newBranch.address || ''}
                  onChange={e => setNewBranch({ ...newBranch, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رقم الهاتف الأرضي / المباشر</label>
                  <input
                    type="text"
                    placeholder="01100874444"
                    value={newBranch.phone || ''}
                    onChange={e => setNewBranch({ ...newBranch, phone: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">الموبايل / واتساب</label>
                  <input
                    type="text"
                    placeholder="01100046841"
                    value={newBranch.mobile || ''}
                    onChange={e => setNewBranch({ ...newBranch, mobile: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">مدير الفرع</label>
                  <input
                    type="text"
                    placeholder="د. أحمد مصطفى"
                    value={newBranch.manager || ''}
                    onChange={e => setNewBranch({ ...newBranch, manager: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">مواعيد العمل</label>
                  <input
                    type="text"
                    placeholder="من 8:00 ص حتى 12:00 م"
                    value={newBranch.workingHours || ''}
                    onChange={e => setNewBranch({ ...newBranch, workingHours: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!newBranch.isMainBranch}
                    onChange={e => setNewBranch({ ...newBranch, isMainBranch: e.target.checked })}
                    className="rounded text-blue-700 focus:ring-blue-600"
                  />
                  <span className="text-slate-700 font-medium">تعيين كفرع رئيسي للمعمل (Main Headquarters)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddBranchModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold shadow-xs cursor-pointer"
              >
                حفظ وإضافة الفرع
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
