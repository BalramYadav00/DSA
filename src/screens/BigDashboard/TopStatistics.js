import React from 'react';
import { Flex } from 'screens/RapidEstimation/RapidEstimationStyles';
import styled from 'styled-components';
export const TopStatistics = ({ text, count = 0, link }) => {
	return (
		<div style={{ color: 'white',  display: 'flex', flexDirection: 'column' ,justifyContent: 'center', alignItems: "flex-start" }}>
			{link ? (
				<StyledA style={{ fontSize: 25, color: 'white',  display: Flex, justifyContent: 'center',marginBottom: 6 }} href={link} target='_blank'>
					{count}
				</StyledA>
			) : (
				<div style={{ fontSize: 25 }}>{count}</div>
			)}

			<div style={{ fontSize: 12, marginTop: 6 }}>{text}</div>
		</div>
	);
};

const StyledA = styled.a`
	color: white;
	font-size: 25;

	&:hover {
		cursor: pointer;
	}
`;
