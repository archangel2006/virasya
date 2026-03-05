
'use server';
/**
 * @fileOverview A Genkit flow for generating social media promotional content.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketingInputSchema = z.object({
  productName: z.string(),
  craftType: z.string(),
  region: z.string(),
  storySnippet: z.string(),
});

const MarketingOutputSchema = z.object({
  instagram: z.object({
    caption: z.string(),
    hashtags: z.array(z.string()),
  }),
  facebook: z.object({
    post: z.string(),
  }),
  whatsapp: z.object({
    message: z.string(),
  }),
});

export async function generateMarketingContent(input: z.infer<typeof MarketingInputSchema>) {
  return marketingGeneratorFlow(input);
}

const marketingPrompt = ai.definePrompt({
  name: 'marketingPrompt',
  input: {schema: MarketingInputSchema},
  output: {schema: MarketingOutputSchema},
  prompt: `Generate promotional social media content for this artisan product. 
The tone should be warm, storytelling-focused, and premium.

Product: {{{productName}}}
Craft: {{{craftType}}}
Region: {{{region}}}
Story: {{{storySnippet}}}

Include an Instagram caption with relevant hashtags, a Facebook post that invites engagement, and a concise WhatsApp message for direct sharing.`,
});

const marketingGeneratorFlow = ai.defineFlow(
  {
    name: 'marketingGeneratorFlow',
    inputSchema: MarketingInputSchema,
    outputSchema: MarketingOutputSchema,
  },
  async input => {
    const {output} = await marketingPrompt(input);
    return output!;
  }
);
