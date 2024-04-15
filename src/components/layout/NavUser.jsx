import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Typography,
  Navbar,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import { PowerIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

function NavUser() {
  const navigate = useNavigate();

  const profileMenuItems = [
    {
      label: "Sign Out",
      icon: PowerIcon,
    },
  ];

  function ProfileMenuU() {
    const [isMenuOpenU, setIsMenuOpenU] = React.useState(false);
    console.log(isMenuOpenU)
    const token = localStorage.getItem("token");

    useEffect(() => {
      if (!token) {
        navigate("/login");
      }
    }, [token]);

    const decodeToken = jwtDecode(token);
    const userImage = decodeToken.imagen;

    const handleLogoutU = () => {
      localStorage.removeItem("token");
      navigate("/login");
    };

    const closeMenuU = () => setIsMenuOpenU(false);

    return (
      <Menu open={isMenuOpenU} handler={setIsMenuOpenU} placement="bottom-end">
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
                isMenuOpenU ? "rotate-180" : ""
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
                onClick={closeMenuU}
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
                <span 
                  className="text-red cursor-pointer"
                  onClick={handleLogoutU}
                >
                  Log out
                </span>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    );
  }

  return (
    <>
      <Navbar className="max-w-screen-3xl mx-auto p-2  lg:pl-3">
        <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
          <Typography className="ml-2 mr-4 cursor-pointer py-1.5 font-medium text-black">
            <Link>TaskBoard</Link>
          </Typography>
          {/* <div className="hidden lg:block">
            <NavList />
          </div> */}
          <ProfileMenuU />
        </div>
        {/* <Collapse open={isNavOpen} className="overflow-scroll">
          <NavList />
        </Collapse> */}
      </Navbar>
    </>
  );
}
export default NavUser;
