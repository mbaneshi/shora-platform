const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  firstNamePersian: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastNamePersian: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  nationalId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    match: [/^\d{10}$/, 'National ID must be 10 digits']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^(\+98|0)?9\d{9}$/, 'Please enter a valid Iranian phone number']
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'male'
  },
  address: {
    street: String,
    city: String,
    province: String,
    postalCode: String,
    country: {
      type: String,
      default: 'Iran'
    }
  },
  addressPersian: {
    street: String,
    city: String,
    province: String,
    postalCode: String
  },
  profile: {
    avatar: String,
    bio: String,
    bioPersian: String,
    education: String,
    educationPersian: String,
    occupation: String,
    occupationPersian: String,
    experience: String,
    experiencePersian: String
  },
  roles: [{
    type: String,
    enum: ['user', 'representative', 'admin', 'super-admin'],
    default: 'user'
  }],
  permissions: [{
    type: String,
    enum: ['read', 'write', 'delete', 'approve', 'vote', 'manage', 'super']
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending'],
    default: 'pending'
  },
  verification: {
    email: {
      type: Boolean,
      default: false
    },
    phone: {
      type: Boolean,
      default: false
    },
    nationalId: {
      type: Boolean,
      default: false
    },
    emailToken: String,
    phoneToken: String,
    emailTokenExpires: Date,
    phoneTokenExpires: Date
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  metadata: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ nationalId: 1 });
userSchema.index({ status: 1 });
userSchema.index({ roles: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for full name in Persian
userSchema.virtual('fullNamePersian').get(function() {
  return `${this.firstNamePersian} ${this.lastNamePersian}`;
});

// Virtual for is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    this.metadata.updatedAt = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update metadata
userSchema.pre('save', function(next) {
  this.metadata.updatedAt = new Date();
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Static method to find active users
userSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

// Static method to find by role
userSchema.statics.findByRole = function(role) {
  return this.find({ roles: role, status: 'active' });
};

// Instance method to get basic info
userSchema.methods.getBasicInfo = function() {
  return {
    id: this._id,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    firstNamePersian: this.firstNamePersian,
    lastNamePersian: this.lastNamePersian,
    email: this.email,
    roles: this.roles,
    status: this.status,
    profile: this.profile
  };
};

// Instance method to check permission
userSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission) || this.roles.includes('super-admin');
};

// Instance method to check role
userSchema.methods.hasRole = function(role) {
  return this.roles.includes(role);
};

module.exports = mongoose.model('User', userSchema);
