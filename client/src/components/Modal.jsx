import React from 'react'

const Modal = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center p-6 z-50"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-gray-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-end">
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition"
          onClick={onClose}
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>
      {children}
    </motion.div>
  </motion.div>
);


export default Modal