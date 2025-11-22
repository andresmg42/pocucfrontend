/**
 * Deletes all answers and data associated with a specific visit from a survey session
 * that is stored in a single localStorage key.
 *
 * @param {string} surveysessionId - The ID of the session (e.g., '12345').
 * @param {string} visit_number - The ID of the visit to delete (e.g., '101').
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

  // --- Step 2: Modify the data (Delete the visit entry) ---
  // The key in the object is structured as "visit_101", so we construct the full key name
  const visitKeyToDelete = `visit_${visit_number}`;

  if (sessionData[visitKeyToDelete]) {
    // Use the delete operator to remove the entire property/object for that visit
    delete sessionData[visitKeyToDelete];
    console.log(
      `Successfully deleted data for ${visitKeyToDelete} from session ${surveysessionId}.`
    );
  } else {
    console.warn(
      `Visit data not found for key: ${visitKeyToDelete} within the session.`
    );
    // No modification is needed if the key doesn't exist
    return;
  }

  // --- Step 3: Save the modified data back ---
  try {
    const dataToSave = JSON.stringify(sessionData);
    localStorage.setItem(storageKey, dataToSave);
    console.log(`Updated session data saved back to localStorage.`);
  } catch (e) {
    console.error("Failed to save modified session data to localStorage.", e);
  }
}

/**
 * Retrieves initial state (answers or comments) for a specific visit ID within a session.
 * * @param {string} storageKey - The top-level localStorage key (e.g., 'mySurveySessionData_123').
 * @param {string} visitNum - The ID of the visit (e.g., '101').
 * @param {string} dataType - 'answers' or 'comments' to identify the internal key.
 */
export function getInitialState(storageKey, visitNum, dataType) {
  const savedItem = localStorage.getItem(storageKey);

  if (savedItem) {
    try {
      const sessionData = JSON.parse(savedItem);

      // 1. Determine the outer key (the visit)
      const visitKey = `visit_${visitNum}`;
      const visitData = sessionData[visitKey];

      if (!visitData) return {}; // No data found for this visit

      // 2. Determine the inner key (simple 'answers' or 'comments')
      const dataKey = dataType;

      // 3. Return the specific answers/comments object for this visit
      // Returns the object or an empty object if the specific dataKey is missing
      return visitData[dataKey] || {};
    } catch (error) {
      console.error(
        `Failed to parse session data for key: ${storageKey}`,
        error
      );
      return {};
    }
  }
  return {};
}

export function saveStorageState(storageKey, visitNum, dataType, data) {
    const savedItem = localStorage.getItem(storageKey);
    let sessionData;

    // --- Step 1: Initialize or Retrieve sessionData ---
    if (!savedItem) {
        // If the top-level session key doesn't exist, initialize an empty object.
        sessionData = {};
        console.log(`Initialized new session data for key: ${storageKey}`);
    } else {
        try {
            sessionData = JSON.parse(savedItem);
        } catch (e) {
            console.error("Failed to parse session data from localStorage. Data corrupted.", e);
            return;
        }
    }

    // --- Step 2: Ensure the Visit structure exists ---
    const visitToUpdate = `visit_${visitNum}`;
    
    // Initialize the visit object if it doesn't exist
    if (!sessionData[visitToUpdate]) {
        sessionData[visitToUpdate] = {}; 
        console.log(`Initialized new visit entry: ${visitToUpdate}`);
    }

    // --- Step 3: Update the specific data type (answers/comments) ---
    // dataType is expected to be 'answers' or 'comments'
    sessionData[visitToUpdate][dataType] = data;
    
    console.log(
        `Successfully updated data type '${dataType}' for visit ${visitToUpdate} in storage key ${storageKey}.`
    );

    // --- Step 4: Save the modified data back to localStorage ---
    try {
        const dataToSave = JSON.stringify(sessionData);
        localStorage.setItem(storageKey, dataToSave);
        console.log("Updated session data saved back to localStorage.");
    } catch (error) {
        // This catch handles errors like localStorage full
        console.error("Failed to save modified session data to localStorage.", error);
    }
}
