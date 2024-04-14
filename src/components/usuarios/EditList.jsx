import { Fragment, useState, useEffect } from "react";
import {useNavigate} from "react-router-dom"
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

function EditList({ ID_Lista, handleCloseEdit, onListEdited }) {
  const [open, setOpen] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Nombre: "",
  });

  const handleClose = () => {
    setOpen(false);
    handleCloseEdit();
  };

  const handleChange = (e, name) => {
    const value = e.target ? e.target.value : e;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const fetchRolData = async () => {
      try {
        const response = await ClienteAxios.get(`/listas/${ID_Lista}`);
        const listData = response.data;
        setFormData({
          Nombre: listData.Nombre,
        });
      } catch (error) {
        if (
          error.response.data.error == "Token no encontrado" ||
          error.response.data.error == "Falta el encabezado de autorizacion"
        ) {
          navigate("/login");
        }
        else{
            console.error("Error al obtener datos de la lista:", error);
            setError("Looks like we have problems :(");
        }  
      }
    };

    fetchRolData();
  }, [ID_Lista, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await ClienteAxios.patch(`/listas/${ID_Lista}`, {
        Nombre: formData.Nombre,
      });
      if (response.status === 201) {
        setSuccessMessage("List successfully edited!");
        setError("");
        onListEdited();
        setTimeout(() => {
          handleClose();
          setFormData({
            Nombre: "",
          });
          setSuccessMessage("");
        }, 3500);
      }
    } catch (error) {
      console.log(error.response.data.error);
      if (
        error.response.data.error === "El nombre de la lista ya existe" &&
        error.response.status === 400
      ) {
        setError("List name already exists");
      }
      else if (
        error.response.data.error == "Token no encontrado" ||
        error.response.data.error == "Falta el encabezado de autorizacion"
      ) {
        navigate("/login");
      } else {
        setError(
          "Ooops..., Unexpected Server Error :(",
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
              <div className="flex items-center justify-between space-x-4">
                <Typography variant="h4" color="blue-gray">
                  Edit List
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
              <Typography className="" variant="h6">
                Name: 
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
              <div className="mt-2 flex flex-col">
                <Button variant="gradient" type="submit" fullWidth>
                  Edit list
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </Fragment>
  );
}
EditList.propTypes = {
  ID_Lista: PropTypes.number.isRequired,
  handleCloseEdit: PropTypes.func.isRequired,
  onListEdited: PropTypes.func.isRequired,
};
export default EditList;
