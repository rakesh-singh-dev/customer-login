import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function WalletPassPage() {
  const [status, setStatus] = useState("Preparing your stamp card...");
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    const fetchPass = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const storeId = urlParams.get("store_id");

      if (!storeId) {
        setStatus("Missing store ID. Please scan a valid QR code.");
        return;
      }

      // 1️⃣ Load or create user ID
      let userId = localStorage.getItem("loyaltee_user_id");
      if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem("loyaltee_user_id", userId);
      }

      try {
        setStatus("Fetching your updated stamp card...");
        const res = await fetch(
          `https://iazivtkf12.execute-api.eu-north-1.amazonaws.com/default/api/apple-wallet/pass?store_id=${storeId}&user_id=${userId}`
        );

        if (!res.ok) throw new Error("Pass generation failed");

        // 2️⃣ Create blob and force download
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setStatus("Tap below to add your stamp card to Apple Wallet");

        // Optional: Auto open
        // window.location.href = url;
      } catch (err) {
        console.error(err);
        setStatus("Something went wrong. Please try again.");
      }
    };

    fetchPass();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      <motion.div
        className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-4">Welcome to Loyaltee</h1>
        <p className="mb-4 text-gray-600 text-sm">{status}</p>

        {downloadUrl && (
          <a
            href={downloadUrl}
            download="loyaltee.pkpass"
            className="inline-block bg-black text-white py-2 px-6 rounded-xl shadow hover:bg-gray-900 transition"
          >
            Add to Apple Wallet
          </a>
        )}
      </motion.div>
    </div>
  );
}
