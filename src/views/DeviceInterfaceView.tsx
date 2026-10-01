import React, { useState } from 'react';
import { AnalyzerDevice, Order } from '../types/lis';
import { 
  Cpu, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  Layers, 
  Server,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface DeviceInterfaceViewProps {
  devices: AnalyzerDevice[];
  orders: Order[];
  onSyncDeviceResults: (device: AnalyzerDevice) => void;
}

export const DeviceInterfaceView: React.FC<DeviceInterfaceViewProps> = ({
  devices,
  orders,
  onSyncDeviceResults
}) => {
  const [syncingDeviceId, setSyncingDeviceId] = useState<string | null>(null);
  const [syncLog, setSyncLog] = useState<string[]>([]);

  const handleRunSync = (device: AnalyzerDevice) => {
    setSyncingDeviceId(device.id);
    const now = new Date().toLocaleTimeString('ar-EG');
    setSyncLog(prev => [
      `[${now}] بدء الاتصال بجهاز ${device.name} عبر بروتوكول ${device.protocol} (IP: ${device.ipAddress}:${device.port})...`,
      ...prev
    ]);

    setTimeout(() => {
      onSyncDeviceResults(device);
      const doneTime = new Date().toLocaleTimeString('ar-EG');
      setSyncLog(prev => [
        `[${doneTime}] تم استقبال وتحليل حزم ASTM/HL7 بنجاح، وربط النتائج بأرقام الباركود وإدخالها في Worklist تلقائياً!`,
        ...prev
      ]);
      setSyncingDeviceId(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1">
            <Cpu className="w-4 h-4" />
            <span>ربط وتكامل أجهزة التحاليل المخبرية (LIS Medical Analyzers Interfacing)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            بروتوكولات الاتصال ASTM E1394 و HL7 v2.5
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            استقبال النتائج المخبرية آلياً من أجهزة صورة الدم والكيمياء والسيولة (Sysmex, Cobas, Mindray) بدون أخطاء إدخال بشرية.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>الخادم الطبي: Online</span>
          </span>
        </div>
      </div>

      {/* Conceptual Diagram from Doc (Analyzer -> LIS -> Barcode/Order -> Results) */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-bold text-slate-300">
            دورة البيانات الآلية: Analyzer ➔ LIS Server ➔ Barcode/Order ➔ Results Worklist
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            Bidirectional Interface Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <div className="text-[10px] text-slate-400 font-mono mb-1">المرحلة الأولى</div>
            <div className="font-bold text-sky-400 mb-1">1. جهاز التحليل (Analyzer)</div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              يقوم الجهاز بقراءة ملصق الباركود على الأنبوبة وفحص العينة أوتوماتيكياً.
            </p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <div className="text-[10px] text-slate-400 font-mono mb-1">المرحلة الثانية</div>
            <div className="font-bold text-purple-400 mb-1">2. قناة الاتصال (Protocol)</div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              إرسال حزم البيانات عبر ASTM E1394 أو HL7 عبر شبكة TCP/IP أو RS232.
            </p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <div className="text-[10px] text-slate-400 font-mono mb-1">المرحلة الثالثة</div>
            <div className="font-bold text-amber-400 mb-1">3. مطابقة الباركود (Barcode Map)</div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              يقوم LIS بمطابقة كود العينة مع ملف المريض والتحاليل المطلوبة فوراً.
            </p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <div className="text-[10px] text-slate-400 font-mono mb-1">المرحلة الرابعة</div>
            <div className="font-bold text-emerald-400 mb-1">4. التغذية الفورية للنتائج</div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              إدراج الأرقام والـ Flags في Worklist تمهيداً للمراجعة والاعتماد الطبي.
            </p>
          </div>

        </div>
      </div>

      {/* Connected Analyzers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.map((device) => {
          const isSyncing = syncingDeviceId === device.id;

          return (
            <div key={device.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{device.name}</h3>
                    <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-bold border border-blue-200">
                      {device.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{device.model}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold ${
                    device.status === 'Online' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    device.status === 'Idle' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    <Wifi className="w-3.5 h-3.5" />
                    <span>{device.status}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">البروتوكول المعياري:</span>
                  <span className="font-mono font-bold text-slate-800">{device.protocol}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">عنوان الشبكة (IP / Port):</span>
                  <span className="font-mono text-slate-800">{device.ipAddress}:{device.port}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">آخر مزامنة ناجحة:</span>
                  <span className="font-mono text-slate-600">{device.lastSyncAt}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">نتائج بانتظار السحب:</span>
                  <span className="font-mono font-bold text-indigo-600">
                    {device.pendingResultsCount} عينات جديدة
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  سحب النتائج الآلية إلى قائمة العمل
                </span>

                <button
                  onClick={() => handleRunSync(device)}
                  disabled={isSyncing}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer ${
                    isSyncing 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'جارٍ الاتصال وسحب النتائج...' : 'مزامنة النتائج الآن'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Device Transmission Terminal Log */}
      <div className="bg-slate-950 text-emerald-400 rounded-xl p-4 border border-slate-800 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
          <span>سجل اتصال الأجهزة اللحظي (LIS Interfacing Live Log)</span>
          <span className="text-[10px]">TCP Port Listener Active</span>
        </div>

        <div className="max-h-40 overflow-y-auto space-y-1 text-[11px]">
          {syncLog.length === 0 ? (
            <div className="text-slate-500">
              اضغط على "مزامنة النتائج الآن" على أي من أجهزة المعمل لمحاكاة استقبال حزم نتائج الفحص المخبري وتغذيتها في Worklist.
            </div>
          ) : (
            syncLog.map((log, i) => (
              <div key={i} className="leading-relaxed">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
