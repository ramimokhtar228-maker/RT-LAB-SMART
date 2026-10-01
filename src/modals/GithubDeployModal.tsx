import React, { useState } from 'react';
import { 
  Github, 
  X, 
  Copy, 
  Check, 
  Globe, 
  ExternalLink, 
  Server, 
  Wifi, 
  Laptop, 
  Smartphone, 
  Layers,
  Terminal,
  Download
} from 'lucide-react';
import { RT_LAB_INFO } from '../data/labInfo';
import { StorageService } from '../services/storage';

interface GithubDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GithubDeployModal: React.FC<GithubDeployModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExportBackup = () => {
    const jsonStr = StorageService.exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RT_LAB_DATABASE_BACKUP_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://rtlab.app';

  const gitCommands = [
    `# 1. تهيئة مستودع Git وربطه بحسابك على GitHub:
git init
git add .
git commit -m "إطلاق نظام إدارة المختبرات الطبية معامل رامي مختار RT LAB LIS"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rt-lab-lis.git
git push -u origin main`,

    `# 2. بناء وتشغيل المشروع محلياً أو على خادم المعمل المركزي:
npm install
npm run build
npm start   # يشغل السيرفر المركزي على المنفذ 3000 مع المزامنة اللحظية بين الأجهزة`,

    `# 3. النشر المجاني الفوري برابط عام مع Vercel / Render / Cloud Run:
# الخيار أ: Vercel (بضغطة واحدة من خلال استيراد مستودع GitHub)
# الخيار ب: Render.com (Web Service -> Node -> Build: npm run build, Start: npm start)
# الخيار ج: GitHub Pages (للواجهة المستقلة)`
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-rose-950 to-blue-950 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Github className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                دليل رفع البرنامج على GitHub والتشغيل برابط مباشر
              </h2>
              <p className="text-xs text-slate-300">
                طريقة رفع كود {RT_LAB_INFO.nameArabic} على GitHub ومشاركته للعمل على جميع أجهزة المعمل
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-right">
          
          {/* Active Live Link Box */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1">
                <Wifi className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>الرابط المباشر للتشغيل الحالي (Multi-Device Active Link):</span>
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-slate-800 break-all select-all bg-white px-3 py-1.5 rounded-lg border border-emerald-200" dir="ltr">
                {currentUrl}
              </div>
            </div>

            <button
              onClick={() => handleCopy(currentUrl, 99)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              {copiedIndex === 99 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedIndex === 99 ? 'تم نسخ الرابط!' : 'نسخ رابط التشغيل'}</span>
            </button>
          </div>

          {/* Golden Rule: Multi-Device Sync Explanation */}
          <div className="bg-blue-50 border border-blue-300 rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
              <Laptop className="w-4 h-4 text-blue-700" />
              <span>كيف يعمل النظام بحيث "إذا اشتغلت على جهاز يسمع في باقي الأجهزة"؟</span>
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              تم بناء النظام بنظام تزامن مركزي ذكي (Full-Stack Realtime Sync Engine):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-blue-200">
                <strong className="text-blue-900 block mb-1">1. الخادم المركزي (Server):</strong>
                يحفظ قاعدة بيانات المعمل لحظياً في <span className="font-mono text-[11px] text-rose-800">central_lab_database.json</span>.
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-200">
                <strong className="text-blue-900 block mb-1">2. البث المباشر (SSE Stream):</strong>
                يرسل إشعاراً فورياً لكل شاشة متصلة ثانية تسجيل أو تعديل أي طلب أو نتيجة.
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-200">
                <strong className="text-blue-900 block mb-1">3. التزامن الدوري الذكي:</strong>
                يقوم كل جهاز بالتحديث التلقائي كل 4 ثوانٍ وعند فتح الشاشة لضمان عدم فقدان أي بيان.
              </div>
            </div>
          </div>

          {/* GitHub Step by Step */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
              <Terminal className="w-4 h-4 text-rose-800" />
              <span>خطوات الرفع على GitHub خطوة بخطوة:</span>
            </h3>

            {gitCommands.map((cmd, idx) => (
              <div key={idx} className="bg-slate-900 rounded-xl p-3 sm:p-4 text-slate-200 space-y-2 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-emerald-400">الخطوة {idx + 1}</span>
                  <button
                    onClick={() => handleCopy(cmd, idx)}
                    className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded transition-colors cursor-pointer"
                  >
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === idx ? 'تم النسخ!' : 'نسخ الأوامر'}</span>
                  </button>
                </div>
                <pre className="font-mono text-xs text-sky-300 overflow-x-auto p-2 bg-black/40 rounded leading-relaxed select-all" dir="ltr">
                  {cmd}
                </pre>
              </div>
            ))}
          </div>

          {/* PWA & Desktop App Installation */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-rose-700" />
                <span>تثبيت البرنامج كتطبيق على أجهزة الاستقبال واللاب توب (PWA Desktop App)</span>
              </h4>
              <p className="text-[11px] text-slate-600 mt-1">
                يمكن لأي موظف فتح الرابط في متصفح Chrome أو Edge والضغط على أيقونة التثبيت (Install) بجوار شريط العنوان ليعمل البرنامج بدون شريط المتصفح كتطبيق سطح مكتب أصيل.
              </p>
            </div>

            <button
              onClick={handleExportBackup}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-900 hover:bg-rose-950 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>تصدير نسخة احتياطية فورية (JSON)</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            معامل رامي مختار RT LAB · شبرا الخيمة · الخط الساخن: {RT_LAB_INFO.hotline}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>

      </div>
    </div>
  );
};
