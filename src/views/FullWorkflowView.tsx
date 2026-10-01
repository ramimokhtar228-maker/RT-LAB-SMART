import React, { useState } from 'react';
import { 
  Workflow, 
  UserCheck, 
  FilePlus, 
  TestTube2, 
  Calculator, 
  CreditCard, 
  Barcode, 
  Clock, 
  CheckCircle2, 
  Microscope, 
  ShieldCheck, 
  ArrowUpDown, 
  AlertOctagon, 
  Sparkles, 
  FileText, 
  Send, 
  Globe2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const FullWorkflowView: React.FC = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const steps = [
    {
      num: 1,
      title: 'Patient Registration (تسجيل المريض)',
      icon: UserCheck,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      summary: 'تسجيل البيانات الديموغرافية والاتصال والتاريخ المرضي.',
      details: 'إدخال اسم المريض، الهاتف، الرقم القومي، النوع، العمر، العنوان، الحساسية الدوائية، والأمراض المزمنة لتأسيس سجله الطبي المركزي.'
    },
    {
      num: 2,
      title: 'Patient ID (توليد المعرف الطبي الموحد)',
      icon: ShieldCheck,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
      summary: 'تخصيص كود فريد للمريض يربط كل زياراته المستقبلية.',
      details: 'يضمن عدم تكرار الملفات وإمكانية استرجاع تاريخ التحاليل السابقة وإجراء المقارنات التاريخية ودلتا تشيك بكل موثوقية.'
    },
    {
      num: 3,
      title: 'New Order (إنشاء طلب فحص جديد)',
      icon: FilePlus,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      summary: 'تحديد نوعية الزيارة والفرع والطبيب المعالج والأولوية.',
      details: 'اختيار الفرع، الطبيب المعالج، وتحديد أولوية الفحص ما بين Routine (روتيني) أو STAT (طوارئ عاجل).'
    },
    {
      num: 4,
      title: 'Select Tests / Profile (اختيار التحاليل والباقات)',
      icon: TestTube2,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      summary: 'اختيار الفحوصات الفردية أو حزم الفحص الشامل المخفضة.',
      details: 'استعراض الدليل الشامل من صور دم وكيمياء وهرمونات وباقات الفحص الشامل VIP أو السكر أو الكبد والكلى.'
    },
    {
      num: 5,
      title: 'Calculate Price (حساب التكلفة والخصومات)',
      icon: Calculator,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      summary: 'احتساب السعر الإجمالي، الخصم، والسعر الصافي (Net Price).',
      details: 'حساب مالي فوري يوضح الإجمالي، الخصم المعتمد، الصافي المستحق، وتحديد شروط السداد.'
    },
    {
      num: 6,
      title: 'Payment (السداد والخزينة)',
      icon: CreditCard,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
      summary: 'تسجيل الدفع نقداً، InstaPay، محافظ الهاتف، أو بطاقات الائتمان.',
      details: 'إصدار إيصال استلام نقدية رسمي وتوثيق المبلغ المدفوع والمتبقي في سجل الخزينة اليومي.'
    },
    {
      num: 7,
      title: 'Tubes & Barcode (حساب الأنابيب وتوليد الباركود)',
      icon: Barcode,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      summary: 'حساب أوتوماتيكي لألوان الأنابيب المطلوبة وطباعة ملصقات الباركود.',
      details: 'يحدد النظام تلقائياً كمية ونوع الأنابيب (EDTA بنفسجي، سيروم جل ذهبي، سترات أزرق، فلوريد رمادي) مع طباعة باركود Code128 لكل أنبوبة.'
    },
    {
      num: 8,
      title: 'Sample Collection (سحب العينات)',
      icon: Clock,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      summary: 'سحب العينات بدقة مع التحقق من شروط الصيام.',
      details: 'يقوم فني السحب بسحب الدم، والتأكد من الترتيب الصحيح للأنابيب (Order of Draw)، وتوثيق وقت السحب واسم الساحب.'
    },
    {
      num: 9,
      title: 'Sample Reception (استلام وتجهيز العينات)',
      icon: CheckCircle2,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      summary: 'الفصل بالطرد المركزي (Centrifugation) والتسليم لمختبر التحليل.',
      details: 'فحص جودة العينة (خلوها من التحلل Hemolysis أو الدهون Lipemia) وفصل السيروم أو البلازما وتجهيزها للفحص.'
    },
    {
      num: 10,
      title: 'Analyzer / Manual Entry (الفحص الآلي والإدخال)',
      icon: Microscope,
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      summary: 'فحص العينات على أجهزة السيسماكس والروش عبر ASTM/HL7.',
      details: 'نقل النتائج آلياً بدون خطأ بشري عبر واجهات الربط الإلكتروني أو الإدخال اليدوي للفحوصات التقديرية والميكروسكوبية.'
    },
    {
      num: 11,
      title: 'Auto Validation (المطابقة الآلية الأولية)',
      icon: ShieldCheck,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      summary: 'فحص النتائج وفق المعدلات الفسيولوجية للجنس والعمر.',
      details: 'يقوم النظام بتمييز النتائج الطبيعية Normal من الشاذة High/Low وتعيين الـ Flag فوراً.'
    },
    {
      num: 12,
      title: 'Delta Check Engine (محرك دلتا تشيك)',
      icon: ArrowUpDown,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      summary: 'مقارنة النتيجة الحالية بالفحص السابق للمريض.',
      details: 'إذا زادت نسبة التغير عن المعدل المسموح (مثل قفزة في الكرياتينين تزيد عن 30%)، يطلق النظام تحذيراً فورياً لإعادة الفحص والتأكد.'
    },
    {
      num: 13,
      title: 'Critical Value Alert (رصد القيم الحرجة Panic Values)',
      icon: AlertOctagon,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      summary: 'تنبيه طارئ للنتائج التي تهدد حياة المريض وتوثيق إبلاغ الطبيب.',
      details: 'إطلاق إشعار أحمر وامض في النظام وتوثيق توقيت الاتصال بالطبيب المعالج هاتفياً لإنقاذ المريض.'
    },
    {
      num: 14,
      title: 'Technical Verification (المراجعة والتحقق الفني)',
      icon: UserCheck,
      color: 'text-cyan-700 bg-cyan-50 border-cyan-200',
      summary: 'مراجعة أخصائي التحاليل الكيميائي ومطابقة نتائج الجودة الداخلية QC.',
      details: 'التأكد من سير كيرفات المعايرة وجودة التشغيل قبل رفع التقرير للاستشاري.'
    },
    {
      num: 15,
      title: 'Pathologist Approval (الاعتماد الطبي النهائي)',
      icon: ShieldCheck,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
      summary: 'المراجعة الطبية النهائية من استشاري الباثولوجيا الإكلينيكية.',
      details: 'صلاحية طبية حصرية للدكتور الاستشاري لمراجعة الحالة والاعتماد بالتوقيع والختم الرقمي المعتمد.'
    },
    {
      num: 16,
      title: 'Clinical Interpretation (التفسير والربط السريري)',
      icon: Sparkles,
      color: 'text-indigo-800 bg-indigo-50 border-indigo-200',
      summary: 'صياغة التفسير الطبي والتعليقات والتوصيات الموجهة للطبيب المعالج.',
      details: 'إضافة ملخص طبي يربط بين النتائج المخبرية وخطة المتابعة والعلاج.'
    },
    {
      num: 17,
      title: 'Release, Print & WhatsApp (إصدار وتسليم التقرير)',
      icon: Send,
      color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      summary: 'طباعة التقرير الرسمي A4 وإرساله للمريض عبر واتساب وبوابة الـ Portal.',
      details: 'إتاحة التقرير مع كود QR للتحقق الرقمي، وتنزيل نسخة PDF رسمية أو استلام التقرير الورقي المطبوع.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
            <Workflow className="w-4 h-4" />
            <span>المسار الطبي الشامل الموثق (Section 23: Complete Clinical Workflow)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            سير العمل المخبري المرجعي لمعامل RT - من التسجيل حتى التسليم
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            17 مرحلة متكاملة تضمن دقة التشخيص، الجودة الشاملة، السلامة المهنية، والاعتماد الطبي النهائي.
          </p>
        </div>

        <div className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
          ISO 15189 Compliant Workflow
        </div>
      </div>

      {/* Accordion / Interactive Timeline */}
      <div className="space-y-3">
        {steps.map((step) => {
          const Icon = step.icon;
          const isExpanded = expandedStep === step.num;

          return (
            <div 
              key={step.num}
              className={`rounded-xl border transition-all overflow-hidden ${
                isExpanded 
                  ? 'bg-white border-blue-300 shadow-xs' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => setExpandedStep(isExpanded ? null : step.num)}
                className="w-full text-right p-4 flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border ${step.color}`}>
                    {step.num}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {step.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Icon className="w-4 h-4 text-slate-400" />
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-4 pt-1 border-t border-slate-100 text-xs text-slate-700 leading-relaxed bg-slate-50/50">
                  <p>{step.details}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
