import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDNvq8YLIWepuxwUtm7b9UghzbX9mJK6J4",
    authDomain: "invik-sa.firebaseapp.com",
    projectId: "invik-sa",
    storageBucket: "invik-sa.firebasestorage.app",
    messagingSenderId: "451186720468",
    appId: "1:451186720468:web:0d21651718d6d7e7d08541"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
    const adminEmail = "admin-inviksa@monsupport-app.com";
    const adminPassword = "Admin123!"; // Change this to a secure password

    try {
        console.log("Creating admin user...");

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
        const user = userCredential.user;

        console.log("User created in Auth:", user.uid);

        // Create user document in Firestore with admin role
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: adminEmail,
            firstName: "Admin",
            lastName: "System",
            role: "admin", // IMPORTANT: This makes the user an admin
            accountType: "admin",
            accountStatus: "active",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        console.log("✅ Admin user created successfully!");
        console.log("Email:", adminEmail);
        console.log("Password:", adminPassword);
        console.log("User ID:", user.uid);
        console.log("\nYou can now login to the admin portal with these credentials.");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating admin user:", error.message);

        if (error.code === 'auth/email-already-in-use') {
            console.log("\n⚠️  This email is already registered.");
            console.log("If you need to make this user an admin, update the Firestore document manually:");
            console.log("1. Go to Firebase Console > Firestore");
            console.log("2. Find the user document in the 'users' collection");
            console.log("3. Add/update the field: role = 'admin'");
        }

        process.exit(1);
    }
}

createAdminUser();
