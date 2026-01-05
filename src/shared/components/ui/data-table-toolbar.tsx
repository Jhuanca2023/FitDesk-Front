import type { Table } from '@tanstack/react-table';
import { Input } from './input';
import { Search } from 'lucide-react';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey: string;
  searchPlaceholder?: string;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = 'Buscar...',
}: DataTableToolbarProps<TData>) {
  const column = table.getColumn(searchKey);
  
  if (!column) {
    console.warn(`Column with id '${searchKey}' not found in the table.`);
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={(column.getFilterValue() as string) ?? ''}
            onChange={(event) => column.setFilterValue(event.target.value)}
            className="h-8 pl-8 w-[150px] lg:w-[250px]"
          />
        </div>
      </div>
    </div>
  );
}
