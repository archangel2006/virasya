'use server';
/**
 * @fileOverview An AI agent for automatically detecting the craft category from a product image.
 *
 * - artisanAITypeDetection - A function that handles the product image analysis and craft type detection process.
 * - ArtisanAITypeDetectionInput - The input type for the artisanAITypeDetection function.
 * - ArtisanAITypeDetectionOutput - The return type for the artisanAITypeDetection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ArtisanAITypeDetectionInputSchema = z.object({
  productImageDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ArtisanAITypeDetectionInput = z.infer<
  typeof ArtisanAITypeDetectionInputSchema
>;

const ArtisanAITypeDetectionOutputSchema = z.object({
  craftType: z
    .enum(['Pottery', 'Textiles', 'Jewelry', 'Woodwork', 'Hand painting', 'Other'])
    .describe('The detected craft category of the product.'),
});
export type ArtisanAITypeDetectionOutput = z.infer<
  typeof ArtisanAITypeDetectionOutputSchema
>;

export async function artisanAITypeDetection(
  input: ArtisanAITypeDetectionInput
): Promise<ArtisanAITypeDetectionOutput> {
  return artisanAITypeDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'artisanAITypeDetectionPrompt',
  input: {schema: ArtisanAITypeDetectionInputSchema},
  output: {schema: ArtisanAITypeDetectionOutputSchema},
  prompt: `You are an expert in handcrafted products. Your task is to analyze the provided image of a product and accurately identify its primary craft category.

Use the image below to determine the craft type. If you cannot determine a specific type from the given options, choose 'Other'.

Craft type options: Pottery, Textiles, Jewelry, Woodwork, Hand painting.

Product Image: {{media url=productImageDataUri}}`,
});

const artisanAITypeDetectionFlow = ai.defineFlow(
  {
    name: 'artisanAITypeDetectionFlow',
    inputSchema: ArtisanAITypeDetectionInputSchema,
    outputSchema: ArtisanAITypeDetectionOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      prompt: prompt(input),
      model: 'googleai/gemini-2.5-flash-image',
      config: {responseModalities: ['TEXT']},
    });
    return output!;
  }
);
