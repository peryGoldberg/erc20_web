'use client';
import { useState, useMemo } from "react"
import { connect, disconnect } from "get-starknet"
import { Contract, Provider, SequencerProvider, constants } from "starknet"

const contractAddress = "0x001892d81e09cb2c2005f0112891dacb92a6f8ce571edd03ed1f3e549abcf37f"

function App() {
  const [provider, setProvider] = useState({} as Provider)
  const [address, setAddress] = useState('')
  const [currentBlockHash, setCurrentBlockHash] = useState('')
  const [balance, setBalance] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [recipient, setRecipient] = useState('0x');
  const [amount, setAmount] = useState('1000000000000000000');

  const disconnectWallet = async () => {
    try {
      await disconnect({ clearLastWallet: true })
      setProvider({} as Provider)
      setAddress('')
      setIsConnected(false)
    }
    catch (error: any) {
      alert(error.message)
    }
  }

  const connectWallet = async () => {
    try {
      const starknet = await connect()
      if (!starknet) throw new Error("Failed to connect to wallet.")
      await starknet.enable({ starknetVersion: "v5" })
      setProvider(starknet.account)
      setAddress(starknet.selectedAddress || '')
      setIsConnected(true)
    }
    catch (error: any) {
      alert(error.message)
    }
  }

  const checkBalance = async () => {
    try {
      // initialize contract using abi, address and provider
      const { abi: testAbi } = await provider.getClassAt(contractAddress);
      if (testAbi === undefined) { throw new Error("no abi.") };
      const contract = new Contract(testAbi, contractAddress, provider)
      // make contract call
      const data = await contract.balance_of(address)
      setBalance(data.toString())
    }
    catch (error: any) {
      alert(error.message)
    }
  }

  const transfer = async () => {
    try {
      // initialize contract using abi, address and provider
      const { abi: testAbi } = await provider.getClassAt(contractAddress);
      if (testAbi === undefined) { throw new Error("no abi.") };
      const contract = new Contract(testAbi, contractAddress, provider)
      // make contract call
      await contract.transfer(recipient, amount)
    }
    catch (error: any) {
      alert(error.message)
    }
  }

  const current_block_hash = async () => {
    try {
      const provider1 = new SequencerProvider({ baseUrl: constants.BaseUrl.SN_GOERLI });

      const block = await provider1.getBlock("latest"); // <- Get latest block
      setCurrentBlockHash(block.block_hash);
    }
    catch (error: any) {
      alert(error.message)
    }
  }

  current_block_hash()

  const shortenedAddress = useMemo(() => {
    if (!isConnected) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [isConnected, address])

  const handleRecipientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(event.target.value);
  };

  return (
    <div>
      <p>Latest block hash: {currentBlockHash}</p>
      {isConnected ?
        <div>
          <span>Connected: {shortenedAddress}</span>
          <p><button onClick={()=> {disconnectWallet()}}>Disconnect</button></p>
          <hr />
          <p>Balance.</p>
          <p>{balance}</p>
          <p><button onClick={() => checkBalance()}>Check Balance</button></p>
          <hr />
          <p>Transfer.</p>
          <p>Recipient:
              <input
              type="text"
              value={recipient}
              onChange={handleRecipientChange}
              />
          </p>
          <p>Amount (default 1 MKT with 18 decimals):
            <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            />
          </p>
          <p>
            <button onClick={() => transfer()}>Transfer</button>
          </p>
          <hr/>
        </div> :
        <div>
          <span>Choose a wallet:</span>
          <p>
            <button onClick={() => connectWallet()}>Connect a Wallet</button>
          </p>
        </div>
      }
    </div>
  );
}

export default App;