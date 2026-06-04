
'use server';
/**
 * @fileOverview A Genkit flow for extracting the "Core DNA" of a family legacy based on psychological profiling.
 *
 * - extractFamilyDNA - A function that handles the DNA extraction process.
 * - ExtractFamilyDNAInput - The input type for the extractFamilyDNA function.
 * - ExtractFamilyDNAOutput - The return type for the extractFamilyDNA function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractFamilyDNAInputSchema = z.object({
  surveyData: z.record(z.string()).describe('Raw survey responses from the user onboarding.'),
});
export type ExtractFamilyDNAInput = z.infer<typeof ExtractFamilyDNAInputSchema>;

const ExtractFamilyDNAOutputSchema = z.object({
  generationalStage: z.enum(["Gen 1 Founder", "Gen 2 Transition", "Gen 3+ Stewardship"]),
  coreValues: z.array(z.string()).describe('The fundamental principles driving the family.'),
  frictionPoints: z.array(z.string()).describe('Identified emotional or structural bottlenecks.'),
  legacyGoals: z.array(z.string()).describe('Primary long-term objectives for the heritage.'),
  geographicDistribution: z.string().describe('Analysis of how family locations impact dynamics.'),
  assetComplexity: z.string().describe('Level of complexity and its psychological impact.'),
  narrativeSummary: z.string().describe('A synthesized narrative of the family identity.'),
  overlookedFactors: z.array(z.string()).describe('What traditional advisors usually miss for this profile.'),
  initialTimeline: z.array(z.object({
    title: z.string(),
    date: z.string(),
    type: z.enum(["financial", "personal", "succession", "philanthropy", "vision"]),
    description: z.string(),
    status: z.enum(["completed", "in-progress", "upcoming", "target"]),
  })).describe('Proposed initial milestones for the legacy timeline.'),
});
export type ExtractFamilyDNAOutput = z.infer<typeof ExtractFamilyDNAOutputSchema>;

export async function extractFamilyDNA(input: ExtractFamilyDNAInput): Promise<ExtractFamilyDNAOutput> {
  return extractFamilyDNAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractFamilyDNAPrompt',
  input: {schema: ExtractFamilyDNAInputSchema},
  output: {schema: ExtractFamilyDNAOutputSchema},
  prompt: `You are an expert legacy strategist and family psychologist. 
Your task is to analyze raw psychological profiling survey data and extract the "Core DNA" of the family.

The input data contains answers to questions about family roles, asset locations, current friction points, priorities, and overlooked factors by advisors.

Focus on:
1. Deep psychological insight: What is the underlying fear or motivation?
2. Generational context: Are they building, transitioning, or preserving?
3. Actionable gaps: What human-centric issues need addressing immediately?

Survey Data:
{{{surveyData}}}`,
});

const extractFamilyDNAFlow = ai.defineFlow(
  {
    name: 'extractFamilyDNAFlow',
    inputSchema: ExtractFamilyDNAInputSchema,
    outputSchema: ExtractFamilyDNAOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) throw new Error("Failed to extract DNA.");
    return output;
  }
);
