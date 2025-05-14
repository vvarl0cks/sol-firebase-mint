import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import Bundlr from '@bundlr-network/client';
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { config } from 'dotenv';

config(); // Load environment variables from .env.local

export async function POST(req: NextRequest) {
  const { publicKey: clientPublicKey } = await req.json();
  const privateKey = process.env.NEXT_PUBLIC_SOLANA_PRIVATE_KEY;

  if (!privateKey) {
    return NextResponse.json({ error: 'Solana private key not found' }, { status: 500 });
  }

  try {
    // Create Keypair from the private key
    const keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(privateKey)));

    // Step 1: Fetch Firebase Data
    const snapshot = await db.collection('items').get();
    const data = snapshot.docs.map(doc => doc.data());

    // Step 2: Upload to Arweave (Bundlr)
    const bundlr = new Bundlr('https://devnet.bundlr.network', 'solana', {
      address: keypair.publicKey.toBase58(),
      providerUrl: process.env.NEXT_PUBLIC_SOLANA_RPC,
      signer: {
        signTransaction: async (transaction) => {
          transaction.partialSign(keypair);
          return transaction;
        },
      },
    });
    const serializedData = JSON.stringify(data);
    const tx = await bundlr.upload(serializedData);
    const arweaveTxId = tx.id;

    // Step 3: Create Solana Memo Transaction
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC, 'confirmed');
    const transaction = new Transaction().add({
      keys: [],
      programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcFxSFUhMzFqwB2D1yQ6g'),
      data: Buffer.from(arweaveTxId),
    });

    // Sign the transaction with the keypair
    transaction.partialSign(keypair);

    // Return the signed transaction for the client to send (optional, depending on your flow)
    return NextResponse.json({
      arweaveId: arweaveTxId,
      transaction: transaction.serialize({ requireAllSignatures: false }).toString('base64'),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Minting failed' }, { status: 500 });
  }
}