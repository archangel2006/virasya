'use server';
/**
 * @fileOverview A Genkit flow for translating product content accurately using AI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslationInputSchema = z.object({
  title: z.string(),
  description: z.string(),
  story: z.string(),
  targetLanguage: z.enum(['Hindi', 'Tamil', 'Bengali', 'Marathi', 'English', 'Gujarati', 'Telugu', 'Kannada', 'Malayalam', 'Punjabi']),
});

const TranslationOutputSchema = z.object({
  translatedTitle: z.string(),
  translatedDescription: z.string(),
  translatedStory: z.string(),
});

export async function translateListing(input: z.infer<typeof TranslationInputSchema>) {
  return translationFlow(input);
}

const translationPrompt = ai.definePrompt({
  name: 'translationPrompt',
  input: {schema: TranslationInputSchema},
  output: {schema: TranslationOutputSchema},
  prompt: `Translate the following product listing content to {{{targetLanguage}}}. 
Maintain the cultural nuances and artisan-focused language. 
Do NOT translate specific names of regions or people unless necessary for context.

Title: {{{title}}}
Description: {{{description}}}
Story: {{{story}}}`,
});

const translationFlow = ai.defineFlow(
  {
    name: 'translationFlow',
    inputSchema: TranslationInputSchema,
    outputSchema: TranslationOutputSchema,
  },
  async input => {
    const {output} = await translationPrompt(input);
    return output!;
  }
);
