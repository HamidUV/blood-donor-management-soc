import multer from 'multer';
import XLSX from 'xlsx';
import Donor from '../Models/donorModel.mjs';

// Configure multer to use memory storage
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'), false);
    }
  },
});

// Show the form for uploading an Excel file
export const showForm = (req, res) => {
  try {
    res.render('upload');
  } catch (error) {
    console.error('Error displaying form:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Handle Excel upload and data extraction
export const uploadForm = upload.single('excelFile'); // Use multer middleware

export const processExcel = async (req, res) => {
  const excelFile = req.file;

  if (!excelFile) {
    return res.status(400).send('No file uploaded');
  }

  try {
    // Use XLSX to read the Excel data from the buffer
    const workbook = XLSX.read(excelFile.buffer, { type: 'buffer' });
    const sheetNames = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log('Data extracted from Excel:', data); // Log extracted data

    for (const donor of data) {
      const { name, phone, email, bloodGroup, place = '', district, age } = donor;

      if (!name || !phone || !email || !bloodGroup || !district || !age) {
        console.log(`Skipping donor due to missing required fields: ${JSON.stringify(donor)}`);
        continue;
      }

      console.log('Donor to be saved:', { name, phone, email, bloodGroup, place, district, age });

      const newDonor = new Donor({
        name,
        phone,
        email,
        bloodGroup,
        place,
        district,
        age,
      });

      try {
        await newDonor.save(); // Save donor to database
        console.log('Donor saved successfully:', newDonor);
      } catch (saveError) {
        console.error('Error saving donor to database:', saveError);
      }
    }

    res.redirect('/'); // Redirect to home page after processing

  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.status(500).send('Error processing file');
  }
};
