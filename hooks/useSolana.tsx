import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { AnchorProvider, web3 } from '@coral-xyz/anchor';
import { useMemo } from 'react';

export function useSolana() {
  const anchorWallet = useAnchorWallet();
  const wallet = useWallet();

  const connectedAccount = useMemo(() => wallet?.publicKey, [wallet]);
  const network = WalletAdapterNetwork.Testnet;
  const solanaRpc = useMemo(() => clusterApiUrl(network), [network]);

  const connection = useMemo(() => new Connection(solanaRpc), [solanaRpc]);
  const anonymousProvider = useMemo(
    () => new AnchorProvider(connection, new MyAnchorWallet(), {}),
    [connection]
  );
  const anchorProvider = useMemo(
    () =>
      new AnchorProvider(connection, anchorWallet || new MyAnchorWallet(), {}),
    [connection, anchorWallet]
  );

  return {
    solanaRpc,
    connection,
    anchorProvider,
    anonymousProvider,
    wallet,
    connectedAccount
  };
}

export class MyAnchorWallet {
  constructor() {
    //
  }

  async signTransaction<T extends web3.Transaction | web3.VersionedTransaction>(
    tx: T
  ): Promise<T> {
    return Promise.resolve(tx);
  }

  async signAllTransactions<
    T extends web3.Transaction | web3.VersionedTransaction
  >(txs: T[]): Promise<T[]> {
    return Promise.resolve(txs);
  }

  get publicKey(): web3.PublicKey {
    return web3.PublicKey.default;
  }
}
