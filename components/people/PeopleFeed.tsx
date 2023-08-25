import useUsers from '@/hooks/useUsers';
import Avatar from '../common/Avatar';
import { useCallback } from 'react';
import { useRouter } from 'next/router';

const PeopleFeed = () => {
  const router = useRouter();
  const { data: users = [] } = useUsers();

  const goToUser = useCallback((event: any, userId: string) => {
    event.stopPropagation();
    const url = `/users/${userId}`;
    router.push(url);
  }, [router]);

  if (users.length === 0) {
    return null;
  }

  return (
    <div className="p-5">
      <div className="grid grid-cols-4 gap-6">
        {users.map((user: Record<string, any>) => (
          <div key={user.id} className="flex flex-row place-items-center gap-4 col-span-4 md:col-span-2 bg-neutral-800 p-3 rounded-md hover:bg-sky-500 text-neutral-400 hover:text-neutral-800" onClick={(e: any) => goToUser(e, user.id)}>
            <Avatar userId={user.id} />
            <div className="flex flex-col justify-center max-w-full overflow-hidden whitespace-nowrap">
              <p className="text-white font-semibold text-sm overflow-hidden text-ellipsis">{user.name}</p>
              <p className="text-sm overflow-hidden text-ellipsis">@{user.username}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleFeed;