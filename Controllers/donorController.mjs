import Donor from '../Models/donorModel.mjs';

// Get all donors (for home page)
export const getDonors = async (req, res) => {
  try {
    // Fetch all donors
    const donors = await Donor.find();

    // Get total number of donors
    const totalDonors = donors.length;

    // Group donors by blood group and count
    const bloodGroups = await Donor.aggregate([
      { $group: { _id: "$bloodGroup", count: { $sum: 1 } } },
    ]);

    // Extract the bloodGroup and district from query parameters or default to empty
    const { bloodGroup = '', district = '' } = req.query;

    // Render the home page and pass the data
    res.render('home', { totalDonors, bloodGroups, donors, bloodGroup, district });
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).send('Server Error');
  }
};



export const addDonorsdata = async(req,res) =>{
  try {
    res.render('form');
  } catch (error) {
    console.error('Error adding donor:', error);
    res.status(500).send('Server Error');
  }
}

// Add a new donor
export const addDonor = async (req, res) => {
  try {
    const { name, phone, email, bloodGroup, place, district, age } = req.body;
    const newDonor = new Donor({ name, phone, email, bloodGroup, place, district, age });
    await newDonor.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error adding donor:', error);
    res.status(500).send('Server Error');
  }
};




export const filterDonors = async (req, res) => {
  try {
    const { bloodGroup, district } = req.query;
    const filters = {};

    // Adding filters based on query parameters
    if (bloodGroup) filters.bloodGroup = bloodGroup;
    if (district) filters.district = district;

    // Find donors based on the filters
    const donors = await Donor.find(filters);

    // Render the donor list EJS template and pass donors and filters
    res.render('donorList', { donors, bloodGroup, district });
  } catch (error) {
    console.error('Error filtering donors:', error);
    res.status(500).send('Server Error');
  }
};


export const deleteDonor = async (req, res) => {
  try {
    const { id } = req.params; // Get the donor ID from the route parameters
    await Donor.findByIdAndDelete(id); // Delete the donor from the database
    res.redirect('/'); // Redirect back to the home page or donor list
  } catch (error) {
    console.error('Error deleting donor:', error);
    res.status(500).send('Server Error');
  }
};



export const logDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const { donationDate } = req.body;
    
    // Calculate the next eligible donation date (3 months after the last donation date)
    const lastDonationDate = new Date(donationDate);
    const nextEligibleDate = new Date(lastDonationDate);
    nextEligibleDate.setMonth(nextEligibleDate.getMonth() + 3);

    // Update donor's donation details in the database
    await Donor.findByIdAndUpdate(id, {
      lastDonationDate,
      nextEligibleDate,
    });

    res.redirect('/'); // Redirect back to the home page or donor list
  } catch (error) {
    console.error('Error logging donation:', error);
    res.status(500).send('Server Error');
  }
};
