import { useState, useEffect } from "react";

const Toaster = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 3000); // Auto-hide after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible || !message) return null;

  return (
    <div
      className={`fixed top-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white text-sm ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
};

export default Toaster;
