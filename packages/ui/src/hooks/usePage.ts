"use client";

import { useState } from "react";

export function UsePage(initialPage = 1) {
  const [page, setPage] = useState(initialPage);

  return {page, setPage};
}