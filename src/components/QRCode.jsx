// card pra exibir QR Code

import React from "react";
import { Link } from "react-router-dom";

function QRCode() {
  return (
    <Link
      to="/validar-qrcode"
      className="button-qr-code"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        border: "1px solid gray",
        padding: "16px",
        margin: "8px",
        borderRadius: "8px",
        color: "rgba(235, 14, 14, 0.87)",
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      QR Code
    </Link>
  );
}

export default QRCode;