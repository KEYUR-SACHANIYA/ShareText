import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from 'react-icons/ai';
import { formatDistanceToNowStrict } from 'date-fns';
import { MdOutlineEdit } from "react-icons/md"
import { MdDeleteOutline } from "react-icons/md"
import useLoginModal from '@/hooks/useLoginModal';
import useCurrentUser from '@/hooks/useCurrentUser';
import useEditPostModal from '@/hooks/useEditPostModal';
import useDeletePostModal from '@/hooks/useDeletePostModal';
import useLike from '@/hooks/useLike';
import Avatar from '../common/Avatar';

interface PostItemProps {
  data: Record<string, any>;
  userId?: string;
}

const PostItem: React.FC<PostItemProps> = ({ data = {}, userId }) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const editPostModal = useEditPostModal();
  const deletePostModal = useDeletePostModal();

  const { data: currentUser } = useCurrentUser();
  const { hasLiked, toggleLike } = useLike({ postId: data.id, userId });

  const goToUser = useCallback((e: any) => {
    e.stopPropagation();
    router.push(`/users/${data.user.id}`)
  }, [router, data.user.id]);

  const goToPost = useCallback(() => {
    router.push(`/posts/${data.id}`);
  }, [router, data.id]);

  const onLike = useCallback(async (ev: any) => {
    ev.stopPropagation();

    if (!currentUser) {
      return loginModal.onOpen();
    }

    toggleLike();
  }, [loginModal, currentUser, toggleLike]);

  const onDelete = useCallback(async (e: any) => {
    e.stopPropagation();

    if (!currentUser) {
      return loginModal.onOpen();
    }

    deletePostModal.onOpen(data.body, data.id)
  }, [loginModal, currentUser, deletePostModal, data.body, data.id]);

  const onEdit = useCallback(async (e: any) => {
    e.stopPropagation();

    if (!currentUser) {
      return loginModal.onOpen();
    }

    editPostModal.onOpen(data.body, data.id)
  }, [loginModal, currentUser, editPostModal, data.body, data.id]);

  const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;

  const createdAt = useMemo(() => {
    if (!data?.createdAt) {
      return null;
    }
    return formatDistanceToNowStrict(new Date(data.createdAt));
  }, [data.createdAt])

  return (
    <div
      onClick={goToPost}
      className="border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition"
    >
      <div className="flex flex-row items-start gap-3">
        <Avatar userId={data.user.id} />
        <div className="w-full overflow-hidden">
          <div className="flex flex-row items-center justify-between gap-2 whitespace-nowrap">
            <div className="flex flex-row items-center gap-1.5 sm:gap-2">
              <p
                onClick={goToUser}
                className="text-white font-semibold cursor-pointer hover:underline max-w-[45px] sm:max-w-[100px] text-ellipsis overflow-hidden"
              >
                {data.user.name}
              </p>
              <span
                onClick={goToUser}
                className="text-neutral-500 cursor-pointer hover:underline hidden md:block md:max-w-[100px] text-ellipsis overflow-hidden"
              >
                @{data.user.username}
              </span>
              <span className="text-neutral-500 text-sm">
                {createdAt}
              </span>
            </div>
            {
              data.userId === currentUser?.id && <div
                className="
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-1 
                cursor-pointer
                transition 
              ">
                <span className="hover:text-sky-500" onClick={onEdit}>
                  <MdOutlineEdit size={20} />
                </span>
                <span className="hover:text-red-500" onClick={onDelete}>
                  <MdDeleteOutline size={20} />
                </span>
              </div>
            }
          </div>
          <div className="text-white mt-1 overflow-hidden break-words">
            {data.body}
          </div>
          <div className="flex flex-row items-center mt-3 gap-10">
            <div className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer  transition hover:text-sky-500">
              <AiOutlineMessage size={20} />
              <p>
                {data.comments?.length || 0}
              </p>
            </div>
            <div
              onClick={onLike}
              className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500"
            >
              <LikeIcon color={hasLiked ? 'red' : ''} size={20} />
              <p>
                {data.likedIds.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostItem;