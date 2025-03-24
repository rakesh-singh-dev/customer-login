import React, { useEffect } from "react";

const Login = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    script.onload = () => {
      window.AppleID.auth.init({
        clientId: "com.arenema.loyaltee.web", // Your Service ID
        scope: "name email",
        redirectURI: "https://your-ngrok-url.ngrok.io/callback", // change this
        usePopup: true,
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Loyaltee</h1>
        <p className="mb-6 text-gray-600 text-sm">
          Sign in to save your stamp card and start collecting rewards.
        </p>

        <div id="appleid-signin"
             data-color="black"
             data-border="true"
             data-type="sign in">
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Your stamp card will be saved to Apple Wallet after login.
        </p>
      </div>
    </div>
  );
};

export default Login;
