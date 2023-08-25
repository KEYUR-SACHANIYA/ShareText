import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import useCurrentUser from "@/hooks/useCurrentUser";
import useDeleteCommentModal from "@/hooks/useDeleteCommentModal";
import usePost from "@/hooks/usePost";
import useLoginModal from "@/hooks/useLoginModal";
import Input from "../common/Input";
import Modal from "../common/Modal";

const DeleteCommentModal = () => {
  const editModal = useDeleteCommentModal();
  const { data: currentUser } = useCurrentUser();
  const { mutate: mutateFetchedPost } = usePost(editModal.postId || "");
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const deleteComment = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      setIsLoading(true);
      await axios.delete(`/api/comment/${editModal.commentId}`);
      toast.success("Comment removed");
      mutateFetchedPost();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      editModal.onClose();
    }
  }, [currentUser, editModal, mutateFetchedPost, loginModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Your comment"
        value={editModal.text}
        onChange={() => {}}
        disabled={true}
      />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={editModal.isOpen}
      title="Delete your comment"
      actionLabel="Delete"
      onClose={editModal.onClose}
      onSubmit={deleteComment}
      body={bodyContent}
    />
  );
};

export default DeleteCommentModal;