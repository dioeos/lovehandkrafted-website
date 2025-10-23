import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion"; // optional polish (already in many setups)

const ConfirmModal = ({ visible, product, action, onCancel, onConfirm }) => {
  if (!visible || !product) return null;

  const actionLabel =
    action === "delete"
      ? "Delete"
      : action === "deactivate"
        ? product.active
          ? "Deactivate"
          : "Activate"
        : "Confirm";

  const isDestructive = action === "delete";
  const isDeactivate = action === "deactivate" && product.active;

  const message =
    action === "delete"
      ? `Are you sure you want to permanently delete “${product.name}”? This action cannot be undone.`
      : isDeactivate
        ? `Are you sure you want to deactivate “${product.name}”? It will no longer appear to customers.`
        : `Are you sure you want to activate “${product.name}”? It will become visible to customers.`;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <>
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* Modal Content */}
          <motion.div
            className="fixed inset-0 z-[2001] flex items-center justify-center px-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-stone-200">
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-stone-100">
                <h2 className="text-lg font-semibold text-stone-800">
                  Confirm {actionLabel}
                </h2>
                <button
                  onClick={onCancel}
                  className="text-stone-400 hover:text-stone-600 text-xl leading-none"
                >
                  &times;
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-4">
                <p className="text-sm text-stone-700 leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 px-5 py-4 bg-stone-50 rounded-b-xl border-t border-stone-100">
                <button
                  onClick={onCancel}
                  className="px-4 py-1.5 text-sm rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onConfirm(product, action)}
                  className={`px-4 py-1.5 text-sm rounded-md text-white transition-colors ${
                    isDestructive
                      ? "bg-red-600 hover:bg-red-700"
                      : isDeactivate
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {actionLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default ConfirmModal;
