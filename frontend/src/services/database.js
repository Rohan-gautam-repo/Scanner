import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// User Collection Operations
export const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
  } catch (error) {
    throw new Error('Error creating user profile: ' + error.message);
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    throw new Error('Error fetching user profile: ' + error.message);
  }
};

// Scan Collection Operations
export const createScan = async (userId, scanData) => {
  try {
    const scanRef = doc(collection(db, 'scans'));
    await setDoc(scanRef, {
      ...scanData,
      userId,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return scanRef.id;
  } catch (error) {
    throw new Error('Error creating scan: ' + error.message);
  }
};

export const updateScanStatus = async (scanId, status, results = null) => {
  try {
    const scanRef = doc(db, 'scans', scanId);
    const updateData = {
      status,
      updatedAt: serverTimestamp()
    };
    if (results) {
      updateData.results = results;
    }
    await updateDoc(scanRef, updateData);
  } catch (error) {
    throw new Error('Error updating scan status: ' + error.message);
  }
};

export const getUserScans = async (userId, limit = 10) => {
  try {
    const scansQuery = query(
      collection(db, 'scans'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limit)
    );
    const querySnapshot = await getDocs(scansQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error('Error fetching user scans: ' + error.message);
  }
};

// Vulnerability Collection Operations
export const addVulnerability = async (scanId, vulnerabilityData) => {
  try {
    const vulnerabilityRef = doc(collection(db, 'vulnerabilities'));
    await setDoc(vulnerabilityRef, {
      ...vulnerabilityData,
      scanId,
      createdAt: serverTimestamp()
    });
    return vulnerabilityRef.id;
  } catch (error) {
    throw new Error('Error adding vulnerability: ' + error.message);
  }
};

export const getScanVulnerabilities = async (scanId) => {
  try {
    const vulnerabilitiesQuery = query(
      collection(db, 'vulnerabilities'),
      where('scanId', '==', scanId),
      orderBy('severity', 'desc')
    );
    const querySnapshot = await getDocs(vulnerabilitiesQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error('Error fetching scan vulnerabilities: ' + error.message);
  }
};

// Report Collection Operations
export const createReport = async (scanId, reportData) => {
  try {
    const reportRef = doc(collection(db, 'reports'));
    await setDoc(reportRef, {
      ...reportData,
      scanId,
      createdAt: serverTimestamp()
    });
    return reportRef.id;
  } catch (error) {
    throw new Error('Error creating report: ' + error.message);
  }
};

export const getScanReport = async (scanId) => {
  try {
    const reportQuery = query(
      collection(db, 'reports'),
      where('scanId', '==', scanId),
      limit(1)
    );
    const querySnapshot = await getDocs(reportQuery);
    return querySnapshot.docs[0]?.data() || null;
  } catch (error) {
    throw new Error('Error fetching scan report: ' + error.message);
  }
}; 