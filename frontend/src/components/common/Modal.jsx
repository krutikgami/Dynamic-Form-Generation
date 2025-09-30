export default function Modal({
  isOpen,
  onClose, 
  message = "Are you sure?",
  actionButtons = [], 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <p className="text-gray-800 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>

          {actionButtons.map((btn, idx) => (
            <button
              key={idx}
              onClick={async () => {
                await btn.onClick?.();
                onClose(); 
              }}
              className={`px-4 py-2 rounded-lg ${
                btn.className || "bg-blue-500 text-white"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
