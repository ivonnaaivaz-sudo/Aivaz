'use server';
/**
 * @fileOverview A Genkit flow for simulating financial scenarios and their impact on wealth and tax obligations.
 *
 * - wealthScenarioSimulation - A function that simulates various financial scenarios.
 * - WealthScenarioSimulationInput - The input type for the wealthScenarioSimulation function.
 * - WealthScenarioSimulationOutput - The return type for the wealthScenarioSimulation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WealthScenarioSimulationInputSchema = z.object({
  currentFinancialOverview: z
    .string()
    .describe(
      'A detailed overview of the user\'s current financial situation, including assets, liabilities, income, investments, and current tax situation.'
    ),
  scenarioDescription: z
    .string()
    .describe(
      'A description of the financial scenario to simulate, such as investment changes, market downturns, or life events.'
    ),
});
export type WealthScenarioSimulationInput = z.infer<
  typeof WealthScenarioSimulationInputSchema
>;

const WealthScenarioSimulationOutputSchema = z.object({
  scenarioSummary: z
    .string()
    .describe('A summary of the simulated financial scenario.'),
  projectedWealth: z
    .string()
    .describe('The projected impact on the user\'s total wealth after the scenario.'),
  projectedTaxObligations: z
    .string()
    .describe('The projected impact on the user\'s tax obligations after the scenario.'),
  impactAnalysis: z
    .string()
    .describe('A detailed analysis of the scenario\'s impact, including key insights and considerations.'),
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
  prompt: `You are a sophisticated AI financial simulator and advisor. Your task is to analyze a given financial scenario and project its potential impact on a user's wealth and tax obligations.

Use the following information to perform the simulation:

Current Financial Overview:
{{{currentFinancialOverview}}}

Scenario to Simulate:
{{{scenarioDescription}}}

Provide a clear and concise summary of the scenario, the projected impact on wealth, the projected impact on tax obligations, and a detailed analysis of the impact. Be as specific as possible with financial figures and reasoning.`,
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
      throw new Error('Failed to generate simulation output.');
    }
    return output;
  }
);
