import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import BasicSliderItems from '../../components/Sliders/BasicSliderItems';
import { map } from 'lodash';
import BannerArtist from '../../components/Artists/BannerArtist';
import firebase from '../../utils/Firebase';
import 'firebase/compat/firestore';

import './Artist.scss';

const db = firebase.firestore();

function Artist(props) {
	const { match } = props;
	const [artist, setArtist] = useState(null);
	const [albums, setAlbums] = useState([]);

	useEffect(() => {
		db.collection('artist')
			.doc(match?.params?.id)
			.get()
			.then((response) => {
				const data = response.data();
				data.id = response.id;
				setArtist(data);
			});
	}, [match]);

	useEffect(() => {
		if (artist) {
			db.collection('albums')
				.where('artist', '==', artist.id)
				.get()
				.then((response) => {
					const arrayAlbums = [];
					map(response?.docs, (album) => {
						const data = album.data();
						data.id = album.id;
						arrayAlbums.push(data);
					});
					setAlbums(arrayAlbums);
				});
		}
	}, [artist]);

	return (
		<div className='artist'>
			{artist && <BannerArtist artist={artist} />}
			<div className='artist__content'>
				<BasicSliderItems
					title='Álbumes'
					data={albums}
					folderImage='album'
					urlName='album'
				/>
			</div>
		</div>
	);
}

export default withRouter(Artist);
