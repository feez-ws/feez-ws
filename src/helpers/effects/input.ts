import { useEffect } from "react";

// Use this effect instead of the `autoFocus` property to avoid
// server side rendering putting the MUI component into a weird state
// where the input is focused but the label is not positioned correctly.
export const useAutoFocus = (selector: string) => {
  useEffect(() => {
    const input = document.querySelector(selector);

    if (input instanceof HTMLInputElement) {
      input.focus();
    }
  }, []);
};
