import { Skeleton } from "@/shared/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";

export const MemberTableSkeleton = ({ showActions }: { showActions?: boolean }) => {
    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {[1, 2, 3, 4, 5, 6, 7, showActions && 8].filter((i): i is number => typeof i === 'number').map((i) => (
                                <TableHead key={i}>
                                    <Skeleton className="h-4 w-24" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3, 4, 5].map((row) => (
                            <TableRow key={row}>
                                <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                                <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                {showActions && (
                                    <TableCell>
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
