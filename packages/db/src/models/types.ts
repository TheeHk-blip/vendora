import { Document, FlattenMaps, Model, Require_id } from "mongoose";

/** 
 * Strongly typed Mongoose model helper
 */
export type TypedModel<T extends Document> = Model<T>;

/**
 *  Lean version of a document (plain JS object)
 */
export type Lean<T extends Document> = FlattenMaps<T>;

/**
 *  Lean version with guaranteed _id
 */
export type RequireIdLean<T extends Document> = Require_id<FlattenMaps<T>>;

/**
 *  Array of lean documents
 */
export type LeanArray<T extends Document> = RequireIdLean<T>[];