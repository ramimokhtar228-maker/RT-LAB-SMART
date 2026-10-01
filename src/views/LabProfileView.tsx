import React from 'react';
import { RT_LAB_INFO } from '../data/labInfo';
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
  QrCode
} from 'lucide-react';

export const LabProfileView: React.FC = () => {
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

      {/* Branches Section */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Building className="w-4 h-4 text-blue-600" />
          <span>شبكة فروع معامل RT المعتمدة (Authorized Branches Network)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RT_LAB_INFO.branches.map((branch) => (
            <div key={branch.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">
                  {branch.arabicName}
                </h3>
                {branch.isMainBranch && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    المركز الرئيسي
                  </span>
                )}
              </div>

              <div className="text-slate-600 flex items-start gap-1.5 pt-1">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{branch.address}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-slate-600 pt-1">
                <div className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{branch.phone} / {branch.mobile}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{branch.workingHours}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 flex items-center justify-between">
                <span>مدير الفرع: {branch.manager}</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>استقبال عينات نشط</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
