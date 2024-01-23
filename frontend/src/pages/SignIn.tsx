import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

interface FormFields {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

const SignIn = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      firstName: "",
      lastName: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  const handleSignIn = async (data: FormFields) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/signin",
        {
          username: data.username,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      console.log(response.data);
      localStorage.setItem(
        "CURRENT_USER",
        JSON.stringify({
          ...data,
          createdAt: Date.now(),
          id: response.data.id,
        })
      );
      navigation(`/home`);
    } catch (error) {
      console.log(error);
      setLoginError("User already exists! Try different username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen background-image text-white">
      <div className="bg min-w-[400px] max-w-[400px] flex flex-col gap-y-1">
        <h1 className="text-center text-xl">
          Welcome to extension based chat application
        </h1>
        <h1
          className="text-center mb-3 
        text-2xl uppercase"
        >
          Sign In
        </h1>

        <form
          onSubmit={handleSubmit(handleSignIn)}
          className="flex flex-col gap-y-3 w-full"
        >
          {loginError && (
            <div className="bg-red-600 px-2 py-4 flex justify-center items-center mb-3 rounded-md text-white">
              {loginError}
            </div>
          )}
          <div className="flex justify-between">
            <div className="flex flex-col w-[48%]">
              <input
                className=" text-black border-2 rounded-xl px-3 py-3 outline-none "
                type="text"
                placeholder="First Name"
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
              {errors.firstName && (
                <span className="text-red-600 italic">
                  *{errors.firstName.message}
                </span>
              )}
            </div>
            <div className="flex flex-col  w-[48%]">
              <input
                className=" text-black border-2 rounded-xl px-3 py-3 outline-none"
                type="text"
                placeholder="Last Name"
                {...register("lastName", {
                  required: "Last name is required",
                })}
              />
              {errors.lastName && (
                <span className="text-red-600 italic">
                  *{errors.lastName.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <input
              className=" text-black border-2 rounded-xl px-3 py-3 outline-none "
              type="text"
              placeholder="Username"
              {...register("username", {
                required: "Username is required",
                pattern: {
                  value: /^[a-z]+$/,
                  message: "Username should be not contain uppercase letters",
                },
              })}
            />
            {errors.username && (
              <span className="text-red-600 italic">
                *{errors.username.message}
              </span>
            )}
          </div>

          <div className="flex flex-col relative">
            <input
              className=" text-black border-2 rounded-xl px-3 py-3 outline-none"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value:
                    /^(?=.*[!@#$%^&*()-_+=/\\{}[\]:;<>,.?])(?=.*[A-Z]).{8,}$/,
                  message:
                    "Password should be 8 characters long and it should have atleast one specical character and uppercase character.",
                },
              })}
            />
            <span
              onClick={() => {
                setShowPassword(true);
              }}
              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-black"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
            {errors.password && (
              <span className="text-red-600 italic">
                *{errors.password.message}
              </span>
            )}
          </div>
          <button
            disabled={loading}
            type="submit"
            className="bg-purple-600 px-2 py-3 rounded-md text-white font-bold text-xl hover:bg-purple-500 transition-all duration-150 disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? (
              <>
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 text-black animate-spin fill-white"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <Link to="/login" className="text-center mt-4">
          Don't have an account?{" "}
          <span className="text-purple-600 font-bold">Login</span>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
