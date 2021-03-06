import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { size, map } from 'lodash';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../../utils/Firebase';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

import './SongsSlider.scss';

const db = firebase.firestore();

export default function SongsSlider(props) {
	const { title, data, playerSong } = props;

	const settings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 5,
		slidesToScroll: 1,
		centerMode: true,
		className: 'songs-slider__list',
	};

	if (size(data) < 5) {
		return null;
	}

	return (
		<div className='songs-slider'>
			<h2>{title}</h2>
			<Slider {...settings}>
				{map(data, (item) => (
					<Song key={item.id} item={item} playerSong={playerSong} />
				))}
			</Slider>
		</div>
	);
}

function Song(props) {
	const { item, playerSong } = props;
	const [banner, setBanner] = useState(null);
	const [album, setAlbum] = useState(null);

	useEffect(() => {
		db.collection('albums')
			.doc(item.album)
			.get()
			.then((response) => {
				const albumAux = response.data();
				albumAux.id = response.id;
				setAlbum(albumAux);
				getImage(albumAux);
			});
	}, [item]);

	const getImage = (album) => {
		firebase
			.storage()
			.ref(`album/${album.banner}`)
			.getDownloadURL()
			.then((url) => {
				setBanner(url);
			});
	};

	const onPlay = () => {
		playerSong(banner, item.name, item.fileName);
	};

	return (
		<div className='songs-slider__list-song'>
			<div
				className='avatar'
				style={{ backgroundImage: `url('${banner}')` }}
				onClick={onPlay}
			>
				<Icon name='play circle outline' />
			</div>
			<Link to={`album/${album?.id}`}>
				<h3>{item.name}</h3>
			</Link>
		</div>
	);
}
