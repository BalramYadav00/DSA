import moment from 'moment';
import React from 'react';
import { Container } from './TimeBarStyles';
import {useLocation} from 'react-router-dom'

const TimeBar = ({ timer }) => {
	const location = useLocation()
	
	if(location.pathname.match('/segments') || location.pathname.match('/new-dashboard')){
		return null
	}

	return (
		<Container>
			{timer.day ? (
				<p>
					<span>{timer.day}</span> hours of work completion by{' '}
					<span>{moment().add(timer.day, 'hours').format('hh:mm A')}</span>
				</p>
			) : (
				<p>
					Day completed. <span>{timer.evening}</span> hours of evening work.
				</p>
			)}
		</Container>
	);
};

export default TimeBar;
