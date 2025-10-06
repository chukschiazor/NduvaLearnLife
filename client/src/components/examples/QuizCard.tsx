import QuizCard from '../QuizCard'

export default function QuizCardExample() {
  const sampleQuestion = {
    question: "What is the recommended percentage of your income to save each month?",
    options: [
      "5%",
      "10-20%",
      "50%",
      "100%"
    ],
    correctAnswer: 1
  };

  return (
    <div className="p-6">
      <QuizCard
        question={sampleQuestion}
        questionNumber={1}
        totalQuestions={5}
        onNext={() => console.log('Next question')}
      />
    </div>
  )
}
