export default function QuestionCard({
  question,
  selected,
  onSelect,
}) {
  return (
    <div className="border p-4 rounded-lg shadow mb-6">
      <p className="mb-2 font-semibold">
        {question.number}. {question.question_text}
      </p>

      {question.imageUrl && (
        <img
          src={question.imageUrl}
          alt="question"
          className="mb-4 rounded"
        />
      )}

      {question.audioUrl && (
        <audio controls className="mb-4">
          <source src={question.audioUrl} type="audio/mpeg" />
        </audio>
      )}

      <div className="space-y-2">
        {question.Options.map((opt) => (
          <label
            key={opt.id}
            className={`block p-2 border rounded cursor-pointer ${
              selected === opt.id
                ? "bg-blue-100 border-blue-600"
                : "hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name={`q-${question.id}`}
              checked={selected === opt.id}
              onChange={() => onSelect(question.id, opt.id)}
              className="mr-2"
            />
            {opt.option_label}. {opt.option_text}
          </label>
        ))}
      </div>
    </div>
  );
}
