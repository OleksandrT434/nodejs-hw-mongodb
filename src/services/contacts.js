import { Contact } from "../db/models/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllContacts = async ({ page, perPage, sortBy, sortOrder, filter = {},}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    //////////////FILTER//////////////////////

    const contactQuery = Contact.find();
    if (typeof filter.type === 'string') {
        contactQuery.where('contactType').equals(filter.type);
    }
    if (typeof filter.isFavourite === 'boolean') {
        contactQuery.where('isFavourite').equals(filter.isFavourite);
    }
        ////////////////////////////////////////
    const[ contactsCount, contacts] = await Promise.all([ Contact.find().merge(contactQuery).countDocuments(), 
    contactQuery
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);
    const paginationData = calculatePaginationData(contactsCount, page, perPage);

    return {
        data: contacts,
        ...paginationData
    }
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
