import { PublicKey } from '@solana/web3.js';
import { useBlinkSolana } from './useBlinkSolana';
import { useQuery } from '@tanstack/react-query';
import { storagePersister } from '@/lib/react-query-persist';
import { getUserPoolAddr, toUserPoolAccount } from '@/lib/blink-solana';

export const useUserPoolInfo = (
  slug: string,
  user: PublicKey | undefined | null
) => {
  const { program } = useBlinkSolana();

  const { data: userPoolInfo, isLoading } = useQuery({
    queryKey: ['blink-user-pool', slug, user?.toString()],
    staleTime: 1000 * 20,
    persister: storagePersister,
    enabled: !!slug && !!user,
    queryFn: async (context) => {
      console.log('userPoolInfo', context);
      const slug = context.queryKey[1] as string;
      const user = context.queryKey[2] as string;

      const userPoolInfo = await program.account.userPoolAccount.fetchNullable(
        getUserPoolAddr(slug, new PublicKey(user))
      );

      return userPoolInfo ? toUserPoolAccount(userPoolInfo) : null;
    }
  });

  return { userPoolInfo, isLoading };
};
