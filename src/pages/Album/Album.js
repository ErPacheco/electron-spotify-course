import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { Loader } from 'semantic-ui-react';
import { map } from 'lodash';
import ListSongs from '../../components/Songs/ListSongs';
import firebase from '../../utils/Firebase';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

import './Album.scss';

const db = firebase.firestore();

function Album(props) {
	const { match, playerSong } = props;
	const [album, setAlbum] = useState(null);
	const [albumImage, setAlbumImage] = useState(null);
	const [artist, setArtist] = useState(null);
	const [songs, setSongs] = useState([]);

	useEffect(() => {
		db.collection('albums')
			.doc(match?.params?.id)
			.get()
			.then((response) => {
				const data = response.data();
				data.id = response.id;
				setAlbum(data);
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
			db.collection('songs')
				.where('album', '==', album.id)
				.get()
				.then((response) => {
					const arraySongs = [];
					map(response?.docs, (song) => {
						const data = song.data();
						data.id = song.id;
						arraySongs.push(data);
					});

					setSongs(arraySongs);
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
				<ListSongs
					songs={songs}
					albumImage={albumImage}
					playerSong={playerSong}
				/>
			</div>
		</div>
	);
}

export default withRouter(Album);
