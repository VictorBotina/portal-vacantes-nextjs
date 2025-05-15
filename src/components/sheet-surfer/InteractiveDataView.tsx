
"use client";

import { useState, useMemo } from "react";
import type { ParsedCSVData } from "@/lib/csv-parser";
import { StructuredDataView } from "@/components/sheet-surfer/StructuredDataView";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Filter, Briefcase } from "lucide-react"; // Removed Info, Briefcase is already here

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
    const lowercasedSelectedDepartment = selectedDepartment.toLowerCase();
    const filteredRows = initialData.rows.filter(
      (row) => row["Departamento"]?.toLowerCase() === lowercasedSelectedDepartment
    );
    return { headers: initialData.headers, rows: filteredRows };
  }, [initialData, selectedDepartment]);

  const totalRecordsInDepartment = useMemo(() => {
    // This count reflects all rows for the selected department, before "Nombre del Cargo" filtering in StructuredDataView
    if (!initialData || !initialData.rows) {
      return 0;
    }
    if (selectedDepartment === "all") {
      return initialData.rows.length;
    }
    const lowercasedSelectedDepartment = selectedDepartment.toLowerCase();
    return initialData.rows.filter(
      (row) => row["Departamento"]?.toLowerCase() === lowercasedSelectedDepartment
    ).length;
  }, [initialData, selectedDepartment]);

  const hasData = initialData.rows.length > 0 && initialData.headers.length > 0;

  const departmentDisplayName = selectedDepartment === "all" || !selectedDepartment ? "Todos los Departamentos" : selectedDepartment;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Instrucciones para filtrar y aplicar a vacantes disponibles</CardTitle>
          <CardDescription className="text-base text-muted-foreground space-y-2 pt-2">
            <p>
              Seleccione el departamento sobre el cual desea obtener más información para consultar detalles como el municipio, nombre del cargo, perfil y objetivo del mismo.
            </p>
            <p>
              Si está interesado en aplicar, envíe su hoja de vida al correo{" "}
              <strong><a href="mailto:seleccionemssanareps@emssanareps.co" className="text-primary hover:underline">
                seleccionemssanareps@emssanareps.co
              </a></strong>
              , indicando en el asunto del mensaje el nombre del cargo y el municipio al que se postula (si es aspirante interno, agregue al asunto: “- Postulación interna”) y adjuntando su hoja de vida actualizada.
            </p>
            <p>
              <strong>Si no cumple con el perfil, por favor abstenerse de postularse.</strong>
            </p>
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
              <Briefcase className="mr-2 h-4 w-4 text-primary" /> {/* Changed Info to Briefcase here */}
              <span>Registros en {departmentDisplayName}: {totalRecordsInDepartment}</span>
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
