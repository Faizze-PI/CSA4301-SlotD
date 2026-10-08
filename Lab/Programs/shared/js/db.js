/**
 * CSA4301 - Shared Local Database & State Engine
 * Provides persistent mock database collections in browser localStorage.
 */
class LabDB {
  constructor(namespace = 'csa4301_db') {
    this.namespace = namespace;
  }

  _getKey(collection) {
    return `${this.namespace}_${collection}`;
  }

  // Get entire collection
  get(collection) {
    try {
      const data = localStorage.getItem(this._getKey(collection));
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error(`Error reading ${collection}:`, e);
      return [];
    }
  }

  // Save collection
  set(collection, items) {
    try {
      localStorage.setItem(this._getKey(collection), JSON.stringify(items));
      return items;
    } catch (e) {
      console.error(`Error saving ${collection}:`, e);
      return [];
    }
  }

  // Insert single item
  insert(collection, item) {
    const items = this.get(collection);
    const newItem = {
      id: item.id || Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      ...item
    };
    items.push(newItem);
    this.set(collection, items);
    return newItem;
  }

  // Find item by ID
  findById(collection, id) {
    const items = this.get(collection);
    return items.find(item => item.id === id) || null;
  }

  // Update item
  update(collection, id, updates) {
    const items = this.get(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    this.set(collection, items);
    return items[index];
  }

  // Remove item
  remove(collection, id) {
    const items = this.get(collection);
    const filtered = items.filter(item => item.id !== id);
    this.set(collection, filtered);
    return true;
  }

  // Seed default data if empty
  seedIfEmpty(collection, defaultData) {
    const existing = this.get(collection);
    if (!existing || existing.length === 0) {
      this.set(collection, defaultData);
      return defaultData;
    }
    return existing;
  }

  // Reset collection
  clear(collection) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this._getKey(collection));
    }
  }

  // Clear all lab collections across all experiments
  clearAll() {
    if (typeof localStorage === 'undefined') return;
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith(this.namespace) || k.includes('_'))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }

  // Export all localStorage data to JSON string
  exportAll() {
    if (typeof localStorage === 'undefined') return '{}';
    const dump = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      dump[k] = localStorage.getItem(k);
    }
    return JSON.stringify(dump, null, 2);
  }

  // Import JSON string back into localStorage
  importAll(jsonString) {
    if (typeof localStorage === 'undefined') return false;
    try {
      const parsed = JSON.parse(jsonString);
      Object.keys(parsed).forEach(k => {
        localStorage.setItem(k, parsed[k]);
      });
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }
}

// Global instance in browser
if (typeof window !== 'undefined') {
  window.labDB = new LabDB();
}

// Module export for Node.js test suites
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LabDB;
}

