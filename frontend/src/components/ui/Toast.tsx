'use client';

import { useSnackbar, VariantType } from 'notistack';

let enqueueSnackbarRef: ((message: string, options?: { variant: VariantType }) => void) | null = null;

export function ToastInitializer() {
  const { enqueueSnackbar } = useSnackbar();
  enqueueSnackbarRef = enqueueSnackbar;
  return null;
}

export function nxToast(message: string, variant: VariantType = 'default') {
  if (enqueueSnackbarRef) {
    enqueueSnackbarRef(message, { variant });
  }
}

export function nxToastSuccess(message: string) {
  nxToast(message, 'success');
}

export function nxToastError(message: string) {
  nxToast(message, 'error');
}

export function nxToastInfo(message: string) {
  nxToast(message, 'info');
}
