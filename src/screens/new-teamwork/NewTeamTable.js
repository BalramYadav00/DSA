import React, { useEffect, useState } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import moment from 'moment';
import useLongPress from '../../hooks/useLongPress';
import { FormControl, Grid, Input, InputLabel, Modal, Select, Typography } from '@material-ui/core';
import axios from 'axios';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ContentLoader from 'react-content-loader';
import Button from '@mui/material/Button';
import { position } from 'polished';
import { style } from '@mui/system';
import '../TeamWork/TeamWork.css';
import { ModalBody } from '../TeamWork/Style';
import CloseIcon from '@material-ui/icons/Close';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
const token = localStorage.getItem('red_wing_token');

function NewTeamTable({
	onlyRedwing,
	users,
	isPerformance5,
	isPerformance15,
	isPerformance0,
	default1,
	sorting,
	notredwing,
	sortingColumn,
	setSortingColumn,
	sortingOrder,
	projects,
	data,
	getTeamWorkData,
	setLoading,
	isPlayground,
	isMultitasking,
	isProjectSame,
	isIdle,
	projectId,
	toggel,
	singleUsers,
	projectName
}) {
	const [newUsers, SetNewUsers] = useState([]);
	var dummyData = users;
	const redwingProjectId = 23190856;
	const [totalTasks, setTotalTasks] = useState(null);
	const [activityCount, setActivityCount] = useState(0);
	const [onboardUserModal, setOnboardUserModal] = useState(false);
	const [onboardUserName, setOnboardUserName] = useState('');
	const [onboardUserEmail, setOnboardUserEmail] = useState('');
	const [onboardProjectId, setonboardProjectId] = useState('');

	var localData = localStorage.getItem('redwing_data');
	// If no tasks --> Table name = Idle and at the last
	// If only on one project --> Table name = project name
	// If more than 1 project --> Table name = Multi tasking and at the top
	localData = JSON.parse(localData);
	// console.log(dummyData);

	useEffect(() => {
		if (notredwing && !default1) {
			SetNewUsers(
				users.filter(
					user => !user.project_ids.includes(redwingProjectId) || user.project_ids.length > 1
				)
			);
			setTotalTasks(
				users
					.filter(
						user => !user.project_ids.includes(redwingProjectId) || user.project_ids.length > 1
					)
					.map(each => each.tasks_count)
					.reduce((acc, item) => acc + item, 0)
			);
		}
		if (isPlayground && !default1) {
			SetNewUsers(
				users.filter(
					user => user.project_ids.includes(redwingProjectId) && user.project_ids.length === 1
				)
			);
			setTotalTasks(
				users
					.filter(
						user => user.project_ids.includes(redwingProjectId) && user.project_ids.length === 1
					)
					.map(each => each.tasks_count)
					.reduce((acc, item) => acc + item, 0)
			);
		}
		if (isMultitasking && !default1) {
			SetNewUsers(users.filter(user => user.project_ids.length > 1));
			setTotalTasks(
				users
					.filter(user => user.project_ids.length > 1)
					.map(each => each.tasks_count)
					.reduce((acc, item) => acc + item, 0)
			);
		}
		if (isProjectSame && !default1) {
			SetNewUsers(
				users.filter(
					user =>
						user.project_ids.length === 1 &&
						!user.project_ids.includes(redwingProjectId) &&
						user.project_ids[0] === projectId
				)
			);
			setTotalTasks(
				users
					.filter(
						user =>
							user.project_ids.length === 1 &&
							!user.project_ids.includes(redwingProjectId) &&
							user.project_ids[0] === projectId
					)
					.map(each => each.tasks_count)
					.reduce((acc, item) => acc + item, 0)
			);
		}
		if (isIdle && !default1) {
			SetNewUsers(users.filter(user => user.tasks_count === 0));
		}
		if (onlyRedwing && !default1) {
			SetNewUsers(
				users.filter(
					user => user.project_ids.includes(redwingProjectId) && user.project_ids.length === 1
				)
			);
			setTotalTasks(
				users
					.filter(
						user => user.project_ids.includes(redwingProjectId) && user.project_ids.length === 1
					)
					.map(each => each.tasks_count)
					.reduce((acc, item) => acc + item, 0)
			);
		}
		if (isPerformance5 && !default1) {
			const boolValue = users.filter(user => user.completed_todo > 5);
			if (boolValue === null || boolValue === undefined) {
				SetNewUsers([]);
			} else {
				SetNewUsers(users.filter(user => user.completed_todo > 5));
				setTotalTasks(
					users
						.filter(user => user.completed_todo > 5)
						.map(each => each.tasks_count)
						.reduce((acc, item) => acc + item, 0)
				);
			}
		}
		if (isPerformance15 && !default1) {
			const boolValue = users.filter(user => user.completed_todo <= 5 && user.completed_todo >= 1);
			if (boolValue === null || boolValue === undefined) {
				SetNewUsers([]);
			} else {
				SetNewUsers(users.filter(user => user.completed_todo <= 5 && user.completed_todo >= 1));
				setTotalTasks(
					users
						.filter(user => user.completed_todo <= 5 && user.completed_todo >= 1)
						.map(each => each.tasks_count)
						.reduce((acc, item) => acc + item, 0)
				);
			}
		}
		if (isPerformance0 && !default1) {
			const boolValue = users.filter(user => user.completed_todo < 1);
			if (boolValue === null || boolValue === undefined) {
				SetNewUsers([]);
			} else {
				SetNewUsers(users.filter(user => user.completed_todo < 1));
				setTotalTasks(
					users
						.filter(user => user.completed_todo < 1)
						.map(each => each.tasks_count)
						.reduce((acc, item) => acc + item, 0)
				);
			}
		}
		if (
			default1 &&
			!isMultitasking &&
			!isProjectSame &&
			!isPerformance5 &&
			!isIdle &&
			!onlyRedwing
		) {
			SetNewUsers(users);
			setTotalTasks(users.map(each => each.tasks_count).reduce((acc, item) => acc + item, 0));
		}
		setActivityCount(
			newUsers.map(user => user.completed_todo).reduce((acc, item) => acc + item, 0)
		);
	}, [
		newUsers,
		users,
		notredwing,
		default1,
		isPlayground,
		isMultitasking,
		isProjectSame,
		isIdle,
		onlyRedwing,
		isPerformance5,
		isPerformance15,
		isPerformance0,
		projectId
	]);

	const handleOnboardToProject = (user_id, user_name) => {
		setOnboardUserModal(true);
		setOnboardUserName(user_name);
	};

	const onboardToProject = () => {
		if (onboardProjectId && onboardUserEmail) {
			setLoading(true);
			setOnboardUserModal(false);
			axios
				.get(
					`${process.env.REACT_APP_API_URL}/pages/join_project.php?name=${onboardUserName}&email=${onboardUserEmail}&work_project_id=${onboardProjectId}`,
					{
						headers: {
							Authorization: `${token}`,
							'Access-Control-Allow-Origin': '*'
						}
					}
				)
				.then(res => {
					if (res.data.status === true) {
						alert(res.data.msg);
						setOnboardUserName('');
						setOnboardUserEmail('');
						setonboardProjectId('');
						getTeamWorkData();
						// getProjectData();
					} else {
						setOnboardUserModal(true);
						alert('Something went wrong');
						console.log(res.data);
					}
					setLoading(false);
				})
				.catch(error => {
					console.error(error);
					setLoading(false);
				});
		}
	};

	const renderTableHeading = () => {
		return (
			<thead>
				<tr>
					<th
						onClick={e => {
							e.preventDefault();
							setSortingColumn('name');
							if (sortingOrder === 'ASC') {
								sorting('name', 'ASC');
							} else {
								sorting('name', 'DEC');
							}
						}}
						style={{
							transform: 'translateX(-6px)',
							fontSize: '14px',
							lineHeight: '21px',
							fontFamily: 'Poppins',
							fontWeight: '500',
							minWidth: '170px'
						}}
					>
						{/* {isPlayground && "Redwing"} */}
						{isMultitasking && `Multitasking (${newUsers.length})`}
						{isProjectSame && `${projectName} (${newUsers.length})`}
						{isIdle && `Idle (${newUsers.length})`}
						{notredwing && `Client Projects (${newUsers.length})`}
						{onlyRedwing && `Playground (${newUsers.length})`}
						{default1 && `All Users (${users.length})`}
						{isPerformance0 && `0 green ticks (${newUsers.length})`}
						{isPerformance15 && `1-5 green ticks (${newUsers.length})`}
						{isPerformance5 && `5+ green ticks (${newUsers.length})`}
						{isPlayground && ` Playground User (${newUsers.length})`}
						{sortingColumn === 'name' ? (
							<a href='/' style={{ color: 'white', marginLeft: '2px' }}>
								{sortingOrder === 'ASC' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
							</a>
						) : (
							''
						)}
					</th>

					<th
						onClick={e => {
							e.preventDefault();
							setSortingColumn('completed_todo');
							if (sortingOrder === 'ASC') {
								sorting('completed_todo', 'ASC');
							} else {
								sorting('completed_todo', 'DEC');
							}
						}}
						style={
							newUsers.length !== 0
								? {
										textAlign: 'left',
										paddingRight: '5rem',
										fontSize: '14px',
										lineHeight: '21px',
										fontFamily: 'Poppins',
										fontWeight: '500',
										width: '100%'
								  }
								: {
										textAlign: 'left',
										paddingRight: '5rem',
										fontSize: '14px',
										lineHeight: '21px',
										fontFamily: 'Poppins',
										fontWeight: '500',
										width: '100%',
										position: 'relative',
										right: '545px'
								  }
						}

						// className="activity"
					>
						<div style={{ display: 'flex' }}>
							<div className='activity-heading'>
								Activity
								{/* {`(${activityCount})`} */}
							</div>
							{sortingColumn === 'completed_todo' ? (
								<a href='/' style={{ color: 'white', marginLeft: '2px' }}>
									{sortingOrder === 'ASC' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
								</a>
							) : (
								''
							)}
						</div>
					</th>

					<th
						onClick={e => {
							e.preventDefault();
							setSortingColumn('weekly_completed_todo');
							if (sortingOrder === 'ASC') {
								sorting('weekly_completed_todo', 'ASC');
							} else {
								sorting('weekly_completed_todo', 'DEC');
							}
						}}
						style={
							newUsers.length !== 0
								? {
										textAlign: 'center',
										fontSize: '14px',
										lineHeight: '21px',
										fontFamily: 'Poppins',
										fontWeight: '500',
										width: '1%',
										'white-space': 'nowrap'
								  }
								: {
										textAlign: 'center',
										fontSize: '14px',
										lineHeight: '21px',
										fontFamily: 'Poppins',
										fontWeight: '500',
										width: '1%',
										'white-space': 'nowrap',
										position: 'relative',
										right: '315px'
								  }
						}
					>
						Weekly completed budget
						{sortingColumn === 'weekly_completed_todo' ? (
							<a style={{ color: 'white', marginLeft: '2px' }} href='/'>
								{sortingOrder === 'ASC' ? (
									<ArrowUpwardIcon style={{ position: 'relative', top: '2px' }} />
								) : (
									<ArrowDownwardIcon style={{ position: 'relative', top: '2px' }} />
								)}
							</a>
						) : (
							''
						)}{' '}
					</th>

					<th
						onClick={e => {
							e.preventDefault();
							setSortingColumn('weekly_average_per_day');
							if (sortingOrder === 'ASC') {
								sorting('weekly_average_per_day', 'ASC');
							} else {
								sorting('weekly_average_per_day', 'DEC');
							}
						}}
						style={
							newUsers.length !== 0
								? {
										textAlign: 'center',
										fontSize: '14px',
										lineHeight: '21px',
										fontFamily: 'Poppins',
										fontWeight: '500',
										width: '1%',
										'white-space': 'nowrap'
								  }
								: {
										textAlign: 'center',
										fontSize: '14px',
										lineHeight: '21px',
										fontFamily: 'Poppins',
										fontWeight: '500',
										width: '1%',
										'white-space': 'nowrap',
										position: 'relative',
										right: '315px'
								  }
						}
					>
						Weekly average per day
						{sortingColumn === 'weekly_average_per_day' ? (
							<a style={{ color: 'white', marginLeft: '2px' }} href='/'>
								{sortingOrder === 'ASC' ? (
									<ArrowUpwardIcon style={{ position: 'relative', top: '2px' }} />
								) : (
									<ArrowDownwardIcon style={{ position: 'relative', top: '2px' }} />
								)}
							</a>
						) : (
							''
						)}{' '}
					</th>

					<th
						onClick={e => {
							e.preventDefault();
							setSortingColumn('tasks_count');
							if (sortingOrder === 'ASC') {
								sorting('tasks_count', 'ASC');
							} else {
								sorting('tasks_count', 'DEC');
							}
						}}
						style={
							newUsers.length !== 0
								? {
										textAlign: 'center',
										fontSize: '14px',
										lineHeight: '21px',
										fontFamily: 'Poppins',
										fontWeight: '500',
										width: '1%',
										'white-space': 'nowrap'
								  }
								: {
										textAlign: 'center',
										fontSize: '14px',
										lineHeight: '21px',
										fontFamily: 'Poppins',
										fontWeight: '500',
										width: '1%',
										'white-space': 'nowrap',
										position: 'relative',
										right: '305px'
								  }
						}
					>
						Pending budgets {totalTasks !== 0 && '(' + totalTasks + ')'}
						{sortingColumn === 'tasks_count' ? (
							<a style={{ color: 'white', marginLeft: '2px' }} href='/'>
								{sortingOrder === 'ASC' ? (
									<ArrowUpwardIcon style={{ position: 'relative', top: '2px' }} />
								) : (
									<ArrowDownwardIcon style={{ position: 'relative', top: '2px' }} />
								)}
							</a>
						) : (
							''
						)}{' '}
					</th>
					<th
						onClick={e => {
							e.preventDefault();
							setSortingColumn('project_ids');
							if (sortingOrder === 'ASC') {
								sorting('project_ids', 'ASC');
							} else {
								sorting('project_ids', 'DEC');
							}
						}}
						style={
							newUsers.length !== 0
								? {
										textAlign: 'center',
										fontSize: '14px',
										lineHeight: '21px',
										fontFamily: 'Poppins',
										fontWeight: '500',
										width: '1%',
										'white-space': 'nowrap'
								  }
								: {
										textAlign: 'center',
										fontSize: '14px',
										lineHeight: '21px',
										fontFamily: 'Poppins',
										fontWeight: '500',
										width: '1%',
										'white-space': 'nowrap',
										position: 'relative',
										right: '315px'
								  }
						}
					>
						Projects
						{sortingColumn === 'project_ids' ? (
							<a style={{ color: 'white', marginLeft: '2px' }} href='/'>
								{sortingOrder === 'ASC' ? (
									<ArrowUpwardIcon style={{ position: 'relative', top: '2px' }} />
								) : (
									<ArrowDownwardIcon style={{ position: 'relative', top: '2px' }} />
								)}
							</a>
						) : (
							''
						)}
					</th>
				</tr>
			</thead>
		);
	};

	useEffect(() => {
		if (newUsers) {
			let total_pending = 0;
			newUsers.map(user => {
				total_pending += user.pending_tasks_budget;
			});
			setTotalTasks(total_pending);
		}
	}, [newUsers]);

	return (
		<>
			{newUsers.length !== 0 && (
				<table cellspacing='0' cellpadding='0'>
					{renderTableHeading()}
					<tbody>
						{newUsers.length !== 0 ? (
							newUsers.map((user, key) => {
								if (!toggel) {
									if (user.projects.length === 1) {
										return (
											<TableRow
												key={key}
												img={user.avatar}
												user_id={user.user_id}
												weekly_average={user.weekly_average_per_day}
												weekly_count={user.weekly_completed_todo}
												name={user.name}
												active={user.active_count}
												active_todo={user.active_todo_count}
												projects={user.project_ids}
												completed_todo={user.completed_todo}
												last_active_at={user.last_active_at}
												projectsdata={projects}
												data={data.users}
												getTeamWorkData={getTeamWorkData}
												setLoading={setLoading}
											/>
										);
									}
								}
								return (
									<TableRow
										key={key}
										img={user.avatar}
										user_id={user.user_id}
										tasks={user.tasks_count}
										name={user.name}
										active={user.active_count}
										active_todo={user.active_todo_count}
										projects={user.project_ids}
										completed_todo={user.completed_todo}
										last_active_at={user.last_active_at}
										projectsdata={projects}
										data={data.users}
										getTeamWorkData={getTeamWorkData}
										setLoading={setLoading}
										handleOnboardToProject={handleOnboardToProject}
										weekly_average={user.weekly_average_per_day}
										weekly_count={user.weekly_completed_todo}
										weekly_completed_budget={user.weekly_completed_budget}
										weekly_average_per_day={user.weekly_average_per_day}
										pending_tasks_budget={user.pending_tasks_budget}
										daily_hours_percentage={user.daily_hours_percentage}
										weekly_hours_percentage={user.weekly_hours_percentage}
										montly_hours_percentage={user.montly_hours_percentage}
										user_projects={user.projects}
									/>
								);
							})
						) : (
							<ContentLoader
								speed={2}
								width={700}
								height={450}
								viewBox='0 0 700 450'
								backgroundColor='rgb(46, 45, 45)'
								foregroundColor='rgb(12, 10, 39)'
							>
								<rect x='0' y='6.5' rx='10' ry='10' width='20' height='20' />
								<rect x='25' y='10' rx='4' ry='4' width='60' height='13' />
								<rect x='160' y='10' rx='4' ry='4' width='160' height='13' />
								<rect x='520' y='10' rx='4' ry='4' width='30' height='13' />
								<rect x='590' y='10' rx='4' ry='4' width='30' height='13' />
								<rect x='0' y='46.5' rx='10' ry='10' width='20' height='20' />
								<rect x='25' y='50' rx='4' ry='4' width='60' height='13' />
								<rect x='160' y='50' rx='4' ry='4' width='160' height='13' />
								<rect x='520' y='50' rx='4' ry='4' width='30' height='13' />
								<rect x='590' y='50' rx='4' ry='4' width='30' height='13' />
								<rect x='0' y='86.5' rx='10' ry='10' width='20' height='20' />
								<rect x='25' y='90' rx='4' ry='4' width='60' height='13' />
								<rect x='160' y='90' rx='4' ry='4' width='160' height='13' />
								<rect x='520' y='90' rx='4' ry='4' width='30' height='13' />
								<rect x='590' y='90' rx='4' ry='4' width='30' height='13' />
								<rect x='0' y='126.5' rx='10' ry='10' width='20' height='20' />
								<rect x='25' y='130' rx='4' ry='4' width='60' height='13' />
								<rect x='160' y='130' rx='4' ry='4' width='160' height='13' />
								<rect x='520' y='130' rx='4' ry='4' width='30' height='13' />
								<rect x='590' y='130' rx='4' ry='4' width='30' height='13' />
								<rect x='0' y='166.5' rx='10' ry='10' width='20' height='20' />
								<rect x='25' y='170' rx='4' ry='4' width='60' height='13' />
								<rect x='160' y='170' rx='4' ry='4' width='160' height='13' />
								<rect x='520' y='170' rx='4' ry='4' width='30' height='13' />
								<rect x='590' y='170' rx='4' ry='4' width='30' height='13' />
								<rect x='0' y='206.5' rx='10' ry='10' width='20' height='20' />
								<rect x='25' y='210' rx='4' ry='4' width='60' height='13' />
								<rect x='160' y='210' rx='4' ry='4' width='160' height='13' />
								<rect x='520' y='210' rx='4' ry='4' width='30' height='13' />
								<rect x='590' y='210' rx='4' ry='4' width='30' height='13' />
								<rect x='0' y='246.5' rx='10' ry='10' width='20' height='20' />
								<rect x='25' y='250' rx='4' ry='4' width='60' height='13' />
								<rect x='160' y='250' rx='4' ry='4' width='160' height='13' />
								<rect x='520' y='250' rx='4' ry='4' width='30' height='13' />
								<rect x='590' y='250' rx='4' ry='4' width='30' height='13' />
								<rect x='0' y='286.5' rx='10' ry='10' width='20' height='20' />
								<rect x='25' y='290' rx='4' ry='4' width='60' height='13' />
								<rect x='160' y='290' rx='4' ry='4' width='160' height='13' />
								<rect x='520' y='290' rx='4' ry='4' width='30' height='13' />
								<rect x='590' y='290' rx='4' ry='4' width='30' height='13' />
								<rect x='0' y='326.5' rx='10' ry='10' width='20' height='20' />
								<rect x='25' y='330' rx='4' ry='4' width='60' height='13' />
								<rect x='160' y='330' rx='4' ry='4' width='160' height='13' />
								<rect x='520' y='330' rx='4' ry='4' width='30' height='13' />
								<rect x='590' y='330' rx='4' ry='4' width='30' height='13' />
								<rect x='0' y='366.5' rx='10' ry='10' width='20' height='20' />
								<rect x='25' y='370' rx='4' ry='4' width='60' height='13' />
								<rect x='160' y='370' rx='4' ry='4' width='160' height='13' />
								<rect x='520' y='370' rx='4' ry='4' width='30' height='13' />
								<rect x='590' y='370' rx='4' ry='4' width='30' height='13' />
								<rect x='0' y='406.5' rx='10' ry='10' width='20' height='20' />
								<rect x='25' y='410' rx='4' ry='4' width='60' height='13' />
								<rect x='160' y='410' rx='4' ry='4' width='160' height='13' />
								<rect x='520' y='410' rx='4' ry='4' width='30' height='13' />
								<rect x='590' y='410' rx='4' ry='4' width='30' height='13' />
							</ContentLoader>
						)}
					</tbody>
				</table>
			)}
			<Modal
				open={onboardUserModal}
				onClose={() => {
					setOnboardUserModal(false);
				}}
				aria-labelledby='simple-modal-title'
				aria-describedby='simple-modal-description'
			>
				<Grid
					container
					spacing={3}
					direction='row'
					justifyContent='center'
					alignItems='center'
					style={{ height: '100vh' }}
				>
					<Grid
						item
						xs={10}
						sm={8}
						md={5}
						style={{
							width: 400,
							backgroundColor: 'white',
							border: '2px solid #000',
							padding: '3px'
						}}
					>
						<ModalBody>
							<div className='modal_header'>
								<Typography variant='h4' style={{ position: 'relative' }}>
									Onboard {onboardUserName} to
									<CloseIcon
										fontSize='large'
										style={{ position: 'absolute', right: '0', cursor: 'pointer' }}
										onClick={() => {
											setOnboardUserModal(false);
										}}
									/>
								</Typography>
							</div>
							<div className='modal_body'>
								<FormControl fullWidth>
									<Input
										type='text'
										label='email'
										placeholder='Enter Email address'
										value={onboardUserEmail}
										onChange={e => {
											setOnboardUserEmail(e.target.value);
										}}
										className='mb-4'
									/>
								</FormControl>
								<FormControl fullWidth>
									<InputLabel id='select-project-label'>Select Project</InputLabel>
									<Select
										labelId='select-project-label'
										id='select-project'
										label='Age'
										value={onboardProjectId}
										onChange={e => {
											setonboardProjectId(e.target.value);
										}}
									>
										{projects.map(project => {
											return <MenuItem value={project.project_id}>{project.name}</MenuItem>;
										})}
									</Select>
								</FormControl>
								<Button
									variant='contained'
									onClick={() => {
										onboardToProject();
									}}
								>
									Add
								</Button>
							</div>
						</ModalBody>
					</Grid>
				</Grid>
			</Modal>
		</>
	);
}

export default NewTeamTable;

const TableRow = props => {
	const [AvatarClick, setAvatarClick] = useState();

	const getProjectname = projectid => {
		// for (let i = 0; i < props.projectsdata.length; i++) {
		// 	if (props.projectsdata[i].project_id === projectid) {
		// 		let c = getProjectCount(projectid, props.pending_budget);
		// 		let s = props.projectsdata[i].name;
		// 		// if(s.length>13){
		// 		// 	s=s.slice(0,12)+'...';
		// 		// }
		// 		return s + ' (' + c + ')';
		// 	}
		// }

		let name = props.user_projects[projectid].project_name;
		let budget = props.user_projects[projectid].pending_budget;
		return name + ' (' + budget + ')';
	};
	const getProjectCount = (projectid, userid) => {
		for (let i = 0; i < props.data.length; i++) {
			if (props.data[i].user_id === userid) {
				return props.data[i]?.projects[projectid]?.count;
			}
		}
	};
	const handleDeleteMember = user_id => {
		axios
			.post(
				`${process.env.REACT_APP_API_URL}/pages/delete_user.php`,
				{ user_id: user_id },
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Access-Control-Allow-Origin': '*'
					}
				}
			)
			.then(res => {
				if (res.data.success === true) {
					alert(res.data.message);
					// getProjectData();
				} else {
					alert('Something went wrong');
					console.log(res.data);
				}
				props.getTeamWorkData();
				props.setLoading(false);
			})
			.catch(error => {
				console.error(error);
				props.setLoading(false);
			});
	};
	const onAvatarLongPress = () => {
		// props.setDeleteMember({img:props.img, name:props.name, user_id:props.user_id})
		// props.setOpenDeleteModal(true)
		if (window.confirm('Do you want to delete this user?')) {
			handleDeleteMember(props.user_id);
		}
	};
	const onAvatarClick = () => {
		if (AvatarClick === 'triggered') {
			setAvatarClick('nontriggered');
		} else {
			setAvatarClick('triggered');
		}
	};
	const defaultOptions = {
		shouldPreventDefault: true,
		delay: 500
	};
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		// console.log(event.currentTarget);
		setAnchorEl(null);
	};
	const longPressAvatarEvent = useLongPress(onAvatarLongPress, onAvatarClick, defaultOptions);

	const DeleteUserBySingleClick = e => {
		e.preventDefault();
		handleClose();
		const data = window.confirm('Are You sure want to delete ?');
		if (data) {
			handleDeleteMember(props.user_id);
		}
	};

	const [chartTooltip, setChartTooltip] = useState('');

	const getColor = value => {
		if (value > 70) {
			return 'green';
		} else if (value < 50) {
			return 'red';
		} else if (value > 50 && value < 70) {
			return 'yellow';
		}
	};

	return (
		<tr style={{ marginTop: '0', paddingTop: '0' }}>
			<td style={{ fontSize: '14px' }}>
				<Grid container spacing={2}>
					{AvatarClick === 'triggered' ? (
						<>
							<Menu
								id='demo-positioned-menu'
								aria-labelledby='demo-positioned-button'
								anchorEl={anchorEl}
								open={open}
								onClose={handleClose}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right'
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'left'
								}}
							>
								<MenuItem onClick={DeleteUserBySingleClick}>Delete {props.name}</MenuItem>
								<MenuItem onClick={handleClose}>Transfer all task of this user</MenuItem>
								<MenuItem
									onClick={() => {
										handleClose();
										props.handleOnboardToProject(props.user_id, props.name);
									}}
								>
									Onboard User to another project
								</MenuItem>
							</Menu>
						</>
					) : (
						<></>
					)}
					<Grid item xs={2} sm={1} style={{ transform: 'translateY(-2px)' }}>
						<img
							{...longPressAvatarEvent}
							src={props.img}
							alt='profile'
							style={{ width: '24px', height: '24px' }}
							onClick={handleClick}
						></img>
					</Grid>
					<Grid item xs={8} sm={10} style={{ fontSize: '14px' }}>
						<a
							href={`https://3.basecamp.com/4954106/reports/users/progress/${props.user_id}`}
							style={{
								color:
									props.name.split(' ')[0] === 'Kajal'
										? 'white'
										: props.active_todo === 0
										? 'red'
										: moment().diff(moment(props.last_active_at), 'hours') >= 3
										? '#EDFC45'
										: 'white',
								paddingLeft: '2rem',
								fontSize: '14px'
							}}
							target='_blank'
							rel='noreferrer'
						>
							{props.name.split(' ')[0]}{' '}
						</a>
					</Grid>
				</Grid>
			</td>

			{/* green ticks */}
			<td style={{ transform: 'translate(0, -3px)', fontSize: '14px' }}>
				<div style={{ display: 'flex', justifyContent: 'flex-start' }}>
					<div
						style={{ width: '30px', height: '30px', position: 'relative' }}
						onMouseEnter={() => setChartTooltip('Daily')}
						onMouseLeave={() => setChartTooltip('')}
					>
						<CircularProgressbar
							value={props.daily_hours_percentage}
							text={`${props.daily_hours_percentage}%`}
							styles={buildStyles({
								pathColor: getColor(props.daily_hours_percentage),
								textColor: getColor(props.daily_hours_percentage)
							})}
						/>
						{chartTooltip === 'Daily' && (
							<div
								style={{
									position: 'absolute',
									top: '-4vh',
									left: '-1vw',
									fontSize: '1.8vh',
									color: 'white',
									width: 'fit-content',
									background: 'rgba(0,0,0,0.9)',
									padding: '0.3vh 0.5vw',
									display: 'flex',
									alignItems: 'center'
								}}
							>
								Daily
								<div style={{ marginLeft: '0.5rem' }}>{props.daily_hours_percentage}%</div>
							</div>
						)}
					</div>
					<div
						style={{ width: '30px', height: '30px', margin: '0 0.5vw', position: 'relative' }}
						onMouseEnter={() => setChartTooltip('Weekly')}
						onMouseLeave={() => setChartTooltip('')}
					>
						<CircularProgressbar
							value={props.weekly_hours_percentage}
							text={`${props.weekly_hours_percentage}%`}
							styles={buildStyles({
								pathColor: getColor(props.weekly_hours_percentage),
								textColor: getColor(props.weekly_hours_percentage)
							})}
						/>

						{chartTooltip === 'Weekly' && (
							<div
								style={{
									position: 'absolute',
									top: '-4vh',
									left: '-1vw',
									fontSize: '1.8vh',
									color: 'white',
									width: 'fit-content',
									background: 'rgba(0,0,0,0.9)',
									padding: '0.3vh 0.5vw',
									display: 'flex',
									alignItems: 'center'
								}}
							>
								Weekly
								<div style={{ marginLeft: '0.5rem' }}>{props.weekly_hours_percentage}%</div>
							</div>
						)}
					</div>
					<div
						style={{ width: '30px', height: '30px', position: 'relative' }}
						onMouseEnter={() => setChartTooltip('Monthly')}
						onMouseLeave={() => setChartTooltip('')}
					>
						<CircularProgressbar
							value={props.montly_hours_percentage}
							text={`${props.montly_hours_percentage}%`}
							styles={buildStyles({
								pathColor: getColor(props.montly_hours_percentage),
								textColor: getColor(props.montly_hours_percentage)
							})}
						/>
						{chartTooltip === 'Monthly' && (
							<div
								style={{
									position: 'absolute',
									top: '-4vh',
									left: '-1vw',
									fontSize: '1.8vh',
									color: 'white',
									width: 'fit-content',
									background: 'rgba(0,0,0,0.9)',
									padding: '0.3vh 0.5vw',
									display: 'flex',
									alignItems: 'center'
								}}
							>
								Monthly
								<div style={{ marginLeft: '0.5rem' }}>{props.montly_hours_percentage}%</div>
							</div>
						)}
					</div>

					{/* {props.completed_todo && parseInt(props.completed_todo) !== 0
						? [...Array(props.completed_todo)]?.map((count, key) => {
								if (key !== 1 && key !== 0 && (key + 1) % 5 === 0) {
									return (
										<span
											style={{
												marginRight: '5px',
												fontSize: '14px'
											}}
											key={key}
										>
											<svg
												width='16'
												height='13'
												viewBox='0 0 16 13'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													d='M13.2982 1.2859C13.5588 1.0378 13.9056 0.900638 14.2654 0.90336C14.6252 0.906083 14.9699 1.04848 15.2267 1.3005C15.4835 1.55252 15.6324 1.89445 15.6419 2.25414C15.6514 2.61384 15.5208 2.96316 15.2777 3.2284L7.89621 12.4599C7.76928 12.5966 7.61609 12.7063 7.44579 12.7824C7.2755 12.8586 7.09159 12.8996 6.90508 12.9031C6.71856 12.9065 6.53326 12.8723 6.36026 12.8025C6.18726 12.7327 6.03012 12.6288 5.89822 12.4969L1.00313 7.60178C0.866812 7.47476 0.757474 7.32158 0.681639 7.15138C0.605804 6.98118 0.565026 6.79745 0.561739 6.61115C0.558452 6.42485 0.592723 6.2398 0.662507 6.06703C0.73229 5.89427 0.836158 5.73732 0.967912 5.60557C1.09967 5.47381 1.25661 5.36995 1.42938 5.30016C1.60214 5.23038 1.7872 5.19611 1.9735 5.1994C2.1598 5.20268 2.34352 5.24346 2.51372 5.3193C2.68392 5.39513 2.8371 5.50447 2.96413 5.64079L6.83801 9.51283L13.263 1.3266C13.2746 1.31236 13.287 1.29877 13.3 1.2859H13.2982Z'
													fill='#14FF00'
												/>
											</svg>
											<br />
										</span>
									);
								}
								return (
									<span
										style={{
											marginRight: '5px',
											fontSize: '14px'
										}}
										//className="tick-arrow"
										key={key}
									>
										<svg
											width='16'
											height='13'
											viewBox='0 0 16 13'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												d='M13.2982 1.2859C13.5588 1.0378 13.9056 0.900638 14.2654 0.90336C14.6252 0.906083 14.9699 1.04848 15.2267 1.3005C15.4835 1.55252 15.6324 1.89445 15.6419 2.25414C15.6514 2.61384 15.5208 2.96316 15.2777 3.2284L7.89621 12.4599C7.76928 12.5966 7.61609 12.7063 7.44579 12.7824C7.2755 12.8586 7.09159 12.8996 6.90508 12.9031C6.71856 12.9065 6.53326 12.8723 6.36026 12.8025C6.18726 12.7327 6.03012 12.6288 5.89822 12.4969L1.00313 7.60178C0.866812 7.47476 0.757474 7.32158 0.681639 7.15138C0.605804 6.98118 0.565026 6.79745 0.561739 6.61115C0.558452 6.42485 0.592723 6.2398 0.662507 6.06703C0.73229 5.89427 0.836158 5.73732 0.967912 5.60557C1.09967 5.47381 1.25661 5.36995 1.42938 5.30016C1.60214 5.23038 1.7872 5.19611 1.9735 5.1994C2.1598 5.20268 2.34352 5.24346 2.51372 5.3193C2.68392 5.39513 2.8371 5.50447 2.96413 5.64079L6.83801 9.51283L13.263 1.3266C13.2746 1.31236 13.287 1.29877 13.3 1.2859H13.2982Z'
												fill='#14FF00'
											/>
										</svg>
									</span>
								);
						  })
						: ''} */}

					{/* {props.active && parseInt(props.active.split('')[0]) !== 0
						? [
							...Array(
								(props.active_todo) - props.completed_todo < 0
									? 0
									: (props.active_todo) - props.completed_todo
							)
						]?.map((count, key) => {
							return (
								<span style={{ marginRight: '5px', fontSize: '14px' }}>
									<svg
										width='7'
										height='7'
										viewBox='0 0 7 7'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
										style={{ fontSize: '14px', transform: 'translateY(-40%)' }}
									>
										<circle cx='3.58691' cy='3.90332' r='3' fill='#666666' />
									</svg>
								</span>
							);
						})
						: ''} */}
				</div>
			</td>

			<td>
				{props.weekly_completed_budget === 0 ? (
					<div>{props.weekly_completed_budget}</div>
				) : (
					<div>{props.weekly_completed_budget}</div>
				)}
			</td>

			<td
				style={{
					transform: 'translateX(35px)',
					fontSize: '14px',
					position: 'relative',
					left: '3px'
				}}
			>
				{props.weekly_average_per_day === 0 ? (
					<div>{props.weekly_average_per_day}</div>
				) : props.weekly_average_per_day < 3 ? (
					<div style={{ color: 'red' }}>{props.weekly_average_per_day}</div>
				) : (
					<div>{props.weekly_average_per_day}</div>
				)}
			</td>

			<td
				style={{
					transform: 'translateX(25px)',
					fontSize: '14px',
					position: 'relative',
					left: '3px'
				}}
			>
				<a
					href={`https://3.basecamp.com/4954106/reports/todos/assigned/${props.user_id}`}
					style={{
						color: props?.tasks > 15 || props?.tasks <= 2 ? 'red' : 'white',
						fontSize: '14px',
						zIndex: '-1'
					}}
					target='_blank'
					rel='noreferrer'
				>
					{props.pending_tasks_budget > 0 ? props.pending_tasks_budget : props.pending_tasks_budget}
				</a>
			</td>

			{/* projects column */}
			<td
				style={{
					textAlign: 'center',
					transform: 'translateX(-8px)',
					position: 'relative',
					left: '3px'
				}}
			>
				<p
					style={{
						color:
							props.projects.length > 3 ? 'red' : props.projects.length === 1 ? '#98FB58' : 'white',
						fontSize: '13px',
						position: 'relative',
						display: 'inline-block'
					}}
					className='projectCount'
				>
					{props.projects.length > 0 ? props.projects.length : ''}

					<div style={{ display: 'inline-block' }} className='ProjectCounttip'>
						{props.projects.map((each, i) => {
							const projectname = getProjectname(each);

							return <div>{projectname}</div>;
						})}
					</div>
				</p>
			</td>
		</tr>
	);
};
