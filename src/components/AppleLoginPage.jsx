import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function AppleLoginPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    script.onload = () => {
      window.AppleID.auth.init({
        clientId: "com.arenema.loyaltee.web",
        scope: "name email",
        redirectURI: "https://your-ngrok-url.ngrok.io/callback", // update me
        usePopup: true,
      });
    };
    document.body.appendChild(script);
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
        <p className="mb-6 text-gray-600 text-sm">
          Sign in to save your stamp card and start collecting rewards.
        </p>

        {/* Apple sign-in button wrapper */}
        <div className="flex justify-center mb-6">
          <div
            id="appleid-signin"
            data-color="black"
            data-border="true"
            data-type="sign in"
            style={{ transform: "scale(0.92)", transformOrigin: "top center" }}
          ></div>
        </div>

        <p className="text-xs text-gray-500">
          Your stamp card will be saved to Apple Wallet after login.
        </p>
      </motion.div>
    </div>
  );
}
