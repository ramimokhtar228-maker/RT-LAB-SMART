import React from 'react';
import { RT_LAB_INFO } from '../data/labInfo';
import { 
  LayoutDashboard, 
  CalendarClock, 
  TestTube2, 
  FileSpreadsheet, 
  FileText, 
  Sparkles, 
  Users, 
  BookOpen, 
  Boxes, 
  DollarSign, 
  ShieldCheck, 
  UserCog, 
  Package, 
  Cpu, 
  Globe2, 
  Workflow, 
  Layers, 
  Building,
  CheckCircle2,
  AlertCircle,
  Award
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard'
  | 'bookings'
  | 'orders'
  | 'worklist'
  | 'flags'
  | 'smart-reports'
  | 'reports'
  | 'patients'
  | 'loyalty'
  | 'catalog'
  | 'packages'
  | 'financial'
  | 'ceo-share'
  | 'hr'
  | 'inventory'
  | 'devices'
  | 'portal'
  | 'workflow'
  | 'architecture'
  | 'lab-profile';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  waitingSamplingCount: number;
  worklistPendingCount: number;
  criticalCount: number;
  pendingBookingsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  waitingSamplingCount,
  worklistPendingCount,
  criticalCount,
  pendingBookingsCount
}) => {
  const navSections = [
    {
      title: 'التشغيل الطبي والعيّنات',
      items: [
        { 
          id: 'dashboard', 
          label: '1. Dashboard الرئيسية', 
          icon: LayoutDashboard,
          badge: null
        },
        { 
          id: 'bookings', 
          label: '2. Bookings الحجوزات والمنزل', 
          icon: CalendarClock,
          badge: pendingBookingsCount > 0 ? pendingBookingsCount : null,
          badgeColor: 'bg-amber-100 text-amber-800'
        },
        { 
          id: 'orders', 
          label: '3. Orders & Sampling السحب', 
          icon: TestTube2,
          badge: waitingSamplingCount > 0 ? waitingSamplingCount : null,
          badgeColor: 'bg-blue-100 text-blue-800'
        },
        { 
          id: 'worklist', 
          label: '6. Worklist قائمة العمل والنتائج', 
          icon: FileSpreadsheet,
          badge: worklistPendingCount > 0 ? worklistPendingCount : null,
          badgeColor: 'bg-indigo-100 text-indigo-800'
        },
        { 
          id: 'flags', 
          label: '7. Flags والتفسير السريري', 
          icon: AlertCircle,
          badge: criticalCount > 0 ? criticalCount : null,
          badgeColor: 'bg-rose-100 text-rose-800'
        },
      ]
    },
    {
      title: 'التقارير والمراجعة',
      items: [
        { 
          id: 'smart-reports', 
          label: '8. Smart Reports التقارير الذكية', 
          icon: Sparkles,
          badge: null
        },
        { 
          id: 'reports', 
          label: '9. Reports التقارير الرسمية والطباعة', 
          icon: FileText,
          badge: null
        },
        { 
          id: 'patients', 
          label: '10. Patients ملفات وسجل المرضى', 
          icon: Users,
          badge: null
        },
        { 
          id: 'loyalty', 
          label: '11. كروت الولاء ونقاط المكافآت RT', 
          icon: Award,
          badge: 'Rewards',
          badgeColor: 'bg-amber-400 text-slate-950 font-bold'
        },
      ]
    },
    {
      title: 'دليل التحاليل والباقات',
      items: [
        { 
          id: 'catalog', 
          label: '12. Test Catalog دليل التحاليل', 
          icon: BookOpen,
          badge: null
        },
        { 
          id: 'packages', 
          label: '13. Packages إدارة الباقات', 
          icon: Boxes,
          badge: null
        },
      ]
    },
    {
      title: 'الإدارة والتشغيل والمالية',
      items: [
        { 
          id: 'financial', 
          label: '14. Financial المالية والمصروفات', 
          icon: DollarSign,
          badge: null
        },
        { 
          id: 'ceo-share', 
          label: '15. CEO / Lab Share حصة الإدارة', 
          icon: ShieldCheck,
          badge: 'PIN',
          badgeColor: 'bg-purple-100 text-purple-800'
        },
        { 
          id: 'hr', 
          label: '16. HR الموظفين ومسير الرواتب', 
          icon: UserCog,
          badge: null
        },
        { 
          id: 'inventory', 
          label: '17. Inventory الكواشف والمخزون', 
          icon: Package,
          badge: null
        },
        { 
          id: 'devices', 
          label: '18. Device Interfacing ربط الأجهزة', 
          icon: Cpu,
          badge: 'ASTM',
          badgeColor: 'bg-emerald-100 text-emerald-800'
        },
        { 
          id: 'portal', 
          label: '19. Patient Portal بوابة المريض', 
          icon: Globe2,
          badge: null
        },
      ]
    },
    {
      title: 'المعمارية وبيانات معامل RT',
      items: [
        { 
          id: 'workflow', 
          label: '23. Full Medical Workflow المسار الشامل', 
          icon: Workflow,
          badge: null
        },
        { 
          id: 'architecture', 
          label: '24. Architecture والتحول السحابي', 
          icon: Layers,
          badge: 'Supabase',
          badgeColor: 'bg-sky-100 text-sky-800'
        },
        { 
          id: 'lab-profile', 
          label: 'بيانات وفروع معامل RT الرسمية', 
          icon: Building,
          badge: 'RT LAB',
          badgeColor: 'bg-blue-100 text-blue-800'
        },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-l border-slate-800 flex flex-col shrink-0 no-print select-none">
      <div className="p-3.5 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
        <img
          src={RT_LAB_INFO.logoUrl}
          alt="RT LAB Logo"
          className="w-10 h-10 object-contain rounded-xl border border-red-900/60 p-0.5 bg-white shadow-xs shrink-0"
          referrerPolicy="no-referrer"
        />
        <div className="space-y-0.5 overflow-hidden">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-xs font-black text-white truncate">معامل رامي مختار</span>
            <span className="text-[9px] font-bold text-amber-400 font-mono bg-amber-950/80 px-1 py-0.2 rounded border border-amber-800 shrink-0">RT LAB</span>
          </div>
          <div className="text-[9.5px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span>نظام LIS مباشر v2.5</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {navSections.map((section, sIdx) => (
          <div key={sIdx}>
            <div className="px-2 mb-1.5 text-[11px] font-bold text-slate-400 tracking-wide">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id as ActiveTab)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-right ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== null && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full shrink-0 font-bold ${
                          isActive
                            ? 'bg-white text-blue-700'
                            : (item.badgeColor || 'bg-slate-700 text-slate-200')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer info in sidebar */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950/40">
        <div className="flex items-center justify-between text-slate-300">
          <span>الربط مع الأجهزة:</span>
          <span className="text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Online (4)
          </span>
        </div>
        <div className="mt-1 text-[10px] text-slate-400">
          RT Clinical Laboratories System
        </div>
      </div>
    </aside>
  );
};
