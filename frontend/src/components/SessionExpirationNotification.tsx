import React from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

interface SessionExpirationNotificationProps {
  onClose: () => void;
}

const SessionExpirationNotification: React.FC<SessionExpirationNotificationProps> = ({ onClose }) => {
  const router = useRouter();

  const handleOkClick = () => {
    onClose();
    router.push('/'); // Redirect to the login page
  };

  return (
    <div>
      <p>Your session has expired. Please log in again.</p>
      <button onClick={handleOkClick}>OK</button>
    </div>
  );
};

export const showSessionExpirationNotification = () => {
  toast(<SessionExpirationNotification onClose={() => toast.dismiss()} />, {
    autoClose: false,
    closeOnClick: false,
    draggable: false,
    closeButton: false,
  });
};

export default SessionExpirationNotification;
