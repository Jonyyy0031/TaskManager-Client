import { Fragment,  useState} from "react";
import { useNavigate } from "react-router-dom";
import ClienteAxios from "../../config/axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";


function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await ClienteAxios.post("/login", formData);
      console.log(response.data.tokenSession)
      if (response.status === 200 && response.data.tokenSession) {
        localStorage.setItem("token", response.data.tokenSession);
  
        if (localStorage.getItem("token")) {
          console.log("Token almacenado correctamente:", localStorage.getItem("token"));
          console.log(response.data.data.ID_Rol)
          if (response.data.data.ID_Rol === 1) {
            navigate("/homea");
          } else if (response.data.data.ID_Rol === 2) {
            navigate("/home");
          } else {
            console.log(error)
          }
        } else {
          console.error("Error al almacenar el token en localStorage");
          setError("Something went wrong :(");
        }
      } else {
        console.error("Respuesta del servidor no válida", error);
        setError("Something went wrong :(");
      }
    } catch (error) {
      if (error.response.status === 500) {
        setError("Oops..Looks like its a server error");
      } else {
        console.error("Error de inicio de sesión:", error.response.data.error);
        setError("Wrong credentials!");
      }
    }
  };
  

  return (
    <Fragment>
      <div className="flex m-auto  min-h-screen">
        <div className="w-full bg-gray-100 flex items-center justify-center">
          <div className="w-[760px] h-[720px] border-xl  bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center justify-center">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                className="mx-auto h-20 w-auto"
                src="https://as2.ftcdn.net/v2/jpg/05/06/81/59/1000_F_506815935_cvsf1tKw8WuPeHpHSm2efPbbH08Tw8nN.jpg"
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
                      className="block w-full rounded-xl border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
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
                      className="block w-full rounded-xl border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                    />
                    
                  </div>
                </div>

                <div className="flex flex-col">
                  <button
                    type="submit"
                    className="flex w-full justify-center active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01]  rounded-xl bg-gray-500  py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" 
                  >
                    Sign in
                  </button>
                  {error && <span className="text-red-500">{error}</span>}
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
      </div>
    </Fragment>
  );
}
export default Login;
