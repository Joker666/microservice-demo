import appConfig from '../config';
import axios from "axios";
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';
//const app=express().use('*', cors());
//const { PROXY_ADDRESS } = process.env;
const PROXY_ADDRESS  = 'localhost:9090';
function requestRegister(creds) {
  return {
    type: REGISTER_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds,
  };
}


function requestLogin(creds) {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds,
  };
}

export function receiveLogin(user) {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    //id_token: user.id_token,
    id_token: user.token,
  };
}

function loginError(message) {
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message,
  };
}

function registerError(message) {
  return {
    type: REGISTER_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message,
  };
}

function requestLogout() {
  return {
    type: LOGOUT_REQUEST,
    isFetching: true,
    isAuthenticated: true,
  };
}

export function receiveLogout() {
  return {
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false,
  };
}

// Logs the user out
export function logoutUser() {
  return dispatch => {
    dispatch(requestLogout());
    localStorage.removeItem('id_token');
    document.cookie = 'id_token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    dispatch(receiveLogout());
  };
}


export function loginUser(creds) {
 const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  const loginRequest = {
    email: creds.login,
    password: creds.password
  };
  return async dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds));
    if (process.env.NODE_ENV === "development") {
    let response = axios.post('http://' + PROXY_ADDRESS + '/v1/user/login',  loginRequest, {
        headers: headers
      })
        .then((response) => {
          localStorage.setItem('id_token', response.data.token);
          localStorage.setItem('id', response.data.id);
          localStorage.setItem('userName', response.data.email);
          /*console.log("RESPONSE RECEIVED: >>> ", response);*/
          dispatch(receiveLogin({id_token: response.data}))
        }).catch((error) => {
          console.log("AXIOS ERROR: ", response.statusText);
        })
    } else {
      localStorage.setItem('id_token', appConfig.id_token);
      dispatch(receiveLogin({id_token: appConfig.id_token}))
    }
  };
}

export function registerUser(creds) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  const registerRequest = {
    email: creds.login,
    password: creds.password
  };
  return async dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestRegister(creds));
    console.log(">>>>>>>>>>>>>>we are in service API for register");

    if (process.env.NODE_ENV === "development") {
      let response = axios.post('http://' + PROXY_ADDRESS + '/v1/user/register',  registerRequest, {
        headers: headers
      })
          .then((response) => {
            localStorage.setItem('id_token', response.data.token);
            localStorage.setItem('id', response.data.id);
            localStorage.setItem('userName', response.data.email);
            /*console.log("RESPONSE RECEIVED: >>> ", response);*/
            dispatch(receiveLogin({id_token: response.data.token}))
          }).catch((error) => {
            console.log("AXIOS ERROR: ", response.statusText);
          })
    } else {
      localStorage.setItem('id_token', appConfig.id_token);
      dispatch(receiveLogin({id_token: appConfig.id_token}))
    }
  };
}
