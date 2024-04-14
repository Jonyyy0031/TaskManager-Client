import { Fragment, useState, useEffect } from "react";
import {useNavigate} from "react-router-dom"
import PropTypes from "prop-types";
import ClienteAxios from "../../config/axios";
import {
  Button,
  Dialog,
  Card,
  Select,
  Option,
  CardBody,
  CardFooter,
  Typography,
  Input,
  IconButton,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { UserCircleIcon } from "@heroicons/react/24/outline";

function AddUser({ onUserAdded }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [img, setImg] = useState(null);
  const [imgTemp, setImgtemp] = useState(null);
  const navigate = useNavigate();

  const [roles, saveRoles] = useState([]);
  useEffect(() => {
    ClienteAxios.get("/roles")
      .then((response) => {
        saveRoles(response.data);
      })
      .catch((error) => {
        if (
          error.response.data.error == "Token no encontrado" ||
          error.response.data.error == "No tienes permisos"
        ) {
          navigate("/login");
        }
        console.error("Error al obtener los roles:", error);
      });
  }, [navigate]);

  const [user, saveUser] = useState({
    ID_Rol: "",
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


  const handleImageChange = e => {
    if (e.target.files[0]) {
      setImg(e.target.files[0]);
      setImgtemp(URL.createObjectURL(e.target.files[0]));
    }
    console.log(e.target.files)
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
    form.append("ID_Rol", user.ID_Rol);
    form.append("username", user.username);
    form.append("email", user.email);
    form.append("password", user.password);
    form.append("file", img);
    try {
      const response = await ClienteAxios.post("/usuarios", form);
      if (response.status === 201) {
        setSuccessMessage("Done!");
        setError("");
        saveUser({
          ID_Rol: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          imagen: "",
        });
        onUserAdded();
        setTimeout(() => {
          setOpen(false);
          setSuccessMessage("");
        }, 3500);
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
          "Something went wrong :/",
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
      <Button onClick={handleOpen}>New User</Button>
      <Dialog size="xs" open={open} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[24rem]">
          <form onSubmit={handleSubmit}>
            <CardBody className="flex flex-col gap-4">
              <div className="flex items-center justify-between space-x-4">
                <Typography variant="h4" color="blue-gray">
                  Create a new user
                </Typography>
                <div className="flex items-center">
                  <IconButton variant="text" size="sm" onClick={handleOpen}>
                    <XMarkIcon className="h-8 w-8 stroke-2"></XMarkIcon>
                  </IconButton>
                </div>
              </div>

              {successMessage && (
                <div
                  className="relative mt-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
                  role="alert"
                >
                  <span className="block sm:inline"> {successMessage}</span>
                </div>
              )}
              <Typography
                className="mb-1 font-normal"
                variant="paragraph"
                color="gray"
              >
                Please enter information
              </Typography>
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
              <Typography className="" variant="h6">
                Rol
              </Typography>
              <Select
                color="red"
                label="Select Rol"
                required
                value={user.ID_Rol}
                onChange={(e) => handleChange(e, "ID_Rol")}
              >
                {roles.map((rol) => (
                  <Option key={rol.ID_Rol} value={rol.ID_Rol.toString()}>
                    {rol.Nombre}
                  </Option>
                ))}
              </Select>
              <Typography className="" variant="h6">
                Username
              </Typography>
              <Input
                name="username"
                value={user.username}
                onChange={(e) => handleChange(e, "username")}
                label="Username"
                required
              />
              <Typography className="-mb-2" variant="h6">
                Email
              </Typography>
              <Input
                type="email"
                name="email"
                value={user.email}
                onChange={(e) => handleChange(e, "email")}
                label="Email"
                required
              />
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <Typography className="mb-2" variant="h6">
                    Password
                  </Typography>
                  <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={(e) => handleChange(e, "password")}
                    placeholder="••••••••"
                    className="focus:ring-primary-600 focus:border-primary-600 placeholder-black-50 block w-full rounded-lg border border-black border-opacity-20 bg-white p-2.5 text-black sm:text-sm"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <Typography className="mb-2" variant="h6">
                    Confirm password
                  </Typography>
                  <input
                    type="password"
                    name="confirmpassword"
                    value={user.confirmpassword}
                    onChange={(e) => handleChange(e, "confirmpassword")}
                    placeholder="••••••••"
                    className="focus:ring-primary-600 focus:border-primary-600 placeholder-black-50 block w-full rounded-lg border border-black border-opacity-20 bg-white p-2.5 text-black sm:text-sm"
                    required
                  />
                </div>
              </div>
            </CardBody>
            <CardFooter className="pt-0">
              {error && <span className="text-red-500">{error}</span>}
              <div className="mt-2 flex flex-col">
                <Button variant="gradient" type="submit" fullWidth>
                  Create account
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </Fragment>
  );
}
AddUser.propTypes = {
  onUserAdded: PropTypes.func.isRequired,
};
export default AddUser;
