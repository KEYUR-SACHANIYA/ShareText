import axios from "axios";
import { toast } from "react-hot-toast";
import { useCallback, useState } from "react";
import { signIn } from 'next-auth/react';
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import Input from "../common/Input";
import Modal from "../common/Modal";

const getDefaultFormData = (): {
  email: { hasError: boolean, value: string },
  password: { hasError: boolean, value: string },
  username: { hasError: boolean, value: string },
  name: { hasError: boolean, value: string }
} => JSON.parse(JSON.stringify({
  email: { hasError: false, value: '' },
  password: { hasError: false, value: '' },
  username: { hasError: false, value: '' },
  name: { hasError: false, value: '' }
}))

const RegisterModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [formData, setFormData] = useState(getDefaultFormData())
  const [isLoading, setIsLoading] = useState(false);

  const handleFormData = (type = '', value = '') => {
    formData[type as keyof typeof formData].value = value
    if (value) {
      formData[type as keyof typeof formData].hasError = false
    }
    setFormData({ ...formData })
  }

  const resetFormData = () => {
    setFormData(getDefaultFormData())
  }

  const checkError = useCallback(() => {
    let error = false;

    for (const key in formData) {
      if (!formData[key as keyof typeof formData].value) {
        error = true
        formData[key as keyof typeof formData].hasError = true
      }
    }
    if (error) {
      toast.error("Please fill all required fields");
      setFormData({ ...formData })
    } else {
      let errorMessage = '';

      if (!/^[\w\.-]+@[\w\.-]+\.\w+$/.test(formData.email.value)) {
        error = true
        formData.email.hasError = true
        errorMessage = 'Please enter a valid email address'
      } else if (formData.name.value.length < 3) {
        error = true
        formData.name.hasError = true
        errorMessage = 'Name must be at least 3 characters long'
      } else if (formData.name.value.length > 20) {
        error = true
        formData.name.hasError = true
        errorMessage = 'Name cannot exceed 20 characters'
      } else if (formData.username.value.length < 3) {
        error = true
        formData.username.hasError = true
        errorMessage = 'Username must be at least 3 characters long'
      } else if (formData.username.value.length > 20) {
        error = true
        formData.username.hasError = true
        errorMessage = 'Username cannot exceed 20 characters'
      } else if (formData.password.value.length < 6) {
        error = true
        formData.password.hasError = true
        errorMessage = 'Password must be at least 6 characters long'
      } else if (formData.password.value.length > 20) {
        error = true
        formData.password.hasError = true
        errorMessage = 'Password cannot exceed 20 characters'
      }

      if (error) {
        toast.error(errorMessage);
        setFormData({ ...formData })
      }
    }
    return error
  }, [formData])

  const onToggle = useCallback(() => {
    if (isLoading) {
      return;
    }
    registerModal.onClose();
    loginModal.onOpen();
    resetFormData();
  }, [loginModal, registerModal, isLoading]);

  const onClose = useCallback(() => {
    registerModal.onClose();
    resetFormData();
  }, [registerModal])

  const onSubmit = useCallback(async () => {
    try {
      if (!checkError()) {
        setIsLoading(true);

        const response = await axios.post('/api/register', {
          email: formData.email.value,
          password: formData.password.value,
          username: formData.username.value,
          name: formData.name.value,
        });

        if(response.data?.exists) {
          toast.error(response.data?.message || 'Something went wrong')
          return
        }

        toast.success('Profile created successfully');

        const result = await signIn('credentials', {
          email: formData.email.value,
          password: formData.password.value,
        });

        if (!result?.error) {
          toast.success('Logging...', { duration: 4000 });
        }
        registerModal.onClose();
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [formData, registerModal, checkError]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        disabled={isLoading}
        placeholder="Email*"
        value={formData.email.value}
        onChange={(e) => handleFormData("email", e.target.value)}
        hasError={formData.email.hasError}
      />
      <Input
        disabled={isLoading}
        placeholder="Name*"
        value={formData.name.value}
        onChange={(e) => handleFormData("name", e.target.value)}
        hasError={formData.name.hasError}
      />
      <Input
        disabled={isLoading}
        placeholder="Username*"
        value={formData.username.value}
        onChange={(e) => handleFormData("username", e.target.value)}
        hasError={formData.username.hasError}
      />
      <Input
        disabled={isLoading}
        placeholder="Password*"
        type="password"
        value={formData.password.value}
        onChange={(e) => handleFormData("password", e.target.value)}
        hasError={formData.password.hasError}
      />
    </div>
  )

  const footerContent = (
    <div className="text-neutral-400 text-center mt-4">
      <p>Already have an account?&nbsp;
        <span
          onClick={onToggle}
          className="text-white cursor-pointer hover:underline"
        >
          Sign in
        </span>
      </p>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Create an account"
      actionLabel="Register"
      onClose={onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default RegisterModal;