import React, { Fragment, useState, useEffect } from "react";
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

function EditRol({ rolID, handleCloseEdit, onRolEdited }) {
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    handleCloseEdit();
  };

  const [formData, setFormData] = useState({
    Nombre: ""
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [invalidCharacters, setInvalidCharacters] = useState("");

  const handleChange = (e, name) => {
    const value = e.target ? e.target.value : e;

    setFormData({ ...formData, [name]: value });
    setInvalidCharacters(""); 
  };

  useEffect(() => {
    const fetchRolData = async () => {
      try {
        const response = await ClienteAxios.get(`/roles/${rolID}`);
        const rolData = response.data;
        setFormData({
          Nombre: rolData.Nombre
        });
      } catch (error) {
        console.error("Error getting role data:", error);
        setError("Error getting role data:");
      }
    };

    fetchRolData();
  }, [rolID]);

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
      const response = await ClienteAxios.patch(`/roles/${rolID}`, {
        Nombre: formData.Nombre
      });
      if (response.status === 201) {
        setSuccessMessage("Successfully edited role.");
        setError("");
        onRolEdited();
        setTimeout(() => {
          handleClose();
          setFormData({
            Nombre: ""
          });
          setSuccessMessage("");
        }, 3500);
      }
    } catch (error) {
      console.log(error.response.data.error);
      if (
        error.response.data.error === "The role name already exists." &&
        error.response.status === 400
      ) {
        setError("The role name already exists.");
      } else {
        setError(
          "The role name already exists."
        );
      }
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <Fragment>
      <Dialog size="xs" open={open} className="bg-transparent shadow-none">
        <Card className="mx-auto w-full max-w-[24rem]">
          <form onSubmit={handleSubmit}>
            <CardBody className="flex flex-col gap-4">
              <div className="flex justify-between items-center space-x-4">
                <Typography variant="h4" color="blue-gray">
                  Edit Rol
                </Typography>
                <div className="flex items-center">
                  <IconButton variant="text" size="sm" onClick={handleClose}>
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
                Please enter information
              </Typography>
              <Typography className="" variant="h6">
                Name
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
                  Edit rol
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </Fragment>
  );
}

EditRol.propTypes = {
  rolID: PropTypes.number.isRequired,
  handleCloseEdit: PropTypes.func.isRequired,
  onRolEdited: PropTypes.func.isRequired,
};

export default EditRol;
