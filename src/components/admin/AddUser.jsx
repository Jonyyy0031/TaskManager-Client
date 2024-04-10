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
  Alert,
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
        console.error("Error obteniendo roles:", error);
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
  const [invalidCharacters, setInvalidCharacters] = useState("");
  const [invalidCharactersEmail, setInvalidCharactersEmail] = useState("");
  const [invalidRole, setInvalidRole] = useState("");

  const handleChange = (e, name) => {
    const value = e.target ? e.target.value : e;
    setFormData({ ...formData, [name]: value });
    setInvalidCharacters(""); 
    setInvalidCharactersEmail(""); 
    setInvalidRole(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const Uname = formData.username;
    if (!/^[a-zA-Z\s]*$/.test(Uname)) {
      setInvalidCharacters("Only letters are accepted.");
      return;
    }

    if (Uname.length > 20) {
      setInvalidCharacters("The name is too long.");
      return;
    }

    const Emailvalue = formData.email;
    if(/[$#""\-+]/g.test(Emailvalue)){
      setInvalidCharactersEmail("Special characters are not accepted in email.");
      return
    }

    if (!formData.ID_Rol) {
      setInvalidRole("Please select a role.");
      return;
    }

    if (formData.password !== formData.confirmpassword) {
      setError("Passwords do not match.");
      setTimeout(() => {
        setError("");
      }, 3000);
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
        setSuccessMessage("Successfully created user");
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
        error.response.data.error === "Username already in use" &&
        error.response.status === 400
      ) {
        setInvalidRole("");
        setInvalidCharacters("");
        setInvalidCharactersEmail("");
        setError("Username already in use");
      } else if (
        error.response.data.error === "Email already in use" &&
        error.response.status === 400
      ) {
        setInvalidRole("");
        setInvalidCharacters("");
        setInvalidCharactersEmail("");
        setError("Email already in use");
      } else {
        setError(
          "Username or Email already in use"
        );
      }
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <Fragment>
      <Button onClick={handleOpen}>New user</Button>
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
                  <strong className="font-bold">Success!</strong>
                  <span className="block sm:inline"> {successMessage}</span>
                </div>
              )}
              {invalidCharacters && (
                <Alert color="yellow" className="mt-4">
                  {invalidCharacters}
                </Alert>
              )}
              {invalidCharactersEmail && (
                <Alert color="yellow" className="mt-4">
                  {invalidCharactersEmail}
                </Alert>
              )}
<<<<<<< Updated upstream
                {invalidRole && (
                  <Alert color="yellow" className="mt-4">
                    {invalidRole}
                  </Alert>
                )}
=======
              {invalidRole && (
                <Alert color="yellow" className="mt-4">
                  {invalidRole}
                </Alert>
              )}
>>>>>>> Stashed changes
              {error && (
                <Alert color="yellow" className="mt-4">
                  {error}
                </Alert>
              )}
              <Typography
                className="mb-1 font-normal"
                variant="paragraph"
                color="gray"
              >
                Please enter information
              </Typography>
              <Typography className="" variant="h6">
                Role
              </Typography>
              <Select
                color="red"
                label="Select Role"
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
