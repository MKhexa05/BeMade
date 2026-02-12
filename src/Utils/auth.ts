export const AUTH_STORAGE_KEY = "bemade:is_authenticated";

export const isUserAuthenticated = (): boolean => {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

export const setUserAuthenticated = (isAuthenticated: boolean) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, isAuthenticated ? "1" : "0");
  } catch {
    // no-op for unavailable storage
  }
};
