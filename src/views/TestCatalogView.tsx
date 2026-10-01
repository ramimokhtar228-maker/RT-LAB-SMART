import React, { useState } from 'react';
import { TestCatalogItem } from '../types/lis';
import { TUBES_DATA } from '../data/initialData';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter, 
  DollarSign, 
  TestTube2, 
  Clock, 
  Check, 
  X,
  Layers
} from 'lucide-react';

interface TestCatalogViewProps {
  tests: TestCatalogItem[];
  onSaveTest: (test: TestCatalogItem) => void;
  onDeleteTest: (testId: string) => void;
}

export const TestCatalogView: React.FC<TestCatalogViewProps> = ({
  tests,
  onSaveTest,
  onDeleteTest
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Partial<TestCatalogItem> | null>(null);

  const categories = ['All', 'Hematology', 'Biochemistry', 'Hormones', 'Immunology', 'Coagulation', 'Urine & Stool'];

  const filteredTests = tests.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.arabicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingTest({
      id: 't-' + Date.now(),
      code: '',
      name: '',
      arabicName: '',
      category: 'Biochemistry',
      price: 100,
      specimenType: 'Serum',
      tubeId: 'tube-serum-gel',
      unit: 'mg/dL',
      method: 'Automated Photometric',
      estimatedHours: 2,
      referenceRanges: [
        { gender: 'All', min: 0, max: 100, textualRange: 'Normal: 0 - 100' }
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: TestCatalogItem) => {
    setEditingTest({ ...t });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest || !editingTest.name || !editingTest.code) return;
    onSaveTest(editingTest as TestCatalogItem);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>الدليل المرجعي للتحاليل (Test Catalog & Master Data)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            فهرس التحاليل الطبية والأسعار والمعدلات المرجعية
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            المصدر الموحد لأسعار الفحوصات، أنواع العينات، ألوان أنابيب السحب، والمعدلات الفسيولوجية المعتمدة.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة تحليل جديد (Add Test)</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث باسم التحليل بالعربي أو الإنجليزي، أو الكود..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                categoryFilter === cat 
                  ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'All' ? 'جميع الأقسام' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Test Catalog Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold">
              <tr>
                <th className="py-3 px-4">كود التحليل</th>
                <th className="py-3 px-4">اسم التحليل (عربي / English)</th>
                <th className="py-3 px-4">القسم المخبري</th>
                <th className="py-3 px-4">نوع العينة والأنبوبة</th>
                <th className="py-3 px-4">الوحدة</th>
                <th className="py-3 px-4">السعر الرسمي</th>
                <th className="py-3 px-4">المعدل الطبيعي (Range)</th>
                <th className="py-3 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTests.map((test) => {
                const tube = TUBES_DATA.find(t => t.id === test.tubeId);

                return (
                  <tr key={test.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {test.code}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{test.arabicName}</div>
                      <div className="text-[11px] text-slate-500 font-sans" dir="ltr">
                        {test.name}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {test.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {tube && (
                          <span 
                            className="w-3 h-3 rounded-full shrink-0 border border-black/10" 
                            style={{ backgroundColor: tube.colorHex }}
                            title={tube.arabicName}
                          />
                        )}
                        <span className="font-medium text-slate-800">{test.specimenType}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {tube?.name}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">
                      {test.unit}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {test.price}
                      </span>
                      <span className="text-[10px] text-slate-400 font-sans mr-1">ج.م</span>
                    </td>

                    <td className="py-3 px-4 max-w-xs font-mono text-[11px] text-slate-600 truncate" title={test.referenceRanges[0]?.textualRange}>
                      {test.referenceRanges[0]?.textualRange || `${test.referenceRanges[0]?.min} - ${test.referenceRanges[0]?.max}`}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(test)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من حذف التحليل (${test.name})؟`)) {
                              onDeleteTest(test.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                          title="حذف"
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

      {/* Add / Edit Test Modal */}
      {isModalOpen && editingTest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl max-w-lg w-full p-5 border border-slate-200 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingTest.id ? 'تعديل بيانات التحليل' : 'إضافة فحص مخبري جديد'}
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
                <label className="block text-slate-700 font-bold mb-1">كود التحليل (Code)</label>
                <input
                  type="text"
                  required
                  value={editingTest.code || ''}
                  onChange={e => setEditingTest({ ...editingTest, code: e.target.value })}
                  placeholder="e.g. CBC, FBS"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">القسم المخبري</label>
                <select
                  value={editingTest.category || 'Biochemistry'}
                  onChange={e => setEditingTest({ ...editingTest, category: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                >
                  <option value="Biochemistry">Biochemistry (كيمياء حيوية)</option>
                  <option value="Hematology">Hematology (أمراض دم)</option>
                  <option value="Hormones">Hormones (هرمونات ودلالات)</option>
                  <option value="Immunology">Immunology (مناعة وأمصال)</option>
                  <option value="Coagulation">Coagulation (تجلط وسيولة)</option>
                  <option value="Urine & Stool">Urine & Stool (سوائل ورواسب)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">الاسم بالعربي</label>
              <input
                type="text"
                required
                value={editingTest.arabicName || ''}
                onChange={e => setEditingTest({ ...editingTest, arabicName: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">الاسم بالإنجليزي (English)</label>
              <input
                type="text"
                required
                value={editingTest.name || ''}
                onChange={e => setEditingTest({ ...editingTest, name: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">السعر (ج.م)</label>
                <input
                  type="number"
                  required
                  value={editingTest.price || 0}
                  onChange={e => setEditingTest({ ...editingTest, price: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">الوحدة (Unit)</label>
                <input
                  type="text"
                  required
                  value={editingTest.unit || ''}
                  onChange={e => setEditingTest({ ...editingTest, unit: e.target.value })}
                  placeholder="mg/dL, %, U/L"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">نوع الأنبوبة</label>
                <select
                  value={editingTest.tubeId || 'tube-serum-gel'}
                  onChange={e => setEditingTest({ ...editingTest, tubeId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                >
                  {TUBES_DATA.map(tube => (
                    <option key={tube.id} value={tube.id}>
                      {tube.arabicName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">نوع العينة (Specimen)</label>
              <input
                type="text"
                value={editingTest.specimenType || ''}
                onChange={e => setEditingTest({ ...editingTest, specimenType: e.target.value })}
                placeholder="Serum, Whole Blood EDTA, Citrated Plasma..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">نص المعدل الطبيعي (Reference Range Text)</label>
              <input
                type="text"
                value={editingTest.referenceRanges?.[0]?.textualRange || ''}
                onChange={e => {
                  const ranges = [...(editingTest.referenceRanges || [])];
                  if (ranges.length === 0) {
                    ranges.push({ gender: 'All', min: 0, max: 100, textualRange: e.target.value });
                  } else {
                    ranges[0].textualRange = e.target.value;
                  }
                  setEditingTest({ ...editingTest, referenceRanges: ranges });
                }}
                placeholder="e.g. 70.0 - 99.0 mg/dL"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
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
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
              >
                حفظ الفحص
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
