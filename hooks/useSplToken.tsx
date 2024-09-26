import { storagePersister } from '@/lib/react-query-persist';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { useSolana } from './useSolana';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  type Mint
} from '@solana/spl-token';
import get from 'lodash/get';

export const useSplToken = (mint: PublicKey | string | undefined) => {
  const { connection } = useSolana();

  const { data: token } = useQuery({
    queryKey: ['spl-token', mint?.toString()],
    staleTime: 5 * 1000 * 60,
    persister: storagePersister,
    enabled: !!mint,
    queryFn: async (context) => {
      const mintAddr = context.queryKey[1] as String;
      const value = await connection.getParsedAccountInfo(
        new PublicKey(mintAddr)
      );
      const type = get(value?.value, 'data.parsed.type')! as string;
      const mint = get(value?.value, 'data.parsed.info')! as Mint;
      if (!mint) {
        throw new Error('Mint not found');
      } else if (type !== 'mint') {
        throw new Error('This address is not a token address');
      }

      return {
        address: mintAddr,
        decimals: mint.decimals,
        supply: mint.supply.toString(),
        programId: value.value!.owner!.toString()
      };
    }
  });

  return { token };
};
