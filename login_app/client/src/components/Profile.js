import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import styles from "../styles/Username.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import converToBase from "../helper/convert";
import { profileValidation } from "../helper/validate";
import extend from "../styles/Profile.module.css";
import useFetch from "../hooks/fetch.hook";
import { updateUser } from "../helper/helper";

const Profile = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch();

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || "",
      lastName: apiData?.lastName || "",
      mobile: apiData?.mobile || "",
      address: apiData?.address || "",
      email: apiData?.email || "",
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, {
        profile: file || apiData?.profile || "",
      });
      let updatePromise = updateUser(values);
      toast.promise(updatePromise, {
        loading: "Update...",
        success: <b>Update Successfully..!</b>,
        error: <b>Could not update..!</b>,
      });
      console.log(values);
    },
  });
  /*formik doesn't support file upload to save so we need to create this handler */
  const onUpload = async (e) => {
    const base64 = await converToBase(e.target.files[0]);
    setFile(base64);
  };

  /**logout handler function */
  function userLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  if (isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className=" flex justify-center items-center h-screen">
        <div
          className={`${styles.glass} ${styles.glass}`}
          style={{ width: "45%" }}
        >
          <div className=" title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Profile!</h4>
            <span className="py-5 text-xl w-2/3 text-center text-gray-500">
              You can update your detail.
            </span>
          </div>
          <form action="" className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={apiData?.profile || file || avatar}
                  className={`${styles.profile_img} ${extend.profile_img}`}
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
              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("firstName")}
                  type="text"
                  className={`${styles.textbox} ${extend.textbox}`}
                  placeholder="first name"
                />
                <input
                  {...formik.getFieldProps("lastName")}
                  type="text"
                  className={`${styles.textbox} ${extend.textbox}`}
                  placeholder="last name"
                />
              </div>
              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("mobile")}
                  type="text"
                  className={`${styles.textbox} ${extend.textbox}`}
                  placeholder="mobile no."
                />
                <input
                  {...formik.getFieldProps("email")}
                  type="text"
                  className={`${styles.textbox} ${extend.textbox}`}
                  placeholder="email*"
                />
              </div>

              <input
                {...formik.getFieldProps("address")}
                type="text"
                className={`${styles.textbox} ${extend.textbox}`}
                placeholder="address"
              />

              <button type="submit" className={styles.btn}>
                Update
              </button>
            </div>
            <div className="text-center ">
              <span>
                come back to later?{" "}
                <button onClick={userLogout} className="text-red-500" to="/">
                  LogOut
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
