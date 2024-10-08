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
const agencyTypeEnum = pgEnum("agency_type_enum", ["fire", "ems", "pd"]);
const severityEnum = pgEnum("severity_enum", [
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
    incidentType: varchar("incident_type").notNull(), // the code, could be 54-U for PD. EMS will be the call type, injury, arrest, etc
    description: text("description").notNull(), // description initially from the radio, updates come after
    agencyType: agencyTypeEnum("agency_type").notNull(), // can only be fire pd or ems
    precinct: varchar("precinct").notNull(), // precinct of occurance will be all jobs
    severity: severityEnum("severity").notNull(),
    sector: char("sector").notNull(), // sector of precinct
    textAddress: varchar("text_address"), // human readable address irrelevant for searches
    streetNumber: varchar("street_number").notNull(), // would be 97-43 for example
    coordinates: point("coordinates").notNull(), // coordinates of the incident
    route: varchar("route").notNull(), // 	105th Street for example
    sublocality: varchar("sublocality"), // neighborhood, Jamaica, Astoria, etc. or Queens, Brooklyn, etc. sublocality_level_1	Queens - in google maps docs
    status: varchar("status").notNull(), // active, or marked -- add timeout after certian time. different for pd and ems
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
