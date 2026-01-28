import React from "react";

const UniqueResponseForm = ({
  q,
  comments,
  answers,
  handleRadioChange,
  handleOtherTextChange,
  handleOtherNumericChange,
  setCommentTrigger,
  handleCommentChange,
  commentTrigger,
  openTextFields
}) => {
  const isOtherOpen = openTextFields[q.id];

  const isOtherSelected =
    isOtherOpen ||
    (answers[q.id] &&
      !q.options.some(
        (opt) =>
          opt.description === answers[q.id]?.numeric_value ||
          opt.description === answers[q.id]?.textValue,
      ));
  return (
    <fieldset
      key={q.id}
      className="pb-8 mb-8 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0 space-y-3"
    >
      <div className="flex gap-3">
        {q.is_required && (
          <legend className="text-red-700 font-bold text-lg">*</legend>
        )}

        <legend className="text-xl font-semibold text-gray-800 mb-4">
          {`${q.code}. ${q.description}`}
        </legend>
      </div>

      {/* Options map */}
      <div className="flex flex-wrap gap-2 md:gap-4 pl-0 md:pl-4">
        {q.options.map((option) => (
          <label
            key={option.id}
            className="flex items-center gap-3 p-3.5 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-blue-50 border border-transparent hover:border-blue-200"
          >
            <input
              type="radio"
              id={option.id}
              name={q.id}
              value={option.description}
              required={q.is_required}
              checked={
                answers[q.id]?.numeric_value === option.description ||
                answers[q.id]?.textValue === option.description
              }
              onChange={() =>
                handleRadioChange(q.id, option.description, option.id)
              }
              // Styled radio button
              className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">
              {option.description}
            </span>
          </label>
        ))}

        {/* "Other" Option */}
        <div>
          <label className="flex items-center gap-3 p-3.5 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-blue-50 border border-transparent hover:border-blue-200">
            <input
              type="radio"
              id={`${q.id}-other`}
              name={q.id}
              value="other"
              required={q.is_required}
              checked={isOtherSelected}
              onChange={() => handleRadioChange(q.id, "other", "")}
              className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">mas</span>
          </label>

          {/* Indented "Other" text field */}

          {isOtherSelected && (
            <>
              {q.input_type === "STR" ? (
                <div className="pl-10 mt-2 ">
                  <input
                    type="text"
                    id={q.id}
                    placeholder="Especifique su respuesta"
                    value={
                      answers[q.id]?.numeric_value ||
                      answers[q.id]?.textValue ||
                      ""
                    }
                    onChange={(e) =>
                      handleOtherTextChange(q.id, e.target.value)
                    }
                    required={q.is_required}
                    autoFocus
                    maxLength={30}
                    // Styled text input
                    className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ) : (
                <div className="pl-4 sm:pl-10 mt-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="number"
                      id={q.id}
                      placeholder="Especifique su respuesta"
                      value={answers[q.id]?.numeric_value || "6"}
                      onChange={(e) =>
                        handleOtherNumericChange(q.id, e.target.value)
                      }
                      required={q.is_required}
                      autoFocus
                      className="w-full p-2 text-gray-900 text-center border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const currentValue =
                            answers[q.id]?.numeric_value || 6;
                          handleOtherNumericChange(
                            q.id,
                            String(Number(currentValue) - 1),
                          );
                        }}
                        className="flex-1 sm:flex-initial sm:w-10 h-10 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700 font-bold rounded-lg flex items-center justify-center touch-manipulation"
                      >
                        −
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const currentValue =
                            answers[q.id]?.numeric_value || 6;
                          handleOtherNumericChange(
                            q.id,
                            String(Number(currentValue) + 1),
                          );
                        }}
                        className="flex-1 sm:flex-initial sm:w-10 h-10 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700 font-bold rounded-lg flex items-center justify-center touch-manipulation"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Comment */}
      <div>
        <div
          className="cursor-pointer"
          onClick={() =>
            setCommentTrigger((prev) => ({
              ...prev,
              [q.id]: !prev[q.id],
            }))
          }
        >
          <h1 className=" text-md text-blue-700">Comentario</h1>
        </div>

        {commentTrigger[q.id] && (
          <div>
            <div className="mt-2 ">
              <textarea
                id={`${q.id}_comment`}
                placeholder="Escriba un comentario"
                value={comments[q.id]?.comment}
                onChange={(e) => handleCommentChange(q.id, e.target.value)}
                autoFocus
                // Your styles like h-[20vh] will now work correctly!
                className="block  w-full h-[15vh] p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>
        )}
      </div>
    </fieldset>
  );
};

export default UniqueResponseForm;
