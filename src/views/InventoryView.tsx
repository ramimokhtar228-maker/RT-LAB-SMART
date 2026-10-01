import React, { useState } from 'react';
import { Reagent } from '../types/lis';
import { StorageService } from '../services/storage';
import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Trash2, 
  Edit, 
  Minus, 
  Calendar, 
  Boxes,
  X
} from 'lucide-react';

interface InventoryViewProps {
  reagents: Reagent[];
  onSaveReagent: (reagent: Reagent) => void;
  onConsumeReagent: (id: string, amount: number) => void;
  onDeleteReagent?: (reagentId: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  reagents,
  onSaveReagent,
  onConsumeReagent,
  onDeleteReagent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'LowStock' | 'ExpiringSoon'>('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReagent, setEditingReagent] = useState<Partial<Reagent> | null>(null);

  const [consumeModalItem, setConsumeModalItem] = useState<Reagent | null>(null);
  const [consumeAmount, setConsumeAmount] = useState<number>(1);

  // Today for expiry calculation
  const today = new Date();

  const isExpiringSoon = (expiryDateStr: string) => {
    const exp = new Date(expiryDateStr);
    const diffTime = exp.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 60; // within 60 days
  };

  const isLowStock = (r: Reagent) => r.currentStock <= r.minimumStock;

  const lowStockCount = reagents.filter(isLowStock).length;
  const expiringCount = reagents.filter(r => isExpiringSoon(r.expiryDate)).length;

  const filteredReagents = reagents.filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.supplier.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === 'LowStock') return matchesSearch && isLowStock(r);
    if (filterType === 'ExpiringSoon') return matchesSearch && isExpiringSoon(r.expiryDate);

    return matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingReagent({
      id: 'reag-' + Date.now(),
      code: 'RG-' + Math.floor(Math.random() * 900 + 100),
      name: '',
      category: 'Biochemistry',
      lotNumber: 'LOT-' + new Date().getFullYear() + 'A1',
      currentStock: 10,
      minimumStock: 5,
      unit: 'Kit',
      expiryDate: '2027-12-31',
      supplier: 'روش دياجنوستكس مصر',
      unitCost: 1500,
      lastRestockedDate: new Date().toISOString().substring(0, 10)
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (r: Reagent) => {
    setEditingReagent({ ...r });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReagent || !editingReagent.name) return;
    onSaveReagent(editingReagent as Reagent);
    setIsModalOpen(false);
  };

  const handleConfirmConsume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumeModalItem) return;
    onConsumeReagent(consumeModalItem.id, consumeAmount);
    setConsumeModalItem(null);
    setConsumeAmount(1);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
            <Package className="w-4 h-4" />
            <span>إدارة الكواشف والمخزون الطبي (Laboratory Reagents & Consumables)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            مخزون الكواشف، أرقام التشغيل (Lot Numbers)، وتنبيهات الصلاحية
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            رصد استهلاك المحاليل وأنابيب السحب، ومراقبة تواريخ الانتهاء والحدود الحرجة لإعادة الطلب.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة كاشف / مستلزم جديد</span>
        </button>
      </div>

      {/* Filter & Warning Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث باسم الكاشف، الكود، Lot Number، المورد..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
          <button
            onClick={() => setFilterType('All')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filterType === 'All' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            كل المخزون ({reagents.length})
          </button>
          <button
            onClick={() => setFilterType('LowStock')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filterType === 'LowStock' ? 'bg-amber-500 text-white shadow-2xs font-bold' : 'text-amber-700 hover:text-amber-900'
            }`}
          >
            نقص مخزون ({lowStockCount})
          </button>
          <button
            onClick={() => setFilterType('ExpiringSoon')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filterType === 'ExpiringSoon' ? 'bg-rose-600 text-white shadow-2xs font-bold' : 'text-rose-700 hover:text-rose-900'
            }`}
          >
            قرب انتهاء الصلاحية ({expiringCount})
          </button>
        </div>
      </div>

      {/* Reagents Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold">
              <tr>
                <th className="py-3 px-4">كود الصنف</th>
                <th className="py-3 px-4">اسم الكاشف / المستلزم</th>
                <th className="py-3 px-4">القسم / التصنيف</th>
                <th className="py-3 px-4">رقم التشغيلة (Lot #)</th>
                <th className="py-3 px-4">الرصيد الحالي</th>
                <th className="py-3 px-4">الحد الأدنى للطلب</th>
                <th className="py-3 px-4">تاريخ الصلاحية (Expiry)</th>
                <th className="py-3 px-4">المورد المعتمد</th>
                <th className="py-3 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReagents.map((r) => {
                const low = isLowStock(r);
                const expiring = isExpiringSoon(r.expiryDate);

                return (
                  <tr key={r.id} className={`hover:bg-slate-50/60 transition-colors ${
                    expiring ? 'bg-rose-50/30' : low ? 'bg-amber-50/30' : ''
                  }`}>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {r.code}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{r.name}</div>
                      <div className="text-[10px] text-slate-400">آخر توريد: {r.lastRestockedDate}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {r.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-800">
                      {r.lotNumber}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono font-bold text-sm ${
                          low ? 'text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300' : 'text-slate-900'
                        }`}>
                          {r.currentStock} {r.unit}
                        </span>
                        {low && (
                          <span title="تحذير: المخزون تحت الحد الأدنى!">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500">
                      {r.minimumStock} {r.unit}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        expiring ? 'text-rose-700 bg-rose-100 border border-rose-300 animate-pulse' : 'text-slate-700'
                      }`}>
                        {r.expiryDate}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-700 text-[11px]">
                      {r.supplier}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setConsumeModalItem(r);
                            setConsumeAmount(1);
                          }}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-[11px] font-bold cursor-pointer transition-colors"
                          title="تسجيل استهلاك عينات أو تشغيل"
                        >
                          استهلاك
                        </button>

                        <button
                          onClick={() => handleOpenEdit(r)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من الحذف النهائي للكاشف (${r.name}) من المخزون؟\nسيتم حذفه من كافة الأجهزة فوراً.`)) {
                              if (onDeleteReagent) onDeleteReagent(r.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition-colors"
                          title="حذف نهائي للكاشف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Consume Modal */}
      {consumeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleConfirmConsume} className="bg-white rounded-xl max-w-sm w-full p-5 border border-slate-200 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              تسجيل استهلاك كاشف مخبري
            </h3>

            <div className="bg-slate-50 p-3 rounded-lg space-y-1">
              <div className="font-bold text-slate-900">{consumeModalItem.name}</div>
              <div className="text-[11px] text-slate-500">
                الرصيد المتوفر حالياً: <strong className="font-mono text-blue-900">{consumeModalItem.currentStock} {consumeModalItem.unit}</strong>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">الكمية المستهلكة ({consumeModalItem.unit})</label>
              <input
                type="number"
                required
                min={1}
                max={consumeModalItem.currentStock}
                value={consumeAmount}
                onChange={e => setConsumeAmount(parseInt(e.target.value) || 1)}
                className="w-full p-2.5 text-lg font-mono font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConsumeModalItem(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 cursor-pointer"
              >
                تأكيد الاستهلاك
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add / Edit Reagent Modal */}
      {isModalOpen && editingReagent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl max-w-lg w-full p-5 border border-slate-200 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              {editingReagent.id ? 'تعديل بيانات الكاشف' : 'إضافة كاشف / مستلزم جديد'}
            </h3>

            <div>
              <label className="block text-slate-700 font-bold mb-1">اسم الكاشف / المستلزم</label>
              <input
                type="text"
                required
                value={editingReagent.name || ''}
                onChange={e => setEditingReagent({ ...editingReagent, name: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">كود الصنف</label>
                <input
                  type="text"
                  required
                  value={editingReagent.code || ''}
                  onChange={e => setEditingReagent({ ...editingReagent, code: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">رقم التشغيلة (Lot Number)</label>
                <input
                  type="text"
                  required
                  value={editingReagent.lotNumber || ''}
                  onChange={e => setEditingReagent({ ...editingReagent, lotNumber: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">الرصيد الحالي</label>
                <input
                  type="number"
                  required
                  value={editingReagent.currentStock || 0}
                  onChange={e => setEditingReagent({ ...editingReagent, currentStock: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">حد إعادة الطلب (Min)</label>
                <input
                  type="number"
                  required
                  value={editingReagent.minimumStock || 0}
                  onChange={e => setEditingReagent({ ...editingReagent, minimumStock: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">الوحدة</label>
                <input
                  type="text"
                  required
                  value={editingReagent.unit || 'Kit'}
                  onChange={e => setEditingReagent({ ...editingReagent, unit: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">تاريخ انتهاء الصلاحية</label>
                <input
                  type="date"
                  required
                  value={editingReagent.expiryDate || ''}
                  onChange={e => setEditingReagent({ ...editingReagent, expiryDate: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">الشركة الموردة</label>
                <input
                  type="text"
                  value={editingReagent.supplier || ''}
                  onChange={e => setEditingReagent({ ...editingReagent, supplier: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 cursor-pointer"
              >
                حفظ الكاشف
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
