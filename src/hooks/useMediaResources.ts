import { getMediaResources } from '@/lib/utils';
import { ResourceDeviceStateProps } from '@/types/index.types';
import { useReducer } from 'react';

type DisplayDeviceActionProps = {
  type: 'GET_DEVICES';
  payload: ResourceDeviceStateProps;
};

export const useMediaResources = () => {
  const [state, action] = useReducer(
    (state: ResourceDeviceStateProps, action: DisplayDeviceActionProps) => {
      switch (action.type) {
        case 'GET_DEVICES': {
          return { ...state, ...action.payload };
        }

        default:
          return state;
      }
    },
    {
      displays: [],
      audioInputs: [],
      error: null,
      isPending: false,
    }
  );

  const fetchMediaResources = async () => {
    action({ type: 'GET_DEVICES', payload: { isPending: true } });

    getMediaResources()
      .then((sources) =>
        action({
          type: 'GET_DEVICES',
          payload: {
            displays: sources.displays,
            audioInputs: sources.audio,
            isPending: false,
          },
        })
      )
      .catch((err) => console.log(err));
  };

  return { state, fetchMediaResources };
};
