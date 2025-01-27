import React, { useState, useEffect } from 'react'
import Home from './Home'
import Quiz from './Quiz'
import Results from './Results'
import { generateQuestionsFromText, generateQuestionsFromPDF } from './geminiService'

const App = () => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Détection du mode sommeil système
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true)
    }
  }, [])

  // Application du mode sombre
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const generateQuestions = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      let questions
      if (formData.pdfFile) {
        questions = await generateQuestionsFromPDF(
          formData.pdfFile,
          formData.topic,
          formData.studyLevel,
          formData.numberOfQuestions
        )
      } else {
        questions = await generateQuestionsFromText(
          formData.topic,
          formData.text,
          formData.studyLevel,
          formData.numberOfQuestions
        )
      }
      
      setQuestions(questions)
      setCurrentQuestionIndex(0)
      setUserAnswers(new Array(questions.length).fill(null))
      setShowResults(false)
    } catch (err) {
      setError(err.message || 'Erreur lors de la génération des questions')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-4">
      {/* Bouton de bascule du mode sombre */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg"
      >
        {darkMode ? '🌞' : '🌙'}
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            StudyMate AI
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            Votre compagnon pour des révisions intelligentes
          </p>
        </div>

        {questions.length === 0 ? (
          <Home onSubmit={generateQuestions} loading={loading} />
        ) : showResults ? (
          <Results 
            questions={questions}
            userAnswers={userAnswers}
            onRestart={() => {
              setQuestions([])
              setUserAnswers([])
              setShowResults(false)
            }}
          />
        ) : (
          <Quiz
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            selectedAnswer={userAnswers[currentQuestionIndex]}
            onAnswer={(index) => {
              const newAnswers = [...userAnswers]
              newAnswers[currentQuestionIndex] = index
              setUserAnswers(newAnswers)
            }}
            onNext={() => {
              if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1)
              }
            }}
            onSubmit={() => setShowResults(true)}
          />
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
