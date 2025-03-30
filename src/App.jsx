// import React from "react";
// import WalletPassPage from "./components/WalletPassPage";
// // import AppleLoginPage from "./components/AppleLoginPage"; // Not needed now

// function App() {
//   const searchParams = new URLSearchParams(window.location.search);
//   const storeId = searchParams.get("store_id");

//   if (storeId) {
//     return <WalletPassPage />;
//   }

//   // Optional fallback for direct visits with no store_id
//   return (
//     <div className="flex items-center justify-center min-h-screen text-center p-4">
//       <div>
//         <h1 className="text-2xl font-semibold">Loyaltee</h1>
//         <p className="text-gray-600 mt-2">
//           Please scan a valid QR code from a participating store to get started.
//         </p>
//       </div>
//     </div>
//   );
// }

// export default App;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Wallet } from 'lucide-react';

// Custom Button Component
const Button = ({ children, onClick, variant = 'default', className = '' }) => {
  const baseStyles = "px-4 py-2 rounded-lg transition-colors focus:outline-none";
  
  const variantStyles = {
    default: "bg-amber-600 text-white hover:bg-amber-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Main App Component
const CoffeeStampCardApp = () => {
  const [currentPage, setCurrentPage] = useState('purchase');
  const [purchaseCount, setPurchaseCount] = useState(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-4">
      {currentPage === 'purchase' && (
        <PurchasePage 
          purchaseCount={purchaseCount} 
          setPurchaseCount={setPurchaseCount} 
          onNextPage={() => setCurrentPage('wallet')} 
        />
      )}
      {currentPage === 'wallet' && (
        <WalletPage 
          purchaseCount={purchaseCount} 
          onBack={() => setCurrentPage('purchase')} 
        />
      )}
    </div>
  );
};

// Purchase Page Component
const PurchasePage = ({ purchaseCount, setPurchaseCount, onNextPage }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      <div className="bg-white shadow-2xl rounded-lg p-6 border-2 border-amber-200">
        <div className="flex items-center gap-2 text-2xl text-amber-800 mb-6">
          <Coffee className="w-8 h-8" /> Coffee Purchase
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="outline"
              onClick={() => setPurchaseCount(Math.max(1, purchaseCount - 1))}
              className="w-10 h-10 flex items-center justify-center rounded-full"
            >
              -
            </Button>
            <input 
              type="number" 
              value={purchaseCount} 
              readOnly
              className="w-16 text-center text-3xl font-bold bg-transparent border-b-2 border-amber-500 focus:outline-none rounded-none"
            />
            <Button 
              variant="outline"
              onClick={() => setPurchaseCount(Math.min(9, purchaseCount + 1))}
              className="w-10 h-10 flex items-center justify-center rounded-full"
            >
              +
            </Button>
          </div>
          <Button 
            onClick={onNextPage} 
            className="w-full rounded-lg"
          >
            Generate Stamp Card
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Wallet Page Component
const WalletPage = ({ purchaseCount, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [passUrl, setPassUrl] = useState(null);
  const [error, setError] = useState(null);

  const generatePasskit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://83qu8fv5df.execute-api.ap-southeast-2.amazonaws.com/dev/api/apple-wallet/pass?count=${purchaseCount}`
      );

      if (!response.ok) throw new Error('Failed to generate pass');

      const data = await response.json();
      setPassUrl(data.url);

      // Open Apple Wallet pass
      window.location.href = data.url;
    } catch (err) {
      console.error('Error generating pass:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      <div className="bg-white shadow-2xl rounded-lg p-6 border-2 border-green-200">
        <div className="flex items-center gap-2 text-2xl text-green-800 mb-6">
          <Wallet className="w-8 h-8" /> Stamp Card
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, index) => (
              <div 
                key={index} 
                className={`h-12 rounded-lg ${
                  index < purchaseCount 
                    ? 'bg-green-500' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              onClick={onBack} 
              className="flex-1 rounded-lg"
            >
              Back
            </Button>
            <Button 
              onClick={generatePasskit} 
              className="flex-1 rounded-lg"
            >
              {loading ? 'Loading...' : 'Add to Wallet'}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CoffeeStampCardApp;