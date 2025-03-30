import { useEffect, useState } from "react";
import { X } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Animate modal appearance
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 200); // Matches transition duration
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/75 transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`relative w-full max-w-lg transform rounded-lg bg-white p-6 shadow-lg transition-all duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Close Button */}
        {/* <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 transition-all duration-300 hover:text-gray-900"
        >
          <X />
        </button> */}

        {/* Title & Message */}
        <div className="text-left">
          <h2 className="text-xl font-semibold text-zinc-950">{title}</h2>
          <p className="mt-2 text-sm text-zinc-500">{message}</p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="w-fit cursor-pointer rounded-md border border-zinc-200 bg-white px-5 py-2 text-sm text-black shadow-2xs transition-all duration-300 hover:bg-zinc-100"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="w-fit cursor-pointer rounded-md bg-zinc-900 px-4 py-2 text-sm text-white shadow-2xs transition-all duration-300 hover:bg-zinc-800"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
