import { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Avatar,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

function EditUser({ usuarioID, handleCloseEdit, onUserEdited }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleClose = () => {
    setOpen(false);
    handleCloseEdit();
  };

  const [roles, saveroles] = useState([]);
  useEffect(() => {
    ClienteAxios.get("/roles")
      .then((response) => {
        saveroles(response.data);
      })
      .catch((error) => {
        if (
          error.response.data.error == "Token no encontrado" ||
          error.response.data.error == "No tienes permisos"
        ) {
          navigate("/login");
        } else {
          console.error("Error al obtener los roles:", error);
          setError("Looks like we have problems! :(");
        }
      });
  }, [navigate]);

  const handleChange = (e, name) => {
    const value = e.target ? e.target.value : e;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await ClienteAxios.get(`/usuarios/${usuarioID}`);
        const userData = response.data;
        console.log(userData);
        setFormData({
          username: userData.Username,
          email: userData.Email,
          Imagen: userData.Imagen,
        });
      } catch (error) {
        if (
          error.response.data.error == "Token no encontrado" ||
          error.response.data.error == "No tienes permisos"
        ) {
          navigate("/login");
        } else {
          console.error("Error al obtener datos del usuario:", error);
          setError("Ooops, Can't get the user :(");
        }
      }
    };

    fetchUserData();
  }, [usuarioID, navigate]);

  const [formData, setFormData] = useState({
    ID_Rol: "",
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmpassword) {
      setError("Password doesn't match");
      return;
    }

    try {
      const response = await ClienteAxios.patch(`/usuarios/${usuarioID}`, {
        ID_Rol: formData.ID_Rol,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      if (response.status === 201) {
        setSuccessMessage("User sucessfully edited!");
        setError("");
        onUserEdited();
        setTimeout(() => {
          handleClose();
          setFormData({
            ID_Rol: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          setSuccessMessage("");
        }, 3500);
      }
    } catch (error) {
      console.log(error.response.data.error);
      if (
        error.response.data.error == "Token no encontrado" ||
        error.response.data.error == "No tienes permisos"
      ) {
        navigate("/login");
      } else if (
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
        setError("Ooops..., Unexpected Server Error");
      }
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };
  return (
    <Fragment>
      <Dialog size="xs" open={open} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[24rem]">
          <form onSubmit={handleSubmit}>
            <CardBody className="flex flex-col gap-4">
              <div className="flex items-center justify-between space-x-4">
                <Typography variant="h4" color="blue-gray">
                  Edit User
                </Typography>
                <div className="flex items-center">
                  <IconButton variant="text" size="sm" onClick={handleClose}>
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
              <Avatar
                src={`http://localhost:8888/${formData.Imagen}`}
                size="sm"
              />
              <Typography className="" variant="h6">
                Rol
              </Typography>
              <Select
                color="red"
                label="Select Rol"
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
                    value={formData.confirmpassword}
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
                  Edit account
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </Fragment>
  );
}
EditUser.propTypes = {
  usuarioID: PropTypes.number.isRequired,
  handleCloseEdit: PropTypes.func.isRequired,
  onUserEdited: PropTypes.func.isRequired,
};
export default EditUser;
