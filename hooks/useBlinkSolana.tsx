import { useSolana } from './useSolana';
import { BlinkSolana } from '../constants/blink_solana';
import BlinkSolanaIDL from '../constants/blink_solana.idl.json';
import { Program } from '@coral-xyz/anchor';
import { useMemo } from 'react';

export const useBlinkSolana = () => {
  const { anonymousProvider } = useSolana();

  const program = useMemo(
    () => new Program<BlinkSolana>(BlinkSolanaIDL as any, anonymousProvider),
    [anonymousProvider]
  );

  return { program };
};
