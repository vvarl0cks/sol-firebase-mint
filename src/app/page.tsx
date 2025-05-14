import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Transaction } from '@solana/web3.js';

export default function Home() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [status, setStatus] = useState<'idle' | 'fetching' | 'uploading' | 'minting' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [arweaveId, setArweaveId] = useState('');
  const [solanaSignature, setSolanaSignature] = useState('');

  const mintData = async () => {
    if (!publicKey) {
      alert('Please connect your wallet');
      return;
    }

    try {
      setStatus('fetching');
      setProgress(33);

      const response = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicKey: publicKey.toBase58() }),
      });

      if (!response.ok) throw new Error('Minting failed');

      const { arweaveId, transaction } = await response.json();
      setArweaveId(arweaveId);
      setStatus('uploading');
      setProgress(66);

      const tx = Transaction.from(Buffer.from(transaction, 'base64'));
      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      setSolanaSignature(signature);

      setStatus('success');
      setProgress(100);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Mint Firebase Data to Solana</h1>
      <WalletMultiButton className="mb-4" />
      <button
        onClick={mintData}
        disabled={status !== 'idle' || !publicKey}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition"
      >
        Mint Data
      </button>

      <div className="w-full max-w-md mt-6">
        <div className="bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-center">
          {status === 'idle' && 'Ready to start'}
          {status === 'fetching' && 'Fetching data from Firebase...'}
          {status === 'uploading' && 'Uploading to Arweave...'}
          {status === 'minting' && 'Minting on Solana...'}
          {status === 'success' && 'Minting completed!'}
          {status === 'error' && 'An error occurred'}
        </p>
      </div>

      {status === 'success' && (
        <div className="mt-6 text-center">
          <p>
            <strong>Arweave Transaction ID:</strong>{' '}
            <a href={`https://viewblock.io/arweave/tx/${arweaveId}`} target="_blank" className="text-blue-600 underline">
              {arweaveId}
            </a>
          </p>
          <p>
            <strong>Solana Transaction Signature:</strong>{' '}
            <a
              href={`https://explorer.solana.com/tx/${solanaSignature}?cluster=devnet`}
              target="_blank"
              className="text-blue-600 underline"
            >
              {solanaSignature}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}