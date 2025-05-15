"use client";

import type { ParsedCSVData } from "@/lib/csv-parser";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown, Columns } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableProps {
  initialData: ParsedCSVData;
}

type SortConfig = {
  key: string;
  direction: "ascending" | "descending";
} | null;

export function DataTable({ initialData }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [data, setData] = useState(initialData.rows);
  const [headers, setHeaders] = useState(initialData.headers);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    initialData.headers.reduce((acc, header) => ({ ...acc, [header]: true }), {})
  );

  useEffect(() => {
    setData(initialData.rows);
    const newHeaders = initialData.headers;
    setHeaders(newHeaders);
    setVisibleColumns(newHeaders.reduce((acc, header) => ({ ...acc, [header]: true }), {}));
  }, [initialData]);

  const filteredAndSortedData = useMemo(() => {
    let filteredData = [...data];

    if (searchTerm) {
      filteredData = filteredData.filter((row) =>
        headers.some(header =>
          visibleColumns[header] && row[header]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (sortConfig !== null) {
      filteredData.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        
        // Attempt numeric sort if possible
        const numA = parseFloat(valA);
        const numB = parseFloat(valB);

        if (!isNaN(numA) && !isNaN(numB)) {
          if (numA < numB) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (numA > numB) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        }

        // Fallback to string sort
        if (valA.toString().toLowerCase() < valB.toString().toLowerCase()) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (valA.toString().toLowerCase() > valB.toString().toLowerCase()) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  }, [data, searchTerm, sortConfig, headers, visibleColumns]);

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    } else if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "descending"
    ) {
      setSortConfig(null); // Third click clears sort
      return;
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    if (sortConfig.direction === "ascending") {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    return <ArrowDown className="ml-2 h-4 w-4" />;
  };
  
  const activeHeaders = headers.filter(header => visibleColumns[header]);

  if (!headers.length) {
    return <p className="text-center text-muted-foreground py-4">No data to display or data is empty.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Filter data..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Columns className="mr-2 h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {headers.map((header) => (
              <DropdownMenuCheckboxItem
                key={header}
                className="capitalize"
                checked={visibleColumns[header]}
                onCheckedChange={(value) =>
                  setVisibleColumns((prev) => ({
                    ...prev,
                    [header]: !!value,
                  }))
                }
              >
                {header}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="rounded-md border whitespace-nowrap">
        <Table>
          <TableHeader>
            <TableRow>
              {activeHeaders.map((header) => (
                <TableHead key={header}>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort(header)}
                    className="px-1"
                  >
                    {header}
                    {getSortIcon(header)}
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.length > 0 ? (
              filteredAndSortedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {activeHeaders.map((header) => (
                    <TableCell key={`${rowIndex}-${header}`}>
                      {row[header]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={activeHeaders.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
       {filteredAndSortedData.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredAndSortedData.length} of {data.length} rows.
        </p>
      )}
    </div>
  );
}
