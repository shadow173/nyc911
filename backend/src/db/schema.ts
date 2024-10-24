import {
  boolean,
  pgTable,
  serial,
  varchar,
  text,
  char,
  timestamp,
  date,
  index,
  integer,
  point,
  pgEnum,
  geometry,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  password: varchar("password").notNull(),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  personalVerificationCode: varchar("personal_verification_code"),
  isActive: boolean("is_active").notNull().default(false), // Account activation status
  isDisabled: boolean("is_disabled").notNull().default(false),
  agencyId: integer("agency_id").references(() => agencies.id),
  agencyEmail: varchar("agency_email"),
  agencyVerificationCode: varchar("agency_verification_code"),
  phoneNumber: text("phone_number"),
  phoneVerified: boolean("phone_verified").default(false),
  isAgencyEmailVerified: boolean("is_agency_email_verified").default(false),
  needsManualApproval: boolean("needs_manual_approval").default(false),
  lastEmailVerification: timestamp("last_email_verification"),
  lastAgencyEmailVerification: timestamp("last_agency_email_verification"),
  lastPhoneVerification: timestamp("last_phone_verification"),
  manualApprovalResult: text("manual_approval_result"),
  totalVerificationAttempts: integer("total_verification_attempts").notNull().default(0),
  totalPhoneVerificationAttempts: integer("total_phone_verification_attempts").notNull().default(0),
  totalPhoneCodeVerificationAttempts: integer("total_phone_verification_code_attempts").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


export const verificationData = pgTable("verification_data", {
  userId: integer("user_id")
  .notNull()
  .references(() => users.id, { onDelete: "cascade" }),
  role: text("role"),
  companyName: text("company_name"),
  streetAddress: text("street_address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  documentId: text("document_id"),
  documentURL: text("document_url"),
  status: varchar("status"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const verificationRelations = relations(users, ({ one }) => ({
  verificationRelations: one(verificationData),
}));
//  role: formData.role,
// name: formData.name,
// companyName: formData.companyName,
// streetAddress: formData.streetAddress,
// city: formData.city,
// state: formData.state,
// zipCode: formData.zipCode,
// documentId: fileId,
// documentUrl: `s3://${process.env.AWS_BUCKET_NAME}/${s3Key}`,
// status: 'pending',
// createdAt: new Date(),
// updatedAt: new Date()


export const agencies = pgTable("agencies", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  emailDomain: varchar("email_domain"), // e.g., 'nypd.org'
  requiresManualApproval: boolean("requires_manual_approval").default(false),
});

export const verificationTokens = pgTable("verification_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  type: varchar("type").notNull(), // 'email_verification' or 'agency_email_verification'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const manualApprovals = pgTable("manual_approvals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fullName: varchar("full_name").notNull(),
  reasonForJoining: text("reason_for_joining").notNull(),
  emtId: varchar("emt_id"),
  emtCertificationUrl: varchar("emt_certification_url"), // URL to uploaded document
  isApproved: boolean("is_approved").default(false),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const precincts = pgTable('precincts', {
  id: serial('id').primaryKey(),
  precinct: text('precinct'),
  patrolBoro: text('patrol_boro'),
  precinctAndSector: text('precinct_and_sector'),
  geometry: geometry('geometry', { type: 'multipolygon', srid: 4326 }), // this really contains MultiPolygon
}, (table) => ({
  // Define the spatial index using Drizzle's index API
  geometryIndex: index('idx_precincts_geometry').using('gist', table.geometry)
})

);
export const agencyTypeEnum = pgEnum("agency_type_enum", ["fire", "ems", "pd"]);
export const severityEnum = pgEnum("severity_enum", [
  "non-urgent",
  "low",
  "moderate",
  "high",
  "critical",
  "citywide-incident",
]);

export const incidents = pgTable(
  "incidents",
  {
    id: serial("id").primaryKey(),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    inputAddress: text("input_address").notNull(),
    createdTimestamp: timestamp('created_timestamp').notNull().defaultNow(),
    updatedTimestamp: timestamp('updated_timestamp').notNull().defaultNow(),
    addressType: text("address_type").notNull(),
    patrolBoro: varchar("patrol_boro").notNull(), // the patrol boro. 
    incidentType: varchar("incident_type").notNull(), // the code, could be 54-U for PD. EMS will be the call type, injury, arrest, etc
    description: text("description").notNull(), // description initially from the radio, updates come after
    agencyType: agencyTypeEnum("agency_type").notNull(), // can only be fire pd or ems
    precinct: varchar("precinct").notNull(), // precinct of occurance will be all jobs
    severity: severityEnum("severity").notNull(),
    gid: text("gid").notNull(), // the openstreetmap grid id. useful for plotting. example: "openstreetmap:intersection:w5670600-n42430304-w496982024",
    oid: text("oid").notNull(), // other ID. better formatted gid. example: "w5670600-n42430304-w496982024",
    nodeId: text("node_id").notNull(), // the node id. useful for when I need to plot an incident on the openstreetmap "42430304
    sector: text("sector").notNull(), // sector of precinct will include precinct name
    textAddress: varchar("text_address"), // human readable address irrelevant for searches or title in other words
    coordinates: point("coordinates").notNull(), // coordinates of the incident
    sublocality: varchar("sublocality"), // neighborhood, Jamaica, Astoria, etc. or Queens, Brooklyn, etc. sublocality_level_1	Queens - in google maps docs
    status: varchar("status").notNull(), // active, or marked, or pending -- add timeout after certian time. different for pd and ems
    createdAt: timestamp("created_at").notNull().defaultNow(), // when the job was assigned
    updatedAt: timestamp("updated_at"), // any updateds to the job should update this, unit assigned, more info, etc
    date: date("date").notNull(), // date of the incident
    assignedUnits: text("assigned_units").array().notNull(), // SHOULD Be an array of current units assigned.
  }, // perhaps add attributes of isClosed. this will let the incident be searchable. could be future implementation.
  (table) => ({
    statusIdx: index("idx_incidents_status").on(table.status),
    dateIdx: index("idx_incidents_date").on(table.date),
    nodeIdIdx: index("idx_incidents_node_id").on(table.nodeId), 

  }),
);



export const incidentsRelations = relations(incidents, ({ many }) => ({
  incidentUpdates: many(incidentUpdates),
}));

export const incidentUpdates = pgTable(
  "incident_updates",
  {
    id: serial("id").primaryKey(),
    timestamp: timestamp("timestamp").notNull().defaultNow(),
    incidentId: integer("incident_id")
      .notNull()
      .references(() => incidents.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    message: text("message").notNull(),
  },
  (table) => ({
    incidentIdIdx: index("idx_incident_updates_incident_id").on(
      table.incidentId,
    ),
  }),
);

export const incidentUpdatesRelations = relations(
  incidentUpdates,
  ({ one }) => ({
    incident: one(incidents, {
      fields: [incidentUpdates.incidentId],
      references: [incidents.id],
    }),
  }),
);



export const archivedIncidents = pgTable(
  "archived_incidents",
  {
    id: serial("id").primaryKey(),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    addressType: text("address_type").notNull(),
    inputAddress: text("input_address").notNull(),
    patrolBoro: varchar("patrol_boro").notNull(),
    incidentType: varchar("incident_type").notNull(),
    description: text("description").notNull(),
    agencyType: agencyTypeEnum("agency_type").notNull(),
    precinct: varchar("precinct").notNull(),
    severity: severityEnum("severity").notNull(),
    gid: text("gid").notNull(),
    oid: text("oid").notNull(),
    nodeId: text("node_id").notNull(),
    sector: text("sector").notNull(),
    textAddress: varchar("text_address"),
    coordinates: point("coordinates").notNull(),
    sublocality: varchar("sublocality"),
    status: varchar("status").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
    date: date("date").notNull(),
    assignedUnits: text("assigned_units").array().notNull(),
  },
  (table) => ({
    statusIdx: index("idx_archived_incidents_status").on(table.status),
    dateIdx: index("idx_archived_incidents_date").on(table.date),
    nodeIdIdx: index("idx_archived_incidents_node_id").on(table.nodeId), 
  }),
);

