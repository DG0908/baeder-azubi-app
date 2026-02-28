import React from 'react';
import { BookOpen, Upload, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <BookOpen className="mr-2 text-blue-500" />
          Lernmaterialien
        </h2>
        {user.permissions.canUploadMaterials && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-3">Neues Material hinzufuegen</h3>
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
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button
                onClick={addMaterial}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                <Upload className="inline mr-2" size={18} />
                Hinzufuegen
              </button>
            </div>
          </div>
        )}
        <div className="space-y-3">
          {materials.map((mat) => {
            const cat = CATEGORIES.find((c) => c.id === mat.category);
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
    </div>
  );
};

export default MaterialsView;
