"use client";

import { ReactNode } from "react";
import { tv, VariantProps } from "tailwind-variants";

const table = tv({
  slots: {
    wrapper: "min-h-screen py-2 px-4 rounded-lg bg-white/50 dark:bg-neutral-700/50",
    header: "",
    title: "",
    body: "",
    footer: ""
  }
});

export interface TableProps extends VariantProps<typeof table> {
  header?: ReactNode;
  title?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
}

export  function Table({
  header,
  title,
  body,
  footer
}: TableProps){
  const styles = table();
  return(
    <div className={styles.wrapper()}>
      <div className={styles.header()} >
        {header}
      </div>
    </div>
  )
}