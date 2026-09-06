import { SEED_DATA } from './seedData.js';
import { supabase } from '../config/supabase.js';

class HospitalDataStore {
  constructor() {
    this.data = JSON.parse(JSON.stringify(SEED_DATA));
    this.initSupabaseSync();
  }

  async initSupabaseSync() {
    if (!supabase) return;
    try {
      // Sync appointments from Supabase if table exists and has rows
      const { data: appts, error: apptErr } = await supabase.from('appointments').select('*').limit(50);
      if (!apptErr && appts && appts.length > 0) {
        console.log(`[Store] Synced ${appts.length} appointments from Supabase.`);
        this.data.appointments = appts;
      }

      // Sync beds from Supabase
      const { data: beds, error: bedErr } = await supabase.from('beds').select('*').limit(50);
      if (!bedErr && beds && beds.length > 0) {
        console.log(`[Store] Synced ${beds.length} beds from Supabase.`);
        this.data.beds = beds;
      }

      // Sync medicines from Supabase
      const { data: meds, error: medErr } = await supabase.from('medicines').select('*').limit(50);
      if (!medErr && meds && meds.length > 0) {
        console.log(`[Store] Synced ${meds.length} medicines from Supabase.`);
        this.data.medicines = meds;
      }
    } catch (err) {
      console.log('[Store] Supabase initial fetch completed (using in-memory operational state):', err.message);
    }
  }

  // --- Collection Getters & Setters ---
  get(collection) {
    const val = this.data[collection];
    // For array collections return array, for objects (queue, parking, hospitalPlan) return as-is
    if (val === undefined || val === null) return [];
    return val;
  }

  set(collection, items) {
    this.data[collection] = items;
  }

  findById(collection, id) {
    const list = this.get(collection);
    return Array.isArray(list) ? list.find((item) => item.id === id) : null;
  }

  insert(collection, item) {
    if (!Array.isArray(this.data[collection])) {
      this.data[collection] = [];
    }
    const newItem = {
      id: item.id || `${collection.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      ...item,
    };
    this.data[collection].unshift(newItem);
    return newItem;
  }

  update(collection, id, updates) {
    if (!Array.isArray(this.data[collection])) return null;
    let updated = null;
    this.data[collection] = this.data[collection].map((item) => {
      if (item.id === id) {
        updated = { ...item, ...updates, updatedAt: new Date().toISOString() };
        return updated;
      }
      return item;
    });
    return updated;
  }

  delete(collection, id) {
    if (!Array.isArray(this.data[collection])) return false;
    const initialLen = this.data[collection].length;
    this.data[collection] = this.data[collection].filter((item) => item.id !== id);
    return this.data[collection].length < initialLen;
  }

  // Live Queue Specific
  getQueue() {
    return this.data.queue;
  }

  advanceQueue() {
    this.data.queue.currentServingToken += 1;
    this.data.queue.peopleAhead = Math.max(0, this.data.queue.peopleAhead - 1);
    this.data.queue.estimatedWaitMinutes = Math.max(0, this.data.queue.peopleAhead * this.data.queue.averageConsultTimeMins);
    return this.data.queue;
  }
}

export const store = new HospitalDataStore();
