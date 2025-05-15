
import { parseCSV, type ParsedCSVData } from "@/lib/csv-parser";
// import { DataTable } from "@/components/sheet-surfer/DataTable"; // Replaced by StructuredDataView
import { StructuredDataView } from "@/components/sheet-surfer/StructuredDataView";
import { DataSummary } from "@/components/sheet-surfer/DataSummary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Newspaper } from "lucide-react"; // Changed Icon
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR6Gi_bB6J6fMCWb77Ii21cj_IgEbKu5a5Kqf5eEexVt6xnr4wIvQ175kfGgW7029MAry_FrHoF74pL/pub?gid=0&single=true&output=csv";

async function fetchData(): Promise<{ rawCsv: string; parsedData: ParsedCSVData; error?: string }> {
  try {
    const response = await fetch(GOOGLE_SHEET_URL, { cache: 'no-store' }); // Fetches fresh data on each request
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const rawCsv = await response.text();
    if (!rawCsv) {
        return { rawCsv: "", parsedData: { headers: [], rows: [] }, error: "Fetched data is empty." };
    }
    const parsedData = parseCSV(rawCsv);
    return { rawCsv, parsedData };
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while fetching data.";
    return { rawCsv: "", parsedData: { headers: [], rows: [] }, error: errorMessage };
  }
}

export default async function HomePage() {
  const { rawCsv, parsedData, error } = await fetchData();
  const hasData = parsedData.rows.length > 0 && parsedData.headers.length > 0;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center justify-center">
          <Newspaper className="mr-3 h-10 w-10" /> {/* Changed Icon */}
          Sheet Surfer
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Explore, filter, and get AI-powered summaries of your Google Sheet data.
        </p>
      </header>

      {error && (
         <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Fetching Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <DataSummary csvData={rawCsv} hasData={hasData && !error} />

        <Card>
          <CardHeader>
            <CardTitle>Data Explorer</CardTitle>
            <CardDescription>
              View data from your Google Sheet, presented in a structured format.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasData && !error ? (
              <StructuredDataView data={parsedData} />
            ) : !error ? (
               <p className="text-center text-muted-foreground py-8">No data loaded or the sheet is empty.</p>
            ) : null }
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
