
'use server';
/**
 * @fileOverview An AI agent for detecting craft details and generating initial listing data.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ArtisanAITypeDetectionInputSchema = z.object({
  productImageDataUri: z.string(),
  location: z.string().optional(),
});

const ArtisanAITypeDetectionOutputSchema = z.object({
  craftType: z.enum(['Pottery', 'Textiles', 'Jewelry', 'Woodwork', 'Hand painting', 'Other']),
  suggestedTitle: z.string(),
  suggestedMaterials: z.string(),
  craftStyle: z.string(),
  description: z.string(),
  craftStory: z.string(),
  pricing: z.object({
    suggestedMidpoint: z.number(),
    reasoning: z.string(),
  }),
});

export async function artisanAITypeDetection(input: z.infer<typeof ArtisanAITypeDetectionInputSchema>) {
  return artisanAITypeDetectionFlow(input);
}

const detectionPrompt = ai.definePrompt({
  name: 'artisanAITypeDetectionPrompt',
  input: {schema: ArtisanAITypeDetectionInputSchema},
  output: {schema: ArtisanAITypeDetectionOutputSchema},
  prompt: `Analyze the provided image of a handcrafted product.
Location: {{{location}}}

Identify:
1. The primary craft category.
2. A descriptive, SEO-friendly product title.
3. The materials visible in the craft.
4. The specific regional or artistic style.
5. A short, professional product description (2-3 sentences).
6. A "Craft Story": 3-4 sentences max. Do NOT fabricate personal history. Provide cultural context based on the craft type and region.
   Example: "Blue pottery from Khurja is known for its vibrant glaze work and traditional patterns."
7. Pricing: Suggest a realistic midpoint in INR based on material and craft complexity. Provide a 2-sentence max reasoning.

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
