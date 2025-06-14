
import { config } from 'dotenv';

try {
  // Load .env variables. This should be called before any code that might depend on them.
  config();

  // The import of budget-insights (and subsequently genkit.ts) will trigger
  // Genkit plugin initializations (like googleAI). If there's an issue
  // (e.g., missing API key), it might throw an error here.
  // Using require for synchronous error catching during module load in this context.
  require('@/ai/flows/budget-insights.ts');

  // This log will appear if flows are loaded by 'genkit start' successfully.
  console.log('[Genkit Dev] Flows loaded successfully for genkit start.');

} catch (error) {
  console.error(
    '[Genkit Dev] Critical error during Genkit initialization or flow loading for "genkit start":',
    error
  );
  console.error(
    '[Genkit Dev] This might be due to issues like missing API keys for AI plugins (e.g., GOOGLE_API_KEY for the googleAI plugin).'
  );
  // Depending on how 'genkit start' and the environment handle errors,
  // explicitly exiting might be necessary to prevent silent failures or restart loops.
  // However, simply logging might be sufficient for diagnostics first.
  // if (process.env.GENKIT_ENV === 'dev') { // Or similar check if needed
  //   process.exit(1);
  // }
}
