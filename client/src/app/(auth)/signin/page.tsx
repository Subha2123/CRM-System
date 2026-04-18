"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/src/services/auth";
import { Eyeoff, EyeVisible } from "@/src/components/Icons";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let newErrors = {};

    if (!form.email.includes("@")) newErrors.email = "Valid email required";
    if (!form.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setSuccess("");

    try {
      const data = await authService.login(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));

      setSuccess("Login successful!");
      setForm({ email: "", password: "" });
      router.push("/dashboard");
    } catch (err: unknown) {
      setErrors({ api: err?.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-6 text-center">User SignIn</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-3 focus:outline-none rounded-md border-gray-300 "
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
              className="w-full border p-3 focus:outline-none rounded-md border-gray-300 "
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
              <span className="animate-pulse">Logging in...</span>
            ) : (
              "Login"
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
            router.push("/signup");
          }}
          className="mt-4 w-full text-blue-600 underline py-3 rounded-lg flex items-center justify-center"
        >
          Create New Account
        </button>
      </div>
    </div>
  );
}
