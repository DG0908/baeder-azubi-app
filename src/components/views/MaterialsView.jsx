import React from 'react';
import { BookOpen, Upload, Download, FileText, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/constants';

const MaterialsView = ({
  materials,
  materialTitle,
  setMaterialTitle,
  materialCategory,
  setMaterialCategory,
  addMaterial
}) => {
  const { user } = useAuth();
  const { darkMode } = useApp();
  const canUpload = user?.permissions?.canUploadMaterials;

  return (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900' : 'bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500'} text-white rounded-2xl p-8 shadow-lg`}>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <BookOpen size={32} />
          Lernmaterialien
        </h2>
        <p className="text-white/80">
          Arbeitsblätter, Checklisten und Unterlagen für deine Ausbildung — zentral und nach Kategorien sortiert.
        </p>
      </div>

      {canUpload && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-cyan-300' : 'text-gray-800'}`}>
            <Upload size={18} />
            Neues Material hinzufügen
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              value={materialTitle}
              onChange={(e) => setMaterialTitle(e.target.value)}
              placeholder="Titel des Materials"
              className={`md:col-span-2 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' : 'bg-white/70 border-gray-300'}`}
            />
            <select
              value={materialCategory}
              onChange={(e) => setMaterialCategory(e.target.value)}
              className={`px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white/70 border-gray-300'}`}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button
              onClick={addMaterial}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Upload size={18} />
              Hinzufügen
            </button>
          </div>
        </div>
      )}

      {materials.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-white/5' : 'bg-blue-50'}`}>
            <Sparkles size={36} className={darkMode ? 'text-blue-300' : 'text-blue-500'} />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Noch keine Materialien
          </h3>
          <p className={`text-sm max-w-md mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Hier kommen bald Arbeitsblätter, Checklisten und Lernunterlagen für deine Ausbildung rein —
            sortiert nach den Kategorien, die du auch aus dem Quiz kennst.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {materials.map((mat) => {
            const cat = CATEGORIES.find((c) => c.id === mat.category);
            return (
              <div key={mat.id} className="glass-card glass-card-hover rounded-2xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`${cat?.color || 'bg-gray-500'} text-white w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                      {cat?.icon || <FileText size={22} />}
                    </div>
                    <div className="min-w-0">
                      <h3 className={`font-bold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {mat.title}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {cat?.name || 'Allgemein'}
                      </p>
                    </div>
                  </div>
                  <button
                    className="text-blue-500 hover:text-blue-600 p-2 rounded-lg flex-shrink-0"
                    title="Download"
                  >
                    <Download size={22} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MaterialsView;
