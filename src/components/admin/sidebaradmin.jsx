import React, { useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Drawer,
  Card,
  Navbar,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  InboxIcon,
  PowerIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function Sidebaradmin() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const navigate = useNavigate();

  
  const profileMenuItems = [
    {
      label: "Sign Out",
      icon: PowerIcon,
    },
  ];

  function ProfileMenu() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
      return null;
  }
    const decodeToken = jwtDecode(token)
    const userImage = decodeToken.imagen
  
    const handleLogout= () =>{
      localStorage.removeItem('token');
      navigate("/login")
    }

    const closeMenu = () => setIsMenuOpen(false);

    return (
      <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
        <MenuHandler>
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-1 rounded-full py-0.5 pl-0.5 pr-2 lg:ml-auto"
          >
            <Avatar
              variant="circular"
              size="md"
              alt=""
              className="h-12 w-12 border border-gray-900 p-0.5"
              src={`http://localhost:8888/${userImage}`}
            />
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-3 w-3 transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </MenuHandler>
        <MenuList className="p-1">
          {profileMenuItems.map(({ label, icon }, key) => {
            const isLastItem = key === profileMenuItems.length - 1;
            return (
              <MenuItem
                key={label}
                onClick={closeMenu}
                className={`flex items-center gap-2 rounded ${
                  isLastItem
                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                    : ""
                }`}
              >
                {React.createElement(icon, {
                  className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                  strokeWidth: 2,
                })}
                <Button
                variant="text"
                size="sm"
                color="red"
                className="w-full"
                onClick={handleLogout}>
                  Log out
                </Button>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    );
  }

  // nav list component
  // const navListItems = [];

  // function NavList() {
  //   return (
  //     <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
  //       {navListItems.map(({ label, icon }) => (
  //         <Typography
  //           key={label}
  //           as="a"
  //           href="#"
  //           variant="small"
  //           color="gray"
  //           className="font-medium text-blue-gray-500"
  //         >
  //           <MenuItem className="flex items-center gap-2 lg:rounded-full">
  //             {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
  //             <span className="text-gray-900"> {label}</span>
  //           </MenuItem>
  //         </Typography>
  //       ))}
  //     </ul>
  //   );
  // }

  // const [isNavOpen, setIsNavOpen] = useState(false);

  // React.useEffect(() => {
  //   window.addEventListener(
  //     "resize",
  //     () => window.innerWidth >= 960 && setIsNavOpen(false),
  //   );
  // }, []);
  
  return (
    <>
      <Navbar className="max-w-screen mx-auto p-2 lg:rounded-3xl lg:pl-3">
        <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
          <IconButton variant="text" size="lg" onClick={openDrawer}>
            {isDrawerOpen ? (
              <XMarkIcon className="h-8 w-8 stroke-2" />
            ) : (
              <Bars3Icon className="h-8 w-8 stroke-2" />
            )}
          </IconButton>
          <Typography className="ml-2 mr-4 cursor-pointer py-1.5 font-medium text-black">
            <Link>TaskBoard</Link>
          </Typography>
          {/* <div className="hidden lg:block">
            <NavList />
          </div> */}
          <ProfileMenu />
        </div>
        {/* <Collapse open={isNavOpen} className="overflow-scroll">
          <NavList />
        </Collapse> */}
      </Navbar>
      <Drawer open={isDrawerOpen} onClose={closeDrawer}>
        <Card
          color="transparent"
          shadow={true}
          className="h-[calc(100vh-2rem)] w-full p-4"
        >
            <div className="mb-2 flex items-center gap-4 p-4">
              {/* <img
                src=""
                alt="brand"
                className="h-8 w-8"
              /> */}
              <Typography variant="h5" color="blue-gray">
                TaskBoard
              </Typography>
            </div>
          <List>
            <ListItem>
              <ListItemPrefix>
                <PresentationChartBarIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Link className="ml-2" to={"/homea"}>
                Home
              </Link>
            </ListItem>
            <ListItem>
              <ListItemPrefix>
                <InboxIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Link className="ml-2" to={"/roles"}>
                Roles
              </Link>
            </ListItem>
          </List>
        </Card>
      </Drawer>
    </>
  );
}
export default Sidebaradmin;
