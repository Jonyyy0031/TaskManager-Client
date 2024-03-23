/* eslint-disable no-unused-vars */
import React, { Fragment,  useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ClienteAxios from "../../config/axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";


function Login() {

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const registroExitoso = params.get("registroExitoso");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const history = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await ClienteAxios.post("/Login", formData);
      console.log(response)
      if (response.status === 200) {
        console.log(response.data.token)
        console.log(response.data.ID_Rol)
        localStorage.setItem("token", response.data.token);
        if (response.data.ID_Rol === 1){
          history("/homea")
        }
        else if(response.data.ID_Rol === 1000){
          history("/home")
        }
        else{
          history("/error")
        }
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error.response.data.error);
      setError("Credenciales incorrectas")
    }
  };

  return (
    <Fragment>
      <div className="flex flex-row m-auto min-h-screen">
        <div className="w-1/2 bg-orange-500 flex items-center justify-center">
          <div className="w-2/3 h-2/3 border-xl bg-white p-8 rounded-xl shadow-md flex flex-col items-center justify-center">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                className="mx-auto h-10 w-auto"
                src=""
                alt="Your Company"
              />
              <h2 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={handleSubmit} >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-medium font-semibold leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Please enter your email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-xl border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-medium font-semibold leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Please enter your password"
                      autoComplete="current-password"
                      required
                      className="block w-full rounded-xl border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    
                  </div>
                </div>

                <div className="flex flex-col">
                  <button
                    type="submit"
                    className="flex w-full justify-center active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] font-bold  rounded-xl bg-indigo-600  py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                  {error && <span className="text-red-500">{error}</span>}
                  <button
                    type="button"
                    className="flex items-center py-3 gap-3 mt-2 justify-center active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] font-bold  rounded-xl   py-3 text-sm font-semibold leading-6 "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      preserveAspectRatio="xMidYMid"
                      viewBox="0 0 256 262"
                      id="google"
                    >
                      <path
                        fill="#4285F4"
                        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                      ></path>
                      <path
                        fill="#34A853"
                        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                      ></path>
                      <path
                        fill="#FBBC05"
                        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                      ></path>
                      <path
                        fill="#EB4335"
                        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                      ></path>
                    </svg>
                    Sign in with Google
                  </button>
                </div>
              </form>

              <p className="mt-10 text-center text-sm text-gray-500">
                Not a member?{" "}
                <Link
                  to={"/registro"}
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Create an Account
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/2 bg-neutral-50 flex items-center justify-center">
          <div className="w-2/3">
            <Slider {...settings} className="text-center">
              <div className="mx-auto flex flex-col items-center justify-center">
                <div className="flex justify-center items-center w-full h-full">
                  <img
                    src="/logoPolitecnico.png"
                    alt="Imagen 1"
                    className="max-w-full max-h-full"
                  />
                </div>
                <h3 className="font-bold text-center">
                  Diseñado para la UPQROO
                </h3>
                <p className="text-gray-900 text-center">
                  TaskManager es un software de gestión de tareas pensado en
                  las necesidades de cada alumno de la universidad
                </p>
              </div>

              <div className="mx-auto">
                <img
                  src="/task-management-hero-banner.png"
                  alt="Imagen 2"
                  className="m-auto"
                />
                <h3 className="font-bold text-center">
                  Olvídese de los registros en papel
                </h3>
                <p className="text-gray-900 text-center">
                  Simplificamos la gestion de tareas eliminando 
                  los registros en papel
                </p>
              </div>

              <div className="mx- auto">
                <img src="/a.jpg" alt="Imagen 2" className="m-auto" />
                <h3 className="font-bold text-center">
                  Seguimiento fácil de cada tarea
                </h3>
                <p className="text-gray-900 text-center">
                  Mantenga el control total cada tarea que tenga
                  manteniendo el seguimiento de manera sencilla{" "}
                </p>
              </div>

              <div className="mx-auto">
                <img src="/b.avif" alt="Imagen 2" className="m-auto" />
                <h3 className="font-bold text-center">Recordatorios</h3>
                <p className="text-gray-900 text-center">
                  Maximice sus tiempos de entrega con los recordatorios personalizados
                  para cada tarea
                </p>
              </div>
            </Slider>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
export default Login;
