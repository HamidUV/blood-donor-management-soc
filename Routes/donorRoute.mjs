import { Router } from 'express';
import { getDonors, addDonor, filterDonors, addDonorsdata, deleteDonor, logDonation } from '../Controllers/donorController.mjs';
import { showForm, uploadForm, processExcel } from '../Controllers/formController.mjs';

const router = Router();

router.get('/', getDonors); // Home page
router.post('/add', addDonor); // Add new donor
router.get('/add', addDonorsdata)
router.get('/filter', filterDonors); // Filter donors

router.get('/upload', showForm);
router.post('/upload-excel', uploadForm, processExcel);
router.delete('/donor/delete/:id', deleteDonor); 

router.post('/donor/donate/:id', logDonation);


export default router;