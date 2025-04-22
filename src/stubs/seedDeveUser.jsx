import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { createUserInFirestore } from "../firebase/";

const registerAndSeedUser = async () => {
  const email = "devuser@example.com";
  const password = "devpassword123";
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  await createUserInFirestore(user.uid, {
    username: "devuser",
    name: "Dev Tester",
    location: "Localhost",
    completedHikes: [],
    profileImage: "https://via.placeholder.com/150"
  });

  console.log("Firebase user + Firestore user created!");
};
