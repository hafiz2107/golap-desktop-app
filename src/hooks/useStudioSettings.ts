import { UpdateStudioSettingsSchema } from '@/schemas/studio-settings.schema';
import { useZodForm } from './useZodForm';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { MutationsKeys } from '@/constants/query-keys';
import { updateStudioSettings } from '@/lib/utils';
import { toast } from 'sonner';

export const useStudioSettings = (
  id: string,
  screen?: string | null,
  audio?: string | null,
  preset?: 'HD' | 'SD',
  plan?: 'PRO' | 'FREE'
) => {
  const [onPreset, setPreset] = useState<'HD' | 'SD' | undefined>();
  const { register, watch } = useZodForm(UpdateStudioSettingsSchema, {
    screen: screen!,
    audio: audio!,
    preset: preset!,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: [MutationsKeys.updateStudio],
    mutationFn: (data: {
      screen: string;
      id: string;
      audio: string;
      preset: 'HD' | 'SD';
    }) => updateStudioSettings(data.id, data.screen, data.audio, data.preset),
    onSuccess: (data) =>
      toast(
        data.status === 201 || data.status === 200
          ? 'Success'
          : 'Something went wrong',
        {
          description: data.message,
        }
      ),
  });

  useEffect(() => {
    if (screen && audio && preset) {
      window.ipcRenderer.send('media-sources', {
        screen,
        id,
        audio,
        preset,
        plan,
      });
    }
  }, []);

  useEffect(() => {
    const subscribe = watch((values) => {
      setPreset(values.preset);
      const payload = {
        id,
        audio: values.audio!,
        screen: values.screen!,
        preset: values.preset!,
      };

      mutate(payload);
      window.ipcRenderer.send('media-sources', { ...payload, plan });
    });

    return () => subscribe.unsubscribe();
  }, [watch]);

  return { register, isPending, onPreset };
};
