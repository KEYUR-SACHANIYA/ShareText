import { create } from 'zustand';

interface DeletePostModalStore {
  isOpen: boolean;
  onOpen: (val: string, postId: string) => void;
  onClose: () => void;
  text: string;
  postId: string;
}

const useDeletePostModal = create<DeletePostModalStore>((set) => ({
  isOpen: false,
  onOpen: (text, postId) => set({ isOpen: true, text, postId }),
  onClose: () => set({ isOpen: false, text: '', postId: '' }),
  text: '',
  postId: ''
}));

export default useDeletePostModal;