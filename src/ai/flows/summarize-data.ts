'use server';

/**
 * @fileOverview A data summarization AI agent for Google Sheet data.
 *
 * - summarizeData - A function that handles the data summarization process.
 * - SummarizeDataInput - The input type for the summarizeData function.
 * - SummarizeDataOutput - The return type for the summarizeData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDataInputSchema = z.object({
  csvData: z.string().describe('The CSV data from the Google Sheet.'),
});
export type SummarizeDataInput = z.infer<typeof SummarizeDataInputSchema>;

const SummarizeDataOutputSchema = z.object({
  summary: z.string().describe('The AI-powered summary of the data.'),
});
export type SummarizeDataOutput = z.infer<typeof SummarizeDataOutputSchema>;

export async function summarizeData(input: SummarizeDataInput): Promise<SummarizeDataOutput> {
  return summarizeDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDataPrompt',
  input: {schema: SummarizeDataInputSchema},
  output: {schema: SummarizeDataOutputSchema},
  prompt: `You are an AI assistant that summarizes data from a Google Sheet.

  Provide a concise summary of the key trends and insights from the following data:

  {{csvData}}`,
});

const summarizeDataFlow = ai.defineFlow(
  {
    name: 'summarizeDataFlow',
    inputSchema: SummarizeDataInputSchema,
    outputSchema: SummarizeDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
