import React from 'react';
import { Plus, Download, Trash2, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const ResourcesView = ({
  resources,
  resourceTitle,
  setResourceTitle,
  resourceType,
  setResourceType,
  resourceUrl,
  setResourceUrl,
  resourceDescription,
  setResourceDescription,
  addResource,
  deleteResource
}) => {
  const { user } = useAuth();
  const { darkMode } = useApp();

  const typeIcons = {
    youtube: '📺',
    website: '🌐',
    document: '📄',
    behörde: '🏛️',
    tool: '🛠️'
  };

  const typeColors = {
    youtube: 'bg-red-500',
    website: 'bg-blue-500',
    document: 'bg-green-500',
    behörde: 'bg-purple-500',
    tool: 'bg-orange-500'
  };

  return (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
        <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <span className="text-3xl mr-3">🔗</span>
          Nützliche Links & Ressourcen
        </h2>

        {user.role === 'admin' ? (
          <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-4 mb-6`}>
            <h3 className={`font-bold mb-3 ${darkMode ? 'text-cyan-400' : 'text-gray-800'}`}>
              🔒 Neue Ressource hinzufügen (Nur Admins)
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
                placeholder="Titel (z.B. 'Prüfungstermine NRW')"
                className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : ''}`}
              />

              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : ''}`}
              >
                <option value="youtube">📺 YouTube Video</option>
                <option value="website">🌐 Website/Link</option>
                <option value="document">📄 Dokument</option>
                <option value="behörde">🏛️ Behörde/Amt</option>
                <option value="tool">🛠️ Tool/Software</option>
              </select>

              <input
                type="url"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                placeholder="URL (https://...)"
                className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : ''}`}
              />

              <textarea
                value={resourceDescription}
                onChange={(e) => setResourceDescription(e.target.value)}
                placeholder="Beschreibung (optional)"
                rows="2"
                className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : ''}`}
              />

              <button
                onClick={addResource}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2 rounded-lg font-bold"
              >
                <Plus className="inline mr-2" size={18} />
                Ressource hinzufügen
              </button>
            </div>
          </div>
        ) : (
          <div className={`${darkMode ? 'bg-yellow-900/50 border-yellow-600' : 'bg-yellow-50 border-yellow-400'} border-2 rounded-lg p-4 mb-6`}>
            <div className="flex items-center gap-3">
              <Shield size={32} className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
              <div>
                <p className={`font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                  🔒 Nur Administratoren können Ressourcen hinzufügen
                </p>
                <p className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  Dies dient der Sicherheit und Qualität der geteilten Inhalte.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {resources.map(resource => (
            <div key={resource.id} className={`${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white'} border rounded-lg p-4 hover:shadow-md transition-shadow`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`${typeColors[resource.type] || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                      {typeIcons[resource.type] || '🔗'} {resource.type ? resource.type.charAt(0).toUpperCase() + resource.type.slice(1) : 'Link'}
                    </span>
                  </div>
                  <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {resource.title}
                  </h3>
                  {resource.description && (
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {resource.description}
                    </p>
                  )}
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm ${darkMode ? 'text-cyan-400' : 'text-blue-600'} hover:underline break-all`}
                  >
                    {resource.url}
                  </a>
                  <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Von {resource.addedBy || 'Unbekannt'} • {resource.time ? new Date(resource.time).toLocaleDateString() : '-'}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                    title="Öffnen"
                  >
                    <Download size={20} />
                  </a>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => deleteResource(resource.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                      title="Löschen"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>

              {resource.type === 'youtube' && resource.url.includes('youtube.com') && (
                <div className="mt-3">
                  <iframe
                    width="100%"
                    height="315"
                    src={resource.url.replace('watch?v=', 'embed/')}
                    title={resource.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              )}
            </div>
          ))}

          {resources.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔗</div>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Noch keine Ressourcen vorhanden
              </p>
            </div>
          )}
        </div>

        <div className={`mt-6 ${darkMode ? 'bg-cyan-900/50 border-cyan-600' : 'bg-cyan-50 border-cyan-300'} border-2 rounded-lg p-4`}>
          <h4 className={`font-bold mb-2 ${darkMode ? 'text-cyan-300' : 'text-cyan-800'}`}>
            💡 Beispiele für nützliche Ressourcen:
          </h4>
          <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <li>• YouTube: Technik-Tutorials, Rettungsschwimmen-Videos</li>
            <li>• Behörden: Bezirksregierung (Prüfungstermine, Anmeldeformulare)</li>
            <li>• Websites: DLRG, DGfdB, Berufsverbände</li>
            <li>• Dokumente: Gesetze, Verordnungen, Leitfäden</li>
            <li>• Tools: Rechner, Simulationen, Lern-Apps</li>
          </ul>
        </div>

        <div className={`mt-4 ${darkMode ? 'bg-red-900/50 border-red-600' : 'bg-red-50 border-red-300'} border-2 rounded-lg p-4`}>
          <h4 className={`font-bold mb-2 flex items-center ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
            <Shield className="mr-2" size={20} />
            🛡️ Sicherheitshinweise
          </h4>
          <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <li>• <strong>Nur Administratoren</strong> können Ressourcen hinzufügen</li>
            <li>• Alle Inhalte werden automatisch auf unangemessene Begriffe geprüft</li>
            <li>• Pornografische, beleidigende oder rechtsradikale Inhalte sind verboten</li>
            <li>• Verstöße führen zur sofortigen Sperrung des Accounts</li>
            <li>• Bei Problemen: Sofort einen Administrator informieren</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResourcesView;
