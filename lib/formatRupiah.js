export const formatRupiah = (num) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);

// fungsi Format Rupiah Ringkas (Jt/M)
export const formatCurrency = (value) => {
  if (value === undefined || value === null) return "Rp 0";

  // Format Ringkas Juta/Milyar untuk Card Kecil
  if (Math.abs(value) >= 1000000000) {
    return `Rp ${(value / 1000000000).toFixed(0)} M`;
  }
  if (Math.abs(value) >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(0)} Jt`;
  }

  // Format Lengkap
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};
