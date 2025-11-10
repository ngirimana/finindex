import { useEffect } from "react";

export function useCoffeeBrandTheme() {
  useEffect(() => {
    const style = document.createElement("style");
    style.setAttribute("data-coffee-brand", "true");
    style.textContent = `
      :root {
        --brand-700: #5a2f1e;
        --brand-600: #6b3b26;
        --brand-500: #7a4932;
        --sand-200: #e9d8c6;
        --sand-100: #f3e7d8;
        --sand-50:  #f8f0e6;
        --cream:    #faf5ef;
        --ink:      #2b211d;
        --muted:    #6a5b53;
      }
      .bg-brand-600 { background-color: var(--brand-600); color:#fff; }
      .bg-brand-700 { background-color: var(--brand-700); color:#fff; }
      .text-brand-600 { color: var(--brand-600); }
      .panel-soft { background-color: var(--sand-50); }
      .chip-cream { background: var(--sand-100); color:#3a2c25; }
      .chip-sand  { background: var(--sand-200); color:#3a2c25; }
      .btn-primary { background: var(--brand-600); color:#fff; }
      .btn-primary:hover { background: var(--brand-700); }
      .btn-outline { background:#fff; border:1px solid var(--brand-600); color:var(--brand-600); }
      .btn-outline:hover { background: var(--sand-100); }
      .startup-card input:focus, .startup-card select:focus, .startup-card textarea:focus {
        outline: none; border-color: var(--brand-600);
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--brand-600) 30%, transparent);
      }
      .startup-card .info-row { background: var(--cream); border: 1px solid #e5ddd5; }
      .startup-card h3, .startup-card .text-gray-900 { color: var(--ink); }
      .startup-card p, .startup-card .text-gray-700, .startup-card .text-gray-800 { color: var(--muted); }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
}
