import { useQuery } from '@tanstack/react-query';
import { useBlinkSolana } from './useBlinkSolana';
import { getPoolAddr, toPoolAccount } from '@/lib/blink-solana';
import { storagePersister } from '@/lib/react-query-persist';

export const usePoolInfo = (slug: string) => {
  const { program } = useBlinkSolana();

  const { data: poolInfo, isLoading } = useQuery({
    queryKey: ['blink-pool', slug],
    staleTime: 1000 * 60,
    persister: storagePersister,
    enabled: !!slug,
    queryFn: async (context) => {
      const slug = context.queryKey[1] as string;

      const poolInfo = await program.account.poolAccount.fetchNullable(
        getPoolAddr(slug)
      );

      return poolInfo ? toPoolAccount(poolInfo) : null;
    }
  });

  return { poolInfo, isLoading };
};
