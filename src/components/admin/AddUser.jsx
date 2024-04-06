import React, { Fragment, useState, useEffect } from "react";
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

function AddUser({ onUserAdded }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  const [roles, guardarroles] = useState([]);
  useEffect(() => {
    ClienteAxios.get("/roles")
      .then((response) => {
        guardarroles(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los roles:", error);
      });
  }, []);

  const [formData, setFormData] = useState({
    ID_Rol: "",
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const handleChange = (e, name) => {
    const value = e.target ? e.target.value : e;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmpassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await ClienteAxios.post("/usuarios", {
        ID_Rol: formData.ID_Rol,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      if (response.status === 201) {
        setSuccessMessage("Usuario creado correctamente");
        setError("");
        setFormData({
          ID_Rol: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
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
        setError("El nombre de usuario ya está en uso");
      } else if (
        error.response.data.error === "El correo electronico ya esta en uso" &&
        error.response.status === 400
      ) {
        setError("El correo electronico ya esta en uso");
      } else {
        setError(
          "Error en el servidor. Por favor, inténtalo de nuevo más tarde."
        );
      }
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <Fragment>
      <Button onClick={handleOpen}>Nuevo usuario</Button>
      <Dialog size="xs" open={open} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[24rem]">
          <form onSubmit={handleSubmit}>
            <CardBody className="flex flex-col gap-4">
              <div className="flex justify-between items-center space-x-4">
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
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4"
                  role="alert"
                >
                  <strong className="font-bold">Éxito!</strong>
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
              <Typography className="" variant="h6">
                Rol
              </Typography>
              <Select
                color="red"
                label="Select Rol"
                required
                value={formData.ID_Rol}
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
                value={formData.username}
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
                value={formData.email}
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
                    value={formData.password}
                    onChange={(e) => handleChange(e, "password")}
                    placeholder="••••••••"
                    className="bg-white border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 border-black border-opacity-20 placeholder-black-50 text-black"
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
                    value={formData.confirmpassword}
                    onChange={(e) => handleChange(e, "confirmpassword")}
                    placeholder="••••••••"
                    className="bg-white border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 border-black border-opacity-20 placeholder-black-50 text-black"
                    required
                  />
                </div>
              </div>
            </CardBody>
            <CardFooter className="pt-0">
              {error && <span className="text-red-500">{error}</span>}
              <div className="flex flex-col mt-2">
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
