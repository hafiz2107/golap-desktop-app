import { useStudioSettings } from '@/hooks/useStudioSettings';
import {
  ResourceDeviceStateProps,
  UserProfileProps,
} from '@/types/index.types';
import React from 'react';

type Props = {
  state: ResourceDeviceStateProps;
  user: UserProfileProps['user'];
};

const MediaConfiguration = ({ state, user }: Props) => {
  const activeScreen = state.displays?.find(
    (screen) => screen.id === user?.studio?.screen
  );

  const activeAudio = state.audioInputs?.find(
    (device) => device.deviceId === user?.studio?.mic
  );

  const { isPending, onPreset, register } = useStudioSettings(
    user!.id,
    user?.studio?.screen || state.displays?.[0]?.id,
    user?.studio?.mic || state.audioInputs?.[0]?.deviceId,
    user?.studio?.preset,
    user?.subscription?.plan
  );
  return (
    <form action="" className="flex h-full relative w-full flex-col gap-y-5">
      {}
    </form>
  );
};

export default MediaConfiguration;
