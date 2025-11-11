import React from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

export type Tone = "brand" | "danger" | "neutral";
export type Mode = "alert" | "confirm";

const toneStyles: Record<
  Tone,
  { ring: string; iconWrap: string; iconColor: string; title: string }
> = {
  brand: {
    ring: "ring-brand-200",
    iconWrap: "bg-brand-50",
    iconColor: "text-brand-600",
    title: "text-gray-900",
  },
  danger: {
    ring: "ring-red-200",
    iconWrap: "bg-red-50",
    iconColor: "text-red-600",
    title: "text-gray-900",
  },
  neutral: {
    ring: "ring-gray-200",
    iconWrap: "bg-gray-50",
    iconColor: "text-gray-600",
    title: "text-gray-900",
  },
};

type ModalData = {
  title: string;
  message: React.ReactNode;
  mode: Mode;
  tone: Tone;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
};

function BrandedModalUI({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: ModalData | null;
}) {
  if (!open || !data) return null;
  const s = toneStyles[data.tone];

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/40"
        aria-hidden="true"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full sm:w-[520px] mx-auto rounded-xl bg-white shadow-xl ring-1 ${s.ring} p-5 sm:p-6`}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 p-1 rounded-md hover:bg-gray-100 text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3 sm:gap-4">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 ${s.iconWrap} rounded-full flex items-center justify-center shrink-0`}
          >
            {data.tone === "danger" ? (
              <AlertTriangle className={`w-6 h-6 ${s.iconColor}`} />
            ) : (
              <CheckCircle2 className={`w-6 h-6 ${s.iconColor}`} />
            )}
          </div>
          <div className="min-w-0">
            <h3 className={`text-base sm:text-lg font-semibold ${s.title}`}>
              {data.title}
            </h3>
            <div className="mt-1 sm:mt-2 text-sm sm:text-[15px] text-gray-700">
              {data.message}
            </div>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 flex items-center justify-end gap-2">
          {data.mode === "confirm" && (
            <button
              onClick={onClose}
              className="btn-outline px-4 py-2 rounded-lg text-sm font-medium"
            >
              {data.cancelText ?? "Cancel"}
            </button>
          )}
          <button
            onClick={() => {
              data.onConfirm?.();
              onClose();
            }}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-medium ${
              data.tone === "danger"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "btn-primary"
            }`}
          >
            {data.confirmText ?? (data.mode === "confirm" ? "Confirm" : "OK")}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Hook that returns a modal element and helpers to open it */
export function useBrandedModal() {
  const [open, setOpen] = React.useState(false);
  const dataRef = React.useRef<ModalData | null>(null);

  const openAlert = React.useCallback(
    (title: string, message: React.ReactNode, tone: Tone = "brand") => {
      dataRef.current = { title, message, mode: "alert", tone };
      setOpen(true);
    },
    []
  );

  const openConfirm = React.useCallback(
    (opts: {
      title: string;
      message: React.ReactNode;
      tone?: Tone;
      confirmText?: string;
      cancelText?: string;
      onConfirm: () => void;
    }) => {
      dataRef.current = {
        title: opts.title,
        message: opts.message,
        mode: "confirm",
        tone: opts.tone ?? "brand",
        confirmText: opts.confirmText,
        cancelText: opts.cancelText,
        onConfirm: opts.onConfirm,
      };
      setOpen(true);
    },
    []
  );

  const close = React.useCallback(() => setOpen(false), []);

  const Modal = (
    <BrandedModalUI open={open} onClose={close} data={dataRef.current} />
  );

  return { Modal, openAlert, openConfirm, close };
}
