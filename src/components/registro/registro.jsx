import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClienteAxios from "../../config/axios";
import { Link } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";

function Registro() {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [img, setImg] = useState(null);
  const [imgTemp, setImgtemp] = useState(null);
  const navigate = useNavigate();

  const [user, saveUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
    imagen: "",
  });

  const handleChange = (e, name) => {
    const value = e.target ? e.target.value : e;
    saveUser({ ...user, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImg(e.target.files[0]);
      setImgtemp(URL.createObjectURL(e.target.files[0]));
    }
    console.log(e.target.files);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmpassword) {
      setError("Password doesn't match");
      return;
    }

    if (!img) {
      setError("Please, select an image");
      return;
    }

    const form = new FormData();
    form.append("username", user.username);
    form.append("email", user.email);
    form.append("password", user.password);
    form.append("file", img);

    try {
      const response = await ClienteAxios.post("/register", form);
      if (response.status === 201) {
        setSuccessMessage("Done!");
        setError("");
        saveUser({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          imagen: "",
        });
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      if (
        error.response.data.error === "El nombre de usuario ya esta en uso" &&
        error.response.status === 400
      ) {
        setError("Username already exists");
      } else if (
        error.response.data.error === "El correo electronico ya esta en uso" &&
        error.response.status === 400
      ) {
        setError("Email already exists");
      } else {
        setError(
          "Somethin went wrong :/",
        );
        console.log(error);
      }
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <Fragment>
      <section className="b h-full w-full">
        <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
          <a className="mb-6 flex items-center text-2xl font-semibold text-gray-700 dark:text-black">
            {/* <img
              className="mr-2 h-8 w-8"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="logo"
            ></img> */}
            Taskmanager
          </a>
          <div className="w-full rounded-lg bg-white border border-black shadow sm:max-w-md md:mt-0 xl:p-0">
            <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
              {successMessage && (
                <div
                  className="relative mt-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
                  role="alert"
                >
                  <span className="block sm:inline"> {successMessage}</span>
                </div>
              )}
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-black md:text-2xl">
                Create an account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div className="relative mx-auto h-24 w-24 animate-pulse rounded-full bg-gray-300">
                  <div className="relative grid h-24 w-24 place-items-center rounded-full bg-gray-300">
                    {img ? (
                      <img
                        src={imgTemp}
                        alt="user-avatar"
                        className="absolute left-0 top-0 h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="absolute left-1/2 top-1/2 h-[64px] w-[64px] -translate-x-1/2 -translate-y-1/2 transform" />
                    )}
                    <label className="absolute left-0 top-0 h-full w-full cursor-pointer">
                      <input
                        type="file"
                        name="imagen"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-black">
                    Your username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={(e) => handleChange(e, "username")}
                    className="bg-whtie focus:ring-primary-600 focus:border-primary-600 dark:placeholder-black-50 block w-full rounded-lg border p-2.5 dark:border-black dark:text-black sm:text-sm"
                    placeholder="Example123"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-black">
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={(e) => handleChange(e, "email")}
                    className="bg-whtie focus:ring-primary-600 focus:border-primary-600 dark:placeholder-black-50 block w-full rounded-lg border p-2.5 dark:border-black dark:text-black sm:text-sm"
                    placeholder="example@gmail.com"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-black">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={(e) => handleChange(e, "password")}
                      placeholder="••••••••"
                      className="focus:ring-primary-600 focus:border-primary-600 dark:placeholder-black-50 block w-full rounded-lg border bg-white p-2.5 dark:border-black dark:text-black sm:text-sm"
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-black">
                      Confirm password
                    </label>
                    <input
                      type="password"
                      name="confirmpassword"
                      value={user.confirmpassword}
                      onChange={(e) => handleChange(e, "confirmpassword")}
                      placeholder="••••••••"
                      className="focus:ring-primary-600 focus:border-primary-600 dark:placeholder-black-50 block w-full rounded-lg border bg-white p-2.5 dark:border-black dark:text-black sm:text-sm"
                      required
                    />
                  </div>
                </div>
                {error && <span className="text-red-500">{error}</span>}
                <div className="flex flex-col">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-xl border border-black bg-gray-600 p-3 text-sm font-bold  leading-6 text-white  shadow-sm transition-all  hover:scale-[1.01] hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:scale-[.98] active:duration-75"
                  >
                    Create an account
                  </button>
                </div>
                <p className="text-sm font-light text-gray-500 dark:text-gray-500">
                  Already have an account?{" "}
                  <Link
                    to={"/login"}
                    className="font-medium text-blue-500 underline hover:underline"
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
