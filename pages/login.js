import React from "react";
import axios from "axios";
import Router from "next/router"
import {useDispatch} from "react-redux"

import Style from "../styles/login.module.css";
import LoginAndSignUp from "../loginAndSignUp/loginAndSignUp";


 const login = () => {


  return (
    <div className={Style.login}>
      <div className={Style.login_box}>
        <h1>Login</h1>
        <LoginAndSignUp />
        <p className={Style.login_box_para}>
          New user? <a href="#">Create an account</a>
        </p>
      </div>
    </div>
  );
};

export default login
