import { signIn } from "next-auth/react";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import Input from "../common/Input";
import Modal from "../common/Modal";

const getDefaultFormData = (): {
  email: { hasError: boolean, value: string },
  password: { hasError: boolean, value: string }
} => JSON.parse(JSON.stringify({
  email: { hasError: false, value: '' },
  password: { hasError: false, value: '' }
}))

const LoginModal = () => {
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
      } else if (formData.password.value.length < 6) {
        error = true
        formData.password.hasError = true
        errorMessage = 'Password must be at least 6 characters'
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
    loginModal.onClose();
    registerModal.onOpen();
    resetFormData();
  }, [loginModal, registerModal, isLoading]);

  const onClose = useCallback(() => {
    loginModal.onClose();
    resetFormData();
  }, [loginModal])

  const onSubmit = useCallback(async () => {
    try {
      if(!checkError()) {
        setIsLoading(true);
  
        const result = await signIn('credentials', {
          redirect: false,
          email: formData.email.value,
          password: formData.password.value,
        })
  
        if (!result?.error) {
          toast.success('Logging...', { duration: 4000 })
          loginModal.onClose()
        } else {
          toast.error('Invalid credentials')
        };
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [formData, loginModal, checkError]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Email*"
        value={formData.email.value}
        onChange={(e) => handleFormData("email", e.target.value)}
        disabled={isLoading}
        hasError={formData.email.hasError}
      />
      <Input
        placeholder="Password*"
        type="password"
        value={formData.password.value}
        onChange={(e) => handleFormData("password", e.target.value)}
        disabled={isLoading}
        hasError={formData.password.hasError}
      />
    </div>
  )

  const footerContent = (
    <div className="text-neutral-400 text-center mt-4">
      <p>First time using ShareText?&nbsp;
        <span
          onClick={onToggle}
          className="text-white cursor-pointer hover:underline"
        >
          Create an account
        </span>
      </p>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Sign in"
      onClose={onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default LoginModal;