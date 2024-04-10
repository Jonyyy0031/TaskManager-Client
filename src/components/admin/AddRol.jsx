import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import ClienteAxios from "../../config/axios";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  IconButton,
  Alert,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

function AddRol({ onRolAdded }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);


  const [formData, setFormData] = useState({
    Nombre : "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [invalidCharacters, setInvalidCharacters] = useState("");
  const handleChange = (e, name) => {
    const value = e.target ? e.target.value : e;

    setFormData({ ...formData, [name]: value });
    setInvalidCharacters(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const value = formData.Nombre;

    if (!/^[a-zA-Z\s]*$/.test(value)) {
      setInvalidCharacters("Only letters are accepted.");
      return;
    }

    if (value.length > 20) {
      setInvalidCharacters("The name is too long.");
      return;
    }

    try {
      const response = await ClienteAxios.post("/roles", {
        Nombre : formData.Nombre,
      });
      if (response.status === 201) {
        setSuccessMessage("Successfully created role.");
        setError("");
        setFormData({
          Nombre: ""
        });
        onRolAdded();
        setTimeout(() => {
          setOpen(false);
          setSuccessMessage("");
        }, 3500);
      }
    } catch (error) {
      if (
        error.response.data.error === "The role name already exists" &&
        error.response.status === 400
      ) {
        setError("The role name is already in use.");
      } else {
        setError(
          "The role name is already in use"
        );
      }
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <Fragment>
      <Button onClick={handleOpen}>New role</Button>
      <Dialog size="xs" open={open} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[24rem]">
          <form onSubmit={handleSubmit}>
            <CardBody className="flex flex-col gap-4">
              <div className="flex justify-between items-center space-x-4">
                <Typography variant="h4" color="blue-gray">
                  Create a new Rol
                </Typography>
                <div className="flex items-center">
                  <IconButton variant="text" size="sm" onClick={handleOpen}>
                    <XMarkIcon className="h-8 w-8 stroke-2"></XMarkIcon>
                  </IconButton>
                </div>
              </div>

              {successMessage && (
                <Alert color="green" className="mt-4">
                  <strong>Éxito!</strong> {successMessage}
                </Alert>
              )}
              {invalidCharacters && (
                <Alert color="yellow" className="mt-4">
                  {invalidCharacters}
                </Alert>
              )}
              {error && (
                <Alert color="red" className="mt-4">
                  {error}
                </Alert>
              )}
              <Typography
                className="mb-1 font-normal"
                variant="paragraph"
                color="gray"
              >
                Please enter the information
              </Typography>
              <Typography className="" variant="h6">
                Role Name
              </Typography>
              <Input
                name="Nombre"
                value={formData.Nombre}
                onChange={(e) => handleChange(e, "Nombre")}
                label="Name"
                required
              />
            </CardBody>
            <CardFooter className="pt-0">
              <div className="flex flex-col mt-2">
                <Button variant="gradient" type="submit" fullWidth>
                  Create role
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </Fragment>
  );
}
AddRol.propTypes = {
  onRolAdded: PropTypes.func.isRequired,
};
export default AddRol;