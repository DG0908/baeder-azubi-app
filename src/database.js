const legacyDatabaseError = () => {
  throw new Error(
    'src/database.js is a retired prototype adapter. Use the secured backend API instead of direct client-side database writes.'
  );
};

export async function createUser() {
  legacyDatabaseError();
}

export async function getUserByEmail() {
  legacyDatabaseError();
}

export async function updateUser() {
  legacyDatabaseError();
}

export async function getAllUsers() {
  legacyDatabaseError();
}

export async function getPendingUsers() {
  legacyDatabaseError();
}

export async function approveUser() {
  legacyDatabaseError();
}

export async function deleteUser() {
  legacyDatabaseError();
}

export async function getUserStats() {
  legacyDatabaseError();
}

export async function createUserStats() {
  legacyDatabaseError();
}

export async function updateUserStats() {
  legacyDatabaseError();
}

export async function getOrCreateUserStats() {
  legacyDatabaseError();
}

export async function getFlashcards() {
  legacyDatabaseError();
}

export async function createFlashcard() {
  legacyDatabaseError();
}

export async function approveFlashcard() {
  legacyDatabaseError();
}

export async function deleteFlashcard() {
  legacyDatabaseError();
}

export async function getMessages() {
  legacyDatabaseError();
}

export async function createMessage() {
  legacyDatabaseError();
}

export async function getNews() {
  legacyDatabaseError();
}

export async function createNews() {
  legacyDatabaseError();
}

export async function deleteNews() {
  legacyDatabaseError();
}

export function createStorageAdapter() {
  legacyDatabaseError();
}
