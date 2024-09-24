import { Proof } from "@cashu/cashu-ts"
import { addProofsSpent, getProofs } from "../utils/storage/cashu"
import { useCashu } from "./useCashu"
import { TypeToast, useToast } from "./useToast"
import { ProofInvoice } from "../types/wallet"

export const usePayment = () => {
    const { meltTokens, wallet } = useCashu()

    const { addToast } = useToast()

    const transformProofSpentToTx = (proofs: Proof[]): ProofInvoice[] => {

        return proofs.map((c) => {
            return {
                date: new Date().getTime(),
                direction: 'out',
                ...c
            }
        })

    }
    const handlePayInvoice = async (invoice?: string) => {


        if (!invoice) return;

        const proofsLocalStr = getProofs()

        /** TODO add tx history for paid invoice/ecash */
        if (proofsLocalStr) {
            let proofsLocal: Proof[] = JSON.parse(proofsLocalStr)
            // console.log("proofsLocal", proofsLocal)
            const proofsSpent = await wallet?.checkProofsSpent(proofsLocal)

            // Filter proofs to spent

            /** TODO better filter of proof based on keysets */
            // console.log("proofsSpent", proofsSpent)

            let proofs = Array.from(proofsLocal && proofsLocal)

            if (proofsSpent) {
                proofs = proofs?.filter((p) => !proofsSpent?.includes(p))
                // proofs = Array.from(new Set([...proofsSpent, ...proofsLocal]))
            }
            const lenProof = proofs?.length
            console.log("proofs", proofs)

            if (lenProof && proofs) {
                const proofsToUsed = proofs?.slice(lenProof - 1, lenProof);
                const tokens = await meltTokens(invoice, proofsToUsed)
                console.log("tokens", tokens)
                if (tokens) {
                    addToast({
                        title: "Payment send",
                        type: TypeToast.success
                    })
                    const proofInvoicesSell = transformProofSpentToTx(proofsToUsed)
                    addProofsSpent(proofInvoicesSell)
                }
                return tokens;
            }

        } else {

            const tokens = await meltTokens(invoice)
            console.log("tokens", tokens)
            if (tokens) {
                addToast({
                    title: "Payment send",
                    type: TypeToast.success
                })
            }
            return tokens;
        }
    }

    return {
        handlePayInvoice
    }

}