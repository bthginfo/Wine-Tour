import { useEffect, useRef, type RefObject } from "react";

type AccessibleDialogOptions = {
  active: boolean;
  onClose: () => void;
  ref: RefObject<HTMLElement | null>;
  closeOnEscape?: boolean;
};

let activeDialogCount = 0;
let previousRootInert = false;
let previousBodyOverflow = "";

/** Keeps modal layers above app chrome and contains keyboard focus while open. */
export function useAccessibleDialog({
  active,
  onClose,
  ref,
  closeOnEscape = true,
}: AccessibleDialogOptions) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!active) return;

    const dialog = ref.current;
    if (!dialog) return;

    const root = document.getElementById("root");
    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    if (activeDialogCount === 0) {
      previousRootInert = root?.hasAttribute("inert") ?? false;
      previousBodyOverflow = document.body.style.overflow;
      root?.setAttribute("inert", "");
      document.body.style.overflow = "hidden";
    }
    activeDialogCount += 1;

    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )).filter((element) => element.getAttribute("aria-hidden") !== "true" && element.getClientRects().length > 0);

    const focusTarget = dialog.querySelector<HTMLElement>("[data-dialog-initial-focus]") ?? focusable()[0];
    if (focusTarget) focusTarget.focus();
    else {
      dialog.setAttribute("tabindex", "-1");
      dialog.focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const targets = focusable();
      if (!targets.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = targets[0];
      const last = targets[targets.length - 1];
      const focusIsInside = dialog.contains(document.activeElement);
      if (event.shiftKey && (!focusIsInside || document.activeElement === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!focusIsInside || document.activeElement === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      activeDialogCount = Math.max(0, activeDialogCount - 1);
      if (activeDialogCount === 0) {
        if (root && !previousRootInert) root.removeAttribute("inert");
        document.body.style.overflow = previousBodyOverflow;
      }
      if (previousFocus?.isConnected && !previousFocus.hasAttribute("disabled")) previousFocus.focus();
    };
  }, [active, closeOnEscape, ref]);
}
