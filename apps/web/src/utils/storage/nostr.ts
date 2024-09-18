
export const KEY_NOSTR = {
  CONTACTS_PUBKEY:"CONTACTS_PUBKEY",
  CONTACTS:"CONTACTS",

}
export const storePubkeyContacts = async (contacts:string[]) => {

  return localStorage.setItem(KEY_NOSTR.CONTACTS_PUBKEY, JSON.stringify(contacts));
};

export const getPubkeyContacts = async () => {

  return localStorage.getItem(KEY_NOSTR.CONTACTS_PUBKEY);
};

export const updatePubkeyContacts = async (contacts: string[]) => {
  const proofsLocal = await getPubkeyContacts()
  if (!proofsLocal) {
    await storePubkeyContacts([...contacts])
  } else {
    await storePubkeyContacts([...contacts])
  }

}
