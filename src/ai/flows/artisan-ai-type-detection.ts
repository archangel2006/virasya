
'use server';
/**
 * @fileOverview An AI agent for detecting craft details from a product image.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ArtisanAITypeDetectionInputSchema = z.object({
  productImageDataUri: z.string(),
});

const ArtisanAITypeDetectionOutputSchema = z.object({
  craftType: z.enum(['Pottery', 'Textiles', 'Jewelry', 'Woodwork', 'Hand painting', 'Other']),
  suggestedTitle: z.string(),
  suggestedMaterials: z.string(),
  craftStyle: z.string(),
});

export async function artisanAITypeDetection(input: z.infer<typeof ArtisanAITypeDetectionInputSchema>) {
  return artisanAITypeDetectionFlow(input);
}

const detectionPrompt = ai.definePrompt({
  name: 'artisanAITypeDetectionPrompt',
  input: {schema: ArtisanAITypeDetectionInputSchema},
  output: {schema: ArtisanAITypeDetectionOutputSchema},
  prompt: `Analyze the provided image of a handcrafted product.
Identify:
1. The primary craft category.
2. A descriptive, SEO-friendly product title.
3. The materials visible in the craft.
4. The specific regional or artistic style (e.g., Blue Pottery, Chanderi, Madhubani).

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
      prompt: detectionPrompt(input),
      model: 'googleai/gemini-2.5-flash-image',
      config: {responseModalities: ['TEXT']},
    });
    return output!;
  }
);
