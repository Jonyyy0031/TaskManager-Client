// eslint-disable-next-line no-unused-vars
import React, { Fragment, useEffect, useState } from "react";
import Sidebaradmin from "./sidebaradmin";
import Footer from "../layout/Footer";
import ClienteAxios from "../../config/axios";
import {
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import New from "./new";

const TABS = [
  {
    label: "All",
    value: "all",
  },
];
const TABLE_HEAD = ["Usuario", "Rol", "Fecha", "Acciones"];

function Homea() {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario.Username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastUsuario = currentPage * perPage;
  const indexOfFirstUsuario = indexOfLastUsuario - perPage;
  const currentUsuarios = filteredUsuarios.slice(
    indexOfFirstUsuario,
    indexOfLastUsuario
  );

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    if (indexOfLastUsuario < filteredUsuarios.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  function fetchUsuarios(){
    ClienteAxios.get("/usuarios")
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de los usuarios:", error);
      });
  }

  useEffect(() => {
    fetchUsuarios();
  }, []);
  
  
  return (
    <Fragment>
      <Sidebaradmin />
      <Card className="block h-full w-full max-w-screen-2xl mx-auto rounded-2xl mt-4 mb-4 p-2 lg:rounded-3xl lg:pl-3">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Usuarios
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Informacion acerca de todos los usuarios registrados
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <New onUserAdded={fetchUsuarios}/>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Tabs value="all" className="w-full md:w-max">
              <TabsHeader>
                {TABS.map(({ label, value }) => (
                  <Tab key={value} value={value}>
                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
            <div className="w-full md:w-72">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}{" "}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentUsuarios.map((usuario, index) => {
                const isLast = index === usuarios.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={usuario.ID_Usuario}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar src="" size="sm" />
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {usuario.Username}
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          >
                            {usuario.Email}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {usuario.ID_Rol}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {usuario.Fechareg.slice(0, 10)}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Edit User">
                        <IconButton variant="text">
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Delete User">
                        <IconButton variant="text">
                          <TrashIcon className="h-4 w-4"></TrashIcon>
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Pagina {currentPage} de{" "}
            {Math.ceil(filteredUsuarios.length / perPage)}
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm" onClick={handlePreviousPage}>
              Anterior
            </Button>
            <Button variant="outlined" size="sm" onClick={handleNextPage} disabled={indexOfLastUsuario >= filteredUsuarios.length}>
              Siguiente
            </Button>
          </div>
        </CardFooter>
      </Card>
      <Footer />
    </Fragment>
  );
}

export default Homea;
