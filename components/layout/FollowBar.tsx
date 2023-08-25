import useUsers from '@/hooks/useUsers';
import Avatar from '../common/Avatar';
import { useCallback } from 'react';
import { useRouter } from 'next/router';

const FollowBar = () => {
  const router = useRouter();
  const { data: users = [] } = useUsers();

  const goToUser = useCallback((e: any, userId: string) => {
    e.stopPropagation();
    router.push(`/users/${userId}`)
  }, [router]);

  if (users.length === 0) {
    return null;
  }

  return (
    <div className="px-6 py-4 hidden lg:block">
      <div className="bg-neutral-800 rounded-xl p-4">
        <h2 className="text-white text-xl font-semibold">Who to follow</h2>
        <div className="flex flex-col gap-6 mt-4">
          {users.map((user: Record<string, any>) => (
            <div key={user.id} className="flex flex-row gap-4">
              <Avatar userId={user.id} />
              <div className="flex flex-col justify-center max-w-full overflow-hidden  whitespace-nowrap">
                <p className="text-white font-semibold text-sm hover:underline overflow-hidden text-ellipsis" onClick={e => goToUser(e, user.id)}>{user.name}</p>
                <p className="text-neutral-400 text-sm overflow-hidden text-ellipsis">@{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowBar;