import React from 'react'

const Results = ({ questions, userAnswers, onRestart }) => {
  const calculateScore = () => {
    return userAnswers.reduce((total, answer, index) => {
      return answer === questions[index].correctAnswer ? total + 1 : total
    }, 0)
  }

  const score = calculateScore()

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Résultats</h2>
      
      <div className="mb-6">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Vous avez obtenu {score} bonnes réponses sur {questions.length}.
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {question.question}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options.map((option, i) => {
                const isCorrect = i === question.correctAnswer
                const isSelected = i === userAnswers[index]
                
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-lg ${
                      isCorrect
                        ? 'bg-green-100 dark:bg-green-900'
                        : isSelected
                        ? 'bg-red-100 dark:bg-red-900'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={isSelected}
                        readOnly
                        className="mr-3"
                      />
                      <span className="text-gray-700 dark:text-gray-200">{option}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-200">
                <span className="font-semibold">Explication :</span> {question.explanation}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onRestart}
        className="mt-6 w-full bg-gradient-to-r from-[#6366f1] to-[#9333ea] text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
      >
        Recommencer
      </button>
    </div>
  )
}

export default Results
