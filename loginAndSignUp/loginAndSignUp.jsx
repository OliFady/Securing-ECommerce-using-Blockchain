import React, { useState } from "react";
import Image from "next/image";
import PropTypes from "prop-types"
import { useRouter } from "next/router";

import Style from "./loginAndSignUp.module.css";
import images from "../img";
import { Button } from "../components/componentsindex.js";
import login from "../pages/login"

export default function loginAndSignUp ({setToken}) {	
  const router = useRouter()
  const [email,setEmail]=useState(); 
	const [passw,setPassw]=useState(); 

  async function loginUser(credentials) {

 return fetch('http://127.0.0.1:3000/api/v1/users/login', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(credentials)
 })
   .then(data =>data.json())
}

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

const handleSubmit = async(event)=> {
  if (!email || !passw){
    event.preventDefault()
      alert("please enter your email and password")
    return
    }
  event.preventDefault();
  console.log(email,passw)

  const loginInfo = await loginUser({email,passw})
  console.log(loginInfo.token)
  setToken(loginInfo.token);
  router.push("/")

}
  return (

<form onSubmit={handleSubmit}>
    <div className={Style.user}>
      <div className={Style.user_box}>
        <div className={Style.user_box_social}>
        </div>

        <div className={Style.user_box_input}>
          <div className={Style.user_box_input_box}>
            <label htmlFor="email">Email address</label>
            <input type="email" placeholder="example@emample.com" onChange={e=>setEmail(e.target.value)}  />
          </div>

          <div className={Style.user_box_input_box}>
            <label
              htmlFor="password"
              className={Style.user_box_input_box_label}
            >
              <p>Password</p>
              <p>
                <a href="#">Forget password</a>
              </p>
            </label>
            <input type="password"  onChange={e=>setPassw(e.target.value)}  />
          </div>
        </div>

        <button type="submit"> Login</button>
      </div>
    </div>
    </form>
  );
};

loginAndSignUp.propTypes = {
  setToken: PropTypes.func.isRequired
}
