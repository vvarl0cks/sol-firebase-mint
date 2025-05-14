Firebase Data Records to Soloena Blockchain
=================

A Next.js project that mints Firebase data as on-chain records on Solana Devnet using Arweave (Bundlr). The project includes a frontend UI with a progress bar and status tracker to monitor the minting process.

Features
--------

-   Fetches data from Firebase Firestore.
-   Uploads data to Arweave using Bundlr.
-   Records the Arweave transaction ID on Solana Devnet using a memo.
-   Provides a responsive UI with Tailwind CSS to trigger and monitor the minting process.
-   Built with Next.js 15.3.2, TypeScript, App Router, and ESLint.

Prerequisites
-------------

-   **Node.js**: v20.12.0 (recommended, use `nvm` to manage versions).
-   **Solana Devnet Wallet**: A wallet (e.g., Phantom) with test SOL for Devnet.
-   **Firebase Project**: A Firebase project with Firestore enabled and a service account key (`firebase-service-account.json`).
-   **Codespace/GitHub**: For development and version control.

Setup Instructions
------------------

1.  **Clone the Repository**:

    ```
    git clone <your-repo-url>
    cd sol-firebase-mint

    ```

2.  **Install Dependencies**:

    ```
    npm install

    ```

3.  **Set Up Environment Variables**:

    -   Create a `.env.local` file in the project root:

        ```
        NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
        NEXT_PUBLIC_SOLANA_PRIVATE_KEY=[your_private_key_here]

        ```

    -   Replace `[your_private_key_here]` with your Solana Devnet private key (base64-encoded, e.g., from `solana-keygen`).
4.  **Add Firebase Service Account**:

    -   Place your `firebase-service-account.json` file in the project root.
    -   Ensure it's listed in `.gitignore` to avoid committing it.
5.  **Fund Your Devnet Wallet**:

    -   Use a faucet like [Solana Faucet](https://faucet.solana.com/) to get test SOL for your wallet.

Usage
-----

1.  **Run the Development Server**:

    ```
    npm run dev

    ```
    or
    ```
    npm run dev --turbopack
    ```
    
    -   Note: Turbopack (`--turbopack`) is disabled due to compatibility issues with Next.js 15.3.2 and Node.js v20.19.0. Use Webpack for now.
2.  **Access the App**:

    -   Open `http://localhost:3000` in your browser.
3.  **Mint Data**:

    -   Connect a Solana Devnet wallet (e.g., Phantom) using the "Connect Wallet" button.
    -   Click "Mint Data" to fetch data from Firebase, upload it to Arweave, and record the transaction on Solana.
    -   Monitor the progress bar and status messages.
    -   View the Arweave transaction ID and Solana transaction signature upon completion.

Testing
-------

1.  **Create Sample Firebase Data**:

    -   In your Firebase Firestore, create a collection named `items` with sample documents (e.g., `{ name: "Item 1", description: "Test item" }`).
2.  **Verify Transactions**:

    -   After minting, click the provided links to verify the Arweave transaction on [Viewblock](https://viewblock.io/arweave) and the Solana transaction on [Solana Explorer](https://explorer.solana.com/?cluster=devnet).

Project Structure
-----------------

```
sol-firebase-mint/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── mint/
│   │   │       └── route.ts
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── lib/
│   │   └── firebaseAdmin.ts
│   └── styles/
│       └── globals.css
├── firebase-service-account.json
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md

```

Dependencies
------------

-   **Next.js**: 15.3.2 (App Router)
-   **React**: 19.0.0
-   **Firebase Admin**: 13.4.0
-   **Solana**: `@solana/web3.js`, `@solana/wallet-adapter-react`, `@solana/spl-memo`
-   **Arweave/Bundlr**: `@bundlr-network/client`
-   **Tailwind CSS**: 4.x

Notes
-----

-   **Security**: Never commit `firebase-service-account.json` or `.env.local`. Use a secrets manager in production.
-   **Private Key**: `NEXT_PUBLIC_SOLANA_PRIVATE_KEY` is used server-side for testing. In production, use a non-public variable (e.g., `SOLANA_PRIVATE_KEY`) and secure it.
-   **Turbopack**: Disabled due to `require-hook` error with Node.js v20.19.0. Use Webpack until fixed.
-   **Time**: It's 09:23 AM WIB on May 14, 2025---ensure your Devnet wallet is funded.

Troubleshooting
---------------

-   **Turbopack Error**: If you encounter `Cannot find module '../server/require-hook'`, disable Turbopack by removing `--turbopack` from the `dev` script.
-   **Node.js Version**: Use Node.js v20.12.0 for better compatibility.
-   **Insufficient SOL**: Ensure your wallet has at least 0.001 SOL for fees.