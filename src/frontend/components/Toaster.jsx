import { useState, useEffect } from "react";

const Toaster = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Delay `onClose` to allow animation
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-5 right-5 px-4 py-3 rounded-lg shadow-lg text-zinc-900 text-sm transition-transform duration-300 ${
        visible ? "translate-x-0" : "translate-x-[120%]"
      } ${type === "success" ? "bg-white border border-zinc-300" : "bg-red-500"}`}
    >
      {message}
    </div>
  );
};

export default Toaster;
