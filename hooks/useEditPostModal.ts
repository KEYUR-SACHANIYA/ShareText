import { create } from 'zustand';

interface EditPostModalStore {
  isOpen: boolean;
  onOpen: (val: string, postId: string) => void;
  onClose: () => void;
  text: string;
  postId: string;
}

const useEditPostModal = create<EditPostModalStore>((set) => ({
  isOpen: false,
  onOpen: (text, postId) => set({ isOpen: true, text, postId }),
  onClose: () => set({ isOpen: false, text: '', postId: '' }),
  text: '',
  postId: ''
}));

export default useEditPostModal;