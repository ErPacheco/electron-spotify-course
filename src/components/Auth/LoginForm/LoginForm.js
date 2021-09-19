import React, { useState } from "react";
import { Button, Icon, Form, Input } from "semantic-ui-react";
import { toast } from "react-toastify";
import { validateEmail } from "../../../utils/Validation";
import firebase from "../../../utils/Firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";

import "./LoginForm.scss";

const auth = getAuth(firebase);

export default function LoginForm(props) {
  const { setSelectedForm } = props;
  const [formData, setFormData] = useState(defaultValueForm());
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userActive, setUserActive] = useState(true);
  const [user, setUser] = useState(null);

  const handlerShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = () => {
    setFormError({});
    let errors = {};
    let formOk = true;

    if (!validateEmail(formData.email)) {
      errors.email = true;
      formOk = false;
    }
    if (formData.password.length < 6) {
      errors.password = true;
      formOk = false;
    }
    setFormError(errors);

    if (formOk) {
      setIsLoading(true);
      signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then((response) => {
          setUser(response.user);
          setUserActive(response.user.emailVerified);
          if (!response.user.emailVerified) {
            toast.warning(
              "Para poder hacer login antes tienes que verificar la cuenta."
            );
          }
        })
        .catch((error) => {
          handlerErrors(error.code);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="login-form">
      <h1>Música para todos.</h1>

      <Form onSubmit={onSubmit} onChange={onChange}>
        <Form.Field>
          <Input
            type="text"
            name="email"
            placeholder="Correo electrónico"
            icon="mail outline"
            error={formError.email}
          />
          {formError.email && (
            <span className="error-text">
              Por favor, introduce un correo electrónico válido
            </span>
          )}
        </Form.Field>
        <Form.Field>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
            icon={
              showPassword ? (
                <Icon
                  name="eye slash outline"
                  link
                  onClick={handlerShowPassword}
                />
              ) : (
                <Icon name="eye" link onClick={handlerShowPassword} />
              )
            }
            error={formError.password}
          />
          {formError.password && (
            <span className="error-text">
              Por favor, elige una contraseña superior a 5 caracteres.
            </span>
          )}
        </Form.Field>
        <Button type="submit" loading={isLoading}>
          Iniciar sesión
        </Button>
      </Form>

      {!userActive && (
        <ButtonResetSendEmailVerification
          user={auth.currentUser}
          setIsLoading={setIsLoading}
          setUserActive={setUserActive}
        />
      )}

      <div className="login-form__options">
        <p onClick={() => setSelectedForm(null)}>Volver</p>
        <p>
          ¿No tienes cuenta?{" "}
          <span onClick={() => setSelectedForm("register")}>
            Regístrate ya!
          </span>
        </p>
      </div>
    </div>
  );
}

function ButtonResetSendEmailVerification(props) {
  const { user, setIsLoading, setUserActive } = props;
  const resendVerificationEmail = () => {
    sendEmailVerification(user)
      .then(() => {
        toast.success("Se ha enviado el email de verificacion");
      })
      .catch((error) => {
        console.log(error);
        handlerErrors(error.code);
      })
      .finally(() => {
        setIsLoading(false);
        setUserActive(true);
      });
  };

  return (
    <div className="resend-verification-email">
      <p>
        Si no has recibido el email de verificación puedes volver a enviarlo
        haciendo click{" "}
        <span onClick={() => resendVerificationEmail()}>aquí.</span>
      </p>
    </div>
  );
}

function handlerErrors(code) {
  switch (code) {
    case "auth/wrong-password":
      toast.warning("El usuario o la contraseña son incorrecto.");
      break;
    case "auth/too-many-requests":
      toast.warning(
        "Has enviado demasiadas solicitudes de reenvio de email de confirmación en muy poco tiempo."
      );
      break;
    case "auth/usser-not-found":
      toast.warning("El usuario o contraseña son incorrecto.");
      break;
    default:
      break;
  }
}

function defaultValueForm() {
  return {
    email: "",
    password: "",
  };
}
