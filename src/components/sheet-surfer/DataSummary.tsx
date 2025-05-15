"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { summarizeData } from "@/ai/flows/summarize-data";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DataSummaryProps {
  csvData: string;
  hasData: boolean;
}

export function DataSummary({ csvData, hasData }: DataSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!csvData) {
      toast({
        title: "No Data",
        description: "Cannot generate summary without data.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    setSummary(null);
    try {
      const result = await summarizeData({ csvData });
      setSummary(result.summary);
      toast({
        title: "Summary Generated",
        description: "AI-powered summary is ready.",
      });
    } catch (e) {
      console.error("Error generating summary:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to generate summary: ${errorMessage}`);
      toast({
        title: "Error",
        description: `Failed to generate summary: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-primary" />
          AI Data Summary
        </CardTitle>
        <CardDescription>
          Get quick insights from your data using AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center space-x-2 py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p>Generating summary, please wait...</p>
          </div>
        )}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {summary && !isLoading && (
          <div className="prose prose-sm max-w-none rounded-md border bg-muted/30 p-4 dark:prose-invert">
            <p className="whitespace-pre-wrap">{summary}</p>
          </div>
        )}
        {!summary && !isLoading && !error && (
          <p className="text-sm text-muted-foreground">
            {hasData ? "Click the button below to generate an AI summary of the table data." : "Load data into the table to enable summary generation."}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSummarize} disabled={isLoading || !hasData}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Summary"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
