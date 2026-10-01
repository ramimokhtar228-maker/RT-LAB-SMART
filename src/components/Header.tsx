import React from 'react';
import { RT_LAB_INFO } from '../data/labInfo';
import { UserRole } from '../types/lis';
import { 
  Building2, 
  UserCheck, 
  PlusCircle, 
  AlertTriangle,
  PhoneCall,
  Wifi,
  Github,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  activeBranch: string;
  onSelectBranch: (branchId: string) => void;
  currentUserRole: UserRole;
  onChangeUserRole: (role: UserRole) => void;
  onOpenNewOrder: () => void;
  criticalAlertCount: number;
  onOpenCriticalAlerts: () => void;
  onOpenGithubGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeBranch,
  onSelectBranch,
  currentUserRole,
  onChangeUserRole,
  onOpenNewOrder,
  criticalAlertCount,
  onOpenCriticalAlerts,
  onOpenGithubGuide
}) => {
  const currentBranch = RT_LAB_INFO.branches.find(b => b.id === activeBranch) || RT_LAB_INFO.branches[0];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs no-print">
      <div className="flex items-center justify-between px-3 sm:px-6 h-16">
        
        {/* Zone 1: Brand & Identity (Dark Red & Deep Blue) */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={RT_LAB_INFO.logoUrl} 
              alt="معامل رامي مختار RT LAB" 
              className="w-11 h-11 rounded-xl object-contain shadow-xs border-2 border-red-900/30 p-0.5 bg-white"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" title="متصل بالشبكة الحية"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black text-rose-950 tracking-tight">
                معامل رامي مختار
              </span>
              <span className="text-xs font-black text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded border border-blue-300">
                RT LAB
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:flex items-center gap-1.5 font-medium">
              <span>{RT_LAB_INFO.taglineArabic}</span>
              <span className="text-slate-300">|</span>
              <span className="text-rose-900 font-bold">إدارة: د. رامي مختار & د. رحاب عبدالحميد</span>
            </p>
          </div>
        </div>

        {/* Zone 2: Realtime Multi-Device Sync & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Multi-Device Live Sync Badge */}
          <div 
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold shadow-2xs"
            title="البيانات متزامنة فورياً لحظة بلحظة مع كل الأجهزة المتصلة بالمعمل والفروع"
          >
            <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>مزامنة فورية متعددة الأجهزة (Live Multi-Device)</span>
          </div>

          {/* GitHub & Online Run Button */}
          <button
            onClick={onOpenGithubGuide}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            title="دليل تنزيل البرنامج على GitHub وتشغيله أونلاين"
          >
            <Github className="w-3.5 h-3.5 text-emerald-400" />
            <span>GitHub & تشغيل أونلاين</span>
          </button>

          {/* Critical Value Alert Indicator if any */}
          {criticalAlertCount > 0 && (
            <button
              onClick={onOpenCriticalAlerts}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-300 rounded-lg text-xs font-bold animate-pulse hover:bg-rose-100 transition-colors"
              title="تنبيه: يوجد نتائج حرجة بحاجة لإبلاغ الطبيب"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>{criticalAlertCount} قيمة حرجة</span>
            </button>
          )}

          {/* Branch Switcher */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
            <Building2 className="w-3.5 h-3.5 text-rose-800" />
            <select
              value={activeBranch}
              onChange={(e) => onSelectBranch(e.target.value)}
              className="bg-transparent border-none text-slate-800 font-bold focus:outline-hidden cursor-pointer"
            >
              {RT_LAB_INFO.branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.arabicName}
                </option>
              ))}
            </select>
          </div>

          {/* User Role Switcher for Medical Permissions */}
          <div className="flex items-center gap-1.5 bg-blue-50/60 border border-blue-200 rounded-lg px-2.5 py-1 text-xs">
            <UserCheck className="w-3.5 h-3.5 text-blue-700" />
            <select
              value={currentUserRole}
              onChange={(e) => onChangeUserRole(e.target.value as UserRole)}
              className="bg-transparent border-none text-blue-950 font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="Pathologist">دكتور استشاري (د. رامي / د. رحاب)</option>
              <option value="Technologist">فني مختبر (إدخال وفحص)</option>
              <option value="Receptionist">موظف استقبال (حجز وطلبات)</option>
              <option value="LabManager">مدير المعمل (إشراف كامل)</option>
            </select>
          </div>

          {/* Hotline chip */}
          <div className="hidden xl:flex items-center gap-1 text-xs text-slate-600 font-mono font-bold">
            <PhoneCall className="w-3 h-3 text-rose-700" />
            <span>{RT_LAB_INFO.phone1} / {RT_LAB_INFO.phone2}</span>
          </div>
        </div>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewOrder}
            className="flex items-center gap-1.5 bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">طلب فحص جديد (New Order)</span>
            <span className="sm:hidden">طلب جديد</span>
          </button>
        </div>

      </div>
    </header>
  );
};
