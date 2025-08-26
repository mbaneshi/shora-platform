const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  namePersian: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['city', 'village', 'town', 'district'],
    default: 'city'
  },
  province: {
    type: String,
    required: true,
    trim: true
  },
  provincePersian: {
    type: String,
    required: true,
    trim: true
  },
  county: {
    type: String,
    required: true,
    trim: true
  },
  countyPersian: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  population: {
    type: Number,
    min: 0
  },
  area: {
    type: Number,
    min: 0,
    description: 'Area in square kilometers'
  },
  description: {
    type: String,
    trim: true
  },
  descriptionPersian: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  features: {
    hasShora: {
      type: Boolean,
      default: true
    },
    hasCommissions: {
      type: Boolean,
      default: true
    },
    hasDocuments: {
      type: Boolean,
      default: true
    },
    hasVoting: {
      type: Boolean,
      default: false
    }
  },
  settings: {
    allowPublicAccess: {
      type: Boolean,
      default: true
    },
    requireApproval: {
      type: Boolean,
      default: true
    },
    maxFileSize: {
      type: Number,
      default: 10485760 // 10MB
    }
  },
  contact: {
    email: String,
    phone: String,
    address: String,
    addressPersian: String
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

// Indexes for better performance
placeSchema.index({ name: 1 });
placeSchema.index({ province: 1, county: 1 });
placeSchema.index({ isActive: 1 });
placeSchema.index({ 'features.hasShora': 1 });

// Virtual for full address
placeSchema.virtual('fullAddress').get(function() {
  return `${this.county}, ${this.province}`;
});

// Virtual for full address in Persian
placeSchema.virtual('fullAddressPersian').get(function() {
  return `${this.countyPersian}, ${this.provincePersian}`;
});

// Pre-save middleware to update metadata
placeSchema.pre('save', function(next) {
  this.metadata.updatedAt = new Date();
  next();
});

// Static method to find active places
placeSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Static method to find places by province
placeSchema.statics.findByProvince = function(province) {
  return this.find({ 
    province: new RegExp(province, 'i'),
    isActive: true 
  });
};

// Instance method to get basic info
placeSchema.methods.getBasicInfo = function() {
  return {
    id: this._id,
    name: this.name,
    namePersian: this.namePersian,
    type: this.type,
    province: this.province,
    county: this.county,
    isActive: this.isActive
  };
};

module.exports = mongoose.model('Place', placeSchema);
