import { useMemo } from 'react';
import { useSolana } from './useSolana';
import { AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createAssociatedTokenAccount,
  getAssociatedTokenAddressSync,
  transfer
} from '@solana/spl-token';
import { toast } from '@/components/ui/use-toast';

const pk = [
  184, 69, 38, 98, 122, 163, 35, 1, 164, 253, 164, 53, 134, 25, 19, 208, 95,
  115, 225, 189, 82, 139, 222, 144, 254, 222, 63, 96, 27, 53, 95, 144, 106, 157,
  223, 247, 46, 81, 34, 239, 133, 119, 46, 136, 31, 31, 76, 245, 137, 168, 35,
  150, 41, 68, 219, 60, 122, 208, 180, 45, 84, 227, 37, 128
];
const mint = new PublicKey('F7m7xfuViVMLc7WT6vAvNDtFqSFqVSFE4YovTrLeBCro');

export const useFaucet = () => {
  const { connectedAccount, connection } = useSolana();
  const queryClient = useQueryClient();

  const secretKey = Uint8Array.from(pk);
  const payer = Keypair.fromSecretKey(secretKey);

  const faucetMut = useMutation({
    mutationKey: ['faucet', connectedAccount],
    mutationFn: async () => {
      if (!connectedAccount) {
        throw new Error('No connected account');
      }
      const fromAta = getAssociatedTokenAddressSync(mint, payer.publicKey);
      const toAta = getAssociatedTokenAddressSync(mint, connectedAccount);

      const tooAtaAcc = await connection.getAccountInfo(toAta);
      if (!tooAtaAcc) {
        await createAssociatedTokenAccount(
          connection,
          payer,
          mint,
          connectedAccount
        );
      }
      await transfer(
        connection,
        payer,
        fromAta,
        toAta,
        payer.publicKey,
        200_000_000_000
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['spl-token-balance', mint, connectedAccount!.toString()]
      });
      toast({
        title: 'Faucet successful',
        description: 'You have successfully received 200 token',
        variant: 'default'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return { faucetMut };
};
