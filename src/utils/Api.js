import firebase from './Firebase';
import firebaseGlobal from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const db = firebase.firestore();

export async function isUserAdmin(uid) {
	const docRef = await db.collection('admins').doc(uid).get();
	return docRef.exists;
}

export const reauthenticate = (password) => {
	const user = firebase.auth().currentUser;

	const credentials = firebaseGlobal.auth.EmailAuthProvider.credential(
		user.email,
		password
	);

	return user.reauthenticateWithCredential(credentials);
};
