import { BlinkSolana } from '@/constants/blink_solana';
import BlinkSolanaIDL from '@/constants/blink_solana.idl.json';
import { Program } from '@coral-xyz/anchor';
import { utf8 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { PublicKey } from '@solana/web3.js';
import last from 'lodash/last';

export type BlinkSolanaType = Program<BlinkSolana>;

export type PoolAccountType = Awaited<
  ReturnType<BlinkSolanaType['account']['poolAccount']['fetch']>
>;
export type UserPoolAccountType = Awaited<
  ReturnType<BlinkSolanaType['account']['userPoolAccount']['fetch']>
>;

export const BlinkSolanaProgramId = new PublicKey(BlinkSolanaIDL.address);

export const POOL = 'pool';
export const USER_POOL = 'user_pool';

export const _100_PERCENT = 10000;

export const getPoolAddr = (slug: string) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(POOL), Buffer.from(slug)],
    BlinkSolanaProgramId
  )[0];
};

export const getUserPoolAddr = (slug: string, user: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(USER_POOL), Buffer.from(slug), user.toBuffer()],
    BlinkSolanaProgramId
  )[0];
};

export const toPoolAccount = (account: PoolAccountType) => {
  const slug = [...account.slug];
  while (slug.length && !last(slug)) {
    slug.pop();
  }
  return {
    slug: utf8.decode(Uint8Array.from(slug)),
    authority: account.authority.toBase58(),
    mint: account.mint.toBase58(),
    vault: account.vault.toBase58(),
    feeVault: account.feeVault.toBase58(),
    feePercent: account.feePercent.toNumber(),
    feeAmount: account.feeAmount.toString(),
    totalAmount: account.totalAmount.toString(),
    userMaxAmount: account.userMaxAmount.toString()
  };
};

export const toUserPoolAccount = (account: UserPoolAccountType) => {
  return {
    amount: account.amount.toString()
  };
};
