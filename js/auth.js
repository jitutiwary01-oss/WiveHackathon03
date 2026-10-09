/**
 * IIT (ISM) DHANBAD — STRAW HAT CREW AUTHENTICATION CONTROLLER
 * Supports both Firebase Live Cloud Authentication and Local/Demo Sessions.
 */

const CREW_STORAGE_KEY = 'straw_hat_crew_member';

// Exported helpers for all pages
window.CrewAuth = {
  getCurrentUser() {
    try {
      const data = localStorage.getItem(CREW_STORAGE_KEY) || sessionStorage.getItem(CREW_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  signIn(user, persist = true) {
    const payload = JSON.stringify(user);
    if (persist) {
      localStorage.setItem(CREW_STORAGE_KEY, payload);
    }
    sessionStorage.setItem(CREW_STORAGE_KEY, payload);
    window.dispatchEvent(new CustomEvent('crewAuthChanged', { detail: user }));
    this.syncHeader();
  },

  async signOut() {
    localStorage.removeItem(CREW_STORAGE_KEY);
    sessionStorage.removeItem(CREW_STORAGE_KEY);
    if (window.fbAuth) {
      try {
        await window.fbAuth.signOut();
      } catch (e) {}
    }
    window.dispatchEvent(new CustomEvent('crewAuthChanged', { detail: null }));
    this.syncHeader();
  },

  syncHeader() {
    const authSlots = document.querySelectorAll('.header-auth-slot');
    const user = this.getCurrentUser();

    authSlots.forEach(slot => {
      if (user) {
        slot.innerHTML = `
          <div class="header-user-badge" title="Active Straw Hat Crewmate">
            <span class="header-user-avatar">${user.avatar || '👒'}</span>
            <span style="font-size: 0.82rem; font-weight: 700; color: var(--pirate-gold-bright);">${user.name}</span>
            <button type="button" class="header-signout-btn" onclick="CrewAuth.signOut(); location.reload();" title="Sign out of Straw Hat Fleet">Sign Out</button>
          </div>
        `;
      } else {
        slot.innerHTML = `
          <a href="login.html" class="btn btn-gold btn-sm header-auth-btn">
            <span style="font-size: 1rem;">&#9760;</span> Sign In
          </a>
        `;
      }
    });

    // Also update any top bar auth link if present
    const topBarAuthLink = document.getElementById('topBarAuthLink');
    if (topBarAuthLink) {
      if (user) {
        topBarAuthLink.innerHTML = `&#9760; Crew: ${user.name} (Sign Out)`;
        topBarAuthLink.href = 'login.html';
      } else {
        topBarAuthLink.innerHTML = `&#9760; Crew Sign In`;
        topBarAuthLink.href = 'login.html';
      }
    }
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  CrewAuth.syncHeader();

  // Listen to Firebase auth state if available
  if (typeof firebase !== 'undefined' && window.fbAuth) {
    window.fbAuth.onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        let profile = {
          uid: fbUser.uid,
          name: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Straw Hat Voyager'),
          email: fbUser.email || '',
          role: 'Straw Hat Fleet Voyager',
          division: 'Computer Science & Engineering',
          bounty: '฿ 45,000,000',
          crewId: 'ISM-FB-' + fbUser.uid.substring(0, 5).toUpperCase(),
          avatar: '<img src="assets/images/luffy-portrait.svg" alt="Avatar" style="width: 32px; height: 32px; border-radius: 50%; vertical-align: middle;">'
        };

        if (window.fbDb) {
          try {
            const doc = await window.fbDb.collection('crew_members').doc(fbUser.uid).get();
            if (doc.exists) {
              profile = { ...profile, ...doc.data() };
            }
          } catch (e) {
            console.warn('Firestore fetch notice:', e.message);
          }
        }

        CrewAuth.signIn(profile, true);
        if (typeof renderView === 'function') {
          renderView();
        }
      }
    });
  }

  // If on login.html, initialize the portal UI
  if (document.getElementById('crewAuthPageWrapper')) {
    initLoginPage();
  }
});

