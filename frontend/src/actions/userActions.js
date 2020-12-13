import axios from 'axios'
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
} from '../constants/userConstants'

//user will login using email and password(parameter)
export const login = (email, password) => async (dispatch) => {
  try {
    //at first dispatch user login request
    dispatch({
      type: USER_LOGIN_REQUEST,
    })

    //to send data in header of content type
    const config = {
      headers: {
        'Content-Type': 'application/json',
        //for protected route send authorization
      },
    }
    //make request for user login
    const { data } = await axios.post(
      '/api/users/login',
      { email, password },
      config
    )
    //after login request dispatch login success action
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    })
    //save the userInfo to local storage
    //since we are saving on localstorage we need to convert to string
    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.response,
    })
  }
}

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo')
  dispatch({ type: USER_LOGOUT })
}
