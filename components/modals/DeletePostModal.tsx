import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import useCurrentUser from "@/hooks/useCurrentUser";
import useDeletePostModal from "@/hooks/useDeletePostModal";
import usePost from "@/hooks/usePost";
import usePosts from "@/hooks/usePosts";
import { useRouter } from "next/router";
import useLoginModal from "@/hooks/useLoginModal";
import Input from "../common/Input";
import Modal from "../common/Modal";

const DeletePostModal = () => {
  const router = useRouter();
  const editModal = useDeletePostModal();
  const { data: currentUser } = useCurrentUser();
  const { mutate: mutateFetchedPost } = usePost(editModal.postId || "");
  const { mutate: mutateFetchedPosts } = usePosts(
    router.pathname === "/" ? "" : currentUser?.id || "",
  );
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const deletePost = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      setIsLoading(true);
      await axios.delete(`/api/posts/${editModal.postId}`);
      toast.success("Post removed");
      if (router.pathname.includes("/posts")) {
        router.push("/");
        return;
      }
      mutateFetchedPost();
      mutateFetchedPosts();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      editModal.onClose();
    }
  }, [
    currentUser,
    editModal,
    mutateFetchedPosts,
    mutateFetchedPost,
    loginModal,
    router,
  ]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Your post"
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
      title="Delete your post"
      actionLabel="Delete"
      onClose={editModal.onClose}
      onSubmit={deletePost}
      body={bodyContent}
    />
  );
};

export default DeletePostModal;