function initLoginPage() {
  const container = document.getElementById('crewAuthPageWrapper');
  const loggedInView = document.getElementById('crewLoggedInView');
  const loggedOutView = document.getElementById('crewLoggedOutView');
  const tabSignIn = document.getElementById('tabBtnSignIn');
  const tabSignUp = document.getElementById('tabBtnSignUp');
  const formSignIn = document.getElementById('formCrewSignIn');
  const formSignUp = document.getElementById('formCrewSignUp');
  const btnSignOut = document.getElementById('btnPageSignOut');
  const statusEl = document.getElementById('firebaseStatusIndicator');

  // Update Firebase status indicator on page
  if (statusEl) {
    if (window.isFirebaseConfigured) {
      statusEl.innerHTML = `<span style="color: #2ED573;">🟢 Firebase Live Connected</span>`;
    } else {
      statusEl.innerHTML = `<span style="color: #FFA502;">🟡 Demo / Local Mode (Firebase Pending)</span>`;
    }
  }

  window.renderView = function() {
    const user = CrewAuth.getCurrentUser();
    if (user) {
      if (loggedInView) loggedInView.style.display = 'block';
      if (loggedOutView) loggedOutView.style.display = 'none';

      const nameEl = document.getElementById('cardCrewName');
      const roleEl = document.getElementById('cardCrewRole');
      const divEl = document.getElementById('cardCrewDivision');
      const bountyEl = document.getElementById('cardCrewBounty');
      const idEl = document.getElementById('cardCrewId');
      const avatarEl = document.getElementById('cardCrewAvatar');

      if (nameEl) nameEl.textContent = user.name;
      if (roleEl) roleEl.textContent = user.role || 'Straw Hat Crewmate';
      if (divEl) divEl.textContent = user.division || 'Computer Science & Engineering';
      if (bountyEl) bountyEl.textContent = user.bounty || '฿ 30,000,000';
      if (idEl) idEl.textContent = user.crewId || 'ISM-2026-SHP';
      if (avatarEl) avatarEl.innerHTML = user.avatar || '👒';
    } else {
      if (loggedInView) loggedInView.style.display = 'none';
      if (loggedOutView) loggedOutView.style.display = 'block';
    }
  };

  // Tabs switching
  if (tabSignIn && tabSignUp) {
    tabSignIn.addEventListener('click', () => {
      tabSignIn.classList.add('active');
      tabSignUp.classList.remove('active');
      if (formSignIn) formSignIn.style.display = 'block';
      if (formSignUp) formSignUp.style.display = 'none';
    });

    tabSignUp.addEventListener('click', () => {
      tabSignUp.classList.add('active');
      tabSignIn.classList.remove('active');
      if (formSignIn) formSignIn.style.display = 'none';
      if (formSignUp) formSignUp.style.display = 'block';
    });
  }

  // Handle Sign In submit
  if (formSignIn) {
    formSignIn.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('inputSignInName');
      const passInput = document.getElementById('inputSignInPass');
      const nameVal = nameInput ? nameInput.value.trim() : 'Monkey D. Luffy';
      const passVal = passInput ? passInput.value : 'onepiece2026';
      const divInput = document.getElementById('selectSignInDept');
      const division = divInput ? divInput.value : 'Computer Science & Engineering';

      // 1. If Firebase is live, try Firebase Auth
      if (window.isFirebaseConfigured && window.fbAuth) {
        try {
          const email = nameVal.includes('@') ? nameVal : `${nameVal.toLowerCase().replace(/\s+/g, '')}@iitism.fleet`;
          await window.fbAuth.signInWithEmailAndPassword(email, passVal);
          return;
        } catch (err) {
          console.warn('Firebase signIn error:', err.message);
          // If user not found, try to auto-create recruit
          if (err.code === 'auth/user-not-found') {
            try {
              const email = nameVal.includes('@') ? nameVal : `${nameVal.toLowerCase().replace(/\s+/g, '')}@iitism.fleet`;
              const cred = await window.fbAuth.createUserWithEmailAndPassword(email, passVal);
              await cred.user.updateProfile({ displayName: nameVal });
              return;
            } catch (createErr) {
              alert("Firebase Auth: " + createErr.message);
            }
          } else {
            alert("Firebase Auth: " + err.message);
            return;
          }
        }
      }

      // 2. Local Fallback Sign In
      CrewAuth.signIn({
        name: nameVal,
        role: 'Fleet Navigator',
        division: division,
        bounty: '฿ 3,000,000,000',
        crewId: 'ISM-1926-' + Math.floor(1000 + Math.random() * 9000),
        avatar: '<img src="assets/images/luffy-portrait.svg" alt="Luffy" style="width: 32px; height: 32px; border-radius: 50%; vertical-align: middle;">'
      });
      window.renderView();
    });
  }

  // Handle Enlist (Sign Up) submit
  if (formSignUp) {
    formSignUp.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('inputSignUpName');
      const rollInput = document.getElementById('inputSignUpRoll');
      const passInput = document.getElementById('inputSignUpPass');
      const divInput = document.getElementById('selectSignUpDept');

      const nameVal = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'New Voyager';
      const rollVal = rollInput && rollInput.value.trim() ? rollInput.value.trim() : '26JE' + Math.floor(100000 + Math.random() * 900000);
      const passVal = passInput && passInput.value ? passInput.value : 'onepiece2026';
      const division = divInput ? divInput.value : 'Mining Engineering';

      // 1. If Firebase is live, register recruit to Firebase Auth + Firestore
      if (window.isFirebaseConfigured && window.fbAuth) {
        try {
          const email = `${rollVal.toLowerCase()}@iitism.ac.in`;
          const cred = await window.fbAuth.createUserWithEmailAndPassword(email, passVal);
          await cred.user.updateProfile({ displayName: nameVal });

          if (window.fbDb) {
            await window.fbDb.collection('crew_members').doc(cred.user.uid).set({
              name: nameVal,
              role: 'Recruit Scholar (Class of 2026)',
              rollNo: rollVal,
              division: division,
              bounty: '฿ 35,000,000',
              crewId: rollVal,
              enlistedAt: new Date().toISOString()
            });
          }
          return;
        } catch (err) {
          alert("Firebase Enlistment: " + err.message);
          return;
        }
      }

      // 2. Local Fallback Sign Up
      CrewAuth.signIn({
        name: nameVal,
        role: 'Recruit Scholar (Class of 2026)',
        division: division,
        bounty: '฿ 35,000,000',
        crewId: rollVal,
        avatar: '<img src="assets/images/zoro-portrait.svg" alt="Zoro" style="width: 32px; height: 32px; border-radius: 50%; vertical-align: middle;">'
      });
      window.renderView();
    });
  }

  // Handle Page Sign Out button
  if (btnSignOut) {
    btnSignOut.addEventListener('click', () => {
      CrewAuth.signOut();
      window.renderView();
    });
  }

  // Quick Demo Logins
  window.demoSignIn = function(type) {
    if (type === 'luffy') {
      CrewAuth.signIn({
        name: 'Monkey D. Luffy',
        role: 'Captain of the Straw Hat Fleet',
        division: 'Institute Grand Admiral • All 17 Fleets',
        bounty: '฿ 3,000,000,000',
        crewId: 'ISM-SHP-001',
        avatar: '<img src="assets/images/luffy-portrait.svg" alt="Luffy" style="width: 32px; height: 32px; border-radius: 50%; vertical-align: middle;">'
      });
    } else if (type === 'zoro') {
      CrewAuth.signIn({
        name: 'Roronoa Zoro',
        role: 'First Mate & Chief Swordsman',
        division: 'Mechanical & Metallurgy Divisions',
        bounty: '฿ 1,111,000,000',
        crewId: 'ISM-SHP-002',
        avatar: '<img src="assets/images/zoro-portrait.svg" alt="Zoro" style="width: 32px; height: 32px; border-radius: 50%; vertical-align: middle;">'
      });
    } else if (type === 'scholar') {
      CrewAuth.signIn({
        name: 'Pioneer Scholar',
        role: 'Research Navigator',
        division: 'Computer Science & Engineering',
        bounty: '฿ 50,000,000',
        crewId: 'ISM-2026-BTECH',
        avatar: '📜'
      });
    }
    window.renderView();
  };

  // Google Sign-In with Firebase
  window.signInWithGoogle = async function() {
    if (!window.isFirebaseConfigured || !window.fbAuth) {
      alert("⚠️ Firebase keys are not connected yet!\n\nPlease paste your Firebase Config credentials in the Firebase Configuration Assistant below, or provide them in chat.");
      return;
    }
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await window.fbAuth.signInWithPopup(provider);
    } catch (err) {
      alert("Google Sign-In: " + err.message);
    }
  };

  // Save custom firebase config from UI
  window.saveCustomFirebaseConfig = function() {
    const textarea = document.getElementById('customFirebaseConfigTextarea');
    if (!textarea) return;
    try {
      const text = textarea.value.trim();
      let parsed;
      // Handle either direct JSON or JS object snippet
      if (text.includes('{')) {
        const jsonLike = text
          .replace(/const\s+firebaseConfig\s*=\s*/, '')
          .replace(/;/g, '')
          .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
          .replace(/'/g, '"');
        parsed = JSON.parse(jsonLike);
      } else {
        throw new Error("Please paste a valid JSON or config object");
      }
      localStorage.setItem('iitism_custom_firebase_config', JSON.stringify(parsed));
      alert("✅ Firebase credentials saved! Reloading page to connect...");
      location.reload();
    } catch (err) {
      alert("⚠️ Error parsing config: " + err.message + "\n\nMake sure to paste the firebaseConfig object from Firebase Console.");
    }
  };

  window.renderView();
}
