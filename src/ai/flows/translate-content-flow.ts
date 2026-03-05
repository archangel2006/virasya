
'use server';
/**
 * @fileOverview A Genkit flow for translating product content accurately using AI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslationInputSchema = z.object({
  text: z.string(),
  targetLanguage: z.enum(['Hindi', 'Tamil', 'Bengali', 'English']),
});

const TranslationOutputSchema = z.object({
  translatedText: z.string(),
});

export async function translateContent(input: z.infer<typeof TranslationInputSchema>) {
  return translationFlow(input);
}

const translationPrompt = ai.definePrompt({
  name: 'translationPrompt',
  input: {schema: TranslationInputSchema},
  output: {schema: TranslationOutputSchema},
  prompt: `Translate the following text to {{{targetLanguage}}}. 
Maintain the cultural nuances, emotional tone, and artisan-focused language of the original text. 
Do not be overly literal; ensure it sounds natural and respectful in the target language.

Text: {{{text}}}`,
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
