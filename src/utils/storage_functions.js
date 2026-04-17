/**
 * Deletes all answers and data associated with a specific visit
 */
export function deleteVisitDataFromSession(
  storageKey,
  surveysessionId,
  visit_number
) {
  if (!surveysessionId || !visit_number) {
    console.error("Both surveysessionId and visitId are required.");
    return;
  }

  const savedData = localStorage.getItem(storageKey);

  if (!savedData) {
    console.warn(`Session data not found for key: ${storageKey}`);
    return;
  }

  let sessionData;
  try {
    sessionData = JSON.parse(savedData);
  } catch (e) {
    console.error("Failed to parse session data from localStorage.", e);
    return;
  }

  const visitKeyToDelete = `visit_${visit_number}`;

  if (sessionData[visitKeyToDelete]) {
    delete sessionData[visitKeyToDelete];
    console.log(`Deleted ${visitKeyToDelete}`);
  } else {
    console.warn(`Visit not found: ${visitKeyToDelete}`);
    return;
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(sessionData));
  } catch (e) {
    console.error("Failed to save modified session data.", e);
  }
}

/**
 * Get initial state (answers/comments) for visit + category
 */
export function getInitialState(
  storageKey,
  visitNum,
  categoryId,
  dataType // "answers" | "comments"
) {
  const savedItem = localStorage.getItem(storageKey);

  if (!savedItem) return {};

  try {
    const sessionData = JSON.parse(savedItem);

    const visitKey = `visit_${visitNum}`;
    const categoryKey = `category_${categoryId}`;

    const visitData = sessionData[visitKey];
    if (!visitData) return {};

    const categoryData = visitData[categoryKey];
    if (!categoryData) return {};

    return categoryData[dataType] || {};
  } catch (error) {
    console.error(`Failed to parse storage for key: ${storageKey}`, error);
    return {};
  }
}

/**
 * Save answers/comments for visit + category
 */
export function saveStorageState(
  storageKey,
  visitNum,
  categoryId,
  dataType, // "answers" | "comments"
  data
) {
  let sessionData;

  const savedItem = localStorage.getItem(storageKey);

  // Step 1: Load or init
  if (!savedItem) {
    sessionData = {};
  } else {
    try {
      sessionData = JSON.parse(savedItem);
    } catch (e) {
      console.error("Corrupted localStorage data.", e);
      return;
    }
  }

  const visitKey = `visit_${visitNum}`;
  const categoryKey = `category_${categoryId}`;

  // Step 2: ensure visit exists
  if (!sessionData[visitKey]) {
    sessionData[visitKey] = {};
  }

  // Step 3: ensure category exists
  if (!sessionData[visitKey][categoryKey]) {
    sessionData[visitKey][categoryKey] = {};
  }

  // Step 4: set data
  sessionData[visitKey][categoryKey][dataType] = data;

  try {
    localStorage.setItem(storageKey, JSON.stringify(sessionData));
  } catch (error) {
    console.error("Failed saving to localStorage", error);
  }
}

/**
 * Delete ONLY a category inside a visit (NEW)
 */
export function deleteCategoryDataFromVisit(
  storageKey,
  visitNum,
  categoryId
) {
  const savedItem = localStorage.getItem(storageKey);

  if (!savedItem) return;

  let sessionData;

  try {
    sessionData = JSON.parse(savedItem);
  } catch (e) {
    console.error("Failed to parse storage", e);
    return;
  }

  const visitKey = `visit_${visitNum}`;
  const categoryKey = `category_${categoryId}`;

  if (
    sessionData[visitKey] &&
    sessionData[visitKey][categoryKey]
  ) {
    delete sessionData[visitKey][categoryKey];
    console.log(`Deleted ${categoryKey} from ${visitKey}`);
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(sessionData));
  } catch (e) {
    console.error("Failed saving storage", e);
  }
}