import { useEffect } from "react";
import { BsChatLeftHeartFill } from "react-icons/bs";
import useNotifications from "@/hooks/useNotifications";
import useCurrentUser from "@/hooks/useCurrentUser";
import { format } from "date-fns";
import Button from "../common/Button";

const NotificationsFeed = () => {
  const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser();
  const { data: fetchedNotifications = [], clearNotifications } = useNotifications(currentUser?.id);

  useEffect(() => {
    mutateCurrentUser();
  }, [mutateCurrentUser]);

  if (fetchedNotifications.length === 0) {
    return (
      <div className="text-neutral-600 text-center p-6 text-xl">
        No notifications
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {fetchedNotifications.map((notification: Record<string, any>) => (
        <div key={notification.id} className="flex flex-row items-center p-6 gap-4 border-b-[1px] border-neutral-800">
          <BsChatLeftHeartFill color="white" size={32} />
          <p className="text-white">
            {notification.body} {notification.createdAt ? `on ${format(new Date(notification.createdAt), 'dd MMMM yyyy')} at ${format(new Date(notification.createdAt), 'HH:mm')}` : ''}
          </p>
        </div>
      ))}
      <div className="p-6 text-right">
        <Button
          onClick={clearNotifications}
          label={'Clear'}
          secondary={false}
          outline={true}
        />
      </div>
    </div>
  );
}

export default NotificationsFeed;