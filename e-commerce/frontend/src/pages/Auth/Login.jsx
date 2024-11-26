import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  useLoginMutation,
  userApiSlice,
} from "../../redux/api/users.apiSlice.js";
import { setCredentials } from "../../redux/features/auth/authSlice.js";
import { toast } from "react-toastify";
import Loader from "../../components/Loader.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  //   console.log(useLocation());

  //   const params = new URLSearchParams(search);
  //   console.log(params.get("key"));

  const redirect = sp.get("redirect") || "/";
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      console.log(res);
      dispatch(setCredentials({ ...res }));
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  }
  return (
    <div>
      <section className="pl-[10rem] flex flex-wrap">
        <div className="mr-[4rem] mt-[5rem] ">
          <h1 className="text-2xl font-semibold mb-4 text-gray-50">Sign up</h1>
          <form onSubmit={handleSubmit} className="container w-[40rem]">
            <div className="my-[2rem]">
              <label
                htmlFor="email"
                className="block text-md font-light text-gray-50"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-1 p-2  rounded-md w-full focus:outline-none focus:ring-lime-500 ring-1 bg-gradient-to-r from-gray-950 to-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-[2rem] mt-[1rem]">
              <label
                htmlFor="password"
                className="block text-md font-light text-gray-50"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="mt-1 p-2  rounded-md w-full focus:outline-none focus:ring-lime-500 ring-1 bg-gradient-to-r from-gray-950 to-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="bg-lime-600 hover:bg-lime-500 px-4 py-2 rounded cursor-pointer my-[rem]"
            >
              {isLoading ? "Singing in..." : "Sign in"}
            </button>
            {isLoading && <Loader />}
          </form>
          <div className="mt-4">
            <p className="text-gray-50 text-sm font-extralight">
              New Customer ?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-lime-500 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
