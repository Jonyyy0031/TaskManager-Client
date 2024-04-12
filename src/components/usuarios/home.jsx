// eslint-disable-next-line no-unused-vars
import React, { Fragment, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom"
import Nav from "../layout/Nav";
import Footer from "../layout/Footer";
import ClienteAxios from "../../config/axios";
import {
  Card,
  Input,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

function Home() {
  const navigate = useNavigate()
  const [listas, setListas] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [showTaskInputs, setShowTaskInputs] = useState({});

  const handleClickOutside = (e) => {
    if (!e.target.closest(".task-inputs")) {
      setShowTaskInputs({});
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddTaskClick = (id) => {
    setShowTaskInputs((prevState) => ({
      ...prevState,
      [id]: true,
    }));
  };

  const handleTaskSubmit = (id) => {
    // Aquí puedes manejar la lógica para enviar la tarea asociada a la lista con el id proporcionado
    // En este ejemplo, solo se muestra un mensaje en la consola
    console.log(`Enviar tarea de la lista ${id}`);
    // Para ocultar los campos de entrada después de enviar la tarea
    setShowTaskInputs({});
  };

  const fetchTareas = useCallback(()=> {
    ClienteAxios.get("/tareas")
      .then((response) => {
        setTareas(response.data);
      })
      .catch((error) => {
        if(error.response.data.error == "Token no encontrado" || error.response.data.error == "Falta el encabezado de autorizacion"){
          navigate("/login")
        }else{
          console.error("Error al obtener los datos de las tareas:", error);
        }
      });
    }, [navigate])

  useEffect(() => {
    fetchTareas();
  }, [fetchTareas]);

  const fetchListas = useCallback(() => {
    ClienteAxios.get("/listas")
      .then((response) => {
        setListas(response.data);
        const initialState = response.data.reduce((acc, lista) => {
          acc[lista.ID_Lista] = false;
          return acc;
        }, {});
        setShowTaskInputs(initialState);
      })
      .catch((error) => {
        if(error.response.data.error == "Token no encontrado" || error.response.data.error == "Falta el encabezado de autorizacion"){
          navigate("/login")
        }else{
          console.error("Error al obtener los datos de las listas:", error);
        }
      });
  }, [navigate])

  useEffect(() => {
    fetchListas();
  }, [fetchListas]);

  return (
    <Fragment>
      <div className="h-full bg-white">
        <Nav />
        <div className="px-* mb-4 mt-4 flex flex-col items-center justify-center">
          {listas.map((lista) => (
            <Card
              key={lista.ID_Lista}
              className="mt-6 w-full max-w-[32rem] rounded-lg bg-gray-50 shadow-lg"
            >
              <CardBody className="rounded-lg bg-gray-50 shadow-md">
                <Typography variant="h4" color="blue-gray" className="">
                  {lista.Nombre}
                </Typography>
              </CardBody>
              <CardFooter divider className="">
                {showTaskInputs[lista.ID_Lista] ? (
                  <div className="task-inputs">
                    <div className="mb-4 mt-4 ">
                      <Input variant="standard" required label="Tittle" />
                    </div>
                    <Input variant="standard" label="Description" />
                    <Button
                      className="mt-4 "
                      onClick={() => handleTaskSubmit(lista.ID_Lista)}
                    >
                      Agregar tarea
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="text"
                    size="sm"
                    ripple={false}
                    className="flex items-center gap-2 hover:bg-transparent hover:text-cyan-500 hover:ease-in-out active:bg-transparent"
                    onClick={() => handleAddTaskClick(lista.ID_Lista)}
                  >
                    <PlusCircleIcon className="h-6 w-6 text-gray-500" />
                    Agregar tarea
                  </Button>
                )}
                {tareas
                  .filter((tarea) => tarea.ID_Lista === lista.ID_Lista)
                  .map((tarea) => (
                    <div key={tarea.ID_Tarea}>
                      <input
                        type="text"
                        value={tarea.Titulo}
                        readOnly={true}
                        className="mt-4 px-4 focus:outline-none hover:bg-gray-100 w-full"
                      />
                    </div>
                  ))}
              </CardFooter>
            </Card>
          ))}
        </div>
        <Footer />
      </div>
    </Fragment>
  );
}

export default Home;
