
export const KEY_NOSTR = {
  CONTACTS_PUBKEY:"CONTACTS_PUBKEY",
  CONTACTS:"CONTACTS",

}
export const storePubkeyContacts = (contacts:string[]) => {

  localStorage.setItem(KEY_NOSTR.CONTACTS_PUBKEY, JSON.stringify(contacts));
};

export const getPubkeyContacts= () => {

  return localStorage.getItem(KEY_NOSTR.CONTACTS_PUBKEY);
};

export const updatePubkeyContacts =  (contacts: string[]) => {
  const proofsLocal =  getPubkeyContacts()
  if (!proofsLocal) {
     storePubkeyContacts([...contacts])
  } else {
     storePubkeyContacts([...contacts])
  }

  return contacts;

}
