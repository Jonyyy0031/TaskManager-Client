import React from "react";
import { Link } from "react-router-dom";
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
  Collapse,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

function Nav() {
  const profileMenuItems = [
    {
      label: "My Profile",
      icon: UserCircleIcon,
    },
    {
      label: "Edit Profile",
      icon: Cog6ToothIcon,
    },
    {
      label: "Sign Out",
      icon: PowerIcon,
    },
  ];

  function ProfileMenu() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const closeMenu = () => setIsMenuOpen(false);

    return (
      <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
        <MenuHandler>
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
          >
            <Avatar
              variant="circular"
              size="sm"
              alt=""
              className="border border-gray-900 p-0.5 w-10 h-10"
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
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
                <Typography
                  as="span"
                  variant="small"
                  className="font-normal"
                  color={isLastItem ? "red" : "inherit"}
                >
                  {label}
                </Typography>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    );
  }

  // nav list component
  const navListItems = [];

  function NavList() {
    return (
      <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
        {navListItems.map(({ label, icon }) => (
          <Typography
            key={label}
            as="a"
            href="#"
            variant="small"
            color="gray"
            className="font-medium text-blue-gray-500"
          >
            <MenuItem className="flex items-center gap-2 lg:rounded-full">
              {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
              <span className="text-gray-900"> {label}</span>
            </MenuItem>
          </Typography>
        ))}
      </ul>
    );
  }

  const [isNavOpen, setIsNavOpen] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );
  }, []);

  return (
    <>
      <Navbar className="mx-auto max-w-screen p-2 lg:rounded-3xl lg:pl-3">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography className="mr-4 ml-2 cursor-pointer py-1.5 font-medium text-black">
            <Link>TaskBoard</Link>
          </Typography>
          <div className="hidden lg:flex flex-grow justify-center">
            <div className="flex text-center align-middle">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '400px' }}
              />
            </div>
          </div>
          <div className="hidden lg:block">
            <NavList />
          </div>
          <ProfileMenu />
        </div>
        <Collapse open={isNavOpen} className="overflow-scroll">
          <NavList />
        </Collapse>
      </Navbar>
    </>
  );
}
export default Nav;
