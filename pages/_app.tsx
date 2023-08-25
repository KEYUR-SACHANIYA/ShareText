import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import Layout from '@/components/layout/Layout'
import LoginModal from '@/components/modals/LoginModal'
import RegisterModal from '@/components/modals/RegisterModal'
import EditProfileModal from '@/components/modals/EditProfileModal';
import EditPostModal from '@/components/modals/EditPostModal';
import DeletePostModal from '@/components/modals/DeletePostModal';
import EditCommentModal from '@/components/modals/EditCommentModal';
import DeleteCommentModal from '@/components/modals/DeleteCommentModal';
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Toaster toastOptions={{ duration: 2000 }} />
      <RegisterModal />
      <LoginModal />
      <EditProfileModal />
      <EditPostModal />
      <EditCommentModal />
      <DeletePostModal />
      <DeleteCommentModal />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}
