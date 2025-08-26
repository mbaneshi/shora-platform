import mongoose, { Document, Schema, Model } from 'mongoose';
import { Place as PlaceInterface, PlaceType, PlaceFeatures, PlaceSettings, Coordinates, Contact, Metadata } from '../types';

export interface PlaceDocument extends PlaceInterface, Document {
  fullAddress: string;
  fullAddressPersian: string;
  getBasicInfo(): Partial<PlaceInterface>;
}

export interface PlaceModel extends Model<PlaceDocument> {
  findActive(): Promise<PlaceDocument[]>;
  findByProvince(province: string): Promise<PlaceDocument[]>;
}

const placeSchema = new Schema<PlaceDocument>({
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
    enum: ['city', 'village', 'town', 'district'] as PlaceType[],
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
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
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
placeSchema.virtual('fullAddress').get(function(this: PlaceDocument): string {
  return `${this.county}, ${this.province}`;
});

// Virtual for full address in Persian
placeSchema.virtual('fullAddressPersian').get(function(this: PlaceDocument): string {
  return `${this.countyPersian}, ${this.provincePersian}`;
});

// Pre-save middleware to update metadata
placeSchema.pre('save', function(next) {
  this.metadata.updatedAt = new Date();
  next();
});

// Static method to find active places
placeSchema.statics.findActive = function(): Promise<PlaceDocument[]> {
  return this.find({ isActive: true });
};

// Static method to find places by province
placeSchema.statics.findByProvince = function(province: string): Promise<PlaceDocument[]> {
  return this.find({ 
    province: new RegExp(province, 'i'),
    isActive: true 
  });
};

// Instance method to get basic info
placeSchema.methods.getBasicInfo = function(): Partial<PlaceInterface> {
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

export const Place = mongoose.model<PlaceDocument, PlaceModel>('Place', placeSchema);
