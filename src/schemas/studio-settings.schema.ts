import { z } from 'zod';

export const UpdateStudioSettingsSchema = z.object({
  screen: z.string(),
  audio: z.string(),
  preset: z.enum(['HD', 'SD']),
});
