
import { parseCSV, type ParsedCSVData } from "@/lib/csv-parser";
import { InteractiveDataView } from "@/components/sheet-surfer/InteractiveDataView";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


async function fetchData(): Promise<{ parsedData: ParsedCSVData; error?: string }> {
  const googleSheetUrl = process.env.GOOGLE_SHEET_URL;

  if (!googleSheetUrl) {
    return { 
      parsedData: { headers: [], rows: [] }, 
      error: "La URL de Google Sheet no está configurada en las variables de entorno (GOOGLE_SHEET_URL)." 
    };
  }

  try {
    const response = await fetch(googleSheetUrl, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const rawCsv = await response.text();
    if (!rawCsv) {
        return { parsedData: { headers: [], rows: [] }, error: "Fetched data is empty." };
    }
    const parsedData = parseCSV(rawCsv);
    return { parsedData };
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while fetching data.";
    return { parsedData: { headers: [], rows: [] }, error: errorMessage };
  }
}

export default async function HomePage() {
  const { parsedData, error } = await fetchData();
  
  const uniqueDepartments = Array.from(
    new Set(parsedData.rows.map(row => row["Departamento"]).filter(Boolean))
  ).sort();

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Header section removed as per user request */}

      {error && (
         <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al Cargar Datos</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <InteractiveDataView initialData={parsedData} departments={uniqueDepartments} fetchError={error} />
      
    </div>
  );
}
