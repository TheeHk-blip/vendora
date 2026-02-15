"use client";

import React from "react";
import { tv, VariantProps } from "tailwind-variants";

const table = tv({
  slots: {
    wrapper:
      "w-full rounded-lg bg-white/50 dark:bg-neutral-800/50 overflow-hidden shadow-sm",
    header: "px-4 py-3 border-b border-neutral-300/50 dark:border-neutral-600/50",
    title:
      "px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200",
    table: "w-full",
    headRow:
      "grid gap-2 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider",
    headCell: "font-medium truncate",
    body: "divide-y divide-neutral-200 dark:divide-neutral-600",
    row:
      "grid gap-2 px-2 py-2 items-center hover:bg-neutral-100/60 dark:hover:bg-neutral-800/70 cursor-default",
    cell: "text-sm text-gray-700 dark:text-gray-200 truncate",
    actions: "flex items-center justify-end gap-2",
    empty: "p-6 text-center text-sm text-neutral-500",
    loading: "p-6 text-center text-sm text-neutral-500",
    footer: "px-4 py-3 border-t border-neutral-300/50 dark:border-neutral-600/50 bg-gray-50/60 dark:bg-neutral-900/30 flex items-center justify-between"
  },
  variants: {
    size: {
      sm: {},
      md: {},
      lg: {}
    }
  },
  defaultVariants: {
    size: "md"
  }
});

export interface Column<T> {
  key: string;
  title?: React.ReactNode;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

export interface TableProps<T> extends VariantProps<typeof table> {
  header?: React.ReactNode;
  title?: React.ReactNode;
  columns: Column<T>[];
  data?: T[];
  rowKey?: keyof T | ((row: T) => string | number);
  loading?: boolean;
  empty?: React.ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;

  /* Pagination */
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (next: number) => void;
  renderFooter?: (meta: {
    page: number;
    pageSize: number;
    total?: number;
    onPageChange?: (next: number) => void;
  }) => React.ReactNode;
}

export function Table<T>({
  header,
  title,
  columns,
  data = [],
  rowKey,
  loading,
  empty,
  onRowClick,
  size,
  className,
  page = 1,
  pageSize = 12,
  total,
  onPageChange,
  renderFooter
}: TableProps<T>) {
  const styles = table({ size });

  const getRowKey = (row: T, idx: number) => {
    if (typeof rowKey === "function") return String(rowKey(row));
    const k = rowKey as keyof T;
    // @ts-ignore
    return String((row as any)[k] ?? (row as any).id ?? idx);
  };

  const columnsCount = Math.max(1, columns.length);
  const gridTemplate = { gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))` };
  const pageData = data.slice((page - 1) * pageSize, page * pageSize);

  const renderDefaultFooter = () => {
    const totalCount = typeof total === "number" ? total: data.length;
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalCount);
    const maxPage = Math.ceil(totalCount / pageSize);

    return (
      <div className="w-full flex items-center justify-between">
        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          {totalCount > 0
            ? `Showing ${start} - ${end} of ${totalCount}`
            : `Page ${page}`
          }        
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange?.(Math.max(1, page - 1))}
            disabled={page <= 1 || !onPageChange}
            className="px-3 py-1 rounded-md bg-white/30 border disabled:opacity-50 text-sm"
            aria-label="Previous page"
          >
            Prev
          </button>

          <div className="px-2 text-sm">{page}</div>

          <button
            type="button"
            onClick={() => onPageChange?.(page + 1)}
            disabled={page >= maxPage || !onPageChange}
            className="px-3 py-1 rounded-md bg-white/30 border disabled:opacity-50 text-sm"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.wrapper()} ${className ?? ""}`}>
      {header && <div className={styles.header()}>{header}</div>}

      {title && <div className={styles.title()}>{title}</div>}

      <div className={styles.table()}>
        <div className={styles.headRow()} style={gridTemplate as React.CSSProperties}>
          {columns.map((col) => (
            <div
              key={col.key}
              className={`${styles.headCell()} ${col.className ?? ""}`}
              title={typeof col.title === "string" ? col.title : undefined}
            >
              {col.title ?? col.key}
            </div>
          ))}
        </div>

        <div className={styles.body()}>
          {loading ? (
            <div className={styles.loading()}>Loading…</div>
          ) : data.length === 0 ? (
            <div className={styles.empty()}>{empty ?? "No results"}</div>
          ) : (
            pageData.map((row, idx) => (
              <div
                key={getRowKey(row, idx)}
                className={`${styles.row()}`}
                style={gridTemplate as React.CSSProperties}
                onClick={() => onRowClick?.(row)}
                role={onRowClick ? "button" : undefined}
              >
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className={`${styles.cell()} ${col.className ?? ""}`}
                  >
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      <div className={styles.footer()}>
        {renderFooter
          ? renderFooter({ page, pageSize, total, onPageChange })
          : renderDefaultFooter()
        }
      </div>
    </div>
  );
}