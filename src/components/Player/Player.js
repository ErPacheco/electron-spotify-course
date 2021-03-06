import React, { useState, useEffect } from 'react';
import { Grid, Progress, Icon, Input, Image } from 'semantic-ui-react';
import ReactPlayer from 'react-player';

import './Player.scss';

export default function Player(props) {
	const { songData } = props;
	const [playing, setPlaying] = useState(false);
	const [playerSeconds, setPlayerSeconds] = useState(0);
	const [totalSeconds, setTotalSeconds] = useState(0);
	const [volume, setVolume] = useState(0.3);

	useEffect(() => {
		if (songData?.url) {
			onStart();
		}
	}, [songData]);
	const onStart = () => {
		setPlaying(true);
	};

	const onPause = () => {
		setPlaying(false);
	};

	const onProgress = (data) => {
		setPlayerSeconds(data.playedSeconds);
		setTotalSeconds(data.loadedSeconds);
	};

	return (
		<div className='player'>
			<Grid>
				<Grid.Column width={4} className='left'>
					<Image src={songData?.image} />
					{songData?.name}
				</Grid.Column>
				<Grid.Column width={8} className='center'>
					<div className='controls'>
						{playing ? (
							<Icon name='pause circle outline' onClick={onPause} />
						) : (
							<Icon name='play circle outline' onClick={onStart} />
						)}
					</div>
					<Progress
						progress='value'
						value={playerSeconds}
						total={totalSeconds}
						size='tiny'
					/>
				</Grid.Column>
				<Grid.Column width={4} className='right'>
					<Input
						label={<Icon name='volume up' />}
						min={0}
						max={1}
						step={0.01}
						type='range'
						name='volume'
						onChange={(e, data) => setVolume(Number(data.value))}
						value={volume}
					/>
				</Grid.Column>
			</Grid>
			<ReactPlayer
				className='react-player'
				url={songData?.url}
				playing={playing}
				height='0'
				volume={volume}
				onProgress={(e) => onProgress(e)}
			/>
		</div>
	);
}
