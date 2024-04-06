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
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

function EditRol({ rolID, handleCloseEdit, onRolEdited }) {
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    handleCloseEdit();
  };

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const handleChange = (e, name) => {
    const value = e.target ? e.target.value : e;
    setFormData({ ...formData, [name]: value });
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
        console.error("Error al obtener datos del rol:", error);
        setError("Error al obtener datos del rol");
      }
    };

    fetchRolData();
  }, [rolID]);

  const [formData, setFormData] = useState({
    Nombre: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await ClienteAxios.patch(`/roles/${rolID}`, {
        Nombre: formData.Nombre
      });
      if (response.status === 201) {
        setSuccessMessage("Rol editado correctamente");
        setError("");
        onRolEdited();
        setTimeout(() => {
          handleClose();
          setFormData({
            Nombre : ""
          });
          setSuccessMessage("");
        }, 3500);
      }
    } catch (error) {
      console.log(error.response.data.error);
      if (
        error.response.data.error === "El nombre del rol ya existe" &&
        error.response.status === 400
      ) {
        setError("El nombre del rol ya existe");
      }  else {
        setError(
          "Error en el servidor. Por favor, inténtalo de nuevo más tarde."
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
                Nombre
              </Typography>
              <Input
                name="Nombre"
                value={formData.Nombre}
                onChange={(e) => handleChange(e, "Nombre")}
                label="Nombre"
                required
              />
            </CardBody>
            <CardFooter className="pt-0">
              {error && <span className="text-red-500">{error}</span>}
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
