import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  hideOnMobile?: boolean;
  isPrimary?: boolean;
  isStatus?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface ResponsiveTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  rowActions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  isLoading?: boolean;
  className?: string;
  onRowClick?: (item: T) => void;
  title?: string;
}

export function ResponsiveTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  rowActions,
  emptyMessage = 'No records found',
  isLoading = false,
  className,
  onRowClick,
  title,
}: ResponsiveTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [activeKebabId, setActiveKebabId] = useState<string | null>(null);

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const primaryCol = columns.find((c) => c.isPrimary) || columns[0];
  const statusCol = columns.find((c) => c.isStatus);
  const mobileVisibleCols = columns.filter((c) => !c.hideOnMobile && c.key !== primaryCol.key && c.key !== statusCol?.key);

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-stone-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white rounded-2xl border border-stone-200">
        <p className="text-sm font-semibold text-stone-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {title && (
        <div className="px-1 py-2 font-bold text-sm text-[#4A2C17] font-heading md:hidden">
          {title} ({data.length})
        </div>
      )}

      {/* MOBILE: Stacked Cards View (hidden on md and above) */}
      <div className="space-y-3 md:hidden">
        {data.map((item) => {
          const id = String(item[keyField]);
          const isExpanded = !!expandedRows[id];

          return (
            <div
              key={id}
              onClick={() => onRowClick && onRowClick(item)}
              className={cn(
                'bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs transition-all relative',
                onRowClick && 'cursor-pointer active:bg-amber-50/40'
              )}
            >
              {/* Card Header: Primary title + Status badge + Action/Kebab */}
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-stone-100">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-[#4A2C17] truncate">
                    {primaryCol.render ? primaryCol.render(item) : item[primaryCol.key]}
                  </div>
                  <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                    ID: {id}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {statusCol && (
                    <div>
                      {statusCol.render ? statusCol.render(item) : item[statusCol.key]}
                    </div>
                  )}

                  {rowActions && (
                    <div className="relative">
                      <button
                        type="button"
                        aria-label="Row options"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveKebabId(activeKebabId === id ? null : id);
                        }}
                        className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeKebabId === id && (
                        <div
                          className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-30"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {rowActions(item)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Key Fields Grid */}
              <div className="grid grid-cols-2 gap-2.5 py-3 text-xs">
                {mobileVisibleCols.slice(0, 4).map((col) => (
                  <div key={col.key} className="min-w-0">
                    <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                      {col.header}
                    </span>
                    <span className="font-medium text-stone-800 break-words mt-0.5 block">
                      {col.render ? col.render(item) : item[col.key]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Expandable Details for remaining fields */}
              {mobileVisibleCols.length > 4 && (
                <div>
                  {isExpanded && (
                    <div className="grid grid-cols-2 gap-2.5 pt-2 pb-3 border-t border-dashed border-stone-100 text-xs">
                      {mobileVisibleCols.slice(4).map((col) => (
                        <div key={col.key} className="min-w-0">
                          <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                            {col.header}
                          </span>
                          <span className="font-medium text-stone-800 break-words mt-0.5 block">
                            {col.render ? col.render(item) : item[col.key]}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => toggleRow(id, e)}
                    className="w-full flex items-center justify-center gap-1 pt-1.5 text-center text-xs font-bold text-amber-700 hover:text-amber-800"
                  >
                    <span>{isExpanded ? 'Show less' : 'View more details'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* DESKTOP / TABLET: Full Table View with Sticky Header (hidden below md) */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-stone-200/90 shadow-2xs bg-white">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#FFFDF9] border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[11px] sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3.5 whitespace-nowrap',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
              {rowActions && <th className="px-4 py-3.5 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium">
            {data.map((item) => {
              const id = String(item[keyField]);

              return (
                <tr
                  key={id}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={cn(
                    'hover:bg-amber-50/40 transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3 text-stone-800',
                        col.align === 'right' && 'text-right font-mono',
                        col.align === 'center' && 'text-center',
                        col.className
                      )}
                    >
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {rowActions(item)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
