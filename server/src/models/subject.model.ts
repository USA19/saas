import * as mongoose from 'mongoose';

const { Schema } = mongoose;

export const SubjectSchema = new Schema(
  {
    name: { type: String, lowercase: true, unique: true },

    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
    },

    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
    },

    description: String,
    //many classes can be taught
    //classes Array

    //class teachers
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.model("Subject", SubjectSchema);
