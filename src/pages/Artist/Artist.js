import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import BannerArtist from '../../components/Artists/BannerArtist';
import firebase from '../../utils/Firebase';
import 'firebase/compat/firestore';

import './Artist.scss';

const db = firebase.firestore();

function Artist(props) {
	const { match } = props;
	const [artist, setArtist] = useState(null);

	useEffect(() => {
		db.collection('artist')
			.doc(match?.params?.id)
			.get()
			.then((response) => {
				setArtist(response.data());
			});
	}, [match]);

	return (
		<div className='artist'>
			{artist && <BannerArtist artist={artist} />}
			<h2>Más información...</h2>
		</div>
	);
}

export default withRouter(Artist);
