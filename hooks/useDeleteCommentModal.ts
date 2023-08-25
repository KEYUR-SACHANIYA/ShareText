import { create } from 'zustand';

interface DeleteCommentModalStore {
  isOpen: boolean;
  onOpen: (val: string, postId:string, commentId: string) => void;
  onClose: () => void;
  text: string;
  postId: string;
  commentId: string;
}

const useDeleteCommentModal = create<DeleteCommentModalStore>((set) => ({
  isOpen: false,
  onOpen: (text, postId, commentId) => set({ isOpen: true, text, postId, commentId }),
  onClose: () => set({ isOpen: false, text: '', postId: '', commentId: '' }),
  text: '',
  postId: '',
  commentId: ''
}));

export default useDeleteCommentModal;