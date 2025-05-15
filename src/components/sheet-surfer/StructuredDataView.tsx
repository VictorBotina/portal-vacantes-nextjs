
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
    // This case is usually handled by InteractiveDataView's totalRecordsInDepartment check,
    // but kept as a safeguard if StructuredDataView is used directly with no data.
    return <p className="text-center text-muted-foreground py-8">No data available to display.</p>;
  }

  if (!data.headers || data.headers.length === 0) {
      return <p className="text-center text-muted-foreground py-8">Data headers are missing or empty.</p>;
  }

  const validRows = data.rows; // We now expect InteractiveDataView to send all rows for the department

  if (validRows.length === 0) {
     // This message will show if, for example, a department is selected but has genuinely no rows.
     return <p className="text-center text-muted-foreground py-8">No records found for the current selection.</p>;
  }


  return (
    <ScrollArea className="h-[70vh] rounded-md border p-1 md:p-4">
      <div className="space-y-4">
        {validRows.map((row, index) => {
          const nombreDelCargoValue = row["Nombre del Cargo"];
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
            hasContent = true;

            if (field === "Link de la convocatoria" && (String(value).startsWith('http://') || String(value).startsWith('https://'))) {
              return (
                <div key={field}>
                  <strong className="font-bold">{field}:</strong>{' '}
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
            // Display non-URL link text as plain text if it's not empty
            if (field === "Link de la convocatoria" && String(value).trim() !== "") {
               return (
                <div key={field}>
                  <strong className="font-bold">{field}:</strong>{' '}
                  {String(value)}
                </div>
              );
            }
            if (field !== "Link de la convocatoria") { // Ensure other fields are rendered
                return (
                  <div key={field}>
                    <strong className="font-bold">{field}:</strong>{' '}
                    {String(value)}
                  </div>
                );
            }
            return null;
          }).filter(Boolean);


          // Only render card if there is a title or description or any content field
          // We still render the card shell even if title is missing, to show other details.
          // The outer logic in InteractiveDataView handles the "no records" message.

          return (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                {nombreDelCargoValue && nombreDelCargoValue.trim() !== "" && (
                  <CardTitle>{nombreDelCargoValue}</CardTitle>
                )}
                {tipoConvocatoriaValue && tipoConvocatoriaValue.trim() !== "" && (
                  <CardDescription>
                    <strong className="font-bold">Tipo de Convocatoria:</strong> {tipoConvocatoriaValue}
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
