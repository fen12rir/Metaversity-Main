import { createWalletClient, http, createPublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';

export const getPublicClient = () => {
  return createPublicClient({
    chain: base,
    transport: http(BASE_RPC_URL),
  });
};

export const mintProofOfWorkNFT = async (privateKey, recipientAddress, metadataUri) => {
  try {
    if (!privateKey) {
      throw new Error('Private key not configured');
    }

    const account = privateKeyToAccount(privateKey);
    
    const walletClient = createWalletClient({
      account,
      chain: base,
      transport: http(BASE_RPC_URL),
    });
    
    const txHash = await walletClient.sendTransaction({
      to: recipientAddress,
      value: 0n,
      data: metadataUri,
    });

    return txHash;
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
};

export const verifyTransaction = async (txHash) => {
  try {
    const publicClient = getPublicClient();
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    return receipt.status === 'success';
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return false;
  }
};

