import { useCallback } from "react";
import { useState } from "react";

export default function UseVisibility(initialOpacity = false) {
  const [visible, setVisible] = useState(initialOpacity);

  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);
  const toggle = useCallback(() => setVisible((v) => !v), []);

  return {visible, show, hide, toggle};
}