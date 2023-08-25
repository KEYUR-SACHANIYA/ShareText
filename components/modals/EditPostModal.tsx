import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import useCurrentUser from "@/hooks/useCurrentUser";
import useEditPostModal from "@/hooks/useEditPostModal";
import usePost from "@/hooks/usePost";
import usePosts from "@/hooks/usePosts";
import Input from "../common/Input";
import Modal from "../common/Modal";

const EditPostModal = () => {
  const router = useRouter();
  const editModal = useEditPostModal();
  const { data: currentUser } = useCurrentUser();
  const { mutate: mutateFetchedPost } = usePost(editModal.postId || "");
  const { mutate: mutateFetchedPosts } = usePosts(
    router.pathname === "/" ? "" : currentUser?.id || "",
  );

  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setText(editModal.text);
  }, [editModal.text]);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/posts/${editModal.postId}`, { text });
      mutateFetchedPost();
      mutateFetchedPosts();

      toast.success("Post edited");
      editModal.onClose();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [editModal, mutateFetchedPost, mutateFetchedPosts, text]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Your post"
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
      title="Edit your post"
      actionLabel="Save"
      onClose={editModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
};

export default EditPostModal;