import React from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

export type Tone = "brand" | "danger" | "neutral";
export type Mode = "alert" | "confirm";

const toneStyles: Record<
  Tone,
  { ring: string; iconWrap: string; iconColor: string; title: string }
> = {
  brand: {
    ring: "ring-[#E5B97C]/50",
    iconWrap: "bg-[#E5B97C]/20",
    iconColor: "text-[#6B3A1E]",
    title: "text-[#6B3A1E]",
  },
  danger: {
    ring: "ring-red-200",
    iconWrap: "bg-red-50",
    iconColor: "text-red-600",
    title: "text-[#6B3A1E]",
  },
  neutral: {
    ring: "ring-gray-200",
    iconWrap: "bg-gray-50",
    iconColor: "text-gray-600",
    title: "text-[#6B3A1E]",
  },
};

type ModalData = {
  title: string;
  message: React.ReactNode;
  mode: Mode;
  tone: Tone;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
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
        className={`relative w-full sm:w-[520px] mx-auto rounded-2xl bg-white shadow-2xl ring-1 ${s.ring} p-6 sm:p-8`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 rounded-md hover:bg-[#F8F6F3] text-[#6B3A1E]/70 hover:text-[#6B3A1E] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 ${s.iconWrap} rounded-full flex items-center justify-center shrink-0`}
          >
            {data.tone === "danger" ? (
              <AlertTriangle className={`w-6 h-6 ${s.iconColor}`} />
            ) : (
              <CheckCircle2 className={`w-6 h-6 ${s.iconColor}`} />
            )}
          </div>
          <div className="min-w-0">
            <h3 className={`text-lg font-semibold ${s.title}`}>{data.title}</h3>
            <div className="mt-2 text-[15px] text-[#6B3A1E]/80 leading-relaxed">
              {data.message}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 sm:mt-8 flex items-center justify-end gap-3">
          {data.mode === "confirm" && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-[#D9CBBE] text-[#6B3A1E] bg-[#F8F6F3] hover:bg-[#FCEFD6] transition-all duration-200"
            >
              {data.cancelText ?? "Cancel"}
            </button>
          )}
          <button
            type="button"
            onClick={async () => {
              try {
                await data.onConfirm?.();
              } finally {
                onClose();
              }
            }}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200
              ${
                data.tone === "danger"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-[#6B3A1E] text-[#FCEFD6] hover:bg-[#8B4A2A]"
              }`}
          >
            {data.confirmText ?? (data.mode === "confirm" ? "Confirm" : "OK")}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Hook for using modal */
export function useBrandedModal() {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<ModalData | null>(null);

  const openAlert = React.useCallback(
    (title: string, message: React.ReactNode, tone: Tone = "brand") => {
      setData({ title, message, mode: "alert", tone });
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
      onConfirm: () => void | Promise<void>;
    }) => {
      setData({
        title: opts.title,
        message: opts.message,
        mode: "confirm",
        tone: opts.tone ?? "brand",
        confirmText: opts.confirmText,
        cancelText: opts.cancelText,
        onConfirm: opts.onConfirm,
      });
      setOpen(true);
    },
    []
  );

  const close = React.useCallback(() => setOpen(false), []);

  const Modal = <BrandedModalUI open={open} onClose={close} data={data} />;

  return { Modal, openAlert, openConfirm, close };
}
