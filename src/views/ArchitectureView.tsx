import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { 
  Layers, 
  Database, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Smartphone, 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  FileCode, 
  Key,
  Server,
  Code2
} from 'lucide-react';

interface ArchitectureViewProps {
  onRefreshData: () => void;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({
  onRefreshData
}) => {
  const [copiedSQL, setCopiedSQL] = useState(false);

  const handleExportJSON = () => {
    const jsonStr = StorageService.exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RT_LAB_DATABASE_BACKUP_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetDemo = () => {
    if (confirm('هل أنت متأكد من إعادة ضبط البيانات إلى الحالة التجريبية المعتمدة؟ سيتم مسح أي طلبات جديدة غير محفوظة.')) {
      StorageService.resetToDemo();
      onRefreshData();
      alert('تم إعادة ضبط قاعدة البيانات المحلية بنجاح.');
    }
  };

  const sampleSupabaseSQL = `-- RT LAB LIS: Master Schema for Supabase / PostgreSQL
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT CHECK (gender IN ('Male', 'Female')),
  national_id TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  barcode TEXT NOT NULL,
  specimen_status TEXT NOT NULL,
  order_status TEXT NOT NULL,
  report_status TEXT NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  paid_amount NUMERIC(10,2) NOT NULL,
  remaining_amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS) & RBAC
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pathologists and Technologists have full access"
ON orders FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' IN ('Pathologist', 'Technologist', 'LabManager'));
`;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-600 mb-1">
            <Layers className="w-4 h-4" />
            <span>المعمارية والجاهزية السحابية (Sections 20, 21, 22, 24: Architecture & Cloud Readiness)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            مخطط المعمارية، قواعد أمان RLS، والتكامل مع Supabase / PostgreSQL
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            المقارنة الموثقة بين التخزين المحلي السريع ومخطط قواعد البيانات السحابية المركزية لربط جميع فروع معامل RT.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تصدير نسخة احتياطية (JSON)</span>
          </button>

          <button
            onClick={handleResetDemo}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة ضبط البيانات</span>
          </button>
        </div>
      </div>

      {/* Comparison Grid: Local vs Cloud (Section 21 & 24) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Local Architecture (Current) */}
        <div className="bg-white rounded-xl p-5 border border-blue-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                1. البنية التحتية الحالية (Local DB + PWA)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Active Now
            </span>
          </div>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>React 19 + TypeScript + Tailwind:</strong> أداء فائق السرعة وخفة استجابة بدون تحميل صفحات.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>تخزين محلي فوري (LocalStorage Engine):</strong> حفظ دائم لكل مريض، طلب، نتيجة، وكاشف دون انقطاع.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>دعم وضع عدم الاتصال (Offline-first / PWA):</strong> إمكانية التثبيت على أجهزة المعمل وأجهزة الأطباء كتابلت أو حاسوب.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>محرك الطباعة الطبية المتوافق مع A4:</strong> تقارير منسقة بالملي بدون تشويه للتنسيق.</span>
            </li>
          </ul>
        </div>

        {/* Cloud Architecture (Proposed in Section 22) */}
        <div className="bg-white rounded-xl p-5 border border-sky-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                2. المعمارية السحابية المقترحة (Supabase Cloud LIS)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
              Production Plan
            </span>
          </div>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span><strong>قاعدة بيانات PostgreSQL العلائقية:</strong> استعلامات دقيقة و Pagination ومزامنة بين كافة الفروع.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span><strong>Supabase Realtime WebSockets:</strong> وصول النتيجة من جهاز التحليل إلى شاشة الطبيب في أجزاء من الثانية.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span><strong>Row Level Security (RLS) + RBAC:</strong> فصل دقيق لصلاحيات الفني والاستشاري ومسؤول الاستقبال والمدير المالي.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span><strong>تكامل أجهزة التحاليل السحابي:</strong> وسيط بروتوكول ASTM / HL7 متصل بالإنترنت.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* SQL Migration Script Box */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Code2 className="w-4 h-4" />
            <span>مخطط الجداول المرجعي للترقية إلى PostgreSQL / Supabase SQL</span>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(sampleSupabaseSQL);
              setCopiedSQL(true);
              setTimeout(() => setCopiedSQL(false), 2000);
            }}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded cursor-pointer"
          >
            {copiedSQL ? 'تم النسخ!' : 'نسخ كود SQL'}
          </button>
        </div>

        <pre className="font-mono text-xs text-sky-300 bg-slate-950 p-3 rounded-lg overflow-x-auto leading-relaxed" dir="ltr">
          {sampleSupabaseSQL}
        </pre>
      </div>

    </div>
  );
};
