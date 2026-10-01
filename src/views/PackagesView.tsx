import React, { useState } from 'react';
import { TestPackage, TestCatalogItem } from '../types/lis';
import { 
  Boxes, 
  Plus, 
  Search, 
  Edit, 
  Check, 
  X, 
  Tag, 
  DollarSign, 
  Sparkles,
  Percent,
  Trash2
} from 'lucide-react';

interface PackagesViewProps {
  packages: TestPackage[];
  tests: TestCatalogItem[];
  onSavePackage: (pkg: TestPackage) => void;
  onSelectPackageForOrder?: (pkg: TestPackage) => void;
  onDeletePackage?: (pkgId: string) => void;
}

export const PackagesView: React.FC<PackagesViewProps> = ({
  packages,
  tests,
  onSavePackage,
  onSelectPackageForOrder,
  onDeletePackage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Partial<TestPackage> | null>(null);

  const filteredPackages = packages.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.arabicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingPackage({
      id: 'pkg-' + Date.now(),
      code: 'PKG-' + Math.floor(Math.random() * 900 + 100),
      name: '',
      arabicName: '',
      description: '',
      originalPrice: 500,
      packagePrice: 350,
      testIds: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: TestPackage) => {
    setEditingPackage({ ...pkg });
    setIsModalOpen(true);
  };

  const handleDelete = (pkg: TestPackage) => {
    if (confirm(`هل أنت متأكد من الحذف النهائي للباقة (${pkg.arabicName} - ${pkg.code})؟\nسيتم حذفها وسينعكس ذلك على كافة الأجهزة فوراً.`)) {
      if (onDeletePackage) {
        onDeletePackage(pkg.id);
      }
    }
  };

  const handleToggleTest = (testId: string) => {
    if (!editingPackage) return;
    const current = editingPackage.testIds || [];
    let updated: string[];
    if (current.includes(testId)) {
      updated = current.filter(id => id !== testId);
    } else {
      updated = [...current, testId];
    }

    // Auto recalculate original price sum
    const sumOriginal = updated.reduce((sum, tid) => {
      const t = tests.find(x => x.id === tid);
      return sum + (t?.price || 0);
    }, 0);

    setEditingPackage({
      ...editingPackage,
      testIds: updated,
      originalPrice: sumOriginal
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage || !editingPackage.arabicName || !editingPackage.code) return;
    onSavePackage(editingPackage as TestPackage);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-800 mb-1">
            <Boxes className="w-4 h-4" />
            <span>باقات الفحص الشامل والعروض الترويجية (Laboratory Health Packages)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            إدارة باقات الفحوصات الطبية والعروض المخفضة
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إنشاء وتعديل وحذف باقات الفحص الشامل مع حساب نسبة الخصم وسعر التوفير للمريض.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-rose-900 hover:bg-rose-950 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة باقة جديدة (Add Package)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث باسم الباقة، الكود، أو الوصف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-900"
          />
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPackages.map(pkg => {
          const savings = Math.max(0, pkg.originalPrice - pkg.packagePrice);
          const discountPct = pkg.originalPrice > 0 ? Math.round((savings / pkg.originalPrice) * 100) : 0;
          const pkgTests = tests.filter(t => pkg.testIds.includes(t.id));

          return (
            <div key={pkg.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-rose-50 text-rose-800 px-2 py-0.5 rounded border border-rose-200">
                      {pkg.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {pkg.arabicName}
                    </h3>
                  </div>

                  {discountPct > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Percent className="w-3 h-3" />
                      خصم {discountPct}%
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {pkg.description}
                </p>

                {/* Included tests pills */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>التحاليل المشمولة في الباقة:</span>
                    <span className="font-mono text-slate-500">{pkgTests.length} فحص</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                    {pkgTests.map(t => (
                      <span key={t.id} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {t.arabicName} ({t.code})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 line-through font-mono">
                    {pkg.originalPrice} ج.م
                  </div>
                  <div className="text-lg font-bold font-mono text-rose-950">
                    {pkg.packagePrice} <span className="text-xs font-sans font-normal text-slate-500">ج.م</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(pkg)}
                    className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                    title="تعديل الباقة"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(pkg)}
                    className="p-2 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                    title="حذف نهائي للباقة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal for creating/editing Package */}
      {isModalOpen && editingPackage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl max-w-lg w-full p-5 border border-slate-200 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingPackage.name ? 'تعديل بيانات الباقة' : 'إنشاء باقة فحص جديدة'}
              </h3>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">كود الباقة</label>
                <input
                  type="text"
                  required
                  value={editingPackage.code || ''}
                  onChange={e => setEditingPackage({ ...editingPackage, code: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">سعر الباقة المخفض (ج.م)</label>
                <input
                  type="number"
                  required
                  value={editingPackage.packagePrice || 0}
                  onChange={e => setEditingPackage({ ...editingPackage, packagePrice: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">اسم الباقة بالعربية</label>
              <input
                type="text"
                required
                value={editingPackage.arabicName || ''}
                onChange={e => setEditingPackage({ ...editingPackage, arabicName: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">وصف الباقة والفحوصات</label>
              <textarea
                rows={2}
                value={editingPackage.description || ''}
                onChange={e => setEditingPackage({ ...editingPackage, description: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            {/* Test Selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-700 font-bold">
                  اختر التحاليل المشمولة في الباقة ({editingPackage.testIds?.length || 0} فحص)
                </label>
                <span className="font-mono text-slate-500 text-[11px]">
                  مجموع الأسعار الأصلية: {editingPackage.originalPrice} ج.م
                </span>
              </div>
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1 bg-slate-50">
                {tests.map(t => {
                  const isChecked = editingPackage.testIds?.includes(t.id);
                  return (
                    <label key={t.id} className="flex items-center justify-between p-1.5 hover:bg-white rounded cursor-pointer transition-colors">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleTest(t.id)}
                          className="rounded text-rose-900 cursor-pointer"
                        />
                        <span className="font-medium text-slate-800">{t.arabicName} ({t.code})</span>
                      </div>
                      <span className="font-mono text-slate-500">{t.price} ج.م</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer font-semibold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-rose-900 hover:bg-rose-950 text-white rounded-lg cursor-pointer font-bold"
              >
                حفظ الباقة
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
