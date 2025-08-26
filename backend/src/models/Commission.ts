import mongoose, { Document, Schema, Model } from 'mongoose';
import { 
  Commission as CommissionInterface, 
  CommissionType, 
  CommissionStatus,
  CommissionMember,
  Metadata
} from '../types';

export interface CommissionDocument extends CommissionInterface, Document {
  getBasicInfo(): Partial<CommissionInterface>;
  isMember(userId: string): boolean;
  getMemberRole(userId: string): string | null;
}

export interface CommissionModel extends Model<CommissionDocument> {
  findActive(): Promise<CommissionDocument[]>;
  findByPlace(placeId: string): Promise<CommissionDocument[]>;
  findByType(type: CommissionType): Promise<CommissionDocument[]>;
}

const commissionSchema = new Schema<CommissionDocument>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  namePersian: {
    type: String,
    required: true,
    trim: true
  },
  place: {
    type: Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  type: {
    type: String,
    enum: ['standing', 'ad-hoc', 'special'] as CommissionType[],
    default: 'standing'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'] as CommissionStatus[],
    default: 'active'
  },
  description: {
    type: String,
    trim: true
  },
  descriptionPersian: {
    type: String,
    trim: true
  },
  members: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  chairperson: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  secretary: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  meetingSchedule: {
    frequency: {
      type: String,
      enum: ['weekly', 'bi-weekly', 'monthly', 'quarterly', 'as-needed'],
      default: 'monthly'
    },
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6
    },
    time: String,
    location: String,
    locationPersian: String
  },
  responsibilities: [{
    title: String,
    titlePersian: String,
    description: String,
    descriptionPersian: String
  }],
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

// Indexes
commissionSchema.index({ place: 1 });
commissionSchema.index({ type: 1 });
commissionSchema.index({ status: 1 });
commissionSchema.index({ 'members.user': 1 });
commissionSchema.index({ chairperson: 1 });

// Virtual for active members count
commissionSchema.virtual('activeMembersCount').get(function(this: CommissionDocument): number {
  return this.members.filter(member => member.isActive).length;
});

// Virtual for is active
commissionSchema.virtual('isActive').get(function(this: CommissionDocument): boolean {
  return this.status === 'active';
});

// Pre-save middleware
commissionSchema.pre('save', function(next) {
  this.metadata.updatedAt = new Date();
  next();
});

// Static method to find active commissions
commissionSchema.statics.findActive = function(): Promise<CommissionDocument[]> {
  return this.find({ status: 'active' });
};

// Static method to find commissions by place
commissionSchema.statics.findByPlace = function(placeId: string): Promise<CommissionDocument[]> {
  return this.find({ place: placeId, status: 'active' });
};

// Static method to find commissions by type
commissionSchema.statics.findByType = function(type: CommissionType): Promise<CommissionDocument[]> {
  return this.find({ type, status: 'active' });
};

// Instance method to get basic info
commissionSchema.methods.getBasicInfo = function(): Partial<CommissionInterface> {
  return {
    id: this._id,
    name: this.name,
    namePersian: this.namePersian,
    type: this.type,
    status: this.status,
    place: this.place,
    activeMembersCount: this.activeMembersCount
  };
};

// Instance method to check if user is member
commissionSchema.methods.isMember = function(userId: string): boolean {
  return this.members.some(member => 
    member.user.toString() === userId.toString() && member.isActive
  );
};

// Instance method to get member role
commissionSchema.methods.getMemberRole = function(userId: string): string | null {
  const member = this.members.find(member => 
    member.user.toString() === userId.toString() && member.isActive
  );
  return member ? member.role : null;
};

export const Commission = mongoose.model<CommissionDocument, CommissionModel>('Commission', commissionSchema);
