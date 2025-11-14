const firebaseConfig = {
    apiKey: "AIzaSyCJkNBHsYzOuymw2vP_HdvKuNdUsRIb4t4",
    authDomain: "in-space-wm.firebaseapp.com",
    projectId: "in-space-wm",
    storageBucket: "in-space-wm.firebasestorage.app",
    messagingSenderId: "38093154042",
    appId: "1:38093154042:web:44c7c33d159efd11704b43",
    measurementId: "G-WXSMK0TP1S"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const ui = new firebaseui.auth.AuthUI(auth);

// This is the observer that listens for auth state changes.
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in.
        // You can get user properties here.
        console.log("User is signed in:", user);
        var uid = user.uid;

        // --- IMPORTANT ---
        // Any logic that needs the user to be logged in should be called from here.
        // For example, you might want to hide the login UI and show the main app content.
        document.getElementById('firebaseui-auth-container').style.display = 'none';
        document.getElementById('app-content').style.display = 'block'; // Assuming you have a div with id 'app-content'

    } else {
        // User is signed out.
        console.log("User is signed out.");

        // Start the FirebaseUI authentication flow.
        ui.start('#firebaseui-auth-container', {
            signInOptions: [
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                firebase.auth.GoogleAuthProvider.PROVIDER_ID
            ],
            // This is the new part:
            callbacks: {
                signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                    // authResult contains the user information.
                    console.log("FirebaseUI sign-in success. Auth result:", authResult);

                    // IMPORTANT: Return false to prevent the default redirect.
                    // This keeps you on the same page, allowing the onAuthStateChanged
                    // listener to handle the UI update.
                    return false;
                },
                uiShown: function () {
                    // The widget is rendered.
                    // You can hide a loader here if you have one.
                }
            }
        });

        // Make sure the login UI is visible and the app content is hidden.
        document.getElementById('firebaseui-auth-container').style.display = 'block';
        if (document.getElementById('app-content')) {
            document.getElementById('app-content').style.display = 'none';
        }
    }
});