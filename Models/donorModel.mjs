



// import mongoose from 'mongoose';
// // import AutoIncrementFactory from 'mongoose-sequence';  // For auto-increment

// // const AutoIncrement = AutoIncrementFactory(mongoose);

// // Define the schema
// const donorSchema = new mongoose.Schema({
//   // slNo: { type: Number, unique: true }, // Auto-incremented serial number
//   name: { type: String},
//   phone: { type: String},
//   email: { type: String},
//   bloodGroup: { type: String},
//   place: { type: String},
//   district: { type: String},
//   age: { type: Number},
//   date: { 
//     type: Date, 
//     default: Date.now,  // Set the current date by default
//     required: true 
//   },
// });

// // Apply the auto-increment plugin on the 'slNo' field
// // donorSchema.plugin(AutoIncrement, { inc_field: 'slNo' });

// const donorData = mongoose.model('Donor', donorSchema);

// export default donorData;
  


import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  bloodGroup: String,
  place: String,
  district: String,
  age: Number,
  lastDonationDate: Date, // Store the last donation date
  nextEligibleDate: Date, // Store the next eligible donation date
});

const Donor = mongoose.model('Donor', donorSchema);

export default Donor;


