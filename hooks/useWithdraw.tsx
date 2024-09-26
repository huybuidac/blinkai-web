import { PublicKey } from '@solana/web3.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useBlinkSolana } from './useBlinkSolana';
import { usePoolInfo } from './usePoolInfo';
import { useSplToken } from './useSplToken';
import { useSolana } from './useSolana';
import { toast } from '@/components/ui/use-toast';

export const useWithdraw = (slug: string) => {
  const { connectedAccount, anchorProvider } = useSolana();
  const { program } = useBlinkSolana();
  const { poolInfo } = usePoolInfo(slug);
  const { token } = useSplToken(poolInfo?.mint);

  const queryClient = useQueryClient();

  const withdrawMut = useMutation({
    mutationKey: ['withdraw', slug, connectedAccount],
    mutationFn: async () => {
      if (!connectedAccount || !poolInfo || !token) {
        throw new Error('No connected account or pool info');
      }
      const tx = await program.methods
        .withdraw(slug)
        .accounts({
          authority: connectedAccount,
          tokenProgram: new PublicKey(token.programId!)
        })
        .transaction();
      await anchorProvider.sendAndConfirm(tx);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blink-pool', slug] });
      queryClient.invalidateQueries({
        queryKey: ['blink-user-pool', slug, connectedAccount!.toBase58()]
      });
      queryClient.invalidateQueries({
        queryKey: [
          'spl-token-balance',
          poolInfo!.mint,
          connectedAccount?.toBase58()
        ]
      });
      toast({
        title: 'Withdraw successful',
        description: 'You have successfully withdrawn',
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

  return { withdrawMut };
};
