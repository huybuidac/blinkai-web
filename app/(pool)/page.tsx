'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePoolInfo } from '@/hooks/usePoolInfo';
import { useSolana } from '@/hooks/useSolana';
import { useUserPoolInfo } from '@/hooks/useUserPoolInfo';
import { useSplToken } from '@/hooks/useSplToken';
import { useSplTokenBalance } from '@/hooks/useSplTokenBalance';
import { formatUnits, parseUnits } from 'viem';
import { _100_PERCENT } from '@/lib/blink-solana';
import {
  WalletMultiButton,
  WalletConnectButton
} from '@solana/wallet-adapter-react-ui';
import { useMemo, useState } from 'react';
import { useDeposit } from '@/hooks/useDeposit';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useWithdraw } from '@/hooks/useWithdraw';
import { useFaucet } from '@/hooks/useFaucet';

export default function Page() {
  const SLUG = 'test';
  const { connectedAccount } = useSolana();

  const { poolInfo, isLoading } = usePoolInfo(SLUG);
  const { userPoolInfo, isLoading: isUserPoolInfoLoading } = useUserPoolInfo(
    SLUG,
    connectedAccount
  );
  const { token } = useSplToken(poolInfo?.mint);
  const { balance } = useSplTokenBalance(poolInfo?.mint, connectedAccount);

  const deposited = useMemo(() => {
    return BigInt(userPoolInfo?.amount || 0) > BigInt(0);
  }, [userPoolInfo?.amount]);

  const [amount, setAmount] = useState<number | null>(null);
  const { depositMut } = useDeposit(SLUG, amount || 0, token?.decimals || 9);
  const { withdrawMut } = useWithdraw(SLUG);
  const { faucetMut } = useFaucet();

  const amountError = useMemo(() => {
    const value = amount || 0;
    if (value > +(balance?.uiAmount || 0)) {
      return 'Amount is greater than your balance';
    }
    const decimalAmount = parseUnits(value.toString(), token?.decimals || 9);
    const depositedAmount = BigInt(userPoolInfo?.amount || 0);
    const maxAmount = BigInt(poolInfo?.userMaxAmount || 0);
    if (decimalAmount + depositedAmount > maxAmount) {
      return 'Amount is greater than your accepted amount';
    }

    return '';
  }, [
    amount,
    balance?.uiAmount,
    poolInfo?.userMaxAmount,
    userPoolInfo?.amount,
    token?.decimals
  ]);

  const handleDeposit = () => {
    depositMut.mutate();
  };

  const handleWithdraw = () => {
    withdrawMut.mutate();
  };

  const handleFaucet = () => {
    faucetMut.mutate();
  };

  return (
    <Card className="mx-auto my-10 min-w-[400px] max-w-sm py-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{poolInfo?.slug} Pool</CardTitle>
          <Button
            variant="secondary"
            onClick={handleFaucet}
            disabled={faucetMut.isPending}
          >
            {faucetMut.isPending && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Faucet
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between gap-4 overflow-x-auto">
          <span>Mint:</span>
          <span>{poolInfo?.mint}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Staked:</span>
          <span>
            {formatUnits(
              BigInt(poolInfo?.totalAmount || 0),
              token?.decimals || 9
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Pool Fee:</span>
          <span>{((poolInfo?.feePercent || 0) / _100_PERCENT) * 100}%</span>
        </div>
        <div className="flex justify-between">
          <span>User Accepted Amount:</span>
          <span>
            {formatUnits(
              BigInt(poolInfo?.userMaxAmount || 0),
              token?.decimals || 9
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Your Deposited Amount:</span>
          <span>
            {formatUnits(
              BigInt(userPoolInfo?.amount || 0),
              token?.decimals || 9
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Your Token Balance:</span>
          <span>{balance?.uiAmount || '--'}</span>
        </div>
        <Input
          type="number"
          placeholder="Amount"
          value={amount || ''}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        {amountError && <p className="text-red-500">{amountError}</p>}
        {!connectedAccount ? (
          <div className="flex justify-center">
            <WalletMultiButton />
          </div>
        ) : (
          <>
            <Button
              className="w-full"
              onClick={handleDeposit}
              disabled={depositMut.isPending || !!amountError || !amount}
            >
              {depositMut.isPending && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Deposit
            </Button>
            {deposited && (
              <Button
                className="w-full"
                onClick={handleWithdraw}
                disabled={withdrawMut.isPending}
              >
                {withdrawMut.isPending && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Withdraw
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
