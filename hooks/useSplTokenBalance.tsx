import { storagePersister } from '@/lib/react-query-persist';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { useSplToken } from './useSplToken';
import { useSolana } from './useSolana';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';

export const useSplTokenBalance = (
  mint: PublicKey | string | undefined | null,
  user: PublicKey | string | undefined | null
) => {
  const { connection } = useSolana();
  // const { token } = useSplToken(mint);

  const { data: balance, isLoading } = useQuery({
    queryKey: ['spl-token-balance', mint?.toString(), user?.toString()],
    staleTime: 1000 * 20,
    persister: storagePersister,
    enabled: !!mint && !!user,
    queryFn: async (context) => {
      console.log('spl-token-balance', context.queryKey);
      const mintAddr = context.queryKey[1] as string;
      const userAddr = context.queryKey[2] as string;

      const tokenAddress = getAssociatedTokenAddressSync(
        new PublicKey(mintAddr),
        new PublicKey(userAddr)
      );
      const balance = await connection.getTokenAccountBalance(tokenAddress);
      return balance.value;
    }
  });

  return { balance, isLoading };
};
