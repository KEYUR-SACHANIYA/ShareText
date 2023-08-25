import useSWR from 'swr';
import fetcher from '@/libs/fetcher';
import toast from 'react-hot-toast';
import axios from 'axios';
import useCurrentUser from './useCurrentUser';

const useNotifications = (userId?: string) => {
  const url = userId ? `/api/notifications/${userId}` : null;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  const { mutate: mutateUser } = useCurrentUser();

  const clearNotifications = async () => {
    try {
      await axios.delete(`/api/notifications/${userId}`);
      mutate();
      mutateUser();
    } catch (error) {
      toast.error('Something went wrong');
    }
  }

  return {
    data,
    error,
    isLoading,
    mutate,
    clearNotifications
  }
};

export default useNotifications;