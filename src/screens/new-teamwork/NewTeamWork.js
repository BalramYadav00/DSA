import axios from 'axios';
import '../BigDashboard';
import { motion } from 'framer-motion';
import FormHelperText from '@mui/material/FormHelperText';

import React, { useEffect, useState } from 'react';
import { pageTransitions, pageVariants } from 'animations';
import { Container, TeamTabBottom, TeamTabTop, ModalBody, Projects } from '../TeamWork/Style';
import {
	Button,
	Container as MdContainer,
	Grid,
	Modal,
	TextField,
	Typography
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Backdrop from '@material-ui/core/Backdrop';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import TabComponent from 'components/TabComponent/TabComponent';
import TeamTable from '../TeamWork/TeamTable';
// import ContentLoader from 'react-content-loader';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import NewTeamTable from './NewTeamTable';
const token = localStorage.getItem('red_wing_token');
const token_expiry_date = localStorage.getItem('red_wing_token_expiry_date');

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
		position: 'absolute',
		width: '100%',
		height: '100%',
		background: 'rgba(0,0,0,0.5)'
	},
	hide_heading: {
		display: 'none'
	}
}));

function NewTeamWork({
	isInverted,
	showTeamTabTop = true,
	showTabComponent = true,
	showActionButtons = true,
	data1,
	loading1,
	setLoading1
}) {
	const [tabValue, setTabValue] = useState('Team');
	const localStorageData = localStorage.getItem('redwing_data');

	const [data, setData] = useState(
		data1 !== undefined
			? data1
			: localStorage.getItem('redwing_data')
			? JSON.parse(localStorageData)
			: {}
	);

	const [projectData, setProjectData] = useState(
		data1 !== undefined
			? data1.projects
			: localStorage.getItem('redwing_data')
			? JSON.parse(localStorageData).projects
			: []
	);

	console.log(data);

	// const projectData = data.projects;
	const [projects, setProjects] = useState([]);
	const [users, setUsers] = useState([]);
	const [projectId, setProjectId] = useState('');
	const [openAddProjectModal, setOpenAddProjectModal] = useState(false);
	const classes = useStyles();
	const [loading, setLoading] = useState(loading1 ? loading1 : false);
	const [loadingdata, setLoadingdata] = useState(true);
	const [sortingOrder, setSortingOrder] = useState('DEC');
	const [sortingColumn, setSortingColumn] = useState('tasks_count');
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [absentUsers, SetAbsentUsers] = useState([]);
	const [slowdownUsers, SetSlowdownUsers] = useState([]);
	const [idleUsers, SetIdleUsers] = useState([]);

	useEffect(() => {
		if (data1 === undefined) {
			getTeamWorkData();

			setInterval(async () => {
				getTeamWorkData();
				console.log('refreshing');
			}, 60000);

			setLoadingdata(false);
		}
	}, []);

	useEffect(() => {
		if (loading1 !== undefined) {
			setLoading(loading1);
		}
	}, [loading1]);

	useEffect(() => {
		if (data1 !== undefined) {
			setData(data1);
		}
	}, [data1]);

	console.log({ users });

	const [segmenting, setSegmenting] = React.useState('Default');

	const handleChange = event => {
		setSegmenting(event.target.value);
	};

	const sorting = (col, sortingOrder1) => {
		if (
			col === 'tasks_count' ||
			col === 'active_count' ||
			col === 'weekly_completed_todo' ||
			col === 'weekly_average_per_day'
		) {
			if (sortingOrder1 === 'ASC') {
				const sorted = [...users].sort((a, b) => (a[col] < b[col] ? 1 : -1));

				setUsers(sorted);

				setSortingOrder('DEC');
			} else if (sortingOrder1 === 'DEC') {
				const sorted = [...users].sort((a, b) => (a[col] > b[col] ? 1 : -1));

				setUsers(sorted);

				setSortingOrder('ASC');
			}
		} else if (col === 'project_ids') {
			if (sortingOrder1 === 'ASC') {
				const sorted = [...users].sort((a, b) => (a[col].length < b[col].length ? 1 : -1));

				setUsers(sorted);

				setSortingOrder('DEC');
			} else if (sortingOrder1 === 'DEC') {
				const sorted = [...users].sort((a, b) => (a[col].length > b[col].length ? 1 : -1));

				setUsers(sorted);

				setSortingOrder('ASC');
			}
		} else if (col === 'name') {
			if (sortingOrder1 === 'ASC') {
				const sorted = [...users].sort((a, b) =>
					a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
				);

				setUsers(sorted);

				setSortingOrder('DEC');
			} else if (sortingOrder1 === 'DEC') {
				const sorted = [...users].sort((a, b) =>
					a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
				);

				setUsers(sorted);

				setSortingOrder('ASC');
			}
		} else if (col === 'completed_todo') {
			if (sortingOrder1 === 'ASC') {
				const sorted = [...users].sort((a, b) => (a[col] < b[col] ? 1 : -1));

				setUsers(sorted);

				setSortingOrder('DEC');
			} else if (sortingOrder1 === 'DEC') {
				const sorted = [...users].sort((a, b) => (a[col] > b[col] ? 1 : -1));

				setUsers(sorted);

				setSortingOrder('ASC');
			}
		} else if (col === 'todos_created_today_count') {
			if (sortingOrder1 === 'ASC') {
				const sorted = [...projects].sort((a, b) => (a[col] < b[col] ? 1 : -1));

				setProjects(sorted);

				setSortingOrder('DEC');
			} else if (sortingOrder1 === 'DEC') {
				const sorted = [...projects].sort((a, b) => (a[col] > b[col] ? 1 : -1));

				setProjects(sorted);

				setSortingOrder('ASC');
			}
		}
		//(sortingOrder);
	};

	const getTeamWorkData = () => {
		if (data1 === undefined) {
			setLoading(true);

			axios
				.get(`${process.env.REACT_APP_API_URL}/pages/team_work.php`, {
					headers: {
						Authorization: `Bearer ${token}`,
						'Access-Control-Allow-Origin': '*'
					}
				})
				.then(res => {
					console.log('data', res.data);
					setData(res.data);
					setProjectData(res.data.projects);
					localStorage.setItem('redwing_data', JSON.stringify(res.data));
					setLoading(false);
				})
				.catch(error => {
					console.error(error);
					setLoading(false);
				});
		}
	};
	// const getProjectData = () => {
	// 	setProjectLoading(true);
	// 	axios
	// 		.get(`${process.env.REACT_APP_API_URL}/pages/projects.php`, {
	// 			headers: {
	// 				Authorization: `Bearer ${token}`,
	// 				'Access-Control-Allow-Origin': '*'
	// 			}
	// 		})
	// 		.then(res => {
	// 			setProjectData(res.data);
	// 			setProjectLoading(false);
	// 		})
	// 		.catch(error => {
	// 			console.error(error);
	// 			setProjectLoading(false);
	// 		});
	// };
	useEffect(() => {
		var users = [];
		if (data && data.users && data.users.length) {
			data.users.forEach(user => {
				if (user.user_id !== 33629907 && user.name.length > 0) {
					users.push(user);
				}
			});
			// for (var k in data.users) {
			// 	users.push(data.users[k]);
			// }
			setUsers(users);
			// setSortingOrder('DEC');
			// setSortingColumn('tasks_count');

			if (segmenting === 'Performance Segmenting') {
				setSortingColumn('completed_todo');
				sorting('completed_todo', 'ASC');
			} else {
				setSortingOrder('DEC');
				setSortingColumn('tasks_count');
			}
		}
	}, [data, segmenting]);
	useEffect(() => {
		var users1 = [];
		var users2 = [];
		var users3 = [];
		if (data && data.users && data.users.length) {
			data.users.forEach(user => {
				if (user.active_todo_count === 0 && user.tasks_count !== 0 && user.name !== 'Kajal Patel')
					users1.push({ name: user.name, id: user.user_id });
				if (user.tasks_count === 0 && user.name !== 'Kajal Patel')
					users2.push({ name: user.name, id: user.user_id });
				if (
					moment().diff(moment(user.last_active_at), 'hours') >= 3 &&
					user.tasks_count !== 0 &&
					user.active_todo_count !== 0 &&
					user.name !== 'Kajal Patel'
				)
					users3.push({ name: user.name, id: user.user_id });
			});
		}
		SetAbsentUsers(users1);
		setIdle(users2);
		SetSlowdownUsers(users3);
	}, [users]);
	let uniqueAbsentUsersArray = [...new Map(absentUsers.map(item => [item['id'], item])).values()];
	let uniqueIdleUsersArray = [...new Map(idleUsers.map(item => [item['id'], item])).values()];
	let uniqueSlowdownUsersArray = [
		...new Map(slowdownUsers.map(item => [item['id'], item])).values()
	];

	useEffect(() => {
		var projects = [];
		for (var k in projectData) {
			projects.push(projectData[k]);
		}
		setProjects(projects);
	}, [projectData]);
	const handleRefreshUserList = () => {
		setLoading(true);
		axios
			.get(`${process.env.REACT_APP_API_URL}/pages/refresh_user_list.php`, {
				headers: {
					Authorization: `${token}`,
					'Access-Control-Allow-Origin': '*'
				}
			})
			.then(res => {
				if (res.data.status === true) {
					alert(res.data.message);
					getTeamWorkData();
					// getProjectData();
				} else {
					alert('Something went wrong');
					console.log(res.data);
				}
				setLoading(false);
			})
			.catch(error => {
				console.error(error);
				setLoading(false);
			});
	};
	const onSVGClick = () => {
		if (tabValue === 'Team') {
			setTabValue('Projects');
		}
		if (tabValue === 'Projects') {
			setTabValue('Team');
		}
	};
	const handleOpenProjectModal = () => {
		setOpenAddProjectModal(true);
	};
	const handleCloseProjectModal = () => {
		setOpenAddProjectModal(false);
	};
	const handleAddProjectId = () => {
		if (projectId) {
			setLoading(true);
			handleCloseProjectModal();
			axios
				.post(
					`${process.env.REACT_APP_API_URL}/pages/add_project.php`,
					{ project_id: projectId },
					{
						headers: {
							Authorization: `${token}`,
							'Access-Control-Allow-Origin': '*'
						}
					}
				)
				.then(res => {
					if (res.data.status === true) {
						alert(res.data.message);
						setProjectId('');
						getTeamWorkData();
						// getProjectData();
					} else {
						handleOpenProjectModal();
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
	const handleCloseDeleteModal = () => {
		setOpenDeleteModal(false);
	};
	const [toggel, setToggel] = useState(true);
	const teamTableProps = {
		users,
		sorting,
		sortingColumn,
		setSortingColumn,
		sortingOrder,
		projects,
		data,
		getTeamWorkData,
		setLoading
	};
	const redwingProjectId = 23190856;
	const [oneProject, setOneProject] = useState([]);
	const [idle, setIdle] = useState(false);
	// console.log(toggel);
	const plus5star = users.filter(user => user.completed_todo > 5);
	// console.log(plus5star);
	useEffect(() => {
		setOneProject(
			Array.from(
				new Set(
					users
						.filter(
							user => user.project_ids.length === 1 && !user.project_ids.includes(redwingProjectId)
						)
						.map(each => each.project_ids[0])
				)
			)
		);
		setIdle(users.filter(each => each.tasks_count === 0).length !== 0);
	}, [users]);

	return (
		<>
			<motion.div
				initial='initial'
				animate={isInverted ? 'inRight' : 'inLeft'}
				exit={isInverted ? 'outRight' : 'outLeft'}
				variants={pageVariants}
				transition={pageTransitions}
				style={{
					width: '100%',
					position: 'relative',
					overflowX: 'scroll',
					padding: '32px 29px'
				}}
			>
				<Container>
					{/* <div style={{ marginTop: '0px', marginBottom: '24px'}}>
						<p
							style={{ color: 'red', marginLeft: '6px' }}
							className={
								uniqueAbsentUsersArray.length === 0 ? `${classes.hide_heading}` : 'default'
							}
						>
							<span>
								{uniqueAbsentUsersArray.length}
								{'  '}
							</span>
							Absent Users :{' '}
							{uniqueAbsentUsersArray.map((item, index) => (
								<span style={{ marginLeft: '5px', color: 'white' }}>
									<a
										target='_blank'
										rel='noreferrer'
										style={{ color: 'white' }}
										href={`https://3.basecamp.com/4954106/reports/users/progress/${item?.id}`}
									>
										{item?.name.split(' ')[0]}
									</a>
									{index !== uniqueAbsentUsersArray.length - 1 && <span>, </span>}
								</span>
							))}
						</p>

						<p
							style={{ color: '#EDFC45', marginLeft: '6px' }}
							className={
								uniqueSlowdownUsersArray.length === 0 ? `${classes.hide_heading}` : 'default'
							}
						>
							<span>
								{uniqueSlowdownUsersArray.length}
								{'  '}
							</span>
							Slowdown Users :{' '}
							{uniqueSlowdownUsersArray.map((item, index) => (
								<span style={{ marginLeft: '5px', color: 'white' }}>
									<a
										target='_blank'
										rel='noreferrer'
										style={{ color: 'white' }}
										href={`https://3.basecamp.com/4954106/reports/users/progress/${item?.id}`}
									>
										{item?.name.split(' ')[0]}
									</a>
									{index !== uniqueSlowdownUsersArray.length - 1 && <span>, </span>}
								</span>
							))}
						</p>

						<p
							style={{ color: 'skyBlue', marginLeft: '6px' }}
							className={uniqueIdleUsersArray.length === 0 ? `${classes.hide_heading}` : 'default'}
						>
							<span>
								{uniqueIdleUsersArray.length}
								{'  '}
							</span>
							Idle Users :{' '}
							{uniqueIdleUsersArray.map((item, index) => (
								<span style={{ marginLeft: '5px', color: 'white' }}>
									<a
										target='_blank'
										rel='noreferrer'
										style={{ color: 'white' }}
										href={`https://3.basecamp.com/4954106/reports/users/progress/${item?.id}`}
									>
										{item?.name.split(' ')[0]}
									</a>
									{index !== uniqueIdleUsersArray.length - 1 && <span>, </span>}
								</span>
							))}
						</p>
					</div> */}
					{showTabComponent && (
						<TabComponent
							active={tabValue}
							setActive={setTabValue}
							tabList={['Team', 'Projects']}
							counts={{ Team: users?.length, Projects: projects?.length }}
						/>
					)}
					{tabValue === 'Team' && (
						<>
							{showTeamTabTop && (
								<TeamTabTop>
									<table>
										<tr align='center'>
											<th align='center'>Today</th>
											<th align='center'>Average</th>
											<th align='center'>Sleeping</th>
											<th align='center'>Unassigned</th>
										</tr>
										<tr style={{ alignItems: 'center', margin: 'auto' }}>
											<td align='center'>{data.tickets_created_today}</td>
											<td>{data.average}</td>
											<td>
												<a
													href='https://redwing.puneetpugalia.com/pages/sleeping_task.php'
													target='_blank'
													rel='noreferrer'
													style={{ color: 'white' }}
												>
													{data.sleeping_tasks}
												</a>
											</td>
											<td>
												<a
													href='https://redwing.puneetpugalia.com/pages/unassigned_task.php'
													target='_blank'
													rel='noreferrer'
													style={{ color: 'white' }}
												>
													{data.unassigned_tasks}
												</a>
											</td>
										</tr>
									</table>
								</TeamTabTop>
							)}
							{/* <p className='isSegmented'>Toggel</p> */}
							<div className='flexx'>
								{/* <p className='isSegmented'>Segmenting: </p>&nbsp;&nbsp; */}
								<p
									value={'Default'}
									onClick={() => setSegmenting('Default')}
									className='isSegmented'
								>
									{segmenting === 'Default' ? (
										<p className='dft'>Default</p>
									) : (
										<p className='unactive-segmenting'>Default</p>
									)}
								</p>
								&nbsp;&nbsp;
								<p
									value={'Project Segmenting'}
									onClick={() => setSegmenting('Project Segmenting')}
									className='isSegmented'
								>
									{segmenting === 'Project Segmenting' ? (
										<p className='dft'>Project</p>
									) : (
										<p className='unactive-segmenting'>Project</p>
									)}
								</p>
								&nbsp;&nbsp;
								<p
									value={'Playground Segmenting'}
									onClick={() => setSegmenting('Playground Segmenting')}
									className='isSegmented'
								>
									{segmenting === 'Playground Segmenting' ? (
										<p className='dft'>Playground</p>
									) : (
										<p className='unactive-segmenting'>Playground</p>
									)}
								</p>
								&nbsp;&nbsp;
								<p
									value={'Performance Segmenting'}
									onClick={() => setSegmenting('Performance Segmenting')}
									className='isSegmented'
								>
									{segmenting === 'Performance Segmenting' ? (
										<p className='dft'>Performance</p>
									) : (
										<p className='unactive-segmenting'>Performance</p>
									)}
								</p>
								&nbsp;&nbsp;
							</div>

							{segmenting === 'Project Segmenting' && (
								<TeamTabBottom>
									<NewTeamTable toggel={toggel} {...teamTableProps} isMultitasking={true} />
									{oneProject.map((each, index) => (
										<TeamTable
											{...teamTableProps}
											isProjectSame={true}
											projectId={each}
											key={index}
											projectName={projects.find(one => one.project_id === each).name}
										/>
									))}
									<NewTeamTable {...teamTableProps} isPlayground={true} />
									{idle && <TeamTable {...teamTableProps} isIdle={true} />}
									{showActionButtons && (
										<MdContainer maxWidth='md'>
											{token && token !== 'undefined' && new Date(token_expiry_date) > new Date() && (
												<Grid container spacing={3} direction='row' justifyContent='center'>
													<Grid item>
														<Button
															variant='contained'
															color='primary'
															onClick={handleOpenProjectModal}
														>
															Add New Project
														</Button>
													</Grid>
													<Grid item>
														<Button
															variant='contained'
															onClick={handleRefreshUserList}
															color='primary'
														>
															Refresh User List
														</Button>
													</Grid>
												</Grid>
											)}
											{(!token ||
												token === 'undefined' ||
												new Date(token_expiry_date) <= new Date()) && (
												<Grid container spacing={3} direction='row' justifyContent='center'>
													<Grid item>
														<a href='https://launchpad.37signals.com/authorization/new?type=web_server&client_id=7d03697adc886996a673634b89d51d8febb29979&redirect_uri=https://touch-dashborad.herokuapp.com/auth/callback'>
															<Button variant='contained' color='primary'>
																Login to Basecamp
															</Button>
														</a>
													</Grid>
												</Grid>
											)}
										</MdContainer>
									)}
								</TeamTabBottom>
							)}

							{segmenting === 'Playground Segmenting' && (
								<>
									<TeamTabBottom>
										<NewTeamTable
											isPlayground={false}
											default1={false}
											isMultitasking={false}
											isProjectSame={false}
											isPerformance={false}
											isIdle={false}
											notredwing={true}
											onlyRedwing={false}
											{...teamTableProps}
										/>
										<NewTeamTable
											isPlayground={false}
											default1={false}
											isMultitasking={false}
											isProjectSame={false}
											isPerformance={false}
											isIdle={false}
											notredwing={false}
											onlyRedwing={true}
											{...teamTableProps}
										/>
									</TeamTabBottom>
								</>
							)}

							{segmenting === 'Performance Segmenting' && (
								<>
									<TeamTabBottom>
										{/* {console.log()} */}
										{plus5star.length > 0 ? (
											<TeamTable
												isPlayground={false}
												default1={false}
												isMultitasking={false}
												isProjectSame={false}
												isPerformance15={false}
												isPerformance5={true}
												isPerformance0={false}
												isIdle={false}
												onlyRedwing={false}
												{...teamTableProps}
											/>
										) : (
											<></>
										)}
										<TeamTable
											isPlayground={false}
											default1={false}
											isMultitasking={false}
											isProjectSame={false}
											isPerformance5={false}
											isPerformance15={true}
											isIdle={false}
											onlyRedwing={false}
											{...teamTableProps}
										/>
										<TeamTable
											isPlayground={false}
											default1={false}
											isMultitasking={false}
											isProjectSame={false}
											isPerformance15={false}
											isPerformance0={true}
											isPerformance5={false}
											isIdle={false}
											onlyRedwing={false}
											{...teamTableProps}
										/>
										{/* <TeamTable isPlayground={false} default1={false} isMultitasking={false} isProjectSame={false} isPerformance={false} isIdle={false} onlyRedwing={true} {...teamTableProps} /> */}
										{/* <TeamTable {...teamTableProps} /> */}
									</TeamTabBottom>
								</>
							)}

							{segmenting === 'Default' && (
								<>
									<TeamTabBottom>
										{/* <TeamTable {...teamTableProps} isMultitasking={true} /> */}
										{/* {oneProject.map((each, index) => { */}
										{/* console.log(oneProject); */}
										{/* console.log(each); */}
										{/* return ( */}
										<NewTeamTable
											isPlayground={false}
											default1={true}
											isMultitasking={false}
											isProjectSame={false}
											isPerformance={false}
											isIdle={false}
											onlyRedwing={false}
											{...teamTableProps}
										/>
										{/* <TeamTable isPlayground={false} default1={false} isMultitasking={false} isProjectSame={false} isPerformance={false} isIdle={false} onlyRedwing={true} {...teamTableProps} /> */}
										{/* <TeamTable {...teamTableProps} singleUsers={true} /> */}
										{/* ) */}
										{/* })} */}
										{/* Team who only belongs to Redwing */}
										{/* {idle && <TeamTable {...teamTableProps} isIdle={true} />} */}
									</TeamTabBottom>
								</>
							)}
						</>
					)}

					{tabValue === 'Projects' && (
						<React.Fragment>
							<Projects>
								<h2>Projects</h2>
								<table>
									<thead>
										<tr>
											<th>Projects</th>
											<th
												onClick={e => {
													e.preventDefault();
													setSortingColumn('todos_created_today_count');
													if (sortingOrder === 'ASC') {
														sorting('todos_created_today_count', 'ASC');
													} else {
														sorting('todos_created_today_count', 'DEC');
													}
												}}
												style={{ textAlign: 'center' }}
											>
												Tasks Today
												{sortingColumn === 'todos_created_today_count' ? (
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
									<tbody>
										{projects
											? projects.map((project, key) => {
													// console.log(project);
													const project_id = project.project_id;

													return (
														<tr>
															<td>
																<div>
																	<div key={key}>{project.name}</div>
																	<div>
																		{users.map(user => {
																			let arr = [];
																			let project_ids = user.project_ids;
																			project_ids.forEach(id => {
																				if (id === project_id) {
																					arr.push(user);
																				}
																			});

																			return (
																				<>
																					{arr.map((user, index) => {
																						return (
																							<div
																								style={{
																									display: 'flex',
																									alignItems: 'center',
																									margin: '1vh 0'
																								}}
																							>
																								<img
																									src={user.avatar}
																									width='30px'
																									style={{ borderRadius: '100%' }}
																									alt={user.name}
																									key={index}
																								/>
																								<span
																									style={{ fontSize: '2.2vh', marginLeft: '0.5vw' }}
																									key={index}
																								>
																									{user.name}
																								</span>
																							</div>
																						);
																					})}
																				</>
																			);
																		})}
																	</div>
																</div>
															</td>
															<td>{project.todos_created_today_count}</td>
														</tr>
													);
											  })
											: ''}
									</tbody>
								</table>
								<MdContainer maxWidth='md'>
									{token && token !== 'undefined' && new Date(token_expiry_date) > new Date() && (
										<Grid container spacing={3} direction='row' justifyContent='center'>
											<Grid item>
												<Button
													variant='contained'
													color='primary'
													onClick={handleOpenProjectModal}
												>
													Add New Project
												</Button>
											</Grid>
											<Grid item>
												<Button variant='contained' onClick={handleRefreshUserList} color='primary'>
													Refresh User List
												</Button>
											</Grid>
										</Grid>
									)}
									{(!token ||
										token === 'undefined' ||
										new Date(token_expiry_date) <= new Date()) && (
										<Grid container spacing={3} direction='row' justifyContent='center'>
											<Grid item>
												<a href='https://launchpad.37signals.com/authorization/new?type=web_server&client_id=7d03697adc886996a673634b89d51d8febb29979&redirect_uri=https://touch-dashborad.herokuapp.com/auth/callback'>
													<Button variant='contained' color='primary'>
														Login to Basecamp
													</Button>
												</a>
											</Grid>
										</Grid>
									)}
								</MdContainer>
							</Projects>
						</React.Fragment>
					)}
				</Container>
				{/* Modal for deleting team member */}
				{/* <Modal
					open={openDeleteModal}
					onClose={handleCloseDeleteModal}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					 <Box sx={deleteMemberStyle}>
					<Card sx={{ display: 'flex' }}>
						<CardMedia
							component="img"
							sx={{ width: 151 }}
							image={deleteMember.img}
							alt="Live from space album cover"
						/>
						<Box sx={{ display: 'flex', flexDirection: 'column' }}>
							<CardContent sx={{ flex: '1 0 auto' }}>
							<Typography component="div" variant="h5">
								{deleteMember.name.split(' ')[0]}{' '}
							</Typography>
							</CardContent>
							<Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
								<Button variant='contained'  color='primary' onClick={()=>handleDeleteMember(deleteMember.user_id)}>Delete</Button>
							</Box>
						</Box>
						
					</Card>
					 </Box>
				</Modal> */}

				<Modal
					open={openAddProjectModal}
					onClose={handleCloseProjectModal}
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
									<Typography variant='h2' style={{ position: 'relative' }}>
										Add Project
										<CloseIcon
											fontSize='large'
											style={{ position: 'absolute', right: '0', cursor: 'pointer' }}
											onClick={handleCloseProjectModal}
										/>
									</Typography>
								</div>
								<div className='modal_body'>
									<TextField
										id='outlined-basic'
										label='Project Id'
										variant='outlined'
										fullWidth={true}
										onChange={function (event) {
											setProjectId(event.target.value);
										}}
									/>
									<Button variant='contained' onClick={handleAddProjectId}>
										Add
									</Button>
								</div>
							</ModalBody>
						</Grid>
					</Grid>
				</Modal>
				<Backdrop className={classes.backdrop} open={loading}>
					<CircularProgress color='inherit' />
				</Backdrop>
			</motion.div>
		</>
	);
}

export default NewTeamWork;
