import { v4 as uuidv4 } from 'uuid';
export function generateUUID() {
    const uuid = uuidv4();
    // Remove hyphens and convert to lowercase
    return uuid.replace(/-/g, '').toLowerCase();
  }
  