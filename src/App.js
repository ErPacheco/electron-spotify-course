import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import firebase from "./utils/Firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Auth from "./pages/Auth";
import LoggedLayout from "./layouts/LoggedLayout";

const auth = getAuth(firebase);

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  onAuthStateChanged(auth, (currentUser) => {
    console.log(currentUser);
    if (!currentUser?.emailVerified) {
      auth.signOut();
      setUser(null);
    } else {
      setUser(currentUser);
    }
    setIsLoading(false);
  });

  if (isLoading) {
    return null;
  }

  // return !user ? <Auth /> : <UserLogged />;

  return (
    <>
      {!user ? <Auth /> : <LoggedLayout user={user} />}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover={true}
      />
    </>
  );
};

export default App;
