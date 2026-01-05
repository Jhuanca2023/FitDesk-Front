import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/shared/components/ui/button';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { UpdatePlanRequest } from '@/core/interfaces/plan.interface';


export type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; 
  isActive: boolean;
  features: string[];
  isPopular?: boolean;
  currency?: string;
};

type ColumnsProps = (
  handleEdit: (plan: UpdatePlanRequest) => void,
  handleDelete: (id: string) => void
) => ColumnDef<Plan>[];

export const columns: ColumnsProps = (handleEdit, handleDelete) => [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Descripción',
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">
        {row.getValue('description')}
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: 'Precio',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'duration',
    header: 'Duración (meses)',
  },
  {
    accessorKey: 'isActive',
    header: 'Estado',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive');
      return (
        <div className="flex items-center">
          <div
            className={`h-2.5 w-2.5 rounded-full mr-2 ${
              isActive ? 'bg-green-500' : 'bg-gray-500'
            }`}
          />
          {isActive ? 'Activo' : 'Inactivo'}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const plan = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(plan)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => handleDelete(plan.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
