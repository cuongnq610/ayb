import { toast } from 'react-toastify';
import ToastSuccess from '@/components/common/toast/ToastSuccess';
import ToastError from '@/components/common/toast/ToastError';
import ToastCollectWinning from '@/components/common/toast/ToastCollectWinning';

const styleToast = {
  width: 'fit-content',
  height: 'fit-content',
  background: 'transparent',
  padding: 0,
  boxShadow: 'none',
};

export function toastErrorFn(isMobile: boolean = true, hash?: string, message?: string) {
  toast(<ToastError message={message} hash={hash} />, {
    icon: undefined,
    bodyStyle: {
      backgroundColor: '#E73558',
      borderRadius: '4px',
    },
    style: {
      ...styleToast,
      transform: isMobile ? 'translateX(2%)' : 'translateX(-6px)',
    },
    toastId: 'error',
  });
}

export function toastErrorClaimFn(isMobile: boolean = true, hash?: string, message?: string) {
  toast(<ToastError message={message} hash={hash} title="Collect Error" />, {
    icon: undefined,
    bodyStyle: {
      backgroundColor: '#E73558',
      borderRadius: '4px',
    },
    style: {
      ...styleToast,
      transform: isMobile ? 'translateX(2%)' : 'translateX(-6px)',
    },
    toastId: 'error',
  });
}

export function toastErrorMintFn(isMobile: boolean = true, hash?: string, message?: string) {
  toast(<ToastError message={message} hash={hash} title="Mint Error" />, {
    icon: undefined,
    bodyStyle: {
      backgroundColor: '#E73558',
      borderRadius: '4px',
    },
    style: {
      ...styleToast,
      transform: isMobile ? 'translateX(2%)' : 'translateX(-6px)',
    },
    toastId: 'error',
  });
}

export function toastSuccessFn(isMobile: boolean = true, hash?: string) {
  toast(<ToastSuccess hash={hash} />, {
    icon: undefined,
    bodyStyle: {
      backgroundColor: '#0CF574',
      borderRadius: '4px',
    },
    style: {
      ...styleToast,
      transform: isMobile ? 'translateX(2%)' : 'translateX(-6px)',
    },
    toastId: 'success',
  });
}

export function toastSuccessClaimFn(isMobile: boolean = true, hash?: string) {
  toast(<ToastSuccess hash={hash} title="Collect Success" content="Congrats on the win!" />, {
    icon: undefined,
    bodyStyle: {
      backgroundColor: '#0CF574',
      borderRadius: '4px',
    },
    style: {
      ...styleToast,
      transform: isMobile ? 'translateX(2%)' : 'translateX(-6px)',
    },
    toastId: 'success',
  });
}

export function toastSuccessMintFn(isMobile: boolean = true, hash?: string) {
  toast(<ToastSuccess hash={hash} title="Mint success" content="Congrats mint success!" />, {
    icon: undefined,
    bodyStyle: {
      backgroundColor: '#0CF574',
      borderRadius: '4px',
    },
    style: {
      ...styleToast,
      transform: isMobile ? 'translateX(2%)' : 'translateX(-6px)',
    },
    toastId: 'success',
  });
}

export function toastCollectWinning(isMobile: boolean = true) {
  toast(<ToastCollectWinning />, {
    icon: undefined,
    autoClose: 2000,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    bodyStyle: {
      backgroundColor: 'transparent',
      width: 'fit-content',
      height: 'fit-content',
    },
    toastId: 'collect-winning',
    style: {
      ...styleToast,
      transform: isMobile ? 'translateX(-8%)' : 'translateX(-85px)',
    },
    progressStyle: {
      display: 'none',
    },
  });
}
