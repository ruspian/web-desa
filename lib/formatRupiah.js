export const formatRupiah = (num) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);

// Helper Format Rupiah Ringkas (Jt/M)
export const formatCurrency = (value) => {
  if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(0)} M`;
  if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(0)} Jt`;
  return `Rp ${value.toLocaleString("id-ID")}`;
};
