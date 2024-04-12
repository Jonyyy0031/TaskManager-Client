import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"
import {
  Input,
  Typography,
  Navbar,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  PowerIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const profileMenuItems = [
    {
      label: "Sign Out",
      icon: PowerIcon,
    },
  ];
  
  function ProfileMenu() {
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
  // // nav list component
  // const navListItems = [];

  // function NavList() {
  //   return (
  //     <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
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

  // const [isNavOpen, setIsNavOpen] = React.useState(false);

  // React.useEffect(() => {
  //   window.addEventListener(
  //     "resize",
  //     () => window.innerWidth >= 960 && setIsNavOpen(false)
  //   );
  // }, []);

  return (
    <>
      <Navbar className="max-w-screen mx-auto p-2 lg:rounded-3xl lg:pl-3">
        <div className="relative flex mx-auto items-center justify-between text-blue-gray-900">
          <Typography className="mr-4 ml-2 cursor-pointer py-1.5 font-medium text-black">
            <Link>TaskBoard</Link>
          </Typography>
          <div className="flex flex-grow justify-center">
            <div className="flex text-center">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
                
              />
            </div>
          </div>
          {/* <div className="hidden lg:block">
            <NavList />
          </div> */}
          <ProfileMenu /> 
        </div>
        {/* <Collapse open={isNavOpen} className="overflow-scroll">
          <NavList />
        </Collapse> */}
      </Navbar>
    </>
  );
}
export default Nav;
