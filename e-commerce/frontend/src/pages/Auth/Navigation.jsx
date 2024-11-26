import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineLogin,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Navigation.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/users.apiSlice.js";
import { logout } from "../../redux/features/auth/authSlice.js";

function Navigation() {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showsidebar, setShowsidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((p) => !p);
  };
  const toggleSidebar = () => {
    setShowsidebar(!showsidebar);
  };
  const closeSidebar = () => {
    setShowsidebar(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{ zIndex: 999 }}
      className={`${
        showsidebar ? "hidden" : "flex"
      }xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-lime-500 bg-black w-[4%] hover:w-[15%] h-[100vh] fixed `}
      id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-4">
        <Link
          to={"/"}
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineHome size={26} className="mr-2 mt-[3rem]" />
          <span className="hidden nav-item-name mt-[3rem]">HOME</span>
        </Link>
        <Link
          to={"/shop"}
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShopping size={26} className="mr-2 mt-[3rem]" />
          <span className="hidden nav-item-name mt-[3rem]">SHOP</span>
        </Link>
        <Link
          to={"/cart"}
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShoppingCart size={26} className="mr-2 mt-[3rem]" />
          <span className="hidden nav-item-name mt-[3rem]">CART</span>
        </Link>
        <Link
          to={"/favourite"}
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <FaHeart size={26} className="mr-2 mt-[3rem]" />
          <span className="hidden nav-item-name mt-[3rem]">Favourite</span>
        </Link>
      </div>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-800 focus:outline-none"
        >
          {userInfo ? (
            <span
              className={` ${
                dropdownOpen ? "text-lime-500" : "text-[#007f5f]"
              } `}
            >
              {userInfo.username.toUpperCase()}
            </span>
          ) : (
            <></>
          )}
          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`ml-[5px] size-5 ${
                dropdownOpen ? "transform rotate-180 text-lime-500" : ""
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          )}
        </button>
        {dropdownOpen && userInfo && (
          <ul
            className={`absolute right-0 mt-2 mr-14 space-y-2 bg-lime-500 rounded-lg font-medium text-gray-950 ${
              !userInfo.isAdmin ? "-top-20" : "-top-80"
            }`}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to={"/admin/dashboard"}
                    className="block px-4 py-2 hover:bg-gray-950 hover:text-lime-500 "
                  >
                    Dashbaord
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/admin/categorylist"}
                    className="block px-4 py-2 hover:bg-gray-950 hover:text-lime-500"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/admin/orderslist"}
                    className="block px-4 py-2 hover:bg-gray-950 hover:text-lime-500"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/admin/userlist"}
                    className="block px-4 py-2 hover:bg-gray-950 hover:text-lime-500"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link
                to={"/admin/profile"}
                className="block px-4 py-2 hover:bg-gray-950 hover:text-lime-500"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to={"/admin/logout"}
                onClick={handleLogout}
                className="block px-4 py-2 hover:bg-gray-950 hover:text-lime-500"
              >
                Logout
              </Link>
            </li>
          </ul>
        )}
      </div>
      {!userInfo && (
        <ul>
          <li>
            <Link
              to={"/login"}
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <AiOutlineLogin size={26} className="mr-2 mt-[3rem]" />
              <span className="hidden nav-item-name mt-[3rem]">Login</span>
            </Link>
          </li>
          <li>
            <Link
              to={"/register"}
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <AiOutlineUserAdd size={26} className="mr-2 mt-[3rem]" />
              <span className="hidden nav-item-name mt-[3rem]">Register</span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}

export default Navigation;
