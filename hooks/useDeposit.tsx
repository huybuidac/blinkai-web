import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePoolInfo } from './usePoolInfo';
import { useSolana } from './useSolana';
import { useBlinkSolana } from './useBlinkSolana';
import { useSplToken } from './useSplToken';
import { parseUnits } from 'viem';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { useToast } from '@/components/ui/use-toast';
import { BN } from '@coral-xyz/anchor';

export const useDeposit = (slug: string, amount: number, decimals: number) => {
  const { program } = useBlinkSolana();
  const { connectedAccount, anchorProvider } = useSolana();
  const { poolInfo } = usePoolInfo(slug);
  const { token } = useSplToken(poolInfo?.mint);
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const depositMut = useMutation({
    mutationKey: ['deposit', slug, connectedAccount],
    mutationFn: async () => {
      console.log('depositMut', connectedAccount, poolInfo, token);
      if (!connectedAccount || !poolInfo || !token) {
        throw new Error('No connected account or pool info or token');
      }
      const tx = await program.methods
        .deposit(slug, new BN(parseUnits(amount.toString(), decimals)))
        .accounts({
          authority: connectedAccount,
          userVault: getAssociatedTokenAddressSync(
            new PublicKey(poolInfo.mint),
            connectedAccount
          ),
          tokenProgram: new PublicKey(token.programId!)
        })
        .transaction();
      await anchorProvider.sendAndConfirm(tx);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blink-pool', slug] });
      queryClient.invalidateQueries({
        queryKey: ['blink-user-pool', slug, connectedAccount!.toString()]
      });
      queryClient.invalidateQueries({
        queryKey: [
          'spl-token-balance',
          poolInfo!.mint,
          connectedAccount!.toString()
        ]
      });
      toast({
        title: 'Deposit successful',
        description: 'You have successfully deposited ' + amount,
        variant: 'default'
      });
    },
    onError: (error) => {
      console.error('depositMut', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return { depositMut };
};
