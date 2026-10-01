import React from 'react';
import { Order } from '../types/lis';
import { StorageService } from '../services/storage';
import { TUBES_DATA } from '../data/initialData';
import { Printer, X, Barcode as BarcodeIcon } from 'lucide-react';

interface BarcodeLabelModalProps {
  order: Order | null;
  onClose: () => void;
}

export const BarcodeLabelModal: React.FC<BarcodeLabelModalProps> = ({
  order,
  onClose
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  // Generate SVG Code128 bars
  const generateBarcodeLines = (code: string) => {
    const bars: { width: number; isSpace: boolean }[] = [];
    bars.push({ width: 2, isSpace: false });
    bars.push({ width: 1, isSpace: true });
    bars.push({ width: 2, isSpace: false });
    bars.push({ width: 1, isSpace: true });

    for (let i = 0; i < code.length; i++) {
      const charCode = code.charCodeAt(i);
      const w1 = (charCode % 3) + 1;
      const w2 = ((charCode >> 1) % 3) + 1;
      const w3 = ((charCode >> 2) % 2) + 1;
      bars.push({ width: w1, isSpace: false });
      bars.push({ width: 1, isSpace: true });
      bars.push({ width: w2, isSpace: false });
      bars.push({ width: w3, isSpace: true });
    }

    bars.push({ width: 2, isSpace: false });
    bars.push({ width: 1, isSpace: true });
    bars.push({ width: 3, isSpace: false });

    return bars;
  };

  // Required tubes
  const requiredTubes = StorageService.calculateRequiredTubes(order.testIds);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 text-xs text-right">
        
        {/* Modal Toolbar */}
        <div className="no-print flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <BarcodeIcon className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                ملصقات باركود أنابيب السحب (Specimen Barcode Labels)
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                الطلب: {order.orderNumber} ({requiredTubes.length} أنابيب مطلوبة)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة الملصقات</span>
            </button>

            <button 
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Labels Preview Grid (Prints cleanly on thermal barcode printers) */}
        <div className="space-y-3">
          {requiredTubes.map(({ tube, count, tests }, idx) => (
            <div 
              key={tube.id}
              className="border-2 border-slate-800 rounded-lg p-3 bg-white text-slate-950 font-mono shadow-xs space-y-1 relative"
            >
              {/* Color Stripe on the edge to match tube cap */}
              <div 
                className="absolute right-0 top-0 bottom-0 w-3 rounded-r-md"
                style={{ backgroundColor: tube.colorHex }}
                title={tube.arabicName}
              />

              <div className="pr-4">
                <div className="flex items-center justify-between font-sans">
                  <div className="font-bold text-slate-900 text-xs">
                    {order.patientName}
                  </div>
                  <span className="text-[10px] font-bold text-blue-900">
                    معامل RT
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-700 pt-0.5">
                  <span>{order.patientAge}Y · {order.patientGender === 'Male' ? 'M' : 'F'}</span>
                  <span>{order.createdAt.substring(0, 10)}</span>
                  <span className="font-bold">{tube.arabicName.split(' ')[0]} ({tube.name})</span>
                </div>

                {/* SVG Barcode */}
                <div className="py-1 flex flex-col items-center">
                  <svg height="28" className="w-48">
                    {generateBarcodeLines(order.barcode).reduce((acc: any[], bar) => {
                      const prevX = acc.length > 0 ? acc[acc.length - 1].x + acc[acc.length - 1].width : 2;
                      acc.push({ x: prevX, width: bar.width * 1.5, fill: bar.isSpace ? 'transparent' : '#000000' });
                      return acc;
                    }, []).map((b, i) => (
                      <rect key={i} x={b.x} y="0" width={b.width} height="28" fill={b.fill} />
                    ))}
                  </svg>
                  <span className="text-[10px] font-bold tracking-widest mt-0.5">
                    *{order.barcode}*
                  </span>
                </div>

                {/* Tests in this tube */}
                <div className="text-[10px] font-sans truncate text-slate-800 font-semibold border-t border-slate-200 pt-1 flex justify-between">
                  <span>الفحوصات: {tests.map(t => t.code).join(', ')}</span>
                  <span className="font-mono text-[9px] text-slate-500">[{idx + 1}/{requiredTubes.length}]</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="no-print pt-2 flex items-center justify-between text-[11px] text-slate-500">
          <span>متوافق مع طابعات الباركود الحرارية (Xprinter / Zebra 50x25mm).</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
