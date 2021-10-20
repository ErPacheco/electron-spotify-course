import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { Loader } from 'semantic-ui-react';
import firebase from '../../utils/Firebase';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

import './Album.scss';

const db = firebase.firestore();

function Album(props) {
	const { match } = props;
	const [album, setAlbum] = useState(null);
	const [albumImage, setAlbumImage] = useState(null);
	const [artist, setArtist] = useState(null);

	useEffect(() => {
		db.collection('albums')
			.doc(match?.params?.id)
			.get()
			.then((response) => {
				setAlbum(response.data());
			});
	}, [match]);

	useEffect(() => {
		if (album) {
			firebase
				.storage()
				.ref(`album/${album?.banner}`)
				.getDownloadURL()
				.then((url) => {
					setAlbumImage(url);
				});
		}
	}, [album]);

	useEffect(() => {
		if (album) {
			db.collection('artist')
				.doc(album?.artist)
				.get()
				.then((response) => {
					setArtist(response.data());
				});
		}
	}, [album]);

	if (!album || !artist) {
		return <Loader active>Cargando...</Loader>;
	}

	return (
		<div className='album'>
			<div className='album__header'>
				<div
					className='image'
					style={{ backgroundImage: `url('${albumImage}')` }}
				/>
				<div className='info'>
					<h1>{album.name}</h1>
					<p>
						De <span>{artist.name}</span>
					</p>
				</div>
			</div>
			<div className='album__songs'>
				<p>Lista de canciones</p>
			</div>
		</div>
	);
}

export default withRouter(Album);
