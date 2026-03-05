
'use server';
/**
 * @fileOverview A Genkit flow for providing pricing guidance to artisans.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PriceAdvisorInputSchema = z.object({
  craftCategory: z.string(),
  materialsUsed: z.string(),
  hoursOfWork: z.number(),
  complexity: z.enum(['Low', 'Medium', 'High']),
});

const PriceAdvisorOutputSchema = z.object({
  recommendedMin: z.number(),
  recommendedMax: z.number(),
  reasoning: z.string().describe('Detailed explanation for the pricing suggestion.'),
});

export async function artisanAiPriceAdvisor(input: z.infer<typeof PriceAdvisorInputSchema>) {
  return artisanAiPriceAdvisorFlow(input);
}

const priceAdvisorPrompt = ai.definePrompt({
  name: 'priceAdvisorPrompt',
  input: {schema: PriceAdvisorInputSchema},
  output: {schema: PriceAdvisorOutputSchema},
  prompt: `You are a specialist in the Indian handicraft market. Provide a fair and competitive pricing range in Indian Rupees (₹) for a product with the following details:

Category: {{{craftCategory}}}
Materials: {{{materialsUsed}}}
Labor: {{{hoursOfWork}}} hours
Complexity: {{{complexity}}}

Consider market trends for authentic handmade goods. Provide a clear reasoning explaining how the labor, material cost, and craft rarity influence the price.`,
});

const artisanAiPriceAdvisorFlow = ai.defineFlow(
  {
    name: 'artisanAiPriceAdvisorFlow',
    inputSchema: PriceAdvisorInputSchema,
    outputSchema: PriceAdvisorOutputSchema,
  },
  async input => {
    const {output} = await priceAdvisorPrompt(input);
    return output!;
  }
);
