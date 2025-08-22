import mongoose from 'mongoose';
const equipmentTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  unit: { type: String, default: 'units' }
}, { timestamps: true });
export default mongoose.model('EquipmentType', equipmentTypeSchema);
