import React from 'react';
import { Brain, Plus, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/constants';

const QuestionsView = ({
  submittedQuestions,
  newQuestionText,
  setNewQuestionText,
  newQuestionCategory,
  setNewQuestionCategory,
  newQuestionAnswers,
  setNewQuestionAnswers,
  newQuestionCorrect,
  setNewQuestionCorrect,
  submitQuestion,
  approveQuestion
}) => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Brain className="mr-2 text-purple-500" />
          Fragen einreichen
        </h2>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-bold mb-3">Neue Quizfrage vorschlagen</h3>
          <div className="space-y-3">
            <textarea
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Deine Frage..."
              rows="2"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <select
              value={newQuestionCategory}
              onChange={(e) => setNewQuestionCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {[0, 1, 2, 3].map(i => (
              <input
                key={i}
                type="text"
                value={newQuestionAnswers[i]}
                onChange={(e) => {
                  const newAnswers = [...newQuestionAnswers];
                  newAnswers[i] = e.target.value;
                  setNewQuestionAnswers(newAnswers);
                }}
                placeholder={`Antwort ${i + 1} ${i === newQuestionCorrect ? '(richtig)' : ''}`}
                className={`w-full px-4 py-2 border rounded-lg ${i === newQuestionCorrect ? 'border-green-500' : ''}`}
              />
            ))}
            <select
              value={newQuestionCorrect}
              onChange={(e) => setNewQuestionCorrect(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {[0, 1, 2, 3].map(i => (
                <option key={i} value={i}>Richtige Antwort: {i + 1}</option>
              ))}
            </select>
            <button
              onClick={submitQuestion}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
            >
              <Plus className="inline mr-2" size={18} />
              Frage einreichen
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="font-bold text-lg">Eingereichte Fragen</h3>
          {submittedQuestions.map(q => {
            const cat = CATEGORIES.find(c => c.id === q.category);
            return (
              <div key={q.id} className={`border rounded-lg p-4 ${q.approved ? 'bg-green-50 border-green-500' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`${cat.color} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                        {cat.name}
                      </span>
                      {q.approved && (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                          <Check size={14} className="mr-1" />
                          Genehmigt
                        </span>
                      )}
                    </div>
                    <p className="font-bold mb-2">{q.text}</p>
                    <ul className="text-sm space-y-1">
                      {q.answers.map((a, i) => (
                        <li key={i} className={i === q.correct ? 'text-green-600 font-medium' : ''}>
                          {i + 1}. {a}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">Von {q.submittedBy}</p>
                  </div>
                  {user.permissions.canApproveQuestions && !q.approved && (
                    <button
                      onClick={() => approveQuestion(q.id)}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg ml-4"
                    >
                      <Check size={20} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {submittedQuestions.length === 0 && (
            <p className="text-gray-500 text-center py-8">Noch keine Fragen eingereicht</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionsView;
