import { MeltQuoteResponse, Proof, Token } from '@cashu/cashu-ts';
import { ICashuInvoice, ProofInvoice } from '../../types/wallet';

export const KEY_CASHU_STORE = {
  INVOICES: "INVOICES",
  QUOTES: "QUOTES",
  TOKENS: "TOKENS",
  PROOFS: "PROOFS",
  PROOFS_SPENT: "PROOFS_SPENT",
  TRANSACTIONS: "TRANSACTIONS",

}
export const storeTokens = (tokens: Token[]) => {
  localStorage.setItem(KEY_CASHU_STORE.TOKENS, JSON.stringify(tokens));
};

export const getTokens = () => {
  return localStorage.getItem(KEY_CASHU_STORE.TOKENS);
};

export const storeQuotes = (quotes: MeltQuoteResponse[]) => {

  localStorage.setItem(KEY_CASHU_STORE.QUOTES, JSON.stringify(quotes));
};


export const getQuotes = () => {
  return localStorage.getItem(KEY_CASHU_STORE.QUOTES);
};


export const storeProofs = (proofs: ProofInvoice[]) => {


  localStorage.setItem(KEY_CASHU_STORE.PROOFS, JSON.stringify(proofs));
};


export const getProofs = () => {


  return localStorage.getItem(KEY_CASHU_STORE.PROOFS);
};


export const getInvoices = () => {


  return localStorage.getItem(KEY_CASHU_STORE.INVOICES);
};


export const storeInvoices = (invoices: ICashuInvoice[]) => {

  localStorage.setItem(KEY_CASHU_STORE.INVOICES, JSON.stringify(invoices));
};

export const addInvoices = (invoicesToAdd: ICashuInvoice[]) => {
  const proofsLocal = getInvoices()
  if (!proofsLocal) {
    storeInvoices([...invoicesToAdd as ICashuInvoice[]])
  } else {
    const invoicesOld: ICashuInvoice[] = JSON.parse(proofsLocal)
    storeInvoices([...invoicesOld, ...invoicesToAdd as ICashuInvoice[]])
  }

}



export const getTransactions = () => {

  return localStorage.getItem(KEY_CASHU_STORE.TRANSACTIONS);
};


export const storeTransactions = (transactions: ICashuInvoice[]) => {

  localStorage.setItem(KEY_CASHU_STORE.TRANSACTIONS, JSON.stringify(transactions));
};

export const addProofs = (proofsToAdd: ProofInvoice[]) => {
  const proofsLocal = getProofs()
  if (!proofsLocal) {
    storeProofs([...proofsToAdd as ProofInvoice[]])
  } else {
    const proofs: ProofInvoice[] = JSON.parse(proofsLocal)
    storeProofs([...proofs, ...proofsToAdd as ProofInvoice[]])
  }

}

export const storeProofsSpent = (proofs: ProofInvoice[]) => {

  localStorage.setItem(KEY_CASHU_STORE.PROOFS_SPENT, JSON.stringify(proofs));
};


export const getProofsSpent = () => {

  return localStorage.getItem(KEY_CASHU_STORE.PROOFS_SPENT);
};
export const addProofsSpent = (proofsToAdd: ProofInvoice[]) => {
  const proofsLocal = getProofsSpent()
  if (!proofsLocal) {
    storeProofsSpent([...proofsToAdd as ProofInvoice[]])
    return proofsToAdd;
  } else {
    const proofs: ProofInvoice[] = JSON.parse(proofsLocal)
    storeProofsSpent([...proofs, ...proofsToAdd as ProofInvoice[]])
    return proofs;
  }

}

export const updateProofsSpent = (proofsToAdd: ProofInvoice[]) => {
  const proofsLocal = getProofsSpent()
  if (!proofsLocal) {
    storeProofsSpent([...proofsToAdd as ProofInvoice[]])
  } else {
    storeProofsSpent([...proofsToAdd as ProofInvoice[]])

  }
  return proofsToAdd;

}
