"use client";

import { PlusCircle, X } from "lucide-react";

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useCreateModal } from "@/store/use-create-modal";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {

    const { onOpen } = useCreateModal();
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder={`Search title...`}
                    value={
                        (table.getColumn("title")?.getFilterValue() as string) ??
                        ""
                    }
                    onChange={(event) => {
                        table
                            .getColumn("title")
                            ?.setFilterValue(event.target.value)
                    }
                    }
                    className="h-8 w-[150px] lg:w-[350px]"
                />
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto hidden h-8 lg:flex flex-row gap-2 items-center justify-center"
                    onClick={() => onOpen("untitled")}
                >
                    <PlusCircle className="h-4 w-4 shrink-0" />
                    Create new
                </Button>
            </div>
        </div>
    );
}