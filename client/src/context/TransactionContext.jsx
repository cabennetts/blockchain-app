import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

// since using MetaMask, we can get access to ethereum object
const { ethereum } = window;

// function to fetch eth contract
const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    // console.log({
    //     provider,
    //     signer,
    //     transactionContract
    // });
    return transactionContract;
}

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    //get data from welcome.jsx
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }

    /*
        CHECK IF WALLET IS CONNECTED
    */ 
    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert("Please install Metamask");
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            //check if there is an account
            if(accounts.length){
                // if true, set as current
                setCurrentAccount(accounts[0]);

                //function to get all transactions
            } else {
                console.log('No accounts found');
            }
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.");
        }
    }
    /*
        CONNECT WALLET
    */ 
    const connectWallet = async () => {
        try{
            if(!ethereum) return alert("Please install Metamask");
            
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.");
        }
    }
    /*
        SEND TRANSACTION
    */
    const sendTransaction = async () => {
        try{
            if(!ethereum) return alert("Please install Metamask");
            // get data from the form
            const { addressTo, amount, keyword, message } = formData;
            // get eth contract
            const transactionContract = getEthereumContract();
            // convert amount to GWEI hex amount
            const parsedAmount = ethers.utils.parseEther(amount);
            // gas 0x5208 = 21000 Gwei (decimal) = ~0.000021 ETH
            await ethereum.request({
                method: 'eth_sendTransaction', 
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', // 21000 Gwei
                    value: parsedAmount._hex, //0.00001 (need to convert to gwei)

                }]
            });

            // store transaction to blockchain
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            // wait for transaction to be finished
            await TransactionContext.wait();
            // once done, set loading to false
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getEthereumCount();
            setTransactionCount(transactionCount.toNumber());

        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.");
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);
    
    return(
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction }}>
            {children}
        </TransactionContext.Provider>
    );
}