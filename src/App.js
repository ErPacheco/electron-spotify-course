import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import firebase from "./utils/Firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Auth from "./pages/Auth";

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
      {!user ? <Auth /> : <UserLogged />}
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

const UserLogged = () => {
  const logout = () => {
    auth.signOut();
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <h1>Usuario Logeado</h1>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};

export default App;
