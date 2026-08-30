// ============================================================
// AUTHENTICATION STORAGE
// ============================================================

export function saveAuth(data) {

  localStorage.setItem(
    "accessToken",
    data.access_token
  );

  localStorage.setItem(
    "currentUser",
    JSON.stringify(data.user)
  );
}


// ============================================================
// GET TOKEN
// ============================================================

export function getAccessToken() {

  return localStorage.getItem(
    "accessToken"
  );
}


// ============================================================
// GET CURRENT USER
// ============================================================

export function getCurrentUser() {

  const user =
    localStorage.getItem(
      "currentUser"
    );

  if (!user) {
    return null;
  }

  try {

    return JSON.parse(user);

  } catch {

    return null;
  }
}


// ============================================================
// LOGOUT
// ============================================================

export function logout() {

  localStorage.removeItem(
    "accessToken"
  );

  localStorage.removeItem(
    "currentUser"
  );
}


// ============================================================
// CHECK LOGIN
// ============================================================

export function isAuthenticated() {

  return Boolean(
    localStorage.getItem(
      "accessToken"
    )
  );
}