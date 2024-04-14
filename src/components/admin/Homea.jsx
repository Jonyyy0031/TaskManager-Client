import { Fragment, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import EditUser from "./EditUser";
import AddUser from "./AddUser";
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
  Avatar,
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
const TABLE_HEAD = ["User", "Rol", "Date", "Actions"];

function Homea() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [usuarioID, setUsuarioID] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const [editMode, setEditMode] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const filteredUsuarios = users.filter((usuario) =>
    usuario.Username.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const indexOfLastUsuario = currentPage * perPage;
  const indexOfFirstUsuario = indexOfLastUsuario - perPage;
  const currentUsuarios = filteredUsuarios.slice(
    indexOfFirstUsuario,
    indexOfLastUsuario,
  );

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    if (indexOfLastUsuario < filteredUsuarios.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const fetchUsers = useCallback(() => {
    ClienteAxios.get("/usuarios")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        if (
          error.response.data.error == "Token no encontrado" ||
          error.response.data.error == "No tienes permisos"
        ) {
          navigate("/login");
        } else {
          console.error("Error al obtener los datos de los usuarios:", error);
        }
      });
  }, [navigate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const deleteUsuario = async (ID_Usuario) => {
    try {
      const decodeToken = jwtDecode(token);
      const IDUsuario = decodeToken.ID_Usuario;

      if (ID_Usuario === IDUsuario) {
        setErrorMessage("You can't delete yourself!");
        return;
      }

      const response = await ClienteAxios.delete(
        "/usuarios/" + ID_Usuario + "",
      );
      console.log(response);
      setOpen(!open);
      fetchUsers();
    } catch (error) {
      if (
        error.response.data.error == "Token no encontrado" ||
        error.response.data.error == "No tienes permisos"
      ) {
        navigate("/login");
      }
      console.error("Error al eliminar el usuario: ", error);
    }
  };

  const handleEditClick = (userID) => {
    setEditMode(true);
    setSelectedUserID(userID);
  };

  const handleCloseEdit = () => {
    setEditMode(false);
  };

  return (
    <Fragment>
      <Sidebaradmin />
      {editMode && (
        <EditUser
          usuarioID={selectedUserID}
          onUserEdited={fetchUsers}
          handleCloseEdit={handleCloseEdit}
        />
      )}
      <div className="min-h-screen bg-gray-100">
        <Card className="mx-auto  mt-4 block h-full w-full max-w-screen-2xl shadow-2xl rounded-2xl p-2 lg:rounded-3xl lg:pl-3">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Members
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  Information on all registered users
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <AddUser onUserAdded={fetchUsers} />
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
                  const isLast = index === filteredUsuarios.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={usuario.ID_Usuario}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={`http://localhost:8888/${usuario.Imagen}`}
                            size="sm"
                          />
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
                          <IconButton
                            variant="text"
                            onClick={() => handleEditClick(usuario.ID_Usuario)}
                          >
                            <PencilIcon className="h-4 w-4"></PencilIcon>
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Delete User">
                          {/* <IconButton variant="text" onClick={() => deleteUsuario(usuario.ID_Usuario)}> */}
                          <IconButton
                            variant="text"
                            onClick={() => {
                              setUsuarioID(usuario.ID_Usuario);
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
              Page {currentPage} of{" "}
              {Math.ceil(filteredUsuarios.length / perPage)}
            </Typography>
            <div className="flex gap-2">
              <Button variant="outlined" size="sm" onClick={handlePreviousPage}>
                Previous
              </Button>
              <Button
                variant="outlined"
                size="sm"
                onClick={handleNextPage}
                disabled={indexOfLastUsuario >= filteredUsuarios.length}
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
            You are about to delete a user!
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
          <Button color="red" onClick={() => deleteUsuario(usuarioID)}>
            I understand
          </Button>
        </DialogFooter>
      </Dialog>
    </Fragment>
  );
}

export default Homea;
