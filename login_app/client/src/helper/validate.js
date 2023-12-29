import toast from "react-hot-toast";
import { authenticate } from "./helper.js";

// validate login page
export async function usernameValidate(values) {
  const errors = usernameVerify({}, values);
  if (values.username) {
    const { status } = await authenticate(values.username);
    if (status !== 200) {
      errors.exist = toast.error("User does not exist..");
    }
  }
  return errors;
}

function usernameVerify(error = {}, values) {
  if (!values.username) {
    error.username = toast.error("Username Required!");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("Invalid Username!");
  }
  return error;
}

// validate password page
export async function validatePassword(values) {
  const errors = passwordVerify({}, values);
  return errors;
}

function passwordVerify(error = {}, values) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  if (!values.password) {
    error.password = toast.error("Password is required..!");
  } else if (values.password.includes(" ")) {
    error.password = toast.error("Wrong Password..!");
  } else if (values.password.length < 4) {
    error.password = toast.error("Password must be more than 4 characters..!");
  } else if (!specialChars.test(values.password)) {
    error.password = toast.error("Password must have a special character..!");
  }
  return error;
}

// ************* validate reset pass word
export async function resetPasswordValidation(values) {
  const errors = passwordVerify({}, values);

  if (values.password !== values.confirm_pwd) {
    errors.exist = toast.error("Password not match..!");
  }
  return errors;
}

/**validate email */
function emailVerify(error = {}, values) {
  if (!values.email) {
    error.email = toast.error("Email Required..!");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Wrong Email..!");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    error.email = toast.error("Invalid Email Address..!");
  }
  return error;
}

//*******validate register form******** */
export async function registerValidate(values) {
  const errors = usernameVerify({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);
  return errors;
}

/**profile validation */

export async function profileValidation(values) {
  const errors = emailVerify({}, values);
  return errors;
}
