import mongoose, { Document, Schema, Model } from 'mongoose';
import { 
  Document as DocumentInterface, 
  DocumentType, 
  DocumentStatus,
  Metadata
} from '../types';

export interface DocumentDocument extends DocumentInterface, Document {
  getFileSize(): string;
  getFileExtension(): string;
  isImage(): boolean;
  isPDF(): boolean;
  getBasicInfo(): Partial<DocumentInterface>;
}

export interface DocumentModel extends Model<DocumentDocument> {
  findActive(): Promise<DocumentDocument[]>;
  findByPlace(placeId: string): Promise<DocumentDocument[]>;
  findByType(type: DocumentType): Promise<DocumentDocument[]>;
  findByStatus(status: DocumentStatus): Promise<DocumentDocument[]>;
  findByUser(userId: string): Promise<DocumentDocument[]>;
}

const documentSchema = new Schema<DocumentDocument>({
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
  type: {
    type: String,
    enum: ['meeting-minutes', 'decision', 'report', 'policy', 'other'] as DocumentType[],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'] as DocumentStatus[],
    default: 'draft'
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true,
    min: 0
  },
  path: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['administrative', 'financial', 'technical', 'legal', 'other'],
    default: 'other'
  },
  version: {
    type: String,
    default: '1.0'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  requiresApproval: {
    type: Boolean,
    default: true
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectionReason: String,
  rejectionReasonPersian: String,
  relatedDocuments: [{
    document: {
      type: Schema.Types.ObjectId,
      ref: 'Document'
    },
    relationship: {
      type: String,
      enum: ['supersedes', 'amends', 'references', 'related'],
      default: 'related'
    }
  }],
  accessControl: {
    roles: [{
      type: String,
      enum: ['user', 'representative', 'admin', 'super-admin']
    }],
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    publicAccess: {
      type: Boolean,
      default: false
    }
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
documentSchema.index({ place: 1 });
documentSchema.index({ type: 1 });
documentSchema.index({ status: 1 });
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ createdAt: -1 });
documentSchema.index({ tags: 1 });
documentSchema.index({ 'accessControl.roles': 1 });

// Virtual for file size in human readable format
documentSchema.virtual('fileSize').get(function(this: DocumentDocument): string {
  const bytes = this.size;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual for file extension
documentSchema.virtual('fileExtension').get(function(this: DocumentDocument): string {
  return this.originalName.split('.').pop()?.toLowerCase() || '';
});

// Virtual for is image
documentSchema.virtual('isImage').get(function(this: DocumentDocument): boolean {
  return this.mimetype.startsWith('image/');
});

// Virtual for is PDF
documentSchema.virtual('isPDF').get(function(this: DocumentDocument): boolean {
  return this.mimetype === 'application/pdf';
});

// Virtual for can be previewed
documentSchema.virtual('canPreview').get(function(this: DocumentDocument): boolean {
  return this.isImage || this.isPDF;
});

// Pre-save middleware
documentSchema.pre('save', function(next) {
  this.metadata.updatedAt = new Date();
  next();
});

// Static method to find active documents
documentSchema.statics.findActive = function(): Promise<DocumentDocument[]> {
  return this.find({ status: { $in: ['draft', 'published'] } });
};

// Static method to find documents by place
documentSchema.statics.findByPlace = function(placeId: string): Promise<DocumentDocument[]> {
  return this.find({ place: placeId }).sort({ createdAt: -1 });
};

// Static method to find documents by type
documentSchema.statics.findByType = function(type: DocumentType): Promise<DocumentDocument[]> {
  return this.find({ type }).sort({ createdAt: -1 });
};

// Static method to find documents by status
documentSchema.statics.findByStatus = function(status: DocumentStatus): Promise<DocumentDocument[]> {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to find documents by user
documentSchema.statics.findByUser = function(userId: string): Promise<DocumentDocument[]> {
  return this.find({ uploadedBy: userId }).sort({ createdAt: -1 });
};

// Instance method to get basic info
documentSchema.methods.getBasicInfo = function(): Partial<DocumentInterface> {
  return {
    id: this._id,
    title: this.title,
    titlePersian: this.titlePersian,
    type: this.type,
    status: this.status,
    place: this.place,
    filename: this.filename,
    originalName: this.originalName,
    mimetype: this.mimetype,
    size: this.size,
    url: this.url,
    uploadedBy: this.uploadedBy,
    tags: this.tags,
    fileSize: this.fileSize,
    fileExtension: this.fileExtension,
    isImage: this.isImage,
    isPDF: this.isPDF,
    canPreview: this.canPreview
  };
};

export const Document = mongoose.model<DocumentDocument, DocumentModel>('Document', documentSchema);
