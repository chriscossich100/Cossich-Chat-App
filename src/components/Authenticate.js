import React, { useState, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import classes from "./Authenticate.module.css";
import {useTranslation} from 'react-i18next'

//this is the component that will handle both the signup and login components:
function Authenticate() {

  const { t, i18n } = useTranslation();

  const [authDetails, setAuthDetails] = useState({
    isLogin: true,
    validated: true,
    username: "",
    email: "",
    password: "",
    errorMessage: "",
  });

  let navigate = useNavigate();

  let usernameReset = useRef(null);
  let emailReset = useRef(null);
  let passwordReset = useRef(null);

  function handleAuthMethod() {
    //reset the input values

    //redundant since we're using state values but will keep anyway :p
    usernameReset.current != null
      ? (usernameReset.current.value = "")
      : (usernameReset.current = null);
    emailReset.current != null
      ? (emailReset.current.value = "")
      : (emailReset.current = null);
    passwordReset.current != null
      ? (passwordReset.current.value = "")
      : (passwordReset.current = null);

    setAuthDetails({
      isLogin: authDetails.isLogin ? false : true,
      errorMessage: "",
      validated: true,
      username: "",
      email: "",
      password: "",
    });
  }

  

  //function to handle login:
  async function handleLogin(e) {
    e.preventDefault();

    if (
      usernameReset.current.value == "" ||
      passwordReset.current.value == ""
    ) {
      setAuthDetails({
        errorMessage: t('authentication.errorMessage1'),
        validated: false,
        isLogin: true,
        username: usernameReset.current.value,
        email: "",
        password: passwordReset.current.value,
      });
    }

    //user has provided credentials:
    else {
      let formdata = e.target;
      let loginInfo = new FormData();
      loginInfo.append("username", formdata["username"].value);
      loginInfo.append("password", formdata["password"].value);
      try {
        let tryLogin = {
          method: "POST",
          body: loginInfo,
        };

        const response = await fetch(`${process.env.REACT_APP_DB}/login/`, tryLogin);
        const details = await response.json();

        //if no user was found with provided credentials, provide error message
        if (!details.userFound) {
          setAuthDetails({
            validated: false,
            errorMessage:
              t('authentication.errorMessage2'),
            isLogin: true,
            username: usernameReset.current.value,
            email: "",
            password: passwordReset.current.value,
          });
        } else {
          //this is in case, a token is not retrieved when loggin in the user:
          if (details.token != null) {
            localStorage.setItem("auth-token", details.token);
          }
          navigate("/home/");
        }
      } catch (err) {
        //remember that this catch block is for when the fetch request itself had an issue.
        console.error(err);
      }
    }
  }

  let loginJSX = (
    <main className={classes.mainWrapper}>
      <div className={classes.authenticateDiv}>
        <div className={classes.authenticateDivForm}>
          <h2>{t('authentication.welcome')}</h2>
          <div className={[classes.formBlock, classes.wForm].join(" ")}>
            <form id="loginForm" onSubmit={handleLogin}>
              {authDetails.validated == false ? (
                <p className={classes.pErrors}>{authDetails.errorMessage}</p>
              ) : null}
              <div>
                <div>
                  <label
                    htmlFor="username"
                    id="username"
                    className={classes.loginFormLabel}
                  >
                    {t('authentication.username')}
                  </label>
                  <input
                    className={[
                      classes.textAreaContentFormLabel,
                      classes.textAreaContentFormLabelWInput,
                      !authDetails.validated && authDetails.username == ""
                        ? classes.formInputErrors
                        : null,
                    ].join(" ")}
                    name="username"
                    ref={usernameReset}
                  ></input>
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  id="password"
                  className={classes.loginFormLabel}
                >
                  {t('authentication.password')}
                </label>
                <input
                  className={[
                    classes.textAreaContentFormLabel,
                    classes.textAreaContentFormLabelWInput,
                    !authDetails.validated && authDetails.password == ""
                      ? classes.formInputErrors
                      : null,
                  ].join(" ")}
                  name="password"
                  type="password"
                  ref={passwordReset}
                ></input>
              </div>
              <button
                type="submit"
                className={[classes.button, classes.wButton].join(" ")}
              >
                {t('authentication.login')}
              </button>
            </form>
            <span onClick={handleAuthMethod}> {t('authentication.authMethodSignup')}</span>
          </div>
        </div>
      </div>
    </main>
  );

  //function to handle signup:
  async function handleSignup(e) {
    e.preventDefault();

    if (
      usernameReset.current.value == "" ||
      passwordReset.current.value == "" ||
      emailReset.current.value == ""
    ) {
      setAuthDetails({
        errorMessage: t('authentication.errorMessage1'),
        validated: false,
        isLogin: false,
        username: usernameReset.current.value,
        email: emailReset.current.value,
        password: passwordReset.current.value,
      });
    } else {
      let form = e.target;
      let formData = new FormData(form);

      formData.append("username", form["username"].value);
      formData.append("email", form["email"].value);
      formData.append("password", form["password"].value);

      //there could be some issues in getting submitting the http request. Use try catch block to handle this accordingly:
      try {
        let data = {
          method: "POST",
          body: formData,
        };

        let response = await fetch(`${process.env.REACT_APP_DB}/signup/`, data);
        let result = await response.json();

        if (!result.userFound) {
          handleAuthMethod();
        } else {
          //set state for credentials that are already in use:
          setAuthDetails({
            errorMessage:
              t('authentication.errorMessage2'),
            validated: false,
            isLogin: false,
            username: usernameReset.current.value,
            email: emailReset.current.value,
            password: passwordReset.current.value,
          });
        }
      } catch (error) {
        console.error("there has been an error: ", error);
      }
      //end of try catch block
    }
  }

  let signupJSX = (
    <main className={classes.mainWrapper}>
      <div className={classes.authenticateDiv}>
        <div className={classes.authenticateDivForm}>
          <h2>{t('authentication.register')}</h2>
          <div className={[classes.formBlock, classes.wForm].join(" ")}>
            <form id="signupForm" onSubmit={handleSignup}>
              {authDetails.validated == false ? (
                <p className={classes.pErrors}>{authDetails.errorMessage}</p>
              ) : null}
              <div>
                <div>
                  <label
                    htmlFor="username"
                    id="username"
                    className={classes.loginFormLabel}
                  >
                    {t('authentication.username')}
                  </label>
                  <input
                    className={[
                      classes.textAreaContentFormLabel,
                      classes.textAreaContentFormLabelWInput,
                      !authDetails.validated && authDetails.username == ""
                        ? classes.formInputErrors
                        : null,
                    ].join(" ")}
                    name="username"
                    ref={usernameReset}
                  ></input>
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  id="email"
                  className={classes.loginFormLabel}
                >
                  {t('authentication.email')}
                </label>
                <input
                  className={[
                    classes.textAreaContentFormLabel,
                    classes.textAreaContentFormLabelWInput,
                    !authDetails.validated && authDetails.email == ""
                      ? classes.formInputErrors
                      : null,
                  ].join(" ")}
                  name="email"
                  type="email"
                  ref={emailReset}
                ></input>
              </div>
              <div>
                <label
                  htmlFor="password"
                  id="password"
                  className={classes.loginFormLabel}
                >
                  {t('authentication.password')}
                </label>
                <input
                  className={[
                    classes.textAreaContentFormLabel,
                    classes.textAreaContentFormLabelWInput,
                    !authDetails.validated && authDetails.password == ""
                      ? classes.formInputErrors
                      : null,
                  ].join(" ")}
                  name="password"
                  type="password"
                  ref={passwordReset}
                ></input>
              </div>
              <button
                type="submit"
                className={[classes.button, classes.wButton].join(" ")}
              >
                {t('authentication.signup')}
              </button>
            </form>
            <span onClick={handleAuthMethod}> {t('authentication.authMethodLogin')}</span>
          </div>
        </div>
      </div>
    </main>
  );

  let result = authDetails.isLogin ? loginJSX : signupJSX;

  return result;
}

export default Authenticate;
