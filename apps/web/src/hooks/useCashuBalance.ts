

import { Proof } from "@cashu/cashu-ts"
import { addProofsSpent, getProofs } from "../utils/storage/cashu"
import { useCashu } from "./useCashu"
import { TypeToast, useToast } from "./useToast"
import { ProofInvoice } from "../types/wallet"
import { useEffect, useState } from "react"

export const useCashuBalance = () => {
    const {  wallet, mint, mintUrl, connectCashMint, connectCashWallet } = useCashu()


    const [balance, setBalance] = useState<number>(0)
    const transformProofSpentToTx = (proofs: Proof[]): ProofInvoice[] => {

        return proofs.map((c) => {
            return {
                date: new Date().getTime(),
                direction: 'out',
                ...c
            }
        })

    }

    useEffect(() => {

        getProofsWalletAndBalance()
    },[mintUrl])


    const getProofsWalletAndBalance = async () => {
        console.log("getProofsWalletAndBalance")
        const proofsLocal = getProofs()
        if (proofsLocal) {
            /** TODO clean proofs */
            let proofs: ProofInvoice[] = JSON.parse(proofsLocal)
            console.log("proofs", proofs)

            const proofsSpent = await wallet?.checkProofsSpent(proofs)
            const keys = await mint.getKeySets()
            console.log("proofsSpent", proofsSpent)
            console.log("keys", keys)


            proofs = proofs?.filter((p) => {
                if (!proofsSpent?.includes(p)
                    && keys?.keysets?.find((k) => k?.id == p?.id)
                ) {
                    return p;
                }
            })

            const totalAmount = proofs.reduce((s, t) => (s += t.amount), 0);
            console.log("totalAmount", totalAmount)
            setBalance(totalAmount)

            return totalAmount;

        }


    }


    return {
        balance,
        setBalance,
        getProofsWalletAndBalance
    }

}