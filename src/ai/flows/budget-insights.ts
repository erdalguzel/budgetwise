// budget-insights.ts
'use server';

/**
 * @fileOverview AI Budget Assistant flow to provide personalized spending insights and recommendations.
 *
 * - getBudgetInsights - A function that returns personalized spending insights and recommendations.
 * - BudgetInsightsInput - The input type for the getBudgetInsights function.
 * - BudgetInsightsOutput - The return type for the getBudgetInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetInsightsInputSchema = z.object({
  transactions: z.string().describe('JSON string containing the list of transactions with category and amount.'),
  budgetGoals: z.string().describe('JSON string containing the monthly budget goals for each category.'),
  timeline: z.string().describe('The timeline to achieve budget goals, e.g., end of the month, specific date.'),
});
export type BudgetInsightsInput = z.infer<typeof BudgetInsightsInputSchema>;

const BudgetInsightsOutputSchema = z.object({
  insights: z.string().describe('Personalized spending insights and recommendations to achieve budget goals.'),
});
export type BudgetInsightsOutput = z.infer<typeof BudgetInsightsOutputSchema>;

export async function getBudgetInsights(input: BudgetInsightsInput): Promise<BudgetInsightsOutput> {
  return budgetInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetInsightsPrompt',
  input: {schema: BudgetInsightsInputSchema},
  output: {schema: BudgetInsightsOutputSchema},
  prompt: `You are an AI Budget Assistant that provides personalized spending insights and recommendations to help users achieve their financial targets. Analyze the user's transactions and budget goals to provide actionable advice.

Transactions: {{{transactions}}}
Budget Goals: {{{budgetGoals}}}
Timeline: {{{timeline}}}

Based on this information, provide spending insights and personalized recommendations to achieve budget goals by the specified timeline. Focus on specific categories where spending can be reduced.`, 
});

const budgetInsightsFlow = ai.defineFlow(
  {
    name: 'budgetInsightsFlow',
    inputSchema: BudgetInsightsInputSchema,
    outputSchema: BudgetInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
