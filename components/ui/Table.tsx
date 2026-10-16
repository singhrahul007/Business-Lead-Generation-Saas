import React from 'react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No records found.',
  isLoading = false,
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-400">
        <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        <span className="ml-3 text-sm">Loading records…</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/50">
      <table className="w-full text-left text-sm text-slate-200">
        <thead className="border-b border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope="col" className={`px-4 py-3.5 ${column.className || ''}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className="transition hover:bg-white/[0.02]"
            >
              {columns.map((column, index) => (
                <td key={index} className={`px-4 py-3.5 ${column.className || ''}`}>
                  {column.cell
                    ? column.cell(item)
                    : column.accessorKey
                    ? String(item[column.accessorKey] ?? '')
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

