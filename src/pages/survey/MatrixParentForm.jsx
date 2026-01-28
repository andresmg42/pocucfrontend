import React from "react";

const MatrixParentForm = ({q,comments,commentTrigger,answers,handleRadioChange,handleOtherTextChange,handleOtherNumericChange,setCommentTrigger,handleCommentChange,openTextFields}) => {
  return (
    <fieldset
      key={q.id}
      className="pb-8 mb-8 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0"
    >
      <div className="flex gap-3">
        {q.is_required && (
          <legend className="text-red-700 font-bold text-lg">*</legend>
        )}
        <legend className="text-xl font-semibold text-gray-800 mb-4">
          {`${q.code}. ${q.description}`}
        </legend>
      </div>

      {/* Sub-questions map */}
      {q.sub_questions.map((sub_q) => {
        // Logic remains unchanged
        const isOtherOpen = openTextFields[sub_q.id];
        const isOtherSelected =
          isOtherOpen ||
          (answers[sub_q.id] &&
            !q.options.some(
              (opt) =>
                opt.description === answers[sub_q.id]?.numeric_value ||
                opt.description === answers[sub_q.id]?.textValue,
            ));

        return (
          // Sub-question fieldset
          <fieldset
            key={sub_q.id}
            className="mt-6 pt-6 border-t border-gray-100 first:mt-0 first:pt-0 first:border-t-0"
          >
            <legend className="text-md font-medium text-gray-700 mb-3">
              {sub_q.description}
            </legend>

            {/* Responsive wrapper for options */}
            <div className="flex flex-wrap gap-2 md:gap-4 pl-0 md:pl-4">
              {q.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-3 p-3.5 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-blue-50 border border-transparent hover:border-blue-200"
                >
                  <input
                    type="radio"
                    id={option.id}
                    name={sub_q.id}
                    value={option.description}
                    required={sub_q.is_required}
                    onChange={() =>
                      handleRadioChange(sub_q.id, option.description, option.id)
                    }
                    checked={
                      answers[sub_q.id]?.numeric_value === option.description ||
                      answers[sub_q.id]?.textValue === option.description
                    }
                    className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700">
                    {option.description}
                  </span>
                </label>
              ))}
              {/* "Other" option for matrix sub-question */}
              <div>
                <label className="flex items-center gap-3 p-3.5 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-blue-50 border border-transparent hover:border-blue-200">
                  <input
                    type="radio"
                    id={`${sub_q.id}-other`}
                    name={sub_q.id}
                    value="other"
                    required={sub_q.is_required}
                    checked={isOtherSelected}
                    onChange={() => handleRadioChange(sub_q.id, "other", "")}
                    className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700">mas</span>
                </label>

                {isOtherSelected && (
                  <>
                    {q.input_type === "STR" ? (
                      <div className="pl-10 mt-2">
                        <input
                          type="text"
                          id={sub_q.id}
                          placeholder="Especifique su respuesta"
                          value={answers[sub_q.id]?.textValue}
                          onChange={(e) =>
                            handleOtherTextChange(sub_q.id, e.target.value)
                          }
                          required={sub_q.is_required}
                          autoFocus
                          maxLength={30}
                          className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="pl-4 sm:pl-10 mt-2">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <input
                            type="number"
                            id={sub_q.id}
                            placeholder="Especifique su respuesta"
                            value={answers[sub_q.id]?.numeric_value || ""}
                            onChange={(e) =>
                              handleOtherNumericChange(sub_q.id, e.target.value)
                            }
                            required={sub_q.is_required}
                            autoFocus
                            className="w-full p-2 text-gray-900 text-center border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                          />

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const currentValue =
                                  answers[sub_q.id]?.numeric_value || 0;
                                handleOtherNumericChange(
                                  sub_q.id,
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
                                  answers[sub_q.id]?.numeric_value || 0;
                                handleOtherNumericChange(
                                  sub_q.id,
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
          </fieldset>
        );
      })}

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
                className="block w-full h-[15vh]  p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>
        )}
      </div>
    </fieldset>
  );
};

export default MatrixParentForm;
