// src/components/auth/Register.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { FormGroup } from "../../widgets/FromGroup";
import { Button } from "../../widgets/Button";
import { FaUserPlus } from "react-icons/fa";
import { Toast } from "../../utils/toast";


const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const [error, setError] = useState("");
  const { register: handleRegister } = useAuth(); 
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    
    try {
      setError("");
      await handleRegister(data);
      Toast('register successful!');
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account");
    }
  };

  const password = watch("password"); 

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-indigo-100 rounded-md space-y-8 p-6 shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome
          </h2>
          <p className="text-center mt-2">Create your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <FormGroup
              label={"Name"}
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              error={errors.name}
              placeholder={"Enter your name"}
              requiredStatus={true}
            />

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
              placeholder={"Enter your email"}
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
              placeholder={"Enter password"}
              requiredStatus={true}
            />

            <FormGroup
              label={"Confirm Password"}
              type="password"
              {...register("password_confirmation", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              error={errors.password_confirmation}
              placeholder={"Confirm your password"}
              requiredStatus={true}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            <FaUserPlus className="mr-2" />
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>

          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to="/"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
