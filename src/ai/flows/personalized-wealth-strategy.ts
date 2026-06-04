'use server';
/**
 * @fileOverview A Genkit flow for generating personalized wealth strategy recommendations and identifying estate blind spots.
 *
 * - personalizedWealthStrategy - A function that handles the personalized wealth strategy generation process.
 * - PersonalizedWealthStrategyInput - The input type for the personalizedWealthStrategy function.
 * - PersonalizedWealthStrategyOutput - The return type for the personalizedWealthStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedWealthStrategyInputSchema = z.object({
  financialData: z.string().describe('Aggregated financial data for the user, including assets, liabilities, income, and expenses.'),
  existingEstatePlan: z.string().optional().describe('Details of any existing estate plan or related documents, if available.'),
});
export type PersonalizedWealthStrategyInput = z.infer<typeof PersonalizedWealthStrategyInputSchema>;

const PersonalizedWealthStrategyOutputSchema = z.object({
  summary: z.string().describe('A high-level summary of the wealth strategy analysis.'),
  recommendations: z.array(z.string()).describe('A list of personalized wealth strategy recommendations.'),
  blindSpots: z.array(z.string()).describe('A list of identified estate blind spots and potential issues.'),
});
export type PersonalizedWealthStrategyOutput = z.infer<typeof PersonalizedWealthStrategyOutputSchema>;

export async function personalizedWealthStrategy(input: PersonalizedWealthStrategyInput): Promise<PersonalizedWealthStrategyOutput> {
  return personalizedWealthStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedWealthStrategyPrompt',
  input: {schema: PersonalizedWealthStrategyInputSchema},
  output: {schema: PersonalizedWealthStrategyOutputSchema},
  prompt: `You are an expert financial advisor specializing in wealth management and estate planning.

Analyze the provided financial data and existing estate plan (if any) to generate personalized wealth strategy recommendations and identify any potential estate blind spots.

Focus on actionable advice and clear identification of risks or overlooked areas.

Aggregated Financial Data: {{{financialData}}}

{{#if existingEstatePlan}}
Existing Estate Plan Details: {{{existingEstatePlan}}}
{{/if}}`,
});

const personalizedWealthStrategyFlow = ai.defineFlow(
  {
    name: 'personalizedWealthStrategyFlow',
    inputSchema: PersonalizedWealthStrategyInputSchema,
    outputSchema: PersonalizedWealthStrategyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
