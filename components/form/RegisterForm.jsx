"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  CreditCard,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "../ui/Toast";

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const toast = useToast();

  // State Form
  const [formData, setFormData] = useState({
    nik: "",
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle Ketik
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Khusus NIK cuma boleh angka
    if (name === "nik" && !/^\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
  };

  // Handle Submit
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validasi
    if (formData.nik.length !== 16) {
      toast.error("NIK harus 16 digit angka!", "Error");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password dan Konfirmasi Password harus sama!", "Error");
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        nik: formData.nik,
        name: formData.nama,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response?.ok) {
        const errData = await response.json();
        toast.error(
          errData.message || "Terjadi kesalahan, Coba lagi!",
          "Error"
        );
        return;
      }

      toast.success("Register Berhasil!", "Success");
      router.push("/login");
    } catch (error) {
      toast.error(
        String(error.message) || "Terjadi kesalahan, Coba lagi!",
        "Error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-2">
      {/* NIK */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          NIK
        </label>
        <div className="relative">
          <input
            type="text"
            name="nik"
            maxLength={16}
            value={formData.nik}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all font-mono"
            placeholder="16 Digit Angka"
            required
          />
          <CreditCard
            className="absolute left-3 top-3.5 text-gray-400"
            size={18}
          />
        </div>
      </div>

      {/* Nama Lengkap */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Nama Lengkap
        </label>
        <div className="relative">
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            placeholder="Sesuai KTP"
            required
          />
          <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Email*/}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Email
        </label>
        <div className="relative">
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            placeholder="contoh@email.com"
            required
          />
          <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Password & Confirm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition-all"
              placeholder="••••••"
              required
            />
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Ulangi Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all
                                    ${
                                      formData.confirmPassword &&
                                      formData.password !==
                                        formData.confirmPassword
                                        ? "border-red-300 focus:ring-red-500 bg-red-50"
                                        : "border-gray-200 focus:ring-green-500"
                                    }
                                `}
              placeholder="••••••"
              required
            />
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
          {formData.confirmPassword &&
            formData.password !== formData.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Password tidak sama!</p>
            )}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 disabled:opacity-70"
        >
          {isLoading ? (
            "Tunggu Sebentar..."
          ) : (
            <>
              Daftar Sekarang <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
