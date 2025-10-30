import React from 'react'

const QuestionUnique = ({question}) => {

  const q= question.question;
  const options=question.options || []
  const radionName=`Pregunta: ${q.id}`
  
  return (
    <div className="max-w-xl border rounded-2xl p-6 shadow">
      <h3 className="font-semibold mb-4">{q.description}</h3>

      <form onSubmit={handleSubmit}>
        <div className="space-y-3 mb-4">
          {options.length > 0 ? (
            options.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={radioName}
                  value={opt.id}
                  checked={selectedOption === opt.id}
                  onChange={() => setSelectedOption(opt.id)}
                  required
                />
                {opt.description}
              </label>
            ))
          ) : (
            <p className="text-gray-500">(No options)</p>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-gray-100 border rounded-lg hover:bg-gray-200"
        >
          Enviar
        </button>

        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>

      {payload && (
        <div className="mt-4">
          <h4 className="font-medium">Payload to send:</h4>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default QuestionUnique