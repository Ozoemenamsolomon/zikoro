import React from "react";
import { Close } from "styled-icons/evaicons-solid";

type TOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
};

const Overlay = ({ isOpen, onClose, title, children }: TOverlayProps) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 py-4 max-h-screen">
          <div className="bg-white p-4 rounded-md max-w-lg w-full relative max-h-full overflow-auto no-scrollbar">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="font-semibold text-slate-800 text-lg">{title}</h2>
              <button
                className="text-gray-700 hover:text-slate-900"
                onClick={onClose}
              >
                <Close className="w-5 h-5" />
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Overlay;
