import { Router } from 'express';
import { getByAllContacts, getByOneContact, createContactController, patchContactController, deleteContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();


router.get('/', ctrlWrapper(getByAllContacts));

router.get('/:contactId', ctrlWrapper(getByOneContact));

router.post('/', ctrlWrapper(createContactController));

router.patch('/:contactId', ctrlWrapper(patchContactController));

router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;