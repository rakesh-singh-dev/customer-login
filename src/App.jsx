import React from "react";
import WalletPassPage from "./components/WalletPassPage";
// import AppleLoginPage from "./components/AppleLoginPage"; // Not needed now

function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const storeId = searchParams.get("store_id");

  if (storeId) {
    return <WalletPassPage />;
  }

  // Optional fallback for direct visits with no store_id
  return (
    <div className="flex items-center justify-center min-h-screen text-center p-4">
      <div>
        <h1 className="text-2xl font-semibold">Loyaltee</h1>
        <p className="text-gray-600 mt-2">
          Please scan a valid QR code from a participating store to get started.
        </p>
      </div>
    </div>
  );
}

export default App;
