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
  Select,
  Option
} from "@material-tailwind/react";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { XMarkIcon } from "@heroicons/react/24/solid";

function EditTask({ ID_Tarea, handleCloseEdit, onTaskEdited }) {
  const [open, setOpen] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const [task, saveTask] = useState({
    Titulo: "",
    Descripcion: "",
    Prioridad: "",
    Fechavencimiento: "",
  });

  const handleClose = () => {
    setOpen(false);
    handleCloseEdit();
  };

  const handleChange = (e, name) => {
    const value = e.target ? e.target.value : e;
    saveTask({ ...task, [name]: value });
  };

  useEffect(() => {
    const fetchRolData = async () => {
      try {
        const response = await ClienteAxios.get(`/tareas/${ID_Tarea}`);
        const taskData = response.data;
        console.log(taskData)
        saveTask({
          Titulo: taskData.Titulo,
          Descripcion: taskData.Descripcion,
          Prioridad: taskData.Prioridad,
          Fechavencimiento: taskData.Fechavencimiento
        });
      } catch (error) {
        if (
          error.response.data.error == "Token no encontrado" ||
          error.response.data.error == "Falta el encabezado de autorizacion"
        ) {
          navigate("/login");
        }
        console.error("Error al obtener datos de la tarea:", error);
        setError("Looks like we have problems :(");
      }
    };

    fetchRolData();
  }, [ID_Tarea, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await ClienteAxios.patch(`/tareas/${ID_Tarea}`, {
        Titulo: task.Titulo,
          Descripcion: task.Descripcion,
          Prioridad: task.Prioridad,
          Fechavencimiento: task.Fechavencimiento
      });
      if (response.status === 201) {
        setSuccessMessage("Task successfully edited!");
        setError("");
        onTaskEdited();
        setTimeout(() => {
          handleClose();
          saveTask({
            Titulo: "",
            Descripcion: "",
            Prioridad: "",
            Fechavencimiento: ""
          });
          setSuccessMessage("");
        }, 3500);
      }
    } catch (error) {
      console.log(error.response.data.error);
      if (
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
                  Edit Task
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
                label="Expiration date"
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
                  Edit task
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </Fragment>
  );
}
EditTask.propTypes = {
  ID_Tarea: PropTypes.number.isRequired,
  handleCloseEdit: PropTypes.func.isRequired,
  onTaskEdited: PropTypes.func.isRequired,
};
export default EditTask;
