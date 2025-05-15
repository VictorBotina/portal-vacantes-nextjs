
"use client";

import { useState, useMemo } from "react";
import type { ParsedCSVData } from "@/lib/csv-parser";
import { StructuredDataView } from "@/components/sheet-surfer/StructuredDataView";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Filter, Briefcase } from "lucide-react";

interface InteractiveDataViewProps {
  initialData: ParsedCSVData;
  departments: string[];
  fetchError?: string;
}

export function InteractiveDataView({ initialData, departments, fetchError }: InteractiveDataViewProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string | "all">("all");

  const departmentFilteredData = useMemo(() => {
    if (!initialData || !initialData.rows) {
      return { headers: initialData.headers || [], rows: [] };
    }
    if (selectedDepartment === "all") {
      return initialData;
    }
    const filteredRows = initialData.rows.filter(
      (row) => row["Departamento"] === selectedDepartment
    );
    return { headers: initialData.headers, rows: filteredRows };
  }, [initialData, selectedDepartment]);

  const availableVacanciesCount = useMemo(() => {
    if (!departmentFilteredData || !departmentFilteredData.rows) {
      return 0;
    }
    return departmentFilteredData.rows.filter(row => {
      const nombreDelCargo = row["Nombre del Cargo"];
      return nombreDelCargo && nombreDelCargo.trim() !== "";
    }).length;
  }, [departmentFilteredData]);

  const hasData = initialData.rows.length > 0 && initialData.headers.length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Explorer</CardTitle>
          <CardDescription>
            View and filter data from your Google Sheet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasData && !fetchError && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg bg-muted/20 shadow-sm">
              <div className="flex items-center text-primary">
                <Filter className="mr-2 h-5 w-5" />
                <Label htmlFor="department-filter" className="text-md font-semibold">Filtrar por Departamento:</Label>
              </div>
              <Select
                value={selectedDepartment}
                onValueChange={(value) => setSelectedDepartment(value)}
              >
                <SelectTrigger id="department-filter" className="w-full sm:w-[280px] bg-background shadow-sm">
                  <SelectValue placeholder="Seleccionar departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Departamentos</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {hasData && !fetchError && (
            <div className="mb-4 flex items-center text-sm text-muted-foreground">
              <Briefcase className="mr-2 h-4 w-4 text-primary" />
              <span>Vacantes disponibles: {availableVacanciesCount}</span>
            </div>
          )}

          {hasData && !fetchError ? (
            <StructuredDataView data={departmentFilteredData} />
          ) : !fetchError ? (
            <p className="text-center text-muted-foreground py-8">No data loaded or the sheet is empty.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

