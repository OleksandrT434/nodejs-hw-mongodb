import { Contact } from "../db/models/contact.js";

export const getAllContacts = async () => {
    const contacts = await Contact.find();
    return contacts;
}

export const getContactById = async (contactId) => {
    const contact = await Contact.findById(contactId);
    return contact;
}

export const createContact = async (payload) => {
    const newContact = await Contact.create(payload);
    return newContact;
}

export const updateContact = async (contactId, payload) => {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, payload, { new: true });
    return updatedContact;
}
export const deleteContact = async (contactId) => {
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    return deletedContact;
}
