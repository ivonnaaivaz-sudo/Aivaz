'use server';
/**
 * @fileOverview A Genkit flow for extracting the comprehensive "Family DNA" profile.
 * Acts as a hyper-personalized Wikipedia generator for the family legacy.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractFamilyDNAInputSchema = z.object({
  surveyData: z.record(z.string()).describe('Raw survey responses from the user onboarding.'),
  userName: z.string().optional().describe('The user\'s name if available.'),
});
export type ExtractFamilyDNAInput = z.infer<typeof ExtractFamilyDNAInputSchema>;

const MemberSchema = z.object({
  name: z.string(),
  relationship: z.string(),
  generationalStage: z.string(),
  role: z.string(),
});

const ExtractFamilyDNAOutputSchema = z.object({
  personalProfile: z.object({
    roleInFamily: z.string(),
    generationalStage: z.string(),
    primaryLocation: z.string(),
    otherLocations: z.array(z.string()),
    psychologicalProfile: z.object({
      biggestHeadache: z.string(),
      currentPriorities: z.array(z.string()),
      emotionalFrictionPoints: z.array(z.string()),
      advisorBlindSpots: z.array(z.string()),
    }),
    financialSnapshot: z.object({
      estimatedNetWorth: z.string(),
      primaryAssetClasses: z.array(z.string()),
    }),
    aiSummary: z.string().describe('2-3 sentence personalized summary.'),
  }),
  familyProfile: z.object({
    familyName: z.string(),
    currentGenerationalStage: z.string(),
    geographicFootprint: z.array(z.string()),
    wealthSource: z.string(),
    estimatedTotalNetWorth: z.string(),
    history: z.object({
      summary: z.string().describe('Summary of family history and wealth creation.'),
      keyHoldings: z.array(z.string()),
      notableTransitions: z.array(z.string()),
    }),
    identifiedMembers: z.array(MemberSchema),
    socialCapital: z.object({
      reputationIndicators: z.array(z.string()),
      keyNetworks: z.array(z.string()),
      mobilityProfile: z.string(),
    }),
    relationalDynamics: z.object({
      keyFrictionPoints: z.array(z.string()),
      alignmentLevel: z.enum(["Low", "Medium", "High"]),
      successionReadinessScore: z.number().min(0).max(100),
    }),
    familyLegacyNarrative: z.string().describe('Neutral, Wikipedia-style summary of the legacy.'),
  }),
  initialTimeline: z.array(z.object({
    title: z.string(),
    date: z.string(),
    type: z.enum(["financial", "personal", "succession", "philanthropy", "vision"]),
    description: z.string(),
    status: z.enum(["completed", "in-progress", "upcoming", "target"]),
  })).describe('Proposed initial milestones for the legacy journey.'),
});
export type ExtractFamilyDNAOutput = z.infer<typeof ExtractFamilyDNAOutputSchema>;

export async function extractFamilyDNA(input: ExtractFamilyDNAInput): Promise<ExtractFamilyDNAOutput> {
  return extractFamilyDNAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractFamilyDNAPrompt',
  input: {schema: ExtractFamilyDNAInputSchema},
  output: {schema: ExtractFamilyDNAOutputSchema},
  prompt: `You are an expert legacy strategist, family office advisor, and biographer. 
Your task is to analyze raw psychological profiling survey data and generate a "Family DNA" profile that reads like a premium, hyper-personalized Wikipedia page.

The input data contains answers to questions about family roles, asset locations, current friction points, priorities, and gaps left by traditional advisors.

Focus on:
1. Deep psychological insight: Synthesize the underlying motivations and fears.
2. Generational context: Clearly distinguish between the Founder (Gen 1) and successive generations.
3. Wikipedia Style: Use neutral, sophisticated, and analytical language for the legacy narratives.
4. Social Capital: Infuse insights about their global footprint and reputation.

User Name: {{{userName}}}
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
