
'use server';
/**
 * @fileOverview A Genkit flow for generating family-level strategic recommendations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FamilyRecommendationsInputSchema = z.object({
  familyDNA: z.any().describe('The synthesized Family DNA profile.'),
  portfolioSummary: z.string().describe('A summary of current family assets and ownership.'),
});
export type FamilyRecommendationsInput = z.infer<typeof FamilyRecommendationsInputSchema>;

const RecommendationSchema = z.object({
  title: z.string(),
  description: z.string(),
  targetMember: z.string().describe('The family member this recommendation primarily concerns (e.g., "@Julian", "Next Gen").'),
  impact: z.string().describe('The estimated strategic or financial impact.'),
  category: z.string(),
  priority: z.enum(["High", "Medium", "Low"]),
  link: z.string().optional().describe('Deep link to a platform section (e.g., "/simulator", "/strategy").'),
});

const FamilyRecommendationsOutputSchema = z.object({
  recommendations: z.array(RecommendationSchema),
});
export type FamilyRecommendationsOutput = z.infer<typeof FamilyRecommendationsOutputSchema>;

export async function generateFamilyRecommendations(input: FamilyRecommendationsInput): Promise<FamilyRecommendationsOutput> {
  return generateFamilyRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'familyRecommendationsPrompt',
  input: {schema: FamilyRecommendationsInputSchema},
  output: {schema: FamilyRecommendationsOutputSchema},
  prompt: `You are an expert multi-generational family office strategist.
Analyze the Family DNA and Portfolio summary to generate actionable, high-impact recommendations at the FAMILY level.

Family DNA:
{{{familyDNA}}}

Portfolio Summary:
{{{portfolioSummary}}}

Your recommendations should:
1. Be specific and actionable (e.g., "Shift 10% of G2's tech holdings into fixed income to buffer against near-term volatility").
2. Reference family members identified in the DNA (using @Name syntax).
3. Address emotional friction points identified in the DNA.
4. Focus on generational transition and legacy alignment.`,
});

const generateFamilyRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateFamilyRecommendationsFlow',
    inputSchema: FamilyRecommendationsInputSchema,
    outputSchema: FamilyRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) throw new Error("Failed to generate recommendations.");
    return output;
  }
);
