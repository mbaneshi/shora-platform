import mongoose, { Document, Schema, Model } from 'mongoose';
import { 
  Decision as DecisionInterface, 
  DecisionType, 
  DecisionStatus,
  DecisionVote,
  Metadata
} from '../types';

export interface DecisionDocument extends DecisionInterface, Document {
  getVoteCounts(): { yes: number; no: number; abstain: number };
  hasUserVoted(userId: string): boolean;
  getUserVote(userId: string): DecisionVote | null;
  canUserVote(userId: string): boolean;
  getBasicInfo(): Partial<DecisionInterface>;
}

export interface DecisionModel extends Model<DecisionDocument> {
  findActive(): Promise<DecisionDocument[]>;
  findByPlace(placeId: string): Promise<DecisionDocument[]>;
  findByShora(shoraId: string): Promise<DecisionDocument[]>;
  findByStatus(status: DecisionStatus): Promise<DecisionDocument[]>;
}

const decisionSchema = new Schema<DecisionDocument>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  titlePersian: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  descriptionPersian: {
    type: String,
    trim: true
  },
  place: {
    type: Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  shora: {
    type: Schema.Types.ObjectId,
    ref: 'Shora',
    required: true
  },
  type: {
    type: String,
    enum: ['resolution', 'policy', 'approval', 'rejection'] as DecisionType[],
    default: 'resolution'
  },
  status: {
    type: String,
    enum: ['draft', 'proposed', 'approved', 'rejected', 'implemented'] as DecisionStatus[],
    default: 'draft'
  },
  meeting: {
    type: Schema.Types.ObjectId,
    ref: 'Meeting'
  },
  proposedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  implementationDate: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['infrastructure', 'education', 'health', 'security', 'finance', 'other'],
    default: 'other'
  },
  budget: {
    amount: Number,
    currency: {
      type: String,
      default: 'IRR'
    },
    description: String
  },
  timeline: {
    startDate: Date,
    endDate: Date,
    milestones: [{
      title: String,
      titlePersian: String,
      date: Date,
      description: String,
      descriptionPersian: String,
      completed: {
        type: Boolean,
        default: false
      }
    }]
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String,
    url: String,
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  votes: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    vote: {
      type: String,
      enum: ['yes', 'no', 'abstain'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    reason: String,
    reasonPersian: String
  }],
  votingDeadline: Date,
  quorumRequired: {
    type: Number,
    min: 1,
    max: 100,
    default: 50
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
decisionSchema.index({ place: 1 });
decisionSchema.index({ shora: 1 });
decisionSchema.index({ type: 1 });
decisionSchema.index({ status: 1 });
decisionSchema.index({ proposedBy: 1 });
decisionSchema.index({ createdAt: -1 });
decisionSchema.index({ 'votes.user': 1 });

// Virtual for total votes count
decisionSchema.virtual('totalVotes').get(function(this: DecisionDocument): number {
  return this.votes.length;
});

// Virtual for is voting open
decisionSchema.virtual('isVotingOpen').get(function(this: DecisionDocument): boolean {
  if (!this.votingDeadline) return false;
  return new Date() < this.votingDeadline && this.status === 'proposed';
});

// Virtual for has reached quorum
decisionSchema.virtual('hasReachedQuorum').get(function(this: DecisionDocument): boolean {
  const totalVotes = this.votes.length;
  const requiredVotes = Math.ceil(totalVotes * (this.quorumRequired / 100));
  return totalVotes >= requiredVotes;
});

// Pre-save middleware
decisionSchema.pre('save', function(next) {
  this.metadata.updatedAt = new Date();
  next();
});

// Static method to find active decisions
decisionSchema.statics.findActive = function(): Promise<DecisionDocument[]> {
  return this.find({ status: { $in: ['draft', 'proposed'] } });
};

// Static method to find decisions by place
decisionSchema.statics.findByPlace = function(placeId: string): Promise<DecisionDocument[]> {
  return this.find({ place: placeId }).sort({ createdAt: -1 });
};

// Static method to find decisions by shora
decisionSchema.statics.findByShora = function(shoraId: string): Promise<DecisionDocument[]> {
  return this.find({ shora: shoraId }).sort({ createdAt: -1 });
};

// Static method to find decisions by status
decisionSchema.statics.findByStatus = function(status: DecisionStatus): Promise<DecisionDocument[]> {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Instance method to get vote counts
decisionSchema.methods.getVoteCounts = function(): { yes: number; no: number; abstain: number } {
  const counts = { yes: 0, no: 0, abstain: 0 };
  
  this.votes.forEach(vote => {
    if (vote.vote === 'yes') counts.yes++;
    else if (vote.vote === 'no') counts.no++;
    else if (vote.vote === 'abstain') counts.abstain++;
  });
  
  return counts;
};

// Instance method to check if user has voted
decisionSchema.methods.hasUserVoted = function(userId: string): boolean {
  return this.votes.some(vote => vote.user.toString() === userId.toString());
};

// Instance method to get user's vote
decisionSchema.methods.getUserVote = function(userId: string): DecisionVote | null {
  const vote = this.votes.find(vote => vote.user.toString() === userId.toString());
  return vote || null;
};

// Instance method to check if user can vote
decisionSchema.methods.canUserVote = function(userId: string): boolean {
  return this.isVotingOpen && !this.hasUserVoted(userId);
};

// Instance method to get basic info
decisionSchema.methods.getBasicInfo = function(): Partial<DecisionInterface> {
  const voteCounts = this.getVoteCounts();
  
  return {
    id: this._id,
    title: this.title,
    titlePersian: this.titlePersian,
    type: this.type,
    status: this.status,
    place: this.place,
    shora: this.shora,
    proposedBy: this.proposedBy,
    totalVotes: this.totalVotes,
    voteCounts,
    isVotingOpen: this.isVotingOpen,
    hasReachedQuorum: this.hasReachedQuorum
  };
};

export const Decision = mongoose.model<DecisionDocument, DecisionModel>('Decision', decisionSchema);
