
"use client";

import type { ParsedCSVData } from "@/lib/csv-parser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StructuredDataViewProps {
  data: ParsedCSVData;
}

// Fields to be displayed in the card content, in order.
const contentFields = [
  "Fechas de publicación",
  "Fechas de cierre",
  "Perfil del cargo",
  "Objetivo del cargo",
  "Tipo de Contrato",
  "Municipio",
  "Departamento",
  "Link de la convocatoria" 
];

export function StructuredDataView({ data }: StructuredDataViewProps) {
  if (!data || !data.rows || data.rows.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No data available to display.</p>;
  }

  if (!data.headers || data.headers.length === 0) {
      return <p className="text-center text-muted-foreground py-8">Data headers are missing or empty.</p>;
  }

  const hasLinkColumn = data.headers.includes("Link de la convocatoria");

  const validRows = data.rows.filter(row => {
    const nombreDelCargo = row["Nombre del Cargo"];
    return nombreDelCargo && nombreDelCargo.trim() !== "";
  });

  if (validRows.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No valid records to display after filtering.</p>;
  }

  return (
    <ScrollArea className="h-[70vh] rounded-md border p-1 md:p-4">
      <div className="space-y-4">
        {validRows.map((row, index) => {
          const nombreDelCargoValue = row["Nombre del Cargo"];
          // This check is now done by filtering validRows, but kept for safety if individual rendering logic changes
          if (!nombreDelCargoValue || nombreDelCargoValue.trim() === "") {
            return null; 
          }

          const tipoConvocatoriaValue = data.headers.includes("Tipo de convocatoria") ? row["Tipo de convocatoria"] : "";
          
          let hasContent = false;
          const renderedContentFields = contentFields.map((field) => {
            if (!data.headers.includes(field) && field !== "Link de la convocatoria") {
                return null;
            }
            
            const value = row[field];
            if (!value || String(value).trim() === "") {
                return null;
            }
            hasContent = true; // Mark that there's at least one content field with data

            if (field === "Link de la convocatoria" && (String(value).startsWith('http://') || String(value).startsWith('https://'))) {
              return (
                <div key={field}>
                  <strong className="font-medium">{field}:</strong>{' '}
                  <a 
                    href={String(value)}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline break-all"
                  >
                    Ver convocatoria
                  </a>
                </div>
              );
            }
            
            return (
              <div key={field}>
                <strong className="font-medium">{field}:</strong>{' '}
                {String(value)}
              </div>
            );
          }).filter(Boolean);


          // Only render card if there is a title or description or any content field
          if (!nombreDelCargoValue.trim() && (!tipoConvocatoriaValue || tipoConvocatoriaValue.trim() === "") && !hasContent) {
            return null;
          }

          return (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                {nombreDelCargoValue && nombreDelCargoValue.trim() !== "" && (
                  <CardTitle>{nombreDelCargoValue}</CardTitle>
                )}
                {tipoConvocatoriaValue && tipoConvocatoriaValue.trim() !== "" && (
                  <CardDescription>
                    <strong>Tipo de Convocatoria:</strong> {tipoConvocatoriaValue}
                  </CardDescription>
                )}
              </CardHeader>
              {hasContent && (
                <CardContent className="space-y-2 text-sm">
                  {renderedContentFields}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
