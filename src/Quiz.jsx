import React from 'react'

function Quiz({ question, questionNumber, totalQuestions, selectedAnswer, onAnswer, onNext, onSubmit }) {
  return (
    <div className="bg-white dark:bg-dark-700 p-4 rounded-xl shadow-lg mx-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Question {questionNumber} sur {totalQuestions}
        </h2>
        <h3 className="text-lg text-gray-700 dark:text-gray-200">{question.question}</h3>
      </div>

      <div className="space-y-3">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => onAnswer(i)}
            className={`w-full text-left p-4 rounded-lg transition-colors duration-200
              ${
                selectedAnswer === i
                  ? 'bg-gradient-to-r from-[#6366f1] to-[#9333ea] text-white'
                  : 'bg-gray-100 dark:bg-dark-600 hover:bg-gray-200 dark:hover:bg-dark-500 text-gray-700 dark:text-gray-200'
              }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-between gap-4">
        {questionNumber < totalQuestions ? (
          <button
            onClick={onNext}
            className="flex-1 bg-gradient-to-r from-[#6366f1] to-[#9333ea] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Suivant
          </button>
        ) : (
          <button
            onClick={onSubmit}
            className="flex-1 bg-gradient-to-r from-[#6366f1] to-[#9333ea] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Soumettre
          </button>
        )}
      </div>
    </div>
  )
}

export default Quiz
