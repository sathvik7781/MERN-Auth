import React, { useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
export default function Login() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { loginUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);
    axios
      .post(`${API_URL}/api/login`, formData, { withCredentials: true })
      .then((res) => {
        console.log(res);
        const message = res.data.message;
        // alert(res.data.message);
        Swal.fire({
          title: "Done!",
          text: message,
          icon: "success",
          showClass: {
            popup: "animate__animated animate__fadeInUp animate__faster",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutDown animate__faster",
          },
        });
        //store the token in frontend
        // localStorage.setItem("token", res.data.token);
        loginUser(res.data);
      })
      .catch((err) => {
        console.log(err);
        const message = err.response.data.message;
        // alert(err.response.data.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: message,
          showClass: {
            popup: "animate__animated animate__fadeInUp animate__faster",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutDown animate__faster",
          },
        });
      });
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
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
        <button>Login</button>
      </form>
    </div>
  );
}
