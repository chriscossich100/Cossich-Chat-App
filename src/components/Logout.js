import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

//simple component that takes away the local storage and redirects to the home page:
function Logout() {

  //remember that a use effect runs after every render. This will be needed for navigating.
  //essentially, every time the component renders, React will update the screen and then run the code inside this useEffect.
  useEffect(function () {
    return navigate("/");
  });

  const navigate = useNavigate();

  if (localStorage.getItem("auth-token")) {
    localStorage.removeItem("auth-token");
  }
}

export default Logout;
