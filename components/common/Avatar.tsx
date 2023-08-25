import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback } from "react";
import useUser from "@/hooks/useUser";

interface AvatarProps {
  userId: string;
  isLarge?: boolean;
  hasBorder?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ userId, isLarge, hasBorder }) => {
  const router = useRouter();
  const { data: fetchedUser } = useUser(userId);

  const onClick = useCallback((event: any) => {
    event.stopPropagation();
    const url = `/users/${userId}`;
    router.push(url);
  }, [router, userId]);

  return (
    <div
      className={`
        ${hasBorder ? 'border-4 border-black' : ''}
        ${isLarge ? 'min-w-[128px] min-h-[128px]' : 'min-w-[48px] max-w-[48px] min-h-[48px] max-h-[48px]'}
        rounded-full 
        hover:opacity-90 
        transition 
        cursor-pointer
        relative
      `}
    >
      <Image
        fill
        sizes="100%"
        style={{
          objectFit: 'cover',
          borderRadius: '100%'
        }}
        alt="Avatar"
        onClick={onClick}
        src={fetchedUser?.profileImage || '/images/placeholder.png'}
      />
    </div>
  );
}
 
export default Avatar;