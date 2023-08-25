import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import useCurrentUser from '@/hooks/useCurrentUser';
import useLoginModal from '@/hooks/useLoginModal';
import useEditCommentModal from '@/hooks/useEditCommentModal';
import useDeleteCommentModal from '@/hooks/useDeleteCommentModal';
import Avatar from '../common/Avatar';

interface CommentItemProps {
  data: Record<string, any>;
}

const CommentItem: React.FC<CommentItemProps> = ({ data = {} }) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const editCommentModal = useEditCommentModal();
  const deleteCommentModal = useDeleteCommentModal();
  const { data: currentUser } = useCurrentUser();

  const goToUser = useCallback((ev: any) => {
    ev.stopPropagation();
    router.push(`/users/${data.user.id}`)
  }, [router, data.user.id]);

  const createdAt = useMemo(() => {
    if (!data?.createdAt) {
      return null;
    }
    return formatDistanceToNowStrict(new Date(data.createdAt));
  }, [data.createdAt])

  const onEdit = useCallback(async (e: any) => {
    e.stopPropagation();

    if (!currentUser) {
      return loginModal.onOpen();
    }

    editCommentModal.onOpen(data.body, data.postId, data.id)
  }, [loginModal, editCommentModal, currentUser, data.body, data.postId, data.id])

  const onDelete = useCallback(async (e: any) => {
    e.stopPropagation();

    if (!currentUser) {
      return loginModal.onOpen();
    }

    deleteCommentModal.onOpen(data.body, data.postId, data.id)
  }, [loginModal, deleteCommentModal, currentUser, data.body, data.postId, data.id])

  return (
    <div className="border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition">
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
        </div>
      </div>
    </div>
  )
}

export default CommentItem;