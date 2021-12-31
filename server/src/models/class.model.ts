import * as mongoose from 'mongoose';

const { Schema } = mongoose;

export const ClassSchema = new Schema(
  {
    name: { type: String, lowercase: true, unique: true },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
    },

    description: String,
    //many classes can be taught
    //classes Array

    //class teachers
    teachers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }]
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.model("Class", ClassSchema);
