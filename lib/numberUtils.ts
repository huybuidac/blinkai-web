import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Address, WaitForTransactionReceiptReturnType } from 'viem';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '@/wagmiConfig';
import { add, differenceInSeconds } from 'date-fns';
import { MAX_TIME } from '@/config';
import { calculateNextRewardPeriod } from './timeUtils';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (
  number: string | number,
  minimumFractionDigits: number = 2,
  maximumFractionDigits: number = 6
) => {
  const nf = new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
    minimumFractionDigits:
      minimumFractionDigits > maximumFractionDigits
        ? maximumFractionDigits
        : minimumFractionDigits
  });
  return nf.format(+number);
};

const ABBREVIATIONS: any = {
  B: 1000000000,
  M: 1000000,
  K: 1000
};

export const formatCurrencyShort = (number: number) => {
  for (const symbol in ABBREVIATIONS) {
    if (number >= ABBREVIATIONS[symbol]) {
      return (
        (number / ABBREVIATIONS[symbol]).toFixed(1).replace(/\.?0+$/, '') +
        symbol
      );
    }
  }
  return number?.toString();
};

const minInSeconds = 60;
const hourInSeconds = minInSeconds * 60;
const dayInSeconds = hourInSeconds * 24;

export const secondsToDays = (seconds: number) => seconds / dayInSeconds;

export const secondsInDate = (seconds: number): Date =>
  new Date(seconds * 1000);

type Callbacks__Type = {
  onPrompt?: () => void;
  onSubmitted?: (hash: `0x${string}`) => void;
  onSuccess?: (receipe: WaitForTransactionReceiptReturnType) => void;
  onError?: (err: unknown) => void;
};

export const submitAction = async (
  action: () => Promise<Address>,
  callbacks: Callbacks__Type
) => {
  const { onPrompt, onSubmitted, onSuccess, onError } = callbacks;

  if (onPrompt) onPrompt();

  try {
    const hash = await action();
    if (onSubmitted) onSubmitted(hash);

    const receipe = await waitForTransactionReceipt(config, {
      hash
    });

    console.log(receipe);

    if (onSuccess) onSuccess(receipe);
  } catch (err) {
    if (onError) onError(err);
    console.error(err);
  }
};

export const getUnlockTime = (date: Date, increase_in_seconds: number) => {
  // Now + seconds remaining until next thursday + seconds in {selected time period}
  let unlockTime = add(date, {
    seconds:
      differenceInSeconds(calculateNextRewardPeriod().toDate(), date) +
      increase_in_seconds
  });
  if (increase_in_seconds >= MAX_TIME) {
    // MAX_TIME - 1 second to make sure we never exceed it
    unlockTime = add(date, { seconds: increase_in_seconds - 1 });
  }

  return unlockTime;
};

export const updateQueryParams = (key: string, value: string) => {
  const params = new URLSearchParams(window.location.search);
  params.set(key, value);
  window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
};
