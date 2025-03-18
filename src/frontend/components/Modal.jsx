import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, message, type }) => {

  
	if (!isOpen) return null;

  return (
		<div className="fixed inset-0 bg-black/75 flex items-center justify-center">
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-[500px] relative">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-5 right-5 text-zinc-400 hover:text-gray-900 text-lg cursor-pointer transition-all duration-300">
					<X/>
				</button>
				<div className="">
        <img
            src={type === "success" ? "/UI/OK.svg" : "/UI/ERR.svg"}
            alt={type === "success" ? "Success Icon" : "Error Icon"}
            className="w-60 h-60 mx-auto"
          />
				</div>

				<div className="flex flex-col justify-center items-center">
					<h2
						className={`text-2xl font-semibold ${
							type === 'success' ? 'text-green-600' : 'text-red-600'
						}`}>
					{title}
					</h2>

					<p className="text-gray-700">{message}</p>

					<button
						onClick={onClose}
						className="bg-zinc-950 text-white px-3 py-3 rounded-md w-full mt-8 text-sm font-medium cursor-pointer hover:bg-zinc-900 transition-all duration-300">
						Okay
					</button>
				</div>
			</div>
		</div>
	);



  
	
};

export default Modal;
