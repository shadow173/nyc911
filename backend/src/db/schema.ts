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
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique().notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  password: varchar("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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
  }),
);
