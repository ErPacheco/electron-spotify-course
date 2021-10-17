import React, { useState, useEffect } from 'react';
import { map } from 'lodash';
import BannerHome from '../../components/BannerHome';
import BasicSliderItems from '../../components/Sliders/BasicSliderItems';
import firebase from '../../utils/Firebase';
import 'firebase/compat/firestore';

import './Home.scss';

const db = firebase.firestore();

export default function Home() {
	const [artists, setArtists] = useState([]);

	useEffect(() => {
		db.collection('artist')
			.get()
			.then((response) => {
				const arrayArtists = [];
				map(response?.docs, (artist) => {
					const data = artist.data();
					data.id = artist.id;
					arrayArtists.push(data);
				});

				setArtists(arrayArtists);
			});
	}, []);

	return (
		<>
			<BannerHome />
			<div className='home'>
				<BasicSliderItems
					title='Últimos artistas'
					data={artists}
					folderImage='artist'
					urlName='artist'
				/>
				<h1>Mas...</h1>
			</div>
		</>
	);
}
