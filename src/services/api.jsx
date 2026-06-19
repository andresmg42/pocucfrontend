// ============================================
// MOCK API SERVICE - NO BACKEND REQUIRED
// Version: 2.0 (Updated)
// ============================================

console.log("🟢 Mock API Service Loaded - v2.0");

// In-memory data store
const DB = {
  campus: [
    { id: 1, name: "Campus Meléndez" },
    { id: 2, name: "Campus San Fernando" },
  ],
  zone: [
    {
      id: 1,
      name: "Biblioteca Central",
      number: 1,
      zone_type: "CL",
      campus: 1,
    },
    { id: 2, name: "Plaza Central", number: 2, zone_type: "OP", campus: 1 },
  ],
  category: [
    { id: 1, name: "Infraestructura", image: "", target_zone_type: null },
    { id: 2, name: "Servicios", image: "", target_zone_type: "CL" },
  ],
  subcategory: [
    { id: 1, name: "Mobiliario", category: 1 },
    { id: 2, name: "Iluminación", category: 1 },
    { id: 3, name: "Mercadeo y Ventas", category: 2 },
    { id: 4, name: "Publicidad", category: 2 },
  ],
  option: [
    { id: 1, description: "0" },
    { id: 2, description: "1" },
    { id: 3, description: "2" },
    { id: 4, description: "3" },
    { id: 5, description: "4" },
    { id: 6, description: "5" },
    { id: 7, description: "Excelente" },
    { id: 8, description: "Bueno" },
    { id: 9, description: "Regular" },
    { id: 10, description: "Malo" },
  ],
  observer: [
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan.perez@univalle.edu.co",
      phone: "3001234567",
    },
    {
      id: 2,
      name: "María García",
      email: "maria.garcia@univalle.edu.co",
      phone: "3007654321",
    },
  ],
  survey: [
    {
      id: 1,
      name: "Encuesta Espacios 2026",
      topic: "Espacios",
      version: "1.0",
      description: "Evaluación de espacios universitarios",
      image_url: "",
      uploaded_at: new Date().toISOString(),
    },
  ],
  surveysession: [
    {
      id: 1,
      zone: 1,
      zone_name: "Biblioteca Central",
      observer: "Juan Pérez",
      survey: 1,
      number_session: 1,
      start_date: null,
      end_date: null,
      observational_distance: "5 metros",
      url: "http://example.com",
      uploaded_at: new Date().toISOString().split("T")[0],
      state: 0,
      visit_number: 1,
      visits_created: "No",
      campus_name: "Campus Meléndez",
    },
  ],
  visit: [
    {
      id: 1,
      surveysession: 1,
      visit_number: 1,
      visit_start_date_time: null,
      visit_end_date_time: null,
      state: 0,
    },
  ],
  response: [
    {
      id: 1,
      visita: 1,
      question: 1,
      numeric_value: 5,
      text_value: null,
      option: 1,
    },
  ],
  question: [
    // Sample question for testing - will be created by users
    // Example structure:
    // {
    //   id: 1,
    //   subcategory: { id: 3, name: 'Mercadeo y Ventas', category: 2 },
    //   code: 'A',
    //   question_type: 'matrix_parent',
    //   description: '¿En qué lugar específico se identifica la venta de las sustancias?',
    //   parent_question: null,
    //   survey: [1],
    //   options: [
    //     { id: 1, description: '0' },
    //     { id: 2, description: '1' }
    //   ],
    //   position: 1.0,
    //   sub_questions: [],
    //   is_required: true,
    //   input_type: 'NUM'
    // }
  ],
};

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

// API factory
function createAPI(name) {
  return {
    list: () => {
      console.log(`📋 ${name}.list() called`);
      return new Promise((resolve) => {
        setTimeout(() => {
          const data = JSON.parse(JSON.stringify(DB[name]));
          console.log(`✅ ${name}.list() returning ${data.length} items`);
          resolve(data);
        }, 100);
      });
    },

    get: (id) => {
      console.log(`🔍 ${name}.get(${id}) called`);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const item = DB[name].find((x) => x.id === id);
          if (!item) {
            console.error(`❌ ${name}.get(${id}) not found`);
            reject(new Error("Not found"));
          } else {
            console.log(`✅ ${name}.get(${id}) found`);
            resolve(JSON.parse(JSON.stringify(item)));
          }
        }, 100);
      });
    },

    create: (data) => {
      console.log(`➕ ${name}.create() called`, data);
      return new Promise((resolve) => {
        setTimeout(() => {
          const newItem = { ...data, id: IDS[name]++ };
          DB[name].push(newItem);
          console.log(`✅ ${name}.create() created item #${newItem.id}`);
          resolve(JSON.parse(JSON.stringify(newItem)));
        }, 100);
      });
    },

    update: (id, data) => {
      console.log(`✏️ ${name}.update(${id}) called`, data);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const idx = DB[name].findIndex((x) => x.id === id);
          if (idx === -1) {
            console.error(`❌ ${name}.update(${id}) not found`);
            reject(new Error("Not found"));
          } else {
            DB[name][idx] = { ...data, id };
            console.log(`✅ ${name}.update(${id}) updated`);
            resolve(JSON.parse(JSON.stringify(DB[name][idx])));
          }
        }, 100);
      });
    },

    delete: (id) => {
      console.log(`🗑️ ${name}.delete(${id}) called`);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const idx = DB[name].findIndex((x) => x.id === id);
          if (idx === -1) {
            console.error(`❌ ${name}.delete(${id}) not found`);
            reject(new Error("Not found"));
          } else {
            DB[name].splice(idx, 1);
            console.log(`✅ ${name}.delete(${id}) deleted`);
            resolve(null);
          }
        }, 100);
      });
    },
  };
}

const api = {
  campus: createAPI("campus"),
  category: createAPI("category"),
  observer: createAPI("observer"),
  option: createAPI("option"),
  response: createAPI("response"),
  subcategory: createAPI("subcategory"),
  survey: createAPI("survey"),
  surveysession: createAPI("surveysession"),
  visit: createAPI("visit"),
  zone: createAPI("zone"),
  question: {
    ...createAPI("question"),
    getBySurvey: (surveyId) => {
      console.log(`📋 question.getBySurvey(${surveyId}) called`);
      return new Promise((resolve) => {
        setTimeout(() => {
          const questions = DB.question.filter((q) =>
            q.survey.includes(surveyId),
          );
          // Build hierarchy: only return parent questions with their sub_questions
          const parentQuestions = questions
            .filter((q) => q.parent_question === null)
            .map((parent) => {
              const subQuestions = questions.filter(
                (q) => q.parent_question === parent.id,
              );
              return {
                ...parent,
                sub_questions: subQuestions,
              };
            })
            .sort((a, b) => a.position - b.position);
          console.log(
            `✅ question.getBySurvey(${surveyId}) returning ${parentQuestions.length} parent questions`,
          );
          resolve(JSON.parse(JSON.stringify(parentQuestions)));
        }, 100);
      });
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

export default api;
