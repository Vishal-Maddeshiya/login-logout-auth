import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import styles from "../styles/Username.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import converToBase from "../helper/convert";
import { registerValidate } from "../helper/validate";
import { regiterUser } from "../helper/helper";

const Register = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      username: "example123",
      email: "doyo562349@cnogs.com",
      password: "admin@123",
    },
    validate: registerValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || "" });
      let registerPromise = regiterUser(values);
      toast.promise(registerPromise, {
        loading: "Creating..!",
        success: <b>Register Successfully..!</b>,
        error: <b>Could not register..!</b>,
      });
      registerPromise.then(function () {
        navigate("/");
      });
    },
  });
  /*formik doesn't support file upload to save so we need to create this handler */
  const onUpload = async (e) => {
    const base64 = await converToBase(e.target.files[0]);
    setFile(base64);
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className=" flex justify-center items-center h-screen">
        <div className={styles.glass} style={{ width: "45%" }}>
          <div className=" title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Register!</h4>
            <span className="py-5 text-xl w-2/3 text-center text-gray-500">
              Happy to join you.
            </span>
          </div>
          <form action="" className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={file || avatar}
                  className={styles.profile_img}
                  alt="avatar"
                />
              </label>
              <input
                onChange={onUpload}
                type="file"
                id="profile"
                name="profile"
              />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("username")}
                type="text"
                className={styles.textbox}
                placeholder="username"
              />
              <input
                {...formik.getFieldProps("email")}
                type="email"
                className={styles.textbox}
                placeholder="email"
              />
              <input
                {...formik.getFieldProps("password")}
                type="text"
                className={styles.textbox}
                placeholder="password"
              />
              <button type="submit" className={styles.btn}>
                Register
              </button>
            </div>
            <div className="text-center ">
              <span>
                Aleaty have a account?{" "}
                <Link className="text-red-500" to="/recovery">
                  LogIn
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
