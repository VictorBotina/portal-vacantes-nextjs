
"use client";

import type { ParsedCSVData } from "@/lib/csv-parser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StructuredDataViewProps {
  data: ParsedCSVData;
}

// Fields to be displayed in the card content, in order.
// "Nombre del Cargo" will be the CardTitle.
// "Tipo de convocatoria" will be the CardDescription.
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

  // Check if essential columns are present
  const requiredColumns = ["Nombre del Cargo", "Tipo de convocatoria", ...contentFields];
  const missingColumns = requiredColumns.filter(col => !data.headers.includes(col) && col !== "Link de la convocatoria"); // Link is optional display
  
  // Allow "Link de la convocatoria" to be optional in the source data for display logic
  const hasLinkColumn = data.headers.includes("Link de la convocatoria");


  return (
    <ScrollArea className="h-[70vh] rounded-md border p-1 md:p-4">
      <div className="space-y-4">
        {data.rows.map((row, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle>{row["Nombre del Cargo"] || <span className="text-muted-foreground italic">Nombre del Cargo no disponible</span>}</CardTitle>
              {data.headers.includes("Tipo de convocatoria") && (
                <CardDescription>
                  <strong>Tipo de Convocatoria:</strong> {row["Tipo de convocatoria"] || <span className="text-muted-foreground italic">No disponible</span>}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {contentFields.map((field) => {
                  if (!data.headers.includes(field)) {
                    // Special handling for Link de la convocatoria if it's not a header
                    if (field === "Link de la convocatoria") return null; 
                    // For other fields, if not in header, show as unavailable if it was in the original user request
                    const userRequestedFields = [
                        "Tipo de convocatoria", "Fechas de publicación", "Fechas de cierre", 
                        "Nombre del Cargo", "Perfil del cargo", "Objetivo del cargo", 
                        "Tipo de Contrato", "Municipio", "Departamento"
                    ];
                    if (userRequestedFields.includes(field)) {
                         return (
                            <div key={field}>
                                <strong className="font-medium">{field}:</strong>{' '}
                                <span className="text-muted-foreground italic">No disponible en los datos</span>
                            </div>
                         );
                    }
                    return null;
                  }
                  
                  const value = row[field];

                  if (field === "Link de la convocatoria" && value && (value.startsWith('http://') || value.startsWith('https://'))) {
                    return (
                      <div key={field}>
                        <strong className="font-medium">{field}:</strong>{' '}
                        <a 
                          href={value} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline break-all"
                        >
                          Ver convocatoria
                        </a>
                      </div>
                    );
                  }
                  
                  // For other fields or if link is not a valid URL
                  return (
                    <div key={field}>
                      <strong className="font-medium">{field}:</strong>{' '}
                      {value || <span className="text-muted-foreground italic">No disponible</span>}
                    </div>
                  );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
