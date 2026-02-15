import { Document, Types} from "mongoose";

/**
 * Recursively converts non-serializable types (ObjectId, Date)
 * into plain JSON-compatible strings
 */
export function SerializeData<T>(data: T): any {
  if (data === null || data === undefined) return data;

  // handle Arrays
  if (Array.isArray(data)) {
    return data.map(item => SerializeData(item));
  }

  //Handle Mongoose documents
  if (data instanceof Document) {
    return SerializeData(data.toObject({ flattenObjectIds: true}));
  }

  // Handle ObjectId
  if (data instanceof Types.ObjectId) {
    return data.toString();
  }

  // Handle Date
  if (data instanceof Date) {
    return data.toISOString();
  }

  // Handle objects recursively
  if (typeof data === "object") {
    const serialized: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        serialized[key] = SerializeData(data[key]);
      }
    }
    return serialized
  }
  return data
}