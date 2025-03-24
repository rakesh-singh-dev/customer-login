import React, { useEffect } from "react";
import { motion } from "framer-motion";

// 👇 Update these
const BACKEND_URL = "https://iazivtkf12.execute-api.eu-north-1.amazonaws.com/default/api"; // your deployed backend
const STORE_ID = "be894d15-fa0d-4f8b-b139-693d5b40fb56";

export default function AppleLoginPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    script.onload = () => {
      window.AppleID.auth.init({
        clientId: "com.arenema.loyaltee.web",
        scope: "name email",
        redirectURI: `${BACKEND_URL}/callback`, // not used if popup=true
        usePopup: true,
      });
    };
    document.body.appendChild(script);
  }, []);

  const handleLogin = async () => {
    try {
      const response = await window.AppleID.auth.signIn();
      const id_token = response.authorization.id_token;
      const name = response.user?.name?.firstName || "Customer";

      // Step 1: Send token to backend
      const signinRes = await fetch(`${BACKEND_URL}/auth/apple/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token, name }),
      });

      if (!signinRes.ok) {
        throw new Error("Apple login failed");
      }

      const { user_id } = await signinRes.json();

      // Step 2: Fetch the Wallet Pass
      const passRes = await fetch(
        `${BACKEND_URL}/apple-wallet/pass?store_id=${STORE_ID}&user_id=${user_id}`
      );

      if (!passRes.ok) {
        throw new Error("Failed to fetch Apple Wallet pass");
      }

      // Step 3: Open the pass (browser will prompt Add to Wallet)
      const blob = await passRes.blob();
      const url = window.URL.createObjectURL(blob);
      window.location.href = url;
    } catch (err) {
      console.error("Login flow error:", err);
      alert("Something went wrong during login. Please try again.");
    }
  };

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
        <p className="mb-6 text-gray-600 text-sm">
          Sign in to save your stamp card and start collecting rewards.
        </p>

        {/* Custom Apple login trigger */}
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-2 border border-gray-800 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-800 hover:text-white transition mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M16.365 1.43c0 1.14-.45 2.11-1.35 2.9-.89.78-1.78 1.17-2.665 1.17-.11-.99.23-1.93 1.015-2.82.79-.89 1.71-1.35 2.765-1.35.08.03.17.04.24.1.09.05.13.14.17.22.03.05.04.11.04.17zM13.4 6.75c1.55 0 2.715.7 3.5 2.09-.93.48-1.575 1.15-1.94 2-.33.78-.405 1.58-.215 2.4.24 1.02.76 1.85 1.56 2.5-.58.9-1.2 1.58-1.875 2.02-.735.48-1.52.73-2.35.73-.6 0-1.305-.12-2.105-.36-.825-.24-1.54-.36-2.15-.36-.66 0-1.38.12-2.155.36-.825.24-1.545.36-2.165.36-.84 0-1.65-.26-2.43-.78C1.515 17.9.93 17.14.39 16.21-.135 15.23-.38 14.2-.345 13.12c.045-1.32.485-2.46 1.32-3.42.87-1.02 1.89-1.57 3.065-1.65.675-.06 1.575.15 2.7.63.93.39 1.53.58 1.8.58.21 0 .86-.2 1.945-.6.99-.39 1.81-.57 2.46-.54z" />
          </svg>
          Sign in with Apple
        </button>

        <p className="text-xs text-gray-500">
          Your stamp card will be saved to Apple Wallet after login.
        </p>
      </motion.div>
    </div>
  );
}
