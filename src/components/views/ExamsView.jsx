import React from 'react';
import { ClipboardList, Calendar, Trash2 } from 'lucide-react';

const ExamsView = ({ exams, examTitle, setExamTitle, examDate, setExamDate, examTopics, setExamTopics, addExam, deleteExam }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <ClipboardList className="mr-2 text-green-500" />
          Klasuren & Prüfungen
        </h2>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-bold mb-3">Klasur eintragen</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder="Klasur-Titel"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <textarea
              value={examTopics}
              onChange={(e) => setExamTopics(e.target.value)}
              placeholder="Themen"
              rows="3"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <button
              onClick={addExam}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              <Calendar className="inline mr-2" size={18} />
              Eintragen
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {exams.map(exam => (
            <div key={exam.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">{exam.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {exam.date
                      ? new Date(exam.date).toLocaleDateString('de-DE')
                      : 'Ohne Termin'}
                  </span>
                  <button
                    onClick={() => deleteExam(exam.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100 transition-all"
                    title="Klausur löschen"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 mb-2">{exam.description || exam.topics}</p>
              <p className="text-sm text-gray-500">Eingetragen von {exam.createdBy || exam.user}</p>
            </div>
          ))}
          {exams.length === 0 && (
            <p className="text-gray-500 text-center py-8">Keine Klasuren eingetragen</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamsView;
