import api from "../api/user.api";

const IDS = {
  campus: 3,
  zone: 3,
  category: 3,
  subcategory: 5,
  option: 11,
  observer: 3,
  survey: 2,
  surveysession: 2,
  visit: 2,
  response: 2,
  question: 1,
};

function createAPI(name) {
  return {
    list: () => {
      console.log(`📋 ${name}.list() called`);
      return api.get(`/${name}/`);
    },

    get: (id) => {
      console.log(`🔍 ${name}.get(${id}) called`);
      return api.get(`/${name}/${id}/`);
    },

    create: (data) => {
      console.log(`➕ ${name}.create() called`, data);
      return api.post(`/${name}/`, data);
    },

    update: (id, data) => {
      console.log(`✏️ ${name}.update(${id}) called`, data);
      return api.patch(`/${name}/${id}/`, data);
    },

    delete: (id) => {
      console.log(`🗑️ ${name}.delete(${id}) called`);
      return api.delete(`/${name}/${id}/`);
    },
  };
}

const apiAdmin = {
  campus: createAPI("campus"),
  category: createAPI("category"),
  observer: {
    ...createAPI("observer"),
    createValidUser: (data) => api.post("/observer/create/", data),
  },
  option: createAPI("options"),
  response: createAPI("response"),
  subcategory: createAPI("subcategory"),
  survey: createAPI("survey/surveys"),
  surveysession: createAPI("surveysession"),
  visit: createAPI("visit"),
  zone: createAPI("zone"),
  question: {
    ...createAPI("question"),
    getBySurvey: (surveyId) => {
      return api.get(`/question/get_questions_by_survey?survey_id=${surveyId}`);
    },
    // Get all questions (including those not linked to any survey) - for question bank
    getBank: () => {
      console.log(`📋 question.getBank() called`);
      return new Promise((resolve) => {
        setTimeout(() => {
          const allQuestions = DB.question
            .filter((q) => q.parent_question === null)
            .map((parent) => {
              const subQuestions = DB.question.filter(
                (q) => q.parent_question === parent.id,
              );
              return {
                ...parent,
                sub_questions: subQuestions,
              };
            })
            .sort((a, b) => a.position - b.position);
          console.log(
            `✅ question.getBank() returning ${allQuestions.length} questions`,
          );
          resolve(JSON.parse(JSON.stringify(allQuestions)));
        }, 100);
      });
    },
  },
};

console.log("🟢 Mock API Ready:", Object.keys(api));

export default apiAdmin;
