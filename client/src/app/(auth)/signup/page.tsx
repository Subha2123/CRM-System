"use client";

import { Eyeoff, EyeVisible } from "@/src/components/Icons";
import { authService } from "@/src/services/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ErrorObj {
  name?:string;
  email?: string;
  password?: string;
  api?: string;
}


export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ErrorObj>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors:ErrorObj = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email.includes("@")) newErrors.email = "Valid email required";
    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 chars";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setSuccess("");

    try {
      await authService.signup(form);
      setSuccess("Account created successfully!");
      setForm({ name: "", email: "", password: "" });
      router.push('/signin')
    } catch (err: unknown) {
       const message =
        err instanceof Error ? err.message : "Something went wrong";
      setErrors({ api: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create New Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-3 rounded-md border-gray-300 focus:outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-3 rounded-md border-gray-300 focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <label className="block text-sm font-medium mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border p-3 rounded-md border-gray-300 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeVisible /> : <Eyeoff />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-pulse">Signing up...</span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {errors.api && (
          <p className="mt-4 text-center text-red-500 text-sm">{errors.api}</p>
        )}

        {success && (
          <p className="mt-4 text-center text-green-600 text-sm">{success}</p>
        )}

        <button
          onClick={() => {
            router.push("/signin");
          }}
          className="mt-4 w-full text-blue-600 underline py-3 rounded-lg flex items-center justify-center"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
