import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Register() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    address: "",
    gender: "",
  });
  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password and confirm password are not same",
        showClass: {
          popup: "animate__animated animate__fadeInUp animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutDown animate__faster",
        },
      });
      return null;
    }
    console.log(formData);

    axios
      .post(`${API_URL}/api/register`, formData)
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            title: "Done!",
            text: "Registration completed successfully!",
            icon: "success",
            showClass: {
              popup: "animate__animated animate__fadeInUp animate__faster",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutDown animate__faster",
            },
          });
        }
        setFormData({
          user: "",
          email: "",
          password: "",
          confirmPassword: "",
          mobileNumber: "",
          Address: "",
          gender: "",
        });
      })
      .catch((err) => {
        console.log("error while posting", err);
      });
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm your password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter your mobile number"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter your address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={formData.gender == "male"}
            onChange={handleChange}
          />
          <label>Male</label>
          <input
            type="radio"
            name="gender"
            value="female"
            checked={formData.gender == "female"}
            onChange={handleChange}
          />
          <label>Female</label>
        </div>
        <button>Register</button>
      </form>
    </div>
  );
}
