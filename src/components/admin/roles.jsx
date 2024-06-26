import { Fragment, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddRol from "./AddRol";
import EditRol from "./EditRol";
import Sidebaradmin from "./sidebaradmin";
import Footer from "../layout/Footer";
import ClienteAxios from "../../config/axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

const TABS = [
  {
    label: "All",
    value: "all",
  },
];

const TABLE_HEAD = ["Rol", "Name", "Actions"];

function Roles() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [rolID, setRolID] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRolID, setSelectedRolID] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const filteredRoles = roles.filter((rol) =>
    rol.Nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const indexOfLastRol = currentPage * perPage;
  const indexOfFirstRol = indexOfLastRol - perPage;
  const currentRoles = filteredRoles.slice(indexOfFirstRol, indexOfLastRol);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    if (indexOfLastRol < filteredRoles.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const fetchRoles = useCallback(() => {
    ClienteAxios.get("/roles")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        if (
          error.response.data.error == "Token no encontrado" ||
          error.response.data.error == "No tienes permisos"
        ) {
          navigate("/login");
        }
        console.error("Error al obtener los datos de los roles:", error);
      });
  }, [navigate]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const deleteRol = async (ID_Rol) => {
    try {
      if (ID_Rol === 1 || ID_Rol === 2) {
        console.log("Los roles con ID 1 y 2 no pueden ser eliminados.");
        setErrorMessage("You can't delete fundamental rol!");
        return;
      }
      const response = await ClienteAxios.delete("/roles/" + ID_Rol + "");
      console.log(response);
      setOpen(!open);
      fetchRoles();
    } catch (error) {
      if (
        error.response.data.error == "Token no encontrado" ||
        error.response.data.error == "No tienes permisos"
      ) {
        navigate("/login");
      }
      console.error("Error al eliminar el rol: ", error);
    }
  };

  const handleOpen = () => setOpen(!open);

  const handleEditClick = (rolID) => {
    setEditMode(true);
    setSelectedRolID(rolID);
  };

  const handleCloseEdit = () => {
    setEditMode(false);
  };

  return (
    <Fragment>
      <Sidebaradmin />
      {editMode && (
        <EditRol
          rolID={selectedRolID}
          onRolEdited={fetchRoles}
          handleCloseEdit={handleCloseEdit}
        />
      )}
      <div className="min-h-screen bg-gray-100">
        <Card className="mx-auto shadow-2xl mt-4 block h-full w-full max-w-screen-2xl rounded-2xl p-2 lg:rounded-3xl lg:pl-3">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Rols
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  Information about all roles
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <AddRol onRolAdded={fetchRoles} />
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
                {currentRoles.map((rol, index) => {
                  const isLast = index === filteredRoles.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={rol.ID_Rol}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {rol.ID_Rol}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {rol.Nombre}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Edit Rol">
                          <IconButton
                            variant="text"
                            onClick={() => handleEditClick(rol.ID_Rol)}
                          >
                            <PencilIcon className="h-4 w-4"></PencilIcon>
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Delete Rol">
                          <IconButton
                            variant="text"
                            onClick={() => {
                              setRolID(rol.ID_Rol);
                              handleOpen();
                            }}
                          >
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
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              Page {currentPage} of {Math.ceil(filteredRoles.length / perPage)}
            </Typography>
            <div className="flex gap-2">
              <Button variant="outlined" size="sm" onClick={handlePreviousPage}>
                Previous
              </Button>
              <Button
                variant="outlined"
                size="sm"
                onClick={handleNextPage}
                disabled={indexOfLastRol >= filteredRoles.length}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <Footer />
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
            You are about to delete a Role!
          </Typography>
          <Typography className="text-center font-normal">
            This action is irreversible!
          </Typography>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="blue-gray" onClick={handleOpen}>
            Cancel
          </Button>
          {errorMessage && <span className="text-red-500">{errorMessage}</span>}
          <Button color="red" onClick={() => deleteRol(rolID)}>
            I understand
          </Button>
        </DialogFooter>
      </Dialog>
    </Fragment>
  );
}

export default Roles;
