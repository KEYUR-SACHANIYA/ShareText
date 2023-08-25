import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useCurrentUser from "@/hooks/useCurrentUser";
import useEditProfileModal from "@/hooks/useEditProfileModal";
import useUser from "@/hooks/useUser";
import Input from "../common/Input";
import Modal from "../common/Modal";
import ImageUpload from "../common/ImageUpload";

const EditProfileModal = () => {
  const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser();
  const { mutate: mutateFetchedUser } = useUser(currentUser?.id);
  const editModal = useEditProfileModal();

  const [profileImage, setProfileImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [hasError, setHasError] = useState({
    name: false,
    username: false
  })
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setProfileImage(currentUser?.profileImage)
    setCoverImage(currentUser?.coverImage)
    setName(currentUser?.name)
    setUsername(currentUser?.username)
    setBio(currentUser?.bio)
  }, [currentUser?.name, currentUser?.username, currentUser?.bio, currentUser?.profileImage, currentUser?.coverImage]);

  const checkError = useCallback(() => {
    let error = false, errorMessage = '';

    if(!name || !username) {
      error = true
      errorMessage = 'Please fill all required fields'
      setHasError({ name: !name, username: !username })
    } else if (name.length < 3) {
      error = true
      setHasError({ name: true, username: false })
      errorMessage = 'Name must be at least 3 characters long'
    } else if (name.length > 20) {
      error = true
      setHasError({ name: true, username: false })
      errorMessage = 'Name cannot exceed 20 characters'
    } else if (username.length < 3) {
      error = true
      setHasError({ name: false, username: true })
      errorMessage = 'Username must be at least 3 characters long'
    } else if (username.length > 20) {
      error = true
      setHasError({ name: false, username: true })
      errorMessage = 'Username cannot exceed 20 characters'
    }

    if(error) {
      toast.error(errorMessage);
    }

    return error
  }, [name, username])

  const onClose = useCallback(() => {
    setProfileImage(currentUser?.profileImage)
    setCoverImage(currentUser?.coverImage)
    setName(currentUser?.name)
    setUsername(currentUser?.username)
    setBio(currentUser?.bio)
    setHasError({ name: false, username: false })
    editModal.onClose()
  }, [currentUser, editModal])

  const onSubmit = useCallback(async () => {
    try {
      if(!checkError()) {
        setIsLoading(true);
  
        await axios.patch('/api/edit', { name, username, bio, profileImage, coverImage });
        mutateFetchedUser();
        mutateCurrentUser();
        onClose();
  
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [onClose, name, username, bio, mutateFetchedUser, mutateCurrentUser, profileImage, coverImage, checkError]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <ImageUpload
        label="Upload profile image"
        onChange={setProfileImage}
        value={profileImage}
        disabled={isLoading}
      />
      <ImageUpload
        label="Upload cover image"
        onChange={setCoverImage}
        value={coverImage}
        disabled={isLoading}
      />
      <Input
        placeholder="Name*"
        onChange={(e) => {
          setName(e.target.value)
          setHasError({ ...hasError, name: false })
        }}
        value={name}
        disabled={isLoading}
        hasError={hasError.name}
      />
      <Input
        placeholder="Username*"
        onChange={(e) => {
          setUsername(e.target.value)
          setHasError({ ...hasError, username: false })
        }}
        value={username}
        disabled={isLoading}
        hasError={hasError.username}
      />
      <Input
        placeholder="Bio"
        onChange={(e) => setBio(e.target.value)}
        value={bio}
        disabled={isLoading}
      />
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={editModal.isOpen}
      title="Edit your profile"
      actionLabel="Save"
      onClose={onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
}

export default EditProfileModal;