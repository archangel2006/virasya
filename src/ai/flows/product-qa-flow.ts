'use server';
/**
 * @fileOverview A Genkit flow for answering buyer questions about specific handcrafted products.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductQAInputSchema = z.object({
  productName: z.string(),
  craftType: z.string(),
  materials: z.string(),
  region: z.string(),
  story: z.string(),
  question: z.string(),
});
export type ProductQAInput = z.infer<typeof ProductQAInputSchema>;

const ProductQAOutputSchema = z.object({
  answer: z.string().describe('A helpful, culturally informed answer to the buyer\'s question.'),
});
export type ProductQAOutput = z.infer<typeof ProductQAOutputSchema>;

export async function askProductAI(input: ProductQAInput): Promise<ProductQAOutput> {
  return productQAFlow(input);
}

const productQAPrompt = ai.definePrompt({
  name: 'productQAPrompt',
  input: {schema: ProductQAInputSchema},
  output: {schema: ProductQAOutputSchema},
  prompt: `You are Virasya AI, an expert on Indian handicrafts and cultural heritage. 
Your goal is to answer a buyer's question about a specific handcrafted product.

Product Context:
- Name: {{{productName}}}
- Category: {{{craftType}}}
- Materials: {{{materials}}}
- Region: {{{region}}}
- Heritage Story: {{{story}}}

Question: {{{question}}}

Instructions:
1. Use the provided product context as the primary source of truth.
2. Provide culturally accurate and respectful information.
3. If the question is about care, provide advice suitable for the materials listed.
4. If the question is about history, elaborate on the regional craft tradition.
5. Keep the tone warm, authentic, and knowledgeable.
6. Limit the answer to 3-4 professional and engaging sentences.`,
});

const productQAFlow = ai.defineFlow(
  {
    name: 'productQAFlow',
    inputSchema: ProductQAInputSchema,
    outputSchema: ProductQAOutputSchema,
  },
  async input => {
    const {output} = await productQAPrompt(input);
    return output!;
  }
);
