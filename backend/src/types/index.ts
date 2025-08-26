// Common types for the Shora Platform

export interface BaseEntity {
  _id?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Metadata {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Contact {
  email?: string;
  phone?: string;
  address?: string;
  addressPersian?: string;
  website?: string;
}

export interface FileUpload {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

// Place types
export type PlaceType = 'city' | 'village' | 'town' | 'district';

export interface PlaceFeatures {
  hasShora: boolean;
  hasCommissions: boolean;
  hasDocuments: boolean;
  hasVoting: boolean;
}

export interface PlaceSettings {
  allowPublicAccess: boolean;
  requireApproval: boolean;
  maxFileSize: number;
}

export interface Place extends BaseEntity {
  name: string;
  namePersian: string;
  type: PlaceType;
  province: string;
  provincePersian: string;
  county: string;
  countyPersian: string;
  coordinates?: Coordinates;
  population?: number;
  area?: number;
  description?: string;
  descriptionPersian?: string;
  isActive: boolean;
  features: PlaceFeatures;
  settings: PlaceSettings;
  contact: Contact;
  metadata: Metadata;
}

// User types
export type UserRole = 'user' | 'representative' | 'admin' | 'super-admin';
export type UserPermission = 'read' | 'write' | 'delete' | 'approve' | 'vote' | 'manage' | 'super';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type UserGender = 'male' | 'female' | 'other';

export interface UserAddress {
  street?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country: string;
}

export interface UserProfile {
  avatar?: string;
  bio?: string;
  bioPersian?: string;
  education?: string;
  educationPersian?: string;
  occupation?: string;
  occupationPersian?: string;
  experience?: string;
  experiencePersian?: string;
}

export interface UserVerification {
  email: boolean;
  phone: boolean;
  nationalId: boolean;
  emailToken?: string;
  phoneToken?: string;
  emailTokenExpires?: Date;
  phoneTokenExpires?: Date;
}

export interface User extends BaseEntity {
  username: string;
  email: string;
  password: string;
  firstName: string;
  firstNamePersian: string;
  lastName: string;
  lastNamePersian: string;
  nationalId?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender: UserGender;
  address: UserAddress;
  addressPersian: UserAddress;
  profile: UserProfile;
  roles: UserRole[];
  permissions: UserPermission[];
  status: UserStatus;
  verification: UserVerification;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  metadata: Metadata;
}

// Shora types
export type ShoraType = 'main' | 'branch' | 'special';
export type ShoraStatus = 'active' | 'inactive' | 'suspended' | 'election';
export type RepresentativeRole = 'chairman' | 'vice-chairman' | 'secretary' | 'member' | 'alternate';
export type RepresentativePosition = 'main' | 'alternate';
export type VotingMethod = 'majority' | 'unanimous' | 'two-thirds';
export type MeetingFrequency = 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';

export interface ShoraTerm {
  startDate: Date;
  endDate: Date;
  number: number;
}

export interface ShoraStructure {
  totalSeats: number;
  mainRepresentatives: number;
  alternateRepresentatives: number;
  specialSeats: number;
}

export interface ShoraRepresentative {
  user: string;
  role: RepresentativeRole;
  position: RepresentativePosition;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  permissions: UserPermission[];
}

export interface ShoraCommission {
  commission: string;
  status: 'active' | 'inactive';
}

export interface ShoraMeeting {
  date: Date;
  type: 'regular' | 'emergency' | 'special';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  agenda: string[];
  decisions: string[];
  attendees: string[];
  minutes?: string;
  minutesPersian?: string;
}

export interface ShoraPolicies {
  quorum: number;
  votingMethod: VotingMethod;
  meetingFrequency: MeetingFrequency;
}

export interface Shora extends BaseEntity {
  place: string;
  name: string;
  namePersian: string;
  type: ShoraType;
  status: ShoraStatus;
  term: ShoraTerm;
  structure: ShoraStructure;
  representatives: ShoraRepresentative[];
  commissions: ShoraCommission[];
  meetings: ShoraMeeting[];
  policies: ShoraPolicies;
  contact: Contact;
  metadata: Metadata;
}

// Commission types
export type CommissionType = 'standing' | 'ad-hoc' | 'special';
export type CommissionStatus = 'active' | 'inactive' | 'suspended';

export interface CommissionMember {
  user: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface Commission extends BaseEntity {
  name: string;
  namePersian: string;
  place: string;
  type: CommissionType;
  status: CommissionStatus;
  description?: string;
  descriptionPersian?: string;
  members: CommissionMember[];
  metadata: Metadata;
}

// Decision types
export type DecisionType = 'resolution' | 'policy' | 'approval' | 'rejection';
export type DecisionStatus = 'draft' | 'proposed' | 'approved' | 'rejected' | 'implemented';

export interface DecisionVote {
  user: string;
  vote: 'yes' | 'no' | 'abstain';
  timestamp: Date;
  reason?: string;
}

export interface Decision extends BaseEntity {
  title: string;
  titlePersian: string;
  description?: string;
  descriptionPersian?: string;
  place: string;
  shora: string;
  type: DecisionType;
  status: DecisionStatus;
  meeting?: string;
  proposedBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  votes: DecisionVote[];
  implementationDate?: Date;
  metadata: Metadata;
}

// Document types
export type DocumentType = 'meeting-minutes' | 'decision' | 'report' | 'policy' | 'other';
export type DocumentStatus = 'draft' | 'published' | 'archived';

export interface Document extends BaseEntity {
  title: string;
  titlePersian: string;
  description?: string;
  descriptionPersian?: string;
  place: string;
  type: DocumentType;
  status: DocumentStatus;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  uploadedBy: string;
  tags: string[];
  metadata: Metadata;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request types
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface SearchQuery extends PaginationQuery {
  search?: string;
  filters?: Record<string, any>;
}

// Socket.io types
export interface SocketEvents {
  'join-place': (placeId: string) => void;
  'decision-update': (data: { placeId: string; decision: Decision }) => void;
  'commission-update': (data: { placeId: string; commission: Commission }) => void;
  'document-uploaded': (data: { placeId: string; document: Document }) => void;
}

export interface ClientToServerEvents extends SocketEvents {}

export interface ServerToClientEvents {
  'decision-updated': (data: { placeId: string; decision: Decision }) => void;
  'commission-updated': (data: { placeId: string; commission: Commission }) => void;
  'document-uploaded': (data: { placeId: string; document: Document }) => void;
}

// Environment types
export interface Environment {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  UPLOAD_PATH: string;
  MAX_FILE_SIZE: number;
  SOCKET_CORS_ORIGIN: string;
  DEBUG: boolean;
  LOG_LEVEL: string;
}

// JWT Payload
export interface JwtPayload {
  userId: string;
  username: string;
  roles: UserRole[];
  permissions: UserPermission[];
  placeId?: string;
  iat?: number;
  exp?: number;
}

// Express Request extensions
export interface AuthenticatedRequest extends Express.Request {
  user?: JwtPayload;
  place?: Place;
}

// Database types
export interface DatabaseConnection {
  isConnected: boolean;
  host: string;
  port: number;
  name: string;
}
