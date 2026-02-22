import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      const darkMode = this.props.darkMode;
      return (
        <div className={`max-w-4xl mx-auto p-6 rounded-xl border-2 border-red-500 ${darkMode ? 'bg-slate-800 text-white' : 'bg-red-50 text-gray-900'}`}>
          <h2 className="text-xl font-bold text-red-500 mb-2">⚠️ Fehler in dieser Ansicht</h2>
          <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Bitte diesen Fehler an den Administrator weitergeben:
          </p>
          <pre className={`text-xs p-3 rounded overflow-auto max-h-48 ${darkMode ? 'bg-slate-900 text-red-300' : 'bg-white text-red-700 border border-red-200'}`}>
            {String(this.state.error?.message || this.state.error)}
            {'\n\n'}
            {String(this.state.error?.stack || '')}
          </pre>
          <button
            onClick={() => this.setState({ error: null })}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
          >
            Erneut versuchen
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
