// eslint-disable-next-line no-unused-vars
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClienteAxios from "../../config/axios";
import { Link } from "react-router-dom";

function Registro() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const history = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmpassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await ClienteAxios.post("/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      if (response.status === 201) {
        setSuccessMessage("Usuario creado correctamente");
        setError("");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          setSuccessMessage("");
          history("/login");
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("El nombre de usuario ya está en uso");
      }
      if (
        error.response.data.error === "El correo electronico ya esta en uso" &&
        error.response.status === 400
      ) {
        setError("El correo electronico ya esta en uso");
      } else {
        setError(
          "Error en el servidor. Por favor, inténtalo de nuevo más tarde."
        );
      }
    }
  };

  return (
    <Fragment>
      <section className="bg-white">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-700 dark:text-black"
          >
            <img
              className="w-8 h-8 mr-2"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="logo"
            ></img>
            Taskmanager
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-100 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              {successMessage && ( // Mostrar mensaje de éxito si está definido
                <div
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4"
                  role="alert"
                >
                  <strong className="font-bold">Éxito!</strong>
                  <span className="block sm:inline"> {successMessage}</span>
                </div>
              )}
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
                Create an account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Your username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="bg-whtie border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-black dark:placeholder-black-50 dark:text-black"
                    placeholder="Example123"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-whtie border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-black dark:placeholder-black-50 dark:text-black"
                    placeholder="example@gmail.com"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="bg-white border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-black dark:placeholder-black-50 dark:text-black"
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      htmlFor="confirmpassword"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      Confirm password
                    </label>
                    <input
                      type="password"
                      name="confirmpassword"
                      value={formData.confirmpassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="bg-white border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-black dark:placeholder-black-50 dark:text-black"
                      required
                    />
                  </div>
                </div>

                {/* <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-light text-gray-500 dark:text-black"
                    >
                      I accept the{" "}
                      <a
                        className="font-medium text-primary-600 hover:underline dark:text-black"
                        href="#"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div> */}
                {error && <span className="text-red-500">{error}</span>}
                <div className="flex flex-col">
                  <button
                    type="submit"
                    className="flex w-full border border-black items-center justify-center active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] font-bold  rounded-xl bg-orange-500  p-3 text-sm  leading-6 text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Create an account
                  </button>
                </div>
                <p className="text-sm font-light text-gray-500 dark:text-gray-500">
                  Already have an account?{" "}
                  <Link
                    to={"/login"}
                    className="font-medium text-primary-600 hover:underline dark:text-orange-500 underline"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default Registro;
