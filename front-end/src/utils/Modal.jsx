import { Dialog } from "@headlessui/react";
import { createPortal } from "react-dom";

export default function Modal({
  open,
  onClose,
  onConfirm,
  titulo,
  descricao,
}) {
  if (!open) return null;

  return createPortal(
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-sm">
          <Dialog.Title className="text-lg font-semibold">
            {titulo}
          </Dialog.Title>

          <p className="my-5 text-sm text-gray-600">{descricao}</p>

          <div className="mt-6 flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancelar
            </button>

            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Confirmar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>,
    document.body
  );
}
