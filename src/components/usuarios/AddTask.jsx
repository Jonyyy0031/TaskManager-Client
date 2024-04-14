import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Select,
  Option
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

function AddTask({ ID_Lista, handleCloseAdd, onTaskAdded }) {
  const [open, setOpen] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [task, saveTask] = useState({
    Titulo: "",
    Descripcion: "",
    Prioridad: "",
    Fechavencimiento: new Date(),
  });

  const handleClose = () => {
    setOpen(false);
    handleCloseAdd();
  };
  
  const handleChange = (e, name) => {
    const value = e.target ? e.target.value : e;
    saveTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await ClienteAxios.post("/tareas", {
        ID_Lista: ID_Lista,
        Titulo: task.Titulo,
        Descripcion: task.Descripcion,
        Prioridad: task.Prioridad,
        Fechavencimiento: task.Fechavencimiento,
      });
      if (response.status === 201) {
        setSuccessMessage("Sucess!");
        setError("");
        saveTask({
          Titulo: "",
          Descripcion: "",
          Prioridad: "",
          Fechavencimiento: new Date(),
        });
        onTaskAdded();
        setTimeout(() => {
          handleClose();
          setSuccessMessage("");
        }, 3500);
      }
    } catch (error) {
      if (
        error.response.data.error == "Token no encontrado" ||
        error.response.data.error == "Falta el encabezado de autorizacion"
      ) {
        navigate("/login");
      } else {
        setError("Ooops...,Unexpected Server Error :(");
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
                  Create new task
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
                Tittle:
              </Typography>
              <Input
                name="Titulo"
                value={task.Titulo}
                onChange={(e) => handleChange(e, "Titulo")}
                label="Tittle"
                required
              />
              <Typography className="" variant="h6">
                Description:
              </Typography>
              <Input
                name="Descripcion"
                value={task.Descripcion}
                onChange={(e) => handleChange(e, "Descripcion")}
                label="Description"
                required
              />
              <Typography className="" variant="h6">
                Priority:
              </Typography>
              <Select
                name="Prioridad"
                value={task.Prioridad}
                onChange={(e) => handleChange(e, "Prioridad")}
                label="Priority"
                required
              >
                <Option value="Alto">High</Option>
                <Option value="Normal">Normal</Option>
                <Option value="Bajo">Low</Option>
              </Select>
              <Typography className="" variant="h6">
              Expiration date:
              </Typography>
              <DatePicker
                selected={task.Fechavencimiento}
                showIcon
                minDate={Date.now()}
                dateFormat="YYYY-MM-dd"
                onChange={(date) =>
                  handleChange(date, "Fechavencimiento")
                }
                
               
              />
            </CardBody>
            <CardFooter className="pt-0">
              {error && <span className="text-red-500">{error}</span>}
              <div className="mt-2 flex flex-col">
                <Button variant="gradient" type="submit" fullWidth>
                  Create Task
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </Fragment>
  );
}
AddTask.propTypes = {
  ID_Lista: PropTypes.number.isRequired,
  handleCloseAdd: PropTypes.func.isRequired,
  onTaskAdded: PropTypes.func.isRequired
};
export default AddTask;
