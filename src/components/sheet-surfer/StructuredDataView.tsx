
"use client";

import type { ParsedCSVData } from "@/lib/csv-parser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Briefcase } from "lucide-react"; // Import the Briefcase icon

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

  const validRows = data.rows; 

  if (validRows.length === 0) {
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
            
            if (field === "Link de la convocatoria" && String(value).trim() !== "") {
               return (
                <div key={field}>
                  <strong className="font-bold">{field}:</strong>{' '}
                  {String(value)}
                </div>
              );
            }
            if (field !== "Link de la convocatoria") { 
                return (
                  <div key={field}>
                    <strong className="font-bold">{field}:</strong>{' '}
                    {String(value)}
                  </div>
                );
            }
            return null;
          }).filter(Boolean);


          return (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                {nombreDelCargoValue && nombreDelCargoValue.trim() !== "" && (
                  <div className="flex items-center">
                    <Briefcase className="mr-3 h-6 w-6 text-primary flex-shrink-0" />
                    <CardTitle>{nombreDelCargoValue}</CardTitle>
                  </div>
                )}
                {tipoConvocatoriaValue && tipoConvocatoriaValue.trim() !== "" && (
                  <CardDescription className="mt-1 ml-9"> {/* Added margin-left to align with title if icon is present */}
                    <strong className="font-bold">Tipo de Convocatoria:</strong> {tipoConvocatoriaValue}
                  </CardDescription>
                )}
                 {/* If no title but there is a type, show icon with type */}
                {(!nombreDelCargoValue || nombreDelCargoValue.trim() === "") && tipoConvocatoriaValue && tipoConvocatoriaValue.trim() !== "" && (
                   <div className="flex items-center">
                    <Briefcase className="mr-3 h-6 w-6 text-primary flex-shrink-0" />
                     <CardDescription>
                        <strong className="font-bold">Tipo de Convocatoria:</strong> {tipoConvocatoriaValue}
                    </CardDescription>
                   </div>
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

