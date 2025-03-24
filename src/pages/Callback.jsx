// src/pages/Callback.tsx

import { useEffect } from "react";

const Callback = () => {
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const id_token = url.searchParams.get("id_token");

    if (id_token) {
      console.log("🍎 Apple ID Token:", id_token);
      // You can send this to backend for user validation + issue your JWT
    } else {
      console.error("❌ Apple login failed");
    }
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <p>Verifying your identity...</p>
    </div>
  );
};

export default Callback;
