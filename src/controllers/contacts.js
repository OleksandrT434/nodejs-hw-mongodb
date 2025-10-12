import {
  getAllContacts, getContactById, createContact, updateContact, deleteContact
 } from '../services/contacts.js';
import createHttpError from 'http-errors'
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVariable } from '../utils/getEnvVariable.js';



export async function getByAllContacts(req, res) {

  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);


  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user.id

    });
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts ,
    });
}

export async function getByOneContact (req, res, next) {
    const { contactId } = req.params;
    const contact = await getContactById(contactId, req.user.id);
    if (!contact) {
      throw createHttpError(404, "Contact not found");
    }
  
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data:  contact ,
      });
}

export const createContactController = async (req, res) => {
  let photo;

  if (getEnvVariable('UPLOAD_CLOUDINARY') === "true") {

      const response = await saveFileToCloudinary(req.file.path);
      await fs.unlink(req.file.path);

      photo = response.secure_url;
  } else {
    await fs.rename(
      req.file.path,
      path.resolve("src/uploads/photos", req.file.filename));
    photo = `htttp://localhost30000/images/${req.file.filename}`
  }
  
  const contact = await createContact({
    ...req.body,
    photo,
    userId:
    req.user.id
  });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const updateData = { ...req.body };

  if (req.file) {
    let photo;
    if (getEnvVariable('UPLOAD_CLOUDINARY') === "true") {

      const response = await saveFileToCloudinary(req.file.path);
      await fs.unlink(req.file.path);

      photo = response.secure_url;
    } else {
      await fs.rename(
      req.file.path,
      path.resolve("src/uploads/photos", req.file.filename));
      photo = `htttp://localhost30000/images/${req.file.filename}`
    }
    updateData.photo = photo;
  }
  const result = await updateContact(
    contactId,
    updateData,
    req.user.id
  );
  if (!result) { next (createHttpError(404, "Contact not found"));
    return;
  }
  res.status(200).json({
  status: 200,
	message: "Successfully patched a contact!",
    data: result,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const result = await deleteContact(contactId, req.user.id);
  if (!result) {
    throw createHttpError(404, "Contact not found");
  }
  res.status(204).send();
};


