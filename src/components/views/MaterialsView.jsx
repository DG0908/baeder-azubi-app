import React from 'react';
import { BookOpen, Upload, Download, ClipboardList } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/constants';
import { PRACTICAL_CHECKLISTS } from '../../data/practicalChecklists';

const MaterialsView = ({
  materials,
  materialTitle,
  setMaterialTitle,
  materialCategory,
  setMaterialCategory,
  addMaterial,
  getChecklistProgressStats,
  isChecklistItemCompleted,
  toggleChecklistItem
}) => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <BookOpen className="mr-2 text-blue-500" />
          Lernmaterialien
        </h2>
        {user.permissions.canUploadMaterials && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-3">Neues Material hinzufügen</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={materialTitle}
                onChange={(e) => setMaterialTitle(e.target.value)}
                placeholder="Titel des Materials"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <select
                value={materialCategory}
                onChange={(e) => setMaterialCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button
                onClick={addMaterial}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                <Upload className="inline mr-2" size={18} />
                Hinzufügen
              </button>
            </div>
          </div>
        )}
        <div className="space-y-3">
          {materials.map(mat => {
            const cat = CATEGORIES.find(c => c.id === mat.category);
            return (
              <div key={mat.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`${cat.color} text-white w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="font-bold">{mat.title}</h3>
                      <p className="text-sm text-gray-600">{cat.name}</p>
                    </div>
                  </div>
                  <button className="text-blue-500 hover:text-blue-600">
                    <Download size={24} />
                  </button>
                </div>
              </div>
            );
          })}
          {materials.length === 0 && (
            <p className="text-gray-500 text-center py-8">Noch keine Materialien vorhanden</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-2xl font-bold flex items-center">
            <ClipboardList className="mr-2 text-emerald-500" />
            Praxis-Checklisten
          </h3>
          <div className="text-sm text-gray-600">
            {(() => {
              const total = PRACTICAL_CHECKLISTS.reduce((sum, checklist) => sum + checklist.items.length, 0);
              const done = PRACTICAL_CHECKLISTS.reduce((sum, checklist) => {
                const stats = getChecklistProgressStats(checklist);
                return sum + stats.done;
              }, 0);
              return `${done}/${total} Punkte erledigt`;
            })()}
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Fuer Schichtstart, Technik und Notfaelle. Diese Checklisten findest du unter Lernen, damit du den Praxisablauf festigst.
        </p>

        <div className="space-y-4">
          {PRACTICAL_CHECKLISTS.map((checklist) => {
            const category = CATEGORIES.find((entry) => entry.id === checklist.category);
            const { done, total } = getChecklistProgressStats(checklist);
            const progress = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <div key={checklist.id} className="border rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-full text-white ${category?.color || 'bg-gray-500'}`}>
                      {category?.icon || '📌'} {category?.name || checklist.category}
                    </span>
                    <h4 className="font-bold text-gray-800">{checklist.title}</h4>
                  </div>
                  <span className="text-sm text-gray-600">{done}/{total}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{checklist.description}</p>

                <div className="h-2 bg-gray-200 rounded-full mb-3 overflow-hidden">
                  <div className="h-2 bg-emerald-500 rounded-full" style={{ width: `${progress}%` }} />
                </div>

                <div className="space-y-2">
                  {checklist.items.map((item, itemIndex) => {
                    const checked = isChecklistItemCompleted(checklist.id, itemIndex);
                    return (
                      <label key={`${checklist.id}-${itemIndex}`} className={`flex items-start gap-3 rounded-lg p-2 border ${checked ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleChecklistItem(checklist.id, itemIndex)}
                          className="mt-1 h-4 w-4 accent-emerald-600"
                        />
                        <span className={`text-sm ${checked ? 'text-emerald-800 line-through' : 'text-gray-700'}`}>
                          {item}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MaterialsView;
