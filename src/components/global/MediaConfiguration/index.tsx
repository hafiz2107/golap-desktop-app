import { useStudioSettings } from "@/hooks/useStudioSettings";
import {
  ResourceDeviceStateProps,
  UserProfileProps,
} from "@/types/index.types";
import Spinner from "../Loader";
import { Headphones, Monitor, Settings2 } from "lucide-react";

type Props = {
  state: ResourceDeviceStateProps;
  user: UserProfileProps["user"];
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
    <form action="" className="flex h-full relativ2e w-full flex-col gap-y-5">
      {isPending && (
        <div className="fixed z-50 w-full top-0 left-0 bottom-0 rounded-2xl bg-black/80 flex justify-center items-center">
          <Spinner />
        </div>
      )}
      <div className="flex gap-x-5 justify-center items-center">
        <Monitor fill="#575655" color="#575655" size={36} />
        <select
          {...register("screen")}
          className="outline-none cursor-pointer px-5 py-2 rounded-2xl border-2 text-white border-[#575655] bg-transparent w-full"
        >
          {state?.displays?.map((display, key) => (
            <option
              selected={activeScreen && activeScreen.id === display.id}
              value={display.id}
              className="bg-[#171717] cursor-pointer"
              key={key}
            >
              {display.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-x-5 justify-center items-center">
        <Headphones color="#575655" size={36} />
        <select
          {...register("audio")}
          className="outline-none cursor-pointer px-5 py-2 rounded-2xl border-2 text-white border-[#575655] bg-transparent w-full"
        >
          {state?.audioInputs?.map((device, key) => (
            <option
              selected={activeAudio && activeAudio.deviceId === device.deviceId}
              value={device.deviceId}
              className="bg-[#171717] cursor-pointer"
              key={key}
            >
              {device.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-x-5 justify-center items-center">
        <Settings2 color="#575655" size={36} />
        <select
          {...register("preset")}
          className="outline-none cursor-pointer px-5 py-2 rounded-2xl border-2 text-white border-[#575655] bg-transparent w-full"
        >
          <option
            value="HD"
            disabled={user?.subscription?.plan === "FREE"}
            selected={onPreset === "HD" || user?.studio?.preset === "HD"}
            className="bg-[#171717] cursor-pointer"
          >
            1080P
          </option>
          <option
            value="SD"
            selected={onPreset === "SD" || user?.studio?.preset === "SD"}
            className="bg-[#171717] cursor-pointer"
          >
            720P
          </option>
        </select>
      </div>
    </form>
  );
};

export default MediaConfiguration;
