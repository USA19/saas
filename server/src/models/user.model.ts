import * as mongoose from 'mongoose';
import classModel from './class.model';
import schoolModel from './school.model';
import subjectModel from './subject.model';
const { Schema } = mongoose;

export enum RoleType {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  REGISTRAR = 'registrar'
}

export const UserSchema = new Schema(
  {
    email: { type: String, lowercase: true, unique: true },
    password: String,
    firstName: { type: String, lowercase: true },
    lastName: { type: String, lowercase: true },
    phone: String,
    imageUrl: String,
    bio: String,
    description: String,
    resetToken: String,
    resetTokenExpiration: Date,
    dateOfBirth: Date,

    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
    },

    profileImageUrl: {
      type: String,
      default: 'images/default.png',
    },

    role: {
      type: String,
      enum: RoleType,
      default: RoleType.STUDENT,
    },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

UserSchema.virtual('nextRoles').get(function () {
  switch (this.role) {
    case RoleType.SUPER_ADMIN:
    case RoleType.ADMIN:
      return [];
    case RoleType.TEACHER:
    case RoleType.REGISTRAR:
      return [{ action: "admin", role: RoleType.ADMIN }];
    case RoleType.STUDENT:
      return [{ action: "admin", role: RoleType.ADMIN }, { action: "teacher", role: RoleType.TEACHER }];
    default:
      return []
  }
});

UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`
});

UserSchema.pre('remove', function (next) {
  schoolModel.findOneAndUpdate(
    { teachers: this._id },
    { $pull: this._id },
    { multi: true })  //if reference exists in multiple documents 
    .exec();

  classModel.findOneAndUpdate(
    { teachers: this._id },
    { $pull: this._id },
    { multi: true })  //if reference exists in multiple documents 
    .exec();


  subjectModel.findOneAndUpdate(
    { teacher: this._id },
    { teacher: null },
    { multi: true })  //if reference exists in multiple documents 
    .exec();
  next();
});
export default mongoose.model("User", UserSchema);
