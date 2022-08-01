import React from 'react';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import styles from './Switchmode.module.css';

const SwitchMode = ({ toggleFullScreen, sectionName, isFullScreen }) => {
	return (
		<div
			style={{
				display: 'flex',
				flex: 1,
				justifyContent: 'flex-end',
				marginRight: '20px',
				zIndex: 100
			}}
			onClick={() => toggleFullScreen(sectionName)}
		>
			{isFullScreen ? (
				<FullscreenExitIcon className={styles.hovermode}/>
			) : (
				<FullscreenIcon className={styles.hovermode} />
			)}
		</div>
	);
};

export default SwitchMode;
