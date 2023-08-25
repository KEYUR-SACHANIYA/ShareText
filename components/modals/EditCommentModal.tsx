import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useEditCommentModal from "@/hooks/useEditCommentModal";
import Input from "../common/Input";
import Modal from "../common/Modal";
import usePost from "@/hooks/usePost";

const EditCommentModal = () => {
  const editModal = useEditCommentModal();
  const { mutate: mutateFetchedPost } = usePost(editModal.postId || "");

  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setText(editModal.text);
  }, [editModal.text]);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/comment/${editModal?.commentId}`, { text });
      mutateFetchedPost();

      toast.success("Comment edited");
      editModal.onClose();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [editModal, mutateFetchedPost, text]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Your comment"
        onChange={(e) => setText(e.target.value)}
        value={text}
        disabled={isLoading}
      />
    </div>
  );

  return (
    <Modal
      disabled={isLoading || !text}
      isOpen={editModal.isOpen}
      title="Edit your comment"
      actionLabel="Save"
      onClose={editModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
};

export default EditCommentModal;