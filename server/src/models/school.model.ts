import * as mongoose from 'mongoose';

const { Schema } = mongoose;

export const SchoolSchema = new Schema(
  {
    name: { type: String, lowercase: true, unique: true },
    principle: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    phone: String,
    imageUrl: String,
    bio: String,
    description: String,
    //many classes can be taught
    //classes Array

    //school teachers
    teachers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.model("School", SchoolSchema);
