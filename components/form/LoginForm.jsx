"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/Toast";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  // fungsi handel ganti nilai firm
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // fungsi handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const loginResult = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (loginResult?.error) {
        toast.error("Email atau password salah!", "Error");
        return;
      }

      if (loginResult?.ok) {
        toast.success("Login Berhasil!", "Success");

        // Kembali ke halaman utama
        router.push("/");
      }
    } catch (error) {
      toast.error(String(error) || "Terjadi kesalahan, Coba lagi!", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-2"
          htmlFor="usename"
        >
          Username atau Email
        </label>
        <div className="relative">
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={(event) =>
              handleInputChange("username", event.target.value)
            }
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            placeholder="username atau email"
            required
          />
          <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <div className="relative">
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(event) =>
              handleInputChange("password", event.target.value)
            }
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            placeholder="••••••••"
            required
          />
          <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-gray-500">Ingat saya</span>
        </label>
        <a href="#" className="text-green-600 hover:text-green-700 font-medium">
          Lupa Password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 disabled:opacity-70"
      >
        {isLoading ? (
          "Tunggu Sebentar..."
        ) : (
          <>
            Masuk <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
};

export default LoginForm;
