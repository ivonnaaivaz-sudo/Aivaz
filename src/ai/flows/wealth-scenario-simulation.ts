
'use server';
/**
 * @fileOverview A Genkit flow for simulating hybrid financial and social scenarios.
 * Projects impact on wealth, tax, and multi-generational family dynamics.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WealthScenarioSimulationInputSchema = z.object({
  currentFinancialOverview: z
    .string()
    .describe(
      'A detailed overview of the user\'s current financial situation, including assets and tax context.'
    ),
  familyDNADynamics: z.string().optional().describe('Key emotional friction points and family values.'),
  scenarioDescription: z
    .string()
    .describe(
      'A description of the scenario, covering both market/financial events and social/family transitions.'
    ),
});
export type WealthScenarioSimulationInput = z.infer<
  typeof WealthScenarioSimulationInputSchema
>;

const WealthScenarioSimulationOutputSchema = z.object({
  scenarioSummary: z
    .string()
    .describe('A high-level summary of the simulated scenario.'),
  projectedWealth: z
    .string()
    .describe('The projected impact on total family wealth.'),
  projectedTaxObligations: z
    .string()
    .describe('The projected impact on tax liabilities and estate efficiency.'),
  socialImpactAnalysis: z
    .string()
    .describe('A detailed analysis of the impact on family unity, alignment, and generational transition.'),
  riskLevel: z.enum(["Low", "Medium", "High", "Critical"]).describe('The overall strategic risk of this scenario.'),
});
export type WealthScenarioSimulationOutput = z.infer<
  typeof WealthScenarioSimulationOutputSchema
>;

export async function wealthScenarioSimulation(
  input: WealthScenarioSimulationInput
): Promise<WealthScenarioSimulationOutput> {
  return wealthScenarioSimulationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'wealthScenarioSimulationPrompt',
  input: {schema: WealthScenarioSimulationInputSchema},
  output: {schema: WealthScenarioSimulationOutputSchema},
  prompt: `You are Aivaz, a sophisticated legacy strategist and AI financial simulator. 
Your task is to analyze a hybrid scenario that combines financial market events with family social dynamics.

Analyze how the following scenario affects the family's total wealth, tax situation, and human architecture (alignment, trust, and succession).

Financial Context:
{{{currentFinancialOverview}}}

Family DNA Dynamics:
{{{familyDNADynamics}}}

Scenario to Simulate:
{{{scenarioDescription}}}

Provide a detailed projection that balances quantitative financial outcomes with qualitative social impact analysis.`,
});

const wealthScenarioSimulationFlow = ai.defineFlow(
  {
    name: 'wealthScenarioSimulationFlow',
    inputSchema: WealthScenarioSimulationInputSchema,
    outputSchema: WealthScenarioSimulationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate hybrid simulation output.');
    }
    return output;
  }
);
