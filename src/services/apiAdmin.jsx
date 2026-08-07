import api from "../api/user.api";

function createAPI(name) {
  return {
    list: () => {
      return api.get(`/${name}/`);
    },

    get: (id) => {
      return api.get(`/${name}/${id}/`);
    },

    create: (data) => {
      return api.post(`/${name}/`, data);
    },

    update: (id, data) => {
      return api.patch(`/${name}/${id}/`, data);
    },

    delete: (id) => {
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
  option: {
    ...createAPI("options"),
    getOptions: (matchingType = null) => {
      if (matchingType) {
        return api.get(`/options?matching_type=${matchingType}`);
      }
      return api.get("/options/");
    },
  },
  response: createAPI("response"),
  subcategory: createAPI("subcategory"),
  survey: createAPI("survey/surveys"),
  surveysession: createAPI("surveysession"),
  visit: createAPI("visit"),
  zone: {
    ...createAPI("zone"),
    getZoneByCampus: (campus_id) =>
      api.get(`/zone/get_zones_by_campus/?campus_id=${campus_id}`),
  },
  question: {
    ...createAPI("question"),
    getBySurvey: (surveyId, question_id = null) => {
      if (!question_id) {
        return api.get(
          `/question/get_questions_by_survey?survey_id=${surveyId}`,
        );
      }
      return api.get(
        `/question/get_questions_by_survey?survey_id=${surveyId}&question_id=${question_id}`,
      );
    },
    reorderQuestions: (data) => {
      return api.post(`/question/reorder_questions`, data);
    },
    // Get all questions (including those not linked to any survey) - for question bank
    getBank: () => {
      return api.get("/question/get_questions_bank");
    },
  },
};

export default apiAdmin;
