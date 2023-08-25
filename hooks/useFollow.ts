import axios from "axios";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import useCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";
import useUser from "./useUser";

const useFollow = (userId: string) => {
  const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser();
  const { data: user, mutate: mutateFetchedUser } = useUser(userId);
  const loginModal = useLoginModal();

  const isFollowing = useMemo(() => {
    const list = currentUser?.followingIds || [];

    return list.includes(userId);
  }, [currentUser, userId]);

  const toggleFollow = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request, message = "";

      if (isFollowing) {
        request = () => axios.delete('/api/follow', { data: { userId } });
        message = `You Unfollowed ${user?.name}`
      } else {
        request = () => axios.post('/api/follow', { userId });
        message = `You Followed ${user?.name}`
      }
      
      toast.success(message);
      await request();
      mutateCurrentUser();
      mutateFetchedUser();

    } catch (error) {
      toast.error('Something went wrong');
    }
  }, [currentUser, isFollowing, userId, mutateCurrentUser, mutateFetchedUser, loginModal, user?.name]);

  return {
    isFollowing,
    toggleFollow,
  }
}

export default useFollow;