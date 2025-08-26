import mongoose, { Document, Schema, Model } from 'mongoose';
import { 
  Shora as ShoraInterface, 
  ShoraType, 
  ShoraStatus, 
  RepresentativeRole, 
  RepresentativePosition, 
  VotingMethod, 
  MeetingFrequency,
  ShoraTerm,
  ShoraStructure,
  ShoraRepresentative,
  ShoraCommission,
  ShoraMeeting,
  ShoraPolicies,
  Contact,
  Metadata
} from '../types';

export interface ShoraDocument extends ShoraInterface, Document {
  isCurrentTerm: boolean;
  activeRepresentativesCount: number;
  mainRepresentatives: ShoraRepresentative[];
  alternateRepresentatives: ShoraRepresentative[];
  getBasicInfo(): Partial<ShoraInterface>;
  isRepresentative(userId: string): boolean;
  getUserRole(userId: string): RepresentativeRole | null;
}

export interface ShoraModel extends Model<ShoraDocument> {
  findActive(): Promise<ShoraDocument[]>;
  findByPlace(placeId: string): Promise<ShoraDocument | null>;
}

const shoraSchema = new Schema<ShoraDocument>({
  place: {
    type: Schema.Types.ObjectId,
    ref: 'Place',
    required: true,
    unique: true
  },
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
  type: {
    type: String,
    enum: ['main', 'branch', 'special'] as ShoraType[],
    default: 'main'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'election'] as ShoraStatus[],
    default: 'active'
  },
  term: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    number: {
      type: Number,
      required: true,
      min: 1
    }
  },
  structure: {
    totalSeats: {
      type: Number,
      required: true,
      min: 5,
      max: 15
    },
    mainRepresentatives: {
      type: Number,
      required: true,
      default: 5
    },
    alternateRepresentatives: {
      type: Number,
      required: true,
      default: 2
    },
    specialSeats: {
      type: Number,
      default: 0
    }
  },
  representatives: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['chairman', 'vice-chairman', 'secretary', 'member', 'alternate'] as RepresentativeRole[],
      default: 'member'
    },
    position: {
      type: String,
      enum: ['main', 'alternate'] as RepresentativePosition[],
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true
    },
    permissions: [{
      type: String,
      enum: ['read', 'write', 'delete', 'approve', 'vote', 'manage']
    }]
  }],
  commissions: [{
    commission: {
      type: Schema.Types.ObjectId,
      ref: 'Commission'
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  }],
  meetings: [{
    date: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ['regular', 'emergency', 'special'],
      default: 'regular'
    },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
      default: 'scheduled'
    },
    agenda: [String],
    decisions: [{
      type: Schema.Types.ObjectId,
      ref: 'Decision'
    }],
    attendees: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    minutes: String,
    minutesPersian: String
  }],
  policies: {
    quorum: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
      default: 50
    },
    votingMethod: {
      type: String,
      enum: ['majority', 'unanimous', 'two-thirds'] as VotingMethod[],
      default: 'majority'
    },
    meetingFrequency: {
      type: String,
      enum: ['weekly', 'bi-weekly', 'monthly', 'quarterly'] as MeetingFrequency[],
      default: 'monthly'
    }
  },
  contact: {
    email: String,
    phone: String,
    address: String,
    addressPersian: String,
    website: String
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
shoraSchema.index({ place: 1 });
shoraSchema.index({ status: 1 });
shoraSchema.index({ 'term.startDate': 1, 'term.endDate': 1 });

// Virtual for current term status
shoraSchema.virtual('isCurrentTerm').get(function(this: ShoraDocument): boolean {
  const now = new Date();
  return now >= this.term.startDate && now <= this.term.endDate;
});

// Virtual for active representatives count
shoraSchema.virtual('activeRepresentativesCount').get(function(this: ShoraDocument): number {
  return this.representatives.filter(rep => rep.isActive).length;
});

// Virtual for main representatives
shoraSchema.virtual('mainRepresentatives').get(function(this: ShoraDocument): ShoraRepresentative[] {
  return this.representatives.filter(rep => 
    rep.position === 'main' && rep.isActive
  );
});

// Virtual for alternate representatives
shoraSchema.virtual('alternateRepresentatives').get(function(this: ShoraDocument): ShoraRepresentative[] {
  return this.representatives.filter(rep => 
    rep.position === 'alternate' && rep.isActive
  );
});

// Pre-save middleware
shoraSchema.pre('save', function(next) {
  this.metadata.updatedAt = new Date();
  next();
});

// Static method to find active shoras
shoraSchema.statics.findActive = function(): Promise<ShoraDocument[]> {
  return this.find({ status: 'active' });
};

// Static method to find shoras by place
shoraSchema.statics.findByPlace = function(placeId: string): Promise<ShoraDocument | null> {
  return this.findOne({ place: placeId, status: 'active' });
};

// Instance method to get basic info
shoraSchema.methods.getBasicInfo = function(): Partial<ShoraInterface> {
  return {
    id: this._id,
    name: this.name,
    namePersian: this.namePersian,
    status: this.status,
    term: this.term,
    structure: this.structure,
    isCurrentTerm: this.isCurrentTerm,
    activeRepresentativesCount: this.activeRepresentativesCount
  };
};

// Instance method to check if user is representative
shoraSchema.methods.isRepresentative = function(userId: string): boolean {
  return this.representatives.some(rep => 
    rep.user.toString() === userId.toString() && rep.isActive
  );
};

// Instance method to get user role
shoraSchema.methods.getUserRole = function(userId: string): RepresentativeRole | null {
  const rep = this.representatives.find(rep => 
    rep.user.toString() === userId.toString() && rep.isActive
  );
  return rep ? rep.role : null;
};

export const Shora = mongoose.model<ShoraDocument, ShoraModel>('Shora', shoraSchema);
