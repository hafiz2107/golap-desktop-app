import { ClerkLoading, SignedIn, useUser } from '@clerk/clerk-react';
import Spinner from '../Loader';
import { useEffect, useState } from 'react';
import { UserProfileProps } from '@/types/index.types';
import { fetuserProfile } from '@/lib/utils';
import { useMediaResources } from '@/hooks/useMediaResources';
import MediaConfiguration from '../MediaConfiguration';

const Widget = () => {
  const [profile, setProfile] = useState<UserProfileProps | null>(null);

  const { user } = useUser();
  const { state, fetchMediaResources } = useMediaResources();
  console.log('State -> ', state);
  useEffect(() => {
    if (user && user.id) {
      fetuserProfile(user.id).then((prof) => setProfile(prof));
      fetchMediaResources();
    }
  }, [user]);

  return (
    <div className="p-5">
      <ClerkLoading>
        <div className="h-full flex justify-center items-center">
          <Spinner />
        </div>
      </ClerkLoading>
      <SignedIn>
        {profile ? (
          <MediaConfiguration user={profile.user} state={state} />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner color="#fff" />
          </div>
        )}
      </SignedIn>
    </div>
  );
};

export default Widget;
