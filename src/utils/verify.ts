import { Verify } from '@walletconnect/types';

export function getVerifyStatus(context?: Verify.Context) {
  if (!context) return '';
  switch (context.verified.validation) {
    case 'VALID':
      return '✅';
    case 'INVALID':
      return '❌';
    case 'UNKNOWN':
      return '❓';
    default:
      return '';
  }
}
