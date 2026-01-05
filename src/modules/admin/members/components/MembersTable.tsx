import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { cn } from '@/core/lib/utils';

import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

import { Badge } from '@/shared/components/ui/badge';
import type { Member } from '@/core/interfaces/member.interface';
import { getMembershipStatusLabel, getMembershipStatusVariant } from '../utils/status.util';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { MemberTableSkeleton } from './MemberTableSkeleton';
import { useQueryClient } from '@tanstack/react-query';
import { MemberService } from '@/core/services/member.service';


interface MembersTableProps {
  members: Member[];
  isLoading: boolean;
  onView?: (member: Member) => void;
  onStatusChange?: (memberId: string, currentStatus: string | null) => void;
  showActions?: boolean;
  className?: string;
  selectedRows: Set<string>;
  onSelectionChange: (selection: Set<string>) => void;
}


export function MembersTable({
  members,
  isLoading,
  onView,
  onStatusChange,
  showActions = true,
  className = '',
  selectedRows,
  onSelectionChange,
}: MembersTableProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handlePrefetchMember = (memberId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['members', 'detail', memberId],
      queryFn: () => MemberService.getMemberByIdWithSecurity(memberId),
      staleTime: 10 * 60 * 1000,
    });
  };




  const columns = useMemo<ColumnDef<Member>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
              if (value) {
                onSelectionChange(new Set(members.map((m) => m.userId)));
              } else {
                onSelectionChange(new Set());
              }
            }}
            aria-label="Seleccionar todos"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedRows.has(row.original.userId)}
            onCheckedChange={(value) => {
              const newSelection = new Set(selectedRows);
              if (value) {
                newSelection.add(row.original.userId);
              } else {
                newSelection.delete(row.original.userId);
              }
              onSelectionChange(newSelection);
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Seleccionar ${row.original.firstName} ${row.original.lastName}`}
          />
        ),
        size: 40,
      },
      {
        id: 'avatar',
        header: 'Avatar',
        cell: ({ row }) => (
          <Avatar>
            <AvatarImage src={row.original.profileImageUrl ?? 'd'} alt={row.original.firstName} />
            <AvatarFallback> {row.original.initials} </AvatarFallback>
          </Avatar>
        ),
        size: 50,
      },
      {
        accessorKey: 'firstName',
        header: 'Nombre',
        cell: ({ row }) => (
          <div>
            <div className="font-medium">
              {row.original.firstName} {row.original.lastName}
            </div>
            <div className="text-xs text-muted-foreground">
              {row.original.dni || 'Sin DNI'}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Contacto',
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.phone || 'Sin teléfono'}</div>
            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
              {row.original.email || 'Sin email'}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'membership',
        header: 'Membresía',
        cell: ({ row }) => {
          const membership = row.original.membership;
          if (!membership) {
            return <Badge variant="outline">Sin membresía</Badge>;
          }
          return (
            <div>
              <Badge variant={getMembershipStatusVariant(membership.status)}>
                {getMembershipStatusLabel(membership.status)}
              </Badge>
              <div className="text-xs text-muted-foreground mt-1">
                {membership.planName}
              </div>
            </div>
          );
        },
      },
      {
        id: 'daysRemaining',
        header: 'Días restantes',
        cell: ({ row }) => {
          const membership = row.original.membership;
          if (!membership) return <span className="text-muted-foreground">-</span>;
          return (
            <div className="text-sm">
              <span className={cn(
                "font-medium",
                membership.daysRemaining < 7 && "text-destructive",
                membership.daysRemaining < 15 && membership.daysRemaining >= 7 && "text-yellow-600"
              )}>
                {membership.daysRemaining}
              </span>
              {' días'}
            </div>
          );
        },
      },
      {
        id: 'endDate',
        header: 'Vencimiento',
        cell: ({ row }) => {
          const membership = row.original.membership;
          if (!membership?.endDate) return <span className="text-muted-foreground">-</span>;
          try {
            return (
              <div className="text-sm">
                {format(new Date(membership.endDate), 'dd MMM yyyy', { locale: es })}
              </div>
            );
          } catch {
            return <span className="text-muted-foreground">-</span>;
          }
        },
      },
      ...(showActions
        ? [
          {
            id: 'actions',
            header: '',
            cell: () => (
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0 mr-2">
                <Eye className="h-4 w-4" />
              </Button>
            ),
            size: 50,
          } as ColumnDef<Member>,
        ]
        : []),
    ],
    [members, selectedRows, onSelectionChange, showActions, onView, onStatusChange, navigate]
  );

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <MemberTableSkeleton showActions={showActions} />;


  return (
    <div className={className}>
      {selectedRows.size > 0 && (
        <div className="flex items-center justify-between mb-4 p-2 bg-muted/50 rounded-md">
          <div className="text-sm font-medium">
            {selectedRows.size} miembro(s) seleccionado(s)
          </div>
          <Button variant="ghost" size="sm" onClick={() => onSelectionChange(new Set())}>
            Limpiar selección
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.getSize() }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  No se encontraron miembros
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onMouseOver={() => handlePrefetchMember(row.original.userId)}
                  onClick={() => {
                    if (onView) {
                      onView(row.original);
                    } else {
                      navigate(`/admin/members/${row.original.userId}`);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={(e) => {
                        if (cell.column.id === 'select' || cell.column.id === 'actions') {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}