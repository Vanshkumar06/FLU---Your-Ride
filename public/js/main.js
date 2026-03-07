// FLU - Main JavaScript File

// ================================
// Mobile Menu Toggle
// ================================
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) mobileMenu.classList.toggle('hidden');
}

// ================================
// Token Management
// ================================
function saveToken(token, user) {
  localStorage.setItem('flu_token', token);
  localStorage.setItem('flu_user', JSON.stringify(user));
  updateNavbar(user);
}

function saveSession(token, user) {
  localStorage.setItem('flu_token', token);
  localStorage.setItem('flu_user', JSON.stringify(user));
  updateNavbar(user);
}

function getToken() { return localStorage.getItem('flu_token'); }

function getUser() {
  const u = localStorage.getItem('flu_user');
  return u ? JSON.parse(u) : null;
}

function logout() {
  localStorage.removeItem('flu_token');
  localStorage.removeItem('flu_user');
  window.location.href = '/';
}

// ================================
// Navbar Update — FLU pill navbar
// ================================
function updateNavbar(user) {
  if (!user) return;

  // Purana navbar (agar kisi page pe ho)
  const authButtons = document.getElementById('auth-buttons');
  const userProfile = document.getElementById('user-profile');
  const userName    = document.getElementById('user-name');
  if (authButtons) authButtons.classList.add('hidden');
  if (userProfile) { userProfile.classList.remove('hidden'); userProfile.classList.add('flex'); }
  if (userName)    userName.textContent = user.name;

  // FLU pill navbar (index.ejs wala)
  const authSection = document.getElementById('nav-auth-section');
  const userChip    = document.getElementById('nav-user-chip');
  const avatarEl    = document.getElementById('nav-avatar-letter');
  const nameEl      = document.getElementById('nav-user-name-text');
  if (authSection) authSection.style.display = 'none';
  if (userChip)    userChip.style.display = 'flex';
  if (avatarEl)    avatarEl.textContent = user.name.charAt(0).toUpperCase();
  if (nameEl)      nameEl.textContent   = user.name.split(' ')[0];
}

// Also expose as updateNavAuth (index.ejs use karta hai)
function updateNavAuth(user) { updateNavbar(user); }

// ================================
// Page Load
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const user = getUser();
  if (user) updateNavbar(user);
});