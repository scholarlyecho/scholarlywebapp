import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export type FormType = 'newsletter' | 'contact' | 'waitlist' | 'enrollment';

export async function submitForm(formType: FormType, data: Record<string, string>) {
  const ref = collection(db, 'submissions');
  const doc = await addDoc(ref, {
    formType,
    ...data,
    createdAt: serverTimestamp(),
    read: false,
  });
  return doc.id;
}
