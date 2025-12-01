export function base64DataURLToArrayBuffer(dataURL) {
  const base64Regex = /^data:image\/(png|jpg|jpeg|svg|svg\+xml);base64,/;
  if (!base64Regex.test(dataURL)) {
    return false;
  }
  const stringBase64 = dataURL.replace(base64Regex, "");
  let binaryString;
  if (typeof window !== "undefined") {
    binaryString = window.atob(stringBase64);
  } else {
    binaryString = new Buffer(stringBase64, "base64").toString("binary");
  }
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export const imageOptions = {
  centered: false, // Apakah gambar di tengah?
  getImage: function (tagValue, tagName) {
    // tagValue adalah data base64 yang di kirim
    return base64DataURLToArrayBuffer(tagValue);
  },
  getSize: function (img, tagName, context) {
    // Ukuran QR Code di dalam Word (120px x 120px)
    return [120, 120];
  },
};
