import { Router } from 'express';
import { getByAllContacts, getByOneContact, createContactController, patchContactController, deleteContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import upload  from '../middlewares/upload.js'


const router = Router();


router.get('/', ctrlWrapper(getByAllContacts));

router.get('/:contactId', isValidId, ctrlWrapper(getByOneContact));

router.post('/', upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContactController));

router.patch('/:contactId', upload.single('photo'), isValidId, validateBody(updateContactSchema), ctrlWrapper(patchContactController));

router.delete('/:contactId', isValidId,  ctrlWrapper(deleteContactController) );

export default router;