import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ClaimPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const store_id = params.get("store_id");

    if (!store_id) {
      setError("Invalid store QR code. Store ID is missing.");
      setLoading(false);
      return;
    }

    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      // First time user – redirect to Apple login
      navigate(`/login?store_id=${store_id}`);
    } else {
      // Existing user – redirect to backend pass endpoint
      window.location.href = `https://iazivtkf12.execute-api.eu-north-1.amazonaws.com/default/api/apple-wallet/pass?store_id=${store_id}&user_id=${user_id}`;
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      {loading && <p className="text-gray-600 text-sm">Processing your scan...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}