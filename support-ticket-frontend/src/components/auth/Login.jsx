import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FormGroup } from "../../widgets/FromGroup";
import { Button } from "../../widgets/Button";
import { useForm } from "react-hook-form";
import { FaSignInAlt } from "react-icons/fa";
import { Toast } from "../../utils/toast";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setError("");
      await login(data); 
      Toast('login successful!');
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-indigo-100 rounded-md space-y-8 p-4 shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome
          </h2>
          <p className="text-center mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="rounded-md">
            <FormGroup
              label={"Email"}
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              error={errors.email}
              placeholder={"Enter Email"}
              requiredStatus={true}
            />

            <FormGroup
              label={"Password"}
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={errors.password}
              placeholder={"Enter Password"}
              requiredStatus={true}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            <FaSignInAlt className="mr-2" />
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
