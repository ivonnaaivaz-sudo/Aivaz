'use client';

import React, { useMemo, ReactNode } from 'react';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirebaseApp } from './config';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const { app, firestore, auth, storage } = useMemo(() => {
    const app = getFirebaseApp();
    const firestore = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);
    return { app, firestore, auth, storage };
  }, []);

  return (
    <FirebaseProvider app={app} firestore={firestore} auth={auth} storage={storage}>
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}
