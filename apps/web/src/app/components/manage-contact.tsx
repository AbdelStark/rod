import React, { useState, useEffect, useMemo, ChangeEvent } from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { getTransactions } from "../../utils/storage/cashu";
import { ICashuInvoice } from "../../types/wallet";
import { MintQuoteState } from "@cashu/cashu-ts";
import { Contact } from "../../types";
import { addContacts, getContacts, updateContacts } from "../../utils/storage/nostr";
import { useNostrContext } from "../context";
import NDK, { NDKEvent, NDKKind, NDKUserProfile } from "@nostr-dev-kit/ndk";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";
import { nip19 } from "nostr-tools";
import { TypeToast, useToast } from "../../hooks/useToast";
import { useCashuStore } from "../../store";
import { useProfileMetadata } from "../../hooks/useProfileMetadata";

interface ManageContactsProps {
  contactsProps: Contact[];
  onDeleteContact?: (contact: Contact) => void;
  onAddContact?: (contact: Contact) => void;
}

const CONTACTS_PER_PAGE = 3;

const ManageContacts: React.FC<ManageContactsProps> = ({
  contactsProps
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { contacts: contactsStore, setContacts: setContactsStore } = useCashuStore()
  const { ndk } = useNostrContext()
  const [_, setAnimate] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(contactsProps ?
    [...contactsProps,
    ...contactsStore]
    : [...contactsStore]
  )
  const [nostrAddress, setNostrAddress] = useState<string | undefined>()
  // const [profileEvent, setProfileEvent] = useState<NDKEvent | undefined>()
  // const [profileToAdd, setProfileToAdd] = useState<NDKUserProfile | undefined>()

  const { handleCheckNostr, user, eventProfile } = useProfileMetadata()
  const { addToast } = useToast()
  const totalContact = useMemo(() => {

    return contacts?.length ?? 10
  }, [contacts])

  const totalPages = Math.ceil(totalContact / CONTACTS_PER_PAGE);
  const startIndex = (currentPage - 1) * CONTACTS_PER_PAGE;
  const visibleContacts = contacts?.reverse().slice(
    // const visibleContacts = txInvoices?.reverse().slice(
    startIndex,
    startIndex + CONTACTS_PER_PAGE,
  );
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => {
      setAnimate(false);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [currentPage]);




  useEffect(() => {
    const handleGetContacts = async () => {
      const contactLocal = await getContacts()

      if (contactLocal) {
        const contacts: Contact[] = JSON.parse(contactLocal)
        setContacts(contacts)
        setContactsStore(contacts)
      }

      const profiles = await ndk.fetchEvents({
        kinds: [NDKKind.Metadata],

      })
      console.log("profiles", profiles)
    }
    handleGetContacts()

  }, [])

  const handleChangeNostrAddress = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNostrAddress(value);

  };

  const handleRemoveContact = (contactToRemove: Contact) => {
    console.log("handleRemoveContact",)

    const contactLocal = getContacts()
    if (contactLocal) {
      const contactsExisting: Contact[] = JSON.parse(contactLocal)

      const oldLen = contactsExisting?.length;
      const newContacts = contactsExisting.filter((c) => c?.nip05 != contactToRemove?.nip05)
      const newLen = newContacts?.length;
      updateContacts(newContacts)
      console.log("newContacts", newContacts)

      setContactsStore(newContacts)
      setContacts(newContacts)

      if (newLen != oldLen) {
        addToast({
          title: "Remove contact successful", type: TypeToast.success
        })
      } else {
        addToast({
          title: "Remove failed", type: TypeToast.warning
        })
      }

    }

  }

  const handleAddContact = () => {

    const contactLocal = getContacts()
    if (!user) {
      return addToast({
        title: "Remove coming soon", type: TypeToast.error
      })
    }
    let newContact: Contact = {
      ...user,
      pubkey: nostrAddress,
      nprofile: nostrAddress
    }
    if (contactLocal) {
      const contactsExisting: Contact[] = JSON.parse(contactLocal)

      const isFind = contactsExisting.find((c) => c?.nip05 === user?.nip05)
      if (isFind) {
        return addToast({
          title: "Contact already added", type: TypeToast.warning
        })
      }

      addContacts([newContact])
      setContacts([...contacts, user])
      addToast({ title: "Contact added", type: TypeToast.success })
    } else {


      addContacts([newContact])
      setContacts([...contacts, user])
      addToast({ title: "Contact added", type: TypeToast.success })
    }


  }

  return (
    <div
    // className="overflow-y overflow-scroll"
    >
      <h3 className="section-title mb-4 ">All contacts</h3>
      <TabGroup>

        <TabList
          className={"flex gap-5"}>
          <Tab
            className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
          >
            All contacts
          </Tab>
          <Tab
            className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
          >Add new contact</Tab>
        </TabList>
        <TabPanels>

          <TabPanel>
            <div className="card">
              {visibleContacts && visibleContacts?.length > 0 && visibleContacts?.map((c) => (
                <div
                  className="transaction-item px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                  key={c?.handle}
                  onClick={() => {
                    // onTransactionClick(tx);
                  }}
                >

                  <div
                    className="flex items-center p-2 hover:bg-gray-700 rounded-lg transition-colors duration-150"
                    key={c?.handle}
                  >
                    {c?.image &&
                      <img
                        alt={c?.nip05}
                        className="w-10 h-10 rounded-full mr-3"
                        src={c?.image?.toString()}
                      />
                    }

                    <span>{c?.nip05}</span>


                  </div>

                  <div className="px-3">
                    <button onClick={() => handleRemoveContact(c)}>Remove</button>
                  </div>
                  {/* 
                  <div className="justify-between items-center mt-1">
                    <div>

                      {c?.avatarUrl &&
                        <Image
                          alt={`Avatar of ${c?.avatarUrl}`}
                          height={30}
                          src={c?.avatarUrl}
                          width={30}
                        // width={70}
                        />
                      }
                    </div>
                    <p className="text-sm text-text-secondary">
                      {c?.handle}
                    </p>
                  </div> */}



                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <button
                  className="pagination-button"
                  disabled={currentPage === 1}
                  onClick={goToPreviousPage}
                >
                  <ChevronLeftIcon className="w-5 h-5 text-text-secondary" />
                </button>
                <span className="pagination-text">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="pagination-button"
                  disabled={currentPage === totalPages}
                  onClick={goToNextPage}
                >
                  <ChevronRightIcon className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
            )}
          </TabPanel>

          <TabPanel>
            <div>

              <div>Add a contact with Nostr address</div>

              <input
                className="bg-black text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
                onChange={handleChangeNostrAddress}
                type="text"
                value={nostrAddress}
              >
              </input>

              <div>

                {eventProfile &&

                  <div>

                  </div>
                }

                {user &&
                  <>

                    {/* {profileToAdd?.image &&
                      <Image
                        alt={`Avatar of ${profileToAdd.handle}`}
                        height={64}
                        src={profileToAdd?.image}
                        width={64}
                      />
                    } */}
                    <div
                      className="flex justify-between items-center mt-1">
                    </div>

                    <div>
                      <p className="text-sm text-text-secondary">
                        NIP05:  {user?.nip05}
                      </p>
                      <div >
                        <p className="text-sm text-text-secondary">
                          Lightning address:  {user?.lud16}
                        </p>
                      </div>
                      <p className="text-sm text-text-secondary">
                        Name:  {user?.displayName}
                      </p>
                      <p className="text-sm text-text-secondary">
                        About:  {user?.about}
                      </p>
                      <p className="text-sm text-text-secondary">
                        Bio:  {user?.bio}
                      </p>
                      <p className="text-sm text-text-secondary">
                        Name:  {user?.name}
                      </p>
                    </div>
                  </>

                }
              </div>
              <button
                className="mt-6 w-full bg-accent text-white rounded-lg py-2 hover:bg-opacity-90 transition-colors duration-150"

                onClick={async () => {


                  await handleCheckNostr(nostrAddress)
                }}
              >

                Check address

              </button>


              <button
                className="mt-6 w-full bg-accent text-white rounded-lg py-2 hover:bg-opacity-90 transition-colors duration-150"

                onClick={handleAddContact}
              >

                Add contact

              </button>


            </div>
          </TabPanel>

        </TabPanels>



      </TabGroup>



    </div >
  );
};

export default ManageContacts;
