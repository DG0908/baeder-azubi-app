import React from 'react';
import { Plus, ExternalLink, Trash2, Shield, Play } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const TYPE_ICONS = {
  youtube: '📺',
  website: '🌐',
  document: '📄',
  behörde: '🏛️',
  tool: '🛠️'
};

const TYPE_COLORS = {
  youtube: 'bg-red-500',
  website: 'bg-blue-500',
  document: 'bg-green-500',
  behörde: 'bg-purple-500',
  tool: 'bg-orange-500'
};

const TYPE_LABELS = {
  youtube: 'YouTube',
  website: 'Website',
  document: 'Dokument',
  behörde: 'Behörde',
  tool: 'Tool'
};

const extractYouTubeId = (url) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '').split('?')[0] || null;
    }
    if (parsed.hostname.includes('youtube.com')) {
      const v = parsed.searchParams.get('v');
      if (v) return v;
      const shortMatch = parsed.pathname.match(/\/(embed|shorts)\/([^/?]+)/);
      if (shortMatch) return shortMatch[2];
    }
  } catch {
    return null;
  }
  return null;
};

const getDomain = (url) => {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
};

const getFaviconUrl = (url) => {
  const domain = getDomain(url);
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
};

const ResourcePreview = ({ resource }) => {
  const videoId = resource.type === 'youtube' ? extractYouTubeId(resource.url) : null;

  if (videoId) {
    return (
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video w-full overflow-hidden rounded-xl group"
      >
        <img
          src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
          alt={resource.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-red-600/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play size={24} className="text-white ml-1" fill="white" />
          </div>
        </div>
      </a>
    );
  }

  const favicon = getFaviconUrl(resource.url);
  const typeColor = TYPE_COLORS[resource.type] || 'bg-gray-500';
  const icon = TYPE_ICONS[resource.type] || '🔗';

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative block aspect-video w-full overflow-hidden rounded-xl ${typeColor} group`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {favicon ? (
          <img
            src={favicon}
            alt=""
            loading="lazy"
            className="w-16 h-16 rounded-xl bg-white/95 p-2 shadow-lg group-hover:scale-110 transition-transform"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <span className="text-6xl">{icon}</span>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-black/40 backdrop-blur-sm text-white text-xs font-medium truncate">
        {getDomain(resource.url) || resource.url}
      </div>
    </a>
  );
};

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
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 via-slate-900 to-blue-900' : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500'} text-white rounded-2xl p-8 shadow-lg`}>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <span className="text-4xl">🔗</span>
          Nützliche Links & Ressourcen
        </h2>
        <p className="text-white/80">
          Kuratierte Links zu Videos, Behörden, Tools und Dokumenten für deine Ausbildung.
        </p>
      </div>

      {isAdmin ? (
        <div className="glass-card rounded-2xl p-6">
          <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-cyan-300' : 'text-gray-800'}`}>
            <Plus size={18} />
            Neue Ressource hinzufügen
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              value={resourceTitle}
              onChange={(e) => setResourceTitle(e.target.value)}
              placeholder="Titel (z.B. 'Prüfungstermine NRW')"
              className={`px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-cyan-400 ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' : 'bg-white/70 border-gray-300'}`}
            />
            <select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              className={`px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-cyan-400 ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white/70 border-gray-300'}`}
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
              className={`md:col-span-2 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-cyan-400 ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' : 'bg-white/70 border-gray-300'}`}
            />
            <textarea
              value={resourceDescription}
              onChange={(e) => setResourceDescription(e.target.value)}
              placeholder="Beschreibung (optional)"
              rows="2"
              className={`md:col-span-2 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-cyan-400 resize-none ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' : 'bg-white/70 border-gray-300'}`}
            />
            <button
              onClick={addResource}
              className="md:col-span-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={18} />
              Ressource hinzufügen
            </button>
          </div>
        </div>
      ) : (
        <div className={`${darkMode ? 'bg-yellow-900/40 border-yellow-600/60' : 'bg-yellow-50 border-yellow-300'} border rounded-2xl p-4 flex items-center gap-3`}>
          <Shield size={28} className={darkMode ? 'text-yellow-300' : 'text-yellow-600'} />
          <div>
            <p className={`font-bold ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
              Nur Administratoren können Ressourcen hinzufügen
            </p>
            <p className={`text-sm ${darkMode ? 'text-yellow-300/80' : 'text-yellow-700'}`}>
              Dies dient der Sicherheit und Qualität der geteilten Inhalte.
            </p>
          </div>
        </div>
      )}

      {resources.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🔗</div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Noch keine Ressourcen vorhanden
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {resources.map((resource) => (
            <div key={resource.id} className="glass-card rounded-2xl p-4 flex flex-col gap-3">
              <ResourcePreview resource={resource} />

              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`${TYPE_COLORS[resource.type] || 'bg-gray-500'} text-white px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1`}>
                      <span>{TYPE_ICONS[resource.type] || '🔗'}</span>
                      {TYPE_LABELS[resource.type] || 'Link'}
                    </span>
                  </div>
                  <h3 className={`text-lg font-bold mb-1 break-words ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {resource.title}
                  </h3>
                  {resource.description && (
                    <p className={`text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {resource.description}
                    </p>
                  )}
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Von {resource.addedBy || 'Unbekannt'}
                    {resource.time && ` • ${new Date(resource.time).toLocaleDateString('de-DE')}`}
                  </p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                    title="Öffnen"
                  >
                    <ExternalLink size={18} />
                  </a>
                  {isAdmin && (
                    <button
                      onClick={() => deleteResource(resource.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                      title="Löschen"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className={`${darkMode ? 'bg-cyan-900/30 border-cyan-700/50' : 'bg-cyan-50 border-cyan-200'} border rounded-2xl p-4`}>
          <h4 className={`font-bold mb-2 ${darkMode ? 'text-cyan-200' : 'text-cyan-800'}`}>
            💡 Beispiele für nützliche Ressourcen
          </h4>
          <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <li>• YouTube: Technik-Tutorials, Rettungsschwimmen-Videos</li>
            <li>• Behörden: Bezirksregierung (Prüfungstermine, Formulare)</li>
            <li>• Websites: DLRG, DGfdB, Berufsverbände</li>
            <li>• Dokumente: Gesetze, Verordnungen, Leitfäden</li>
            <li>• Tools: Rechner, Simulationen, Lern-Apps</li>
          </ul>
        </div>

        <div className={`${darkMode ? 'bg-red-900/30 border-red-700/50' : 'bg-red-50 border-red-200'} border rounded-2xl p-4`}>
          <h4 className={`font-bold mb-2 flex items-center gap-2 ${darkMode ? 'text-red-200' : 'text-red-800'}`}>
            <Shield size={18} />
            Sicherheitshinweise
          </h4>
          <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <li>• Nur Administratoren fügen Ressourcen hinzu</li>
            <li>• Alle Inhalte werden auf unangemessene Begriffe geprüft</li>
            <li>• Verstöße führen zur Sperrung des Accounts</li>
            <li>• Bei Problemen: Administrator informieren</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResourcesView;
