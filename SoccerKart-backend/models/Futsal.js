import mongoose from 'mongoose';

const futsalSchema = new mongoose.Schema({
  name: String,
  address: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  }
});

futsalSchema.index({ location: '2dsphere' }); // Geospatial index

const Futsal = mongoose.model('Futsal', futsalSchema); // <-- Define model

export default Futsal; // <-- Export the model so it can be imported elsewhere
