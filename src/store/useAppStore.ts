import { create } from 'zustand';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, getDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';

export type AssetStatus = 'Active' | 'Maintenance' | 'Deprecated' | 'Disposed' | 'Pending';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  status: AssetStatus;
  purchaseDate: string;
  value: number;
  location: string;
  owner: string;
  lastUpdated: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface Notification {
  id: string;
  timestamp: string;
  message: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success' | 'alert';
}

interface AppState {
  currentUser: User | null;
  users: User[];
  assets: Asset[];
  auditLogs: AuditLog[];
  notifications: Notification[];
  isInitialized: boolean;
  setInitialized: (val: boolean) => void;
  loginState: (user: User | null) => void;
  logout: () => Promise<void>;
  createUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addAsset: (asset: Omit<Asset, 'id' | 'lastUpdated'>) => Promise<void>;
  updateAsset: (id: string, asset: Partial<Asset>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => Promise<void>;
  logAction: (action: string, details: string) => Promise<void>;
  setupListeners: () => () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  users: [],
  assets: [],
  auditLogs: [],
  notifications: [],
  isInitialized: false,
  
  setInitialized: (val) => set({ isInitialized: val }),
  
  loginState: (user) => {
    set({ currentUser: user });
  },

  logout: async () => {
    try {
      if (get().currentUser) {
         await get().logAction('Logout', `${get().currentUser?.name} logged out`);
      }
      await signOut(auth);
      set({ currentUser: null, users: [], assets: [], auditLogs: [], notifications: [] });
    } catch (error) {
      console.error("Logout error", error);
    }
  },

  createUser: async (userData) => {
    try {
      const newId = `USR-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
      const docRef = doc(db, 'users', newId);
      await setDoc(docRef, { ...userData, uid: newId });
      await get().logAction('Create User', `Added new user ${userData.name}`);
      await get().addNotification({ message: `Pengguna baru ditambahkan: ${userData.name}`, type: 'success' });
    } catch (error) {
       handleFirestoreError(error, OperationType.CREATE, 'users');
    }
  },

  updateUser: async (id, userData) => {
    try {
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, { ...userData });
      await get().logAction('Update User', `Updated user ${id}`);
    } catch (error) {
       handleFirestoreError(error, OperationType.UPDATE, `users/${id}`);
    }
  },

  deleteUser: async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      await get().logAction('Delete User', `Deleted user ${id}`);
    } catch (error) {
       handleFirestoreError(error, OperationType.DELETE, `users/${id}`);
    }
  },

  addAsset: async (assetData) => {
    try {
      const newId = `AST-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      const docRef = doc(db, 'assets', newId);
      await setDoc(docRef, {
        ...assetData,
        lastUpdated: new Date().toISOString()
      });
      await get().logAction('Create Asset', `Added new asset ${assetData.name}`);
      await get().addNotification({ message: `Aset baru ditambahkan: ${assetData.name}`, type: 'info' });
    } catch (error) {
       handleFirestoreError(error, OperationType.CREATE, 'assets');
    }
  },

  updateAsset: async (id, assetData) => {
    try {
      const docRef = doc(db, 'assets', id);
      await updateDoc(docRef, {
        ...assetData,
        lastUpdated: new Date().toISOString()
      });
      await get().logAction('Update Asset', `Updated asset ${id}`);
      await get().addNotification({ message: `Aset ${id} telah diperbarui.`, type: 'info' });
    } catch (error) {
       handleFirestoreError(error, OperationType.UPDATE, `assets/${id}`);
    }
  },

  deleteAsset: async (id) => {
    try {
      await deleteDoc(doc(db, 'assets', id));
      await get().logAction('Delete Asset', `Deleted asset ${id}`);
      await get().addNotification({ message: `Aset ${id} telah dihapus dari sistem.`, type: 'alert' });
    } catch (error) {
       handleFirestoreError(error, OperationType.DELETE, `assets/${id}`);
    }
  },

  markNotificationRead: async (id) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { isRead: true });
    } catch (error) {
       handleFirestoreError(error, OperationType.UPDATE, `notifications/${id}`);
    }
  },

  markAllNotificationsRead: async () => {
    const { notifications } = get();
    for (const notif of notifications) {
      if (!notif.isRead) {
        try {
          await updateDoc(doc(db, 'notifications', notif.id), { isRead: true });
        } catch (e) {
          console.error("Failed to mark all as read", e);
        }
      }
    }
  },

  addNotification: async (notifData) => {
    try {
      const newId = `NOTIF-${Date.now()}`;
      await setDoc(doc(db, 'notifications', newId), {
        ...notifData,
        timestamp: new Date().toISOString(),
        isRead: false
      });
    } catch (error) {
       handleFirestoreError(error, OperationType.CREATE, 'notifications');
    }
  },

  logAction: async (action, details) => {
    try {
      const user = get().currentUser;
      const logId = `LOG-${Date.now()}`;
      await setDoc(doc(db, 'auditLogs', logId), {
        timestamp: new Date().toISOString(),
        user: user ? user.name : 'System',
        action,
        details,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'auditLogs');
    }
  },

  setupListeners: () => {
    // Assets Listener
    const unsubAssets = onSnapshot(query(collection(db, 'assets')), (snapshot) => {
      const assetsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Asset));
      set({ assets: assetsList });
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'assets'));

    // Users Listener
    let unsubUsers = () => {};
    const uRole = get().currentUser?.role;
    if (uRole === 'admin') {
      unsubUsers = onSnapshot(query(collection(db, 'users')), (snapshot) => {
        const usersList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
        set({ users: usersList });
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));
    }

    // AuditLogs Listener
    let unsubLogs = () => {};
    if (uRole === 'admin') {
      unsubLogs = onSnapshot(query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc')), (snapshot) => {
        const logsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog));
        set({ auditLogs: logsList });
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'auditLogs'));
    }

    // Notifications Listener
    const unsubNotifs = onSnapshot(query(collection(db, 'notifications'), orderBy('timestamp', 'desc')), (snapshot) => {
      const notifsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      set({ notifications: notifsList });
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'notifications'));

    return () => {
      unsubAssets();
      unsubUsers();
      unsubLogs();
      unsubNotifs();
    };
  }
}));

// Initialize Authentication Listener
onAuthStateChanged(auth, async (firebaseUser) => {
  const store = useAppStore.getState();
  if (firebaseUser) {
    try {
      // Check if user exists in Firestore
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      let userData: User;
      
      if (userSnap.exists()) {
         userData = { id: userSnap.id, ...userSnap.data() } as User;
      } else {
         // Create local fallback if document somehow missing (should be created in Login.tsx)
         const email = firebaseUser.email || '';
         const role = email.endsWith('@ssdi.com') ? 'admin' : 'user';
         userData = {
           id: firebaseUser.uid,
           name: firebaseUser.displayName || email.split('@')[0] || 'User',
           email: email,
           role: role as UserRole
         };
         await setDoc(userRef, { uid: userData.id, name: userData.name, email: userData.email, role: userData.role });
      }
      store.loginState(userData);
      store.setInitialized(true);
      store.logAction('Login', `${userData.name} (${userData.role}) logged in`);
    } catch (e) {
      console.error("Error fetching user", e);
      store.setInitialized(true);
    }
  } else {
    store.loginState(null as any);
    store.setInitialized(true);
  }
});
