import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

const validatePDF = (file) => {
  if (!file) throw new Error('Aucun fichier fourni')
  if (file.type !== 'application/pdf') throw new Error('Le fichier doit être au format PDF')
  if (file.size > 10 * 1024 * 1024) throw new Error('La taille du fichier ne doit pas dépasser 10MB')
}

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => {
    const base64String = reader.result
      .replace('data:', '')
      .replace(/^.+,/, '')
    resolve(base64String)
  }
  reader.onerror = error => reject(error)
  reader.readAsDataURL(file)
})

const generateQuestionsFromText = async (topic, text, studyLevel, numberOfQuestions) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2000
      }
    })

    const prompt = text
      ? `À partir du texte suivant : "${text}", génère ${numberOfQuestions} questions à choix multiples sur le sujet "${topic}" pour un niveau ${studyLevel}. Inclus les réponses correctes et des explications pour chaque réponse. Formatte la réponse en JSON valide avec un tableau de questions, chaque question ayant les propriétés suivantes : question (string), options (un tableau de 4 strings), correctAnswer (l'index de la bonne réponse, number), et explanation (string). Retourne uniquement le JSON, sans texte supplémentaire.`
      : `Génère ${numberOfQuestions} questions à choix multiples sur le sujet "${topic}" pour un niveau ${studyLevel}. Inclus les réponses correctes et des explications pour chaque réponse. Formatte la réponse en JSON valide avec un tableau de questions, chaque question ayant les propriétés suivantes : question (string), options (un tableau de 4 strings), correctAnswer (l'index de la bonne réponse, number), et explanation (string). Retourne uniquement le JSON, sans texte supplémentaire.`

    const result = await model.generateContent(prompt)
    const response = result.response.text()
    const jsonMatch = response.match(/\[.*\]/s)
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('Aucun JSON valide trouvé dans la réponse')
  } catch (error) {
    console.error('Error generating questions:', error)
    throw error
  }
}

const generateQuestionsFromPDF = async (file, topic, studyLevel, numberOfQuestions) => {
  try {
    validatePDF(file)
    const fileBase64 = await toBase64(file)

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2000
      }
    })

    const prompt = `Génère ${numberOfQuestions} questions à choix multiples sur le sujet "${topic}" pour un niveau ${studyLevel} en utilisant le contenu de ce document PDF. Inclus les réponses correctes et des explications pour chaque réponse. Formatte la réponse en JSON valide avec un tableau de questions, chaque question ayant les propriétés suivantes : question (string), options (un tableau de 4 strings), correctAnswer (l'index de la bonne réponse, number), et explanation (string). Retourne uniquement le JSON, sans texte supplémentaire.`

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: file.type,
          data: fileBase64
        }
      },
      { text: prompt }
    ])

    const response = result.response.text()
    const jsonMatch = response.match(/\[.*\]/s)
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('Aucun JSON valide trouvé dans la réponse')
  } catch (error) {
    console.error('Error generating questions from PDF:', error)
    throw error
  }
}

export { generateQuestionsFromText, generateQuestionsFromPDF }
