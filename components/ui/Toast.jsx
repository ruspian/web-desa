"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // hapus toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // tambah toast
  const addToast = useCallback(
    (type, title, message) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, type, title, message }]);

      // Auto remove setelah 3 detik
      setTimeout(() => {
        removeToast(id);
      }, 3000);
    },
    [removeToast]
  );

  //  fungsi toast
  const toast = {
    success: (message, title = "Berhasil!") =>
      addToast("success", title, message),
    error: (message, title = "Gagal!") => addToast("error", title, message),
    warning: (message, title = "Perhatian") =>
      addToast("warning", title, message),
    info: (message, title = "Info") => addToast("info", title, message),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* TOAST CONTAINER */}
      <div className="fixed top-4 right-4 z-9999 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border-l-4 bg-white transform transition-all duration-500 ease-out animate-slide-in-right
              ${t.type === "success" ? "border-emerald-500" : ""}
              ${t.type === "error" ? "border-red-500" : ""}
              ${t.type === "warning" ? "border-yellow-500" : ""}
              ${t.type === "info" ? "border-blue-500" : ""}
            `}
          >
            {/* Icon */}
            <div className="mt-0.5 shrink-0">
              {t.type === "success" && (
                <CheckCircle className="text-emerald-500" size={20} />
              )}
              {t.type === "error" && (
                <XCircle className="text-red-500" size={20} />
              )}
              {t.type === "warning" && (
                <AlertTriangle className="text-yellow-500" size={20} />
              )}
              {t.type === "info" && (
                <Info className="text-blue-500" size={20} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4
                className={`text-sm font-bold ${
                  t.type === "success"
                    ? "text-emerald-700"
                    : t.type === "error"
                    ? "text-red-700"
                    : t.type === "warning"
                    ? "text-yellow-700"
                    : "text-blue-700"
                }`}
              >
                {t.title}
              </h4>
              <p className="text-sm text-slate-600 mt-0.5 leading-snug">
                {t.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
