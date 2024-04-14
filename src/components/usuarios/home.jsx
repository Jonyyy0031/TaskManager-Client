import { Fragment, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Nav from "../layout/Nav";
import Footer from "../layout/Footer";
import ClienteAxios from "../../config/axios";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Textarea,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { QueueListIcon } from "@heroicons/react/24/outline";
import AddTask from "./AddTask.jsx";
import EditTask from "./EditTask.jsx";
import AddList from "./AddList.jsx";
import EditList from "./EditList.jsx";

function Home() {
  const navigate = useNavigate();
  const [listas, setListas] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [errorMessage, seterrorMessage] = useState("")
  const [showTaskMenu, setShowTaskMenu] = useState({});
  const [selectedListaID, setSelectedListaID] = useState(null);
  const [IDUser, setIDUser] = useState(null);
  const [selectedTaskID, setSelectedTaskID] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [addListMode, setAddListMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editListMode, setEditListMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [openList, setOpenList] = useState(false);
  const handleOpen = () => setOpen(!open);
  const handleOpenList = () => setOpenList(!openList);


  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const decodeToken = jwtDecode(token);
  const ID_Usuario = decodeToken.ID_Usuario;

  const handleAddClick = (ID_Lista) => {
    setAddMode(true);
    setSelectedListaID(ID_Lista);
  };

  const handleAddListClick = (ID_Usuario) => {
    setAddListMode(true);
    setIDUser(ID_Usuario);
  };

  const handleEditClick = (ID_Tarea) => {
    setEditMode(true);
    setSelectedTaskID(ID_Tarea);
  };

  const handleEditListClick = (ID_Lista) => {
    setEditListMode(true);
    setSelectedListaID(ID_Lista);
    console.log(ID_Lista);
  };

  const handleCloseAdd = () => {
    setAddMode(false);
  };

  const handleCloseAddList = () => {
    setAddListMode(false);
  };

  const handleCloseEdit = () => {
    setEditMode(false);
  };

  const handleCloseEditList = () => {
    setEditListMode(false);
  };

  const toggleTaskMenu = (id) => {
    setShowTaskMenu((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleClickOutsideTaskMenu = (e) => {
    if (!e.target.closest(".task-menu")) {
      setShowTaskMenu({});
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideTaskMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideTaskMenu);
    };
  }, []);

  const fetchTareas = useCallback(() => {
    ClienteAxios.get("/tareas")
      .then((response) => {
        setTareas(response.data);
      })
      .catch((error) => {
        if (
          error.response.data.error == "Token no encontrado" ||
          error.response.data.error == "Falta el encabezado de autorizacion"
        ) {
          navigate("/login");
          console.log(error)
        } else {
          console.error("Error al obtener los datos de las tareas:", error);
        }
      });
  }, [navigate]);

  useEffect(() => {
    fetchTareas();
  }, [fetchTareas]);

  const fetchListas = useCallback(async () => {
    try {
      const response = await ClienteAxios.get(`/listasu/${ID_Usuario}`);
      setListas(response.data);
    } catch (error) {
      if (
        error.response.data.error == "Token no encontrado" ||
        error.response.data.error == "Falta el encabezado de autorizacion"
      ) {
        navigate("/login");
      } else {
        console.error("Error al obtener los datos de las listas:", error);
      }
    }
  }, [ID_Usuario, navigate]);

  useEffect(() => {
    fetchListas();
  }, [fetchListas]);

  const deleteTask = async (ID_Tarea) => {
    try {
      const response = await ClienteAxios.delete("/tareas/" + ID_Tarea + "");
      console.log(response);
      setOpen(!open);
      fetchTareas();
    } catch (error) {
      if (
        error.response.data.error == "Token no encontrado" ||
        error.response.data.error == "Falta el encabezado de autorizacion"
      )
      console.error("Error al eliminar la tarea: ", error);
    }
  };

  const deleteList = async (ID_Lista) => {
    if(ID_Lista === 1){
      console.log("Primera lista indestructible");
      seterrorMessage("You can't delete the first List!")
    }
    try {
      const response = await ClienteAxios.delete("/listas/" + ID_Lista + "");
      console.log(response);
      setOpenList(!openList);
      fetchListas();
    } catch (error) {
      if (
        error.response.data.error == "Token no encontrado" ||
        error.response.data.error == "Falta el encabezado de autorizacion"
      ){
        navigate("/login")
      }
      console.error("Error al eliminar la Lista: ", error);
    }
  };

  const getColorByPriority = (Prioridad) => {
    switch (Prioridad) {
      case "Alto":
        return "red";
      case "Normal":
        return "orange";
      case "Bajo":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <Fragment>
      {addListMode && (
        <AddList
          ID_Usuario={IDUser}
          onListAdded={fetchListas}
          handleCloseAddList={handleCloseAddList}
        />
      )}
      {addMode && (
        <AddTask
          ID_Lista={selectedListaID}
          onTaskAdded={fetchTareas}
          handleCloseAdd={handleCloseAdd}
        />
      )}
      {editMode && (
        <EditTask
          ID_Tarea={selectedTaskID}
          onTaskEdited={fetchTareas}
          handleCloseEdit={handleCloseEdit}
        />
      )}
      {editListMode && (
        <EditList
          ID_Lista={selectedListaID}
          onListEdited={fetchListas}
          handleCloseEdit={handleCloseEditList}
        />
      )}
      <div className="min-h-screen bg-gray-100">
        <Nav />
        <div className="px-* mb-8 mt-4 flex flex-col items-center justify-center">
          {listas.map((lista) => (
            <Card
              key={lista.ID_Lista}
              className="mt-6 w-full max-w-[32rem] rounded-lg bg-gray-50 shadow-lg"
            >
              <CardBody className="flex rounded-lg bg-gray-50 shadow-md">
                <Typography variant="h4" color="blue-gray" className="mr-2">
                  {lista.Nombre}
                </Typography>
                <Tooltip content="Delete Task">
                  <IconButton
                    variant="text"
                    onClick={() => {
                      setSelectedListaID(lista.ID_Lista);
                      handleOpenList();
                    }}
                  >
                    <TrashIcon className="h-4 w-4"></TrashIcon>
                  </IconButton>
                </Tooltip>
                <Tooltip content="Edit List">
                  <IconButton
                    variant="text"
                    onClick={() => handleEditListClick(lista.ID_Lista)}
                  >
                    <PencilIcon className="h-4 w-4"></PencilIcon>
                  </IconButton>
                </Tooltip>
              </CardBody>
              <CardFooter divider className="">
                {tareas
                  .filter((tarea) => tarea.ID_Lista === lista.ID_Lista)
                  .map((tarea) => (
                    <div key={tarea.ID_Tarea} className="task-menu">
                      <Button
                        variant="text"
                        className=" mb-4 mt-2 w-full border border-cyan-900 text-left hover:bg-gray-100 focus:outline-none"
                        onClick={() => toggleTaskMenu(tarea.ID_Tarea)}
                        style={{
                          borderColor: getColorByPriority(tarea.Prioridad),
                        }}
                      >
                        {tarea.Titulo}
                      </Button>
                      {showTaskMenu[tarea.ID_Tarea] && (
                        <div className="flex flex-col rounded-lg bg-white px-4 shadow-md">
                          <Textarea
                            defaultValue={tarea.Descripcion}
                            label="Descripcion"
                            className="min-h-[16px] w-full"
                          />
                          <div className="flex gap-2">
                            <Tooltip content="Edit Rol">
                              <IconButton
                                variant="text"
                                onClick={() => handleEditClick(tarea.ID_Tarea)}
                              >
                                <PencilIcon className="h-4 w-4"></PencilIcon>
                              </IconButton>
                            </Tooltip>
                            <Tooltip content="Delete Task">
                              <IconButton
                                variant="text"
                                onClick={() => {
                                  setSelectedTaskID(tarea.ID_Tarea);
                                  handleOpen();
                                }}
                              >
                                <TrashIcon className="h-4 w-4"></TrashIcon>
                              </IconButton>
                            </Tooltip>
                            <Tooltip content="Add Subtask">
                              <IconButton variant="text">
                                <QueueListIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                <Button
                  variant="text"
                  size="sm"
                  ripple={false}
                  onClick={() => {
                    handleAddClick(lista.ID_Lista);
                  }}
                  className="flex items-center gap-2 hover:bg-transparent hover:text-cyan-500 hover:ease-in-out active:bg-transparent"
                >
                  <PlusCircleIcon className="h-6 w-6" />
                  New task
                </Button>
              </CardFooter>
            </Card>
          ))}
          <Button
            className="mt-4 w-[512px]"
            onClick={() => {
              handleAddListClick(ID_Usuario);
            }}
          >
            New list
          </Button>
        </div>
      </div>
      <Footer />
      {/* Dialog Task */}
      <Dialog size="sm" open={open}>
        <DialogHeader>
          <Typography variant="h5" color="blue-gray">
            Are you sure?
          </Typography>
        </DialogHeader>
        <DialogBody divider className="grid place-items-center gap-4">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <Typography color="red" variant="h4">
            You are about to delete a Task!
          </Typography>
          <Typography className="text-center font-normal">
            This action is irreversible!
          </Typography>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="blue-gray" onClick={handleOpen}>
            Cancel
          </Button>
          <Button color="red" onClick={() => deleteTask(selectedTaskID)}>
            I understand
          </Button>
        </DialogFooter>
      </Dialog>
      {/* Dialog Task */}
      {/* Dialog List  */}
      <Dialog size="sm" open={openList}>
        <DialogHeader>
          <Typography variant="h5" color="blue-gray">
            Are you sure?
          </Typography>
        </DialogHeader>
        <DialogBody divider className="grid place-items-center gap-4">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <Typography color="red" variant="h4">
            You are about to delete a List!
          </Typography>
          <Typography className="text-center font-normal">
            This action is irreversible!
          </Typography>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="blue-gray" onClick={handleOpenList}>
            Cancel
          </Button>
          {errorMessage && <span className="text-red-500">{errorMessage}</span>}
          <Button color="red" onClick={() => deleteList(selectedListaID)}>
            I understand
          </Button>
        </DialogFooter>
      </Dialog>
      {/*Dialog List*/}
    </Fragment>
  );
}

export default Home;
