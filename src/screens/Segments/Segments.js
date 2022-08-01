import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TeamTable from '../TeamWork/TeamTable';
import './Segment.css';
import Masonry from 'react-masonry-css';

import { motion } from 'framer-motion';
import FormHelperText from '@mui/material/FormHelperText';
import { pageTransitions, pageVariants } from 'animations';
import { Container, TeamTabBottom, TeamTabTop, ModalBody, Projects } from '../TeamWork/Style';
import { Button, Container as MdContainer, Grid, Modal, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Typography } from '@material-ui/core';
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
// import ContentLoader from 'react-content-loader';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
const token = localStorage.getItem('red_wing_token');
const token_expiry_date = localStorage.getItem('red_wing_token_expiry_date');

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff'
	},
	hide_heading: {
		display: 'none'
	}
}));

function Segments({
	isInverted,
	showTeamTabTop = true,
	showTabComponent = true,
	showActionButtons = true,
	homeBreakpoint,
	data
}) {
	const [hover, setHover] = useState('');

	const [tabValue, setTabValue] = useState('Team');
	const localStorageData = JSON.parse(localStorage.getItem('redwing_data'));

	const projectData = data.projects
	const [projects, setProjects] = useState([]);
	const [users, setUsers] = useState([]);
	const [projectId, setProjectId] = useState('');
	const [openAddProjectModal, setOpenAddProjectModal] = useState(false);
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [loadingdata, setLoadingdata] = useState(true);
	const [sortingOrder, setSortingOrder] = useState('DEC');
	const [sortingColumn, setSortingColumn] = useState('tasks_count');
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [absentUsers, SetAbsentUsers] = useState([]);
	const [slowdownUsers, SetSlowdownUsers] = useState([]);
	const [idleUsers, SetIdleUsers] = useState([]);

	const [tasks, setTasks] = useState(null);
	const [multitasking, setMultitasking] = useState(null);
	const [highPerformance, setHighPerformance] = useState(null);
	const [idles, setIdles] = useState(null);
	const [playground, setPlayground] = useState(null);
	const [absent, setAbsent] = useState(null);
	const [slowdown, setSlowdown] = useState(null);
	const [redwing, setRedwing] = useState(null);
	const [allUsers, setAllUsers] = useState(null);
	const [ongoing, setOngoing] = useState([]);
	const [aboutToIdle,setAboutToIdle] = useState([])
	const [lowestPerformers,setLowestPerformers] = useState([])
	useEffect(() => {
		let tasks = 0;
		users.forEach(user => {
			tasks = tasks + user.tasks_count;
		});
		setTasks(tasks);

		setAllUsers(users);

		// setAllUsers(
		// 	users.filter(
		// 		user =>
		// 			(!user.project_ids.includes(redwingProjectId) && user.name !== '') ||
		// 			user.project_ids.length > 1
		// 	)
		// );

		setMultitasking(users.filter(user => user.project_ids.length > 1 && user.name));

		const boolValue = users.filter(user => user.completed_todo > 5 && user.name);
		if (boolValue === null || boolValue === undefined) {
			setHighPerformance(null);
		} else {
			setHighPerformance(users.filter(user => user.completed_todo > 5 && user.name));
		}

		setIdles(users.filter(user => user.tasks_count === 0 && user.name));

		setPlayground(
			users.filter(
				user => user.project_ids.includes(redwingProjectId) && user.project_ids.length === 1 && user.name
			)
		);

		setAbsent(
			users.filter(
				user =>
					user.active_todo_count === 0 && user.tasks_count !== 0 && user.name
			)
		);

		let slow = [];
		users.forEach(user => {
			if (
				moment().diff(moment(user.last_active_at), 'hours') >= 3 &&
				user.tasks_count !== 0 &&
				user.active_todo_count !== 0 &&
				user.name
			) {
				slow.push(user);
			}
		});
		setSlowdown(slow);

		setRedwing(
			users.filter(
				user => user.project_ids.includes(redwingProjectId) && user.project_ids.length === 1
			)
		);

		setAboutToIdle(users.filter(user => user.tasks_count===1 || user.tasks_count==2))

		let lowest_performers = users.filter(user => user.user_id !== 34188691).sort(function(a, b) {
			var x = a['weekly_completed_todo']; var y = b['weekly_completed_todo'];
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
		setLowestPerformers(lowest_performers.slice(0, 3));
	}, [users]);

	useEffect(() => {
		// setOngoing(projects);
	}, [projects]);

	useEffect(() => {
		let arr = [];

		if (projects) {
			projects.map(item => {
				let id = item.project_id;
				let name = item.name;
				let task_count = item.open_task_count

				let user = [];
				user = users.filter(user => user.name && user.project_ids.includes(id));

				if (user.length > 0) {
					arr.push({ name, id, task_count, user });
				}
			});
		}

		console.log({arr})

		// arr = arr.map(item => {
		// 	let user = item.user;
		// 	let name = item.name;
		// 	return (
		// 		<div
		// 			onMouseEnter={() => setHover(name)}
		// 			onMouseLeave={() => setHover('')}
		// 			key={item.name}
		// 			className={hover === 'idle' ? 'segment-element ' : 'segment-element '}
		// 		>
		// 			<div
		// 				className={
		// 					hover === name ? 'card-title card-title-top' : 'card-title card-title-center'
		// 				}
		// 			>
		// 				{user.length} {item.name} members
		// 			</div>
		// 			<div className={hover === name ? 'visible-data' : 'hidden-data'}>
		// 				<>
		// 					{user.map(user => {
		// 						return (
		// 							<div
		// 								style={{
		// 									margin: '1vh 0',
		// 									display: 'flex',
		// 									alignItems: 'center',
		// 									justifyContent: 'space-between'
		// 								}}
		// 							>
		// 								<div style={{ display: 'flex', alignItems: 'center' }}>
		// 									<img
		// 										src={user.avatar}
		// 										style={{ width: '25px', borderRadius: '100%', marginRight: '1vw' }}
		// 									/>
		// 									<div>{user.name}</div>
		// 								</div>

		// 								<div>{user.projects[item.id].count}</div>
		// 							</div>
		// 						);
		// 					})}
		// 				</>
		// 			</div>
		// 		</div>
		// 	);
		// });

		setOngoing(arr);
	}, [projects]);


	// useEffect(() => {
	// 	getTeamWorkData();
	// 	setInterval(async () => getTeamWorkData(), 60000);
	// 	setLoadingdata(false);
	// }, []);

	const [segmenting, setSegmenting] = React.useState('Default');

	const handleChange = event => {
		setSegmenting(event.target.value);
	};

	const getTeamWorkData = () => {
		// setLoading(true);
		// axios
		// 	.get(`${process.env.REACT_APP_API_URL}/pages/team_work.php`, {
		// 		headers: {
		// 			// Authorization: `Bearer ${token}`,
		// 			'Access-Control-Allow-Origin': '*'
		// 		}
		// 	})
		// 	.then(res => {
		// 		setData(res.data);
		// 		setProjectData(res.data.projects);
		// 		localStorage.setItem('redwing_data', JSON.stringify(res.data));
		// 		// setLoading(false);
		// 	})
		// 	.catch(error => {
		// 		console.error(error);
		// 		// setLoading(false);
		// 	});
	};

	const sorting = (col, sortingOrder1) => {
		if (col === 'tasks_count' || col === 'active_count') {
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

	useEffect(() => {
		var users = [];
		if (data && data.users && data.users.length) {
			data.users.forEach(user => {
				if (user.user_id !== 33629907) {
					users.push(user);
				}
			});
			// for (var k in data.users) {
			// 	users.push(data.users[k]);
			// }
			setUsers(users);
			setSortingOrder('DEC');
			setSortingColumn('tasks_count');
		}
	}, [data]);
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
		// console.log('Project Data', projectData);
		setProjects(projects);
	}, [projectData]);
	const handleRefreshUserList = () => {
		setLoading(true);
		axios
			.get(`${process.env.REACT_APP_API_URL}/pages/refresh_user_list.php`, {
				headers: {
					Authorization: `Bearer ${token}`,
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
							Authorization: `Bearer ${token}`,
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
	//console.log(plus5star);
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

	// console.log({users})


	const breakpointColumnsObj = {
		default: homeBreakpoint || 5,
		1100: 1,
		700: 1,
		500: 1
	  };
	
	return (
		// <>
		// <br/><br/><br/>
		// <div style={{display:'flex'}}>
		// <>
		// <TeamTabBottom>
		//   <div style={{color:'white',fontSize:'4.5vh',letterSpacing:'2px'}}>WORKLOAD</div>
		//     <div style={{color:'white'}}>
		//       <br/>
		//       <div>All users ({users.length})</div>
		//       <br/>
		//       {
		//         users.map(user => {
		//           return (
		//             <div style={{margin:'1vh 0',display:'flex',alignItems:'center'}}>
		//               <img src={user.avatar} style={{width:'25px',borderRadius:'100%',marginRight:'1vw'}}  />
		//               <div>{user.name}</div>
		//             </div>
		//           )
		//         })
		//       }
		//     </div>
		// </TeamTabBottom>
		// </>

		// <>
		//   <TeamTabBottom>
		//   <div style={{color:'white',fontSize:'4.5vh',letterSpacing:'2px'}}>PROJECT</div>
		//   <TeamTable toggel={toggel} {...teamTableProps} isMultitasking={true} />
		//   {oneProject.map((each, index) => (
		//     <TeamTable {...teamTableProps} isProjectSame={true} projectId={each} key={index} projectName={projects.find(one => one.project_id === each).name} />
		//   ))}
		//   <TeamTable {...teamTableProps} isPlayground={true} />
		//   {idle && <TeamTable {...teamTableProps} isIdle={true} />}
		//     {/* <TeamTable isPlayground={false} default1={false} isMultitasking={false} isProjectSame={false} isPerformance={false} isIdle={false} notredwing={true} onlyRedwing={false} {...teamTableProps} />
		//     <TeamTable isPlayground={false} default1={false} isMultitasking={false} isProjectSame={false} isPerformance={false} isIdle={false} notredwing={false} onlyRedwing={true} {...teamTableProps} /> */}
		//   </TeamTabBottom>
		// </>

		// <>
		//   <TeamTabBottom>
		//   <div style={{color:'white',fontSize:'4.5vh',letterSpacing:'2px'}}>PLAYGROUND</div>
		//     {/* {plus5star.length > 0  ? (
		//         <TeamTable isPlayground={false} default1={false} isMultitasking={false} isProjectSame={false} isPerformance15={false} isPerformance5={true} isPerformance0={false} isIdle={false} onlyRedwing={false} {...teamTableProps} />
		//     ):(<>

		//     </>)}
		//     <TeamTable isPlayground={false} default1={false} isMultitasking={false} isProjectSame={false} isPerformance5={false} isPerformance15={true} isIdle={false} onlyRedwing={false} {...teamTableProps} />
		//     <TeamTable isPlayground={false} default1={false} isMultitasking={false} isProjectSame={false} isPerformance15={false} isPerformance0={true} isPerformance5={false} isIdle={false} onlyRedwing={false} {...teamTableProps} /> */}
		//     {/* <TeamTable isPlayground={false} default1={false} isMultitasking={false} isProjectSame={false} isPerformance={false} isIdle={false} onlyRedwing={true} {...teamTableProps} /> */}
		//     {/* <TeamTable {...teamTableProps} /> */}
		//     <TeamTable isPlayground={false} default1={false} isMultitasking={false} isProjectSame={false} isPerformance={false} isIdle={false} notredwing={true} onlyRedwing={false} {...teamTableProps} />
		//     <TeamTable isPlayground={false} default1={false} isMultitasking={false} isProjectSame={false} isPerformance={false} isIdle={false} notredwing={false} onlyRedwing={true} {...teamTableProps} />
		//   </TeamTabBottom>
		// </>

		// <>
		//   <TeamTabBottom>
		//   <div style={{color:'white',fontSize:'4.5vh',letterSpacing:'2px'}}>PERFORMANCE</div>
		//     {/* <TeamTable {...teamTableProps} isMultitasking={true} /> */}
		//     {/* {oneProject.map((each, index) => { */}
		//     {/* console.log(oneProject); */}
		//     {/* console.log(each); */}
		//     {/* return ( */}
		//     {/* <TeamTable isPlayground={false} default1={true} isMultitasking={false} isProjectSame={false} isPerformance={false} isIdle={false} onlyRedwing={false} {...teamTableProps} /> */}
		//     {/* <TeamTable isPlayground={false} default1={false} isMultitasking={false} isProjectSame={false} isPerformance={false} isIdle={false} onlyRedwing={true} {...teamTableProps} /> */}
		//     {/* <TeamTable {...teamTableProps} singleUsers={true} /> */}
		//     {/* ) */}
		//     {/* })} */}
		//     {/* Team who only belongs to Redwing */}
		//     {/* {idle && <TeamTable {...teamTableProps} isIdle={true} />} */}

		//     {plus5star.length > 0  ? (
		//         <TeamTable isPlayground={false} default1={false} isMultitasking={false} isProjectSame={false} isPerformance15={false} isPerformance5={true} isPerformance0={false} isIdle={false} onlyRedwing={false} {...teamTableProps} />
		//     ):(<>

		//     </>)}
		//     <TeamTable isPlayground={false} default1={false} isMultitasking={false} isProjectSame={false} isPerformance5={false} isPerformance15={true} isIdle={false} onlyRedwing={false} {...teamTableProps} />
		//     <TeamTable isPlayground={false} default1={false} isMultitasking={false} isProjectSame={false} isPerformance15={false} isPerformance0={true} isPerformance5={false} isIdle={false} onlyRedwing={false} {...teamTableProps} />
		//   </TeamTabBottom>
		// </>

		// </div>
		// </>

		<>
			<Masonry
				breakpointCols={breakpointColumnsObj}
				className='my-masonry-grid'
				columnClassName='my-masonry-grid_column'
				style={{
					width: '99.5%',
					margin: 'auto'
				}}
			>
				{/*client members */}
				{
					/* <div
					onMouseEnter={() => setHover('allUsers')}
					onMouseLeave={() => setHover('')}
					className={hover === 'allUsers' ? 'segment-element' : 'segment-element'}
				>
					<>
						{allUsers && allUsers.length !== 0 && (
							<>
								<div className='wrapper'>
									<div
										className={
											hover === 'allUsers'
												? 'card-title card-title-top'
												: 'card-title'
										}
									>
										{allUsers.length} members, {tasks} tasks
									</div>
								</div>
								<div className={hover === 'allUsers' ? 'visible-data' : 'hidden-data'}>
									{allUsers.map(user => {
										let user_name = user.name
										return (
											<div
												style={{
													margin: '1vh 0',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between'
												}}
											>
												<div style={{ display: 'flex', alignItems: 'center' }}>
													<img
														src={user.avatar}
														style={{ width: '25px', borderRadius: '100%', marginRight: '1vw' }}
													/>
													<a className='open-user' href={`https://3.basecamp.com/4954106/reports/users/progress/${user.user_id}`} target='_blank' rel='noreferrer'>
														<div>
															{user_name.split(' ')[0]}
														</div>
													</a>
												</div>

												<a className='open-user' href={`https://3.basecamp.com/4954106/reports/users/progress/${user.user_id}`} target='_blank' rel='noreferrer'>
													<div>{user.tasks_count}</div>
												</a>
											</div>
										);
									})}
								</div>
							</>
						)}
					</>
				</div> */}

				{/* about-to-idle members	 */}
				{aboutToIdle && aboutToIdle.length !== 0 && (
					<>
						<div
							onMouseEnter={() => setHover('aboutToIdle')}
							onMouseLeave={() => setHover('')}
							className={
								hover === 'idle' ? 'segment-element poor-card' : 'segment-element poor-card'
							}
						>
							<div className='wrapper'>
								<div
									className={
										hover === 'aboutToIdle'
											? 'card-title card-title-top'
											: 'card-title card-title-center'
									}
								>
									{aboutToIdle.length} about to get idle
								</div>
							</div>
							<div className={hover === 'aboutToIdle' ? 'visible-data' : 'hidden-data'}>
								{aboutToIdle.map(user => {
									let user_name = user.name
									return (
										<div
											style={{
												margin: '1vh 0',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between'
											}}
										>
											<div style={{ display: 'flex', alignItems: 'center' }}>
												<img
													src={user.avatar}
													style={{ width: '25px', borderRadius: '100%', marginRight: '1vw' }}
												/>
												<a className='open-user' href={`https://3.basecamp.com/4954106/reports/users/progress/${user.user_id}`} target='_blank' rel='noreferrer'>
													<div>{user_name.split(' ')[0]}</div>
												</a>
											</div>

											<a className='open-user' href={`https://3.basecamp.com/4954106/reports/users/progress/${user.user_id}`} target='_blank' rel='noreferrer'>
												<div>{user.tasks_count}</div>
											</a>
										</div>
									);
								})}
							</div>
						</div>
					</>
				)}

				{/* idle memebers */}
				{idles && idles.length !== 0 && (
					<>
						<div
							onMouseEnter={() => setHover('idle')}
							onMouseLeave={() => setHover('')}
							className={
								hover === 'idle' ? 'segment-element poor-card' : 'segment-element poor-card'
							}
						>
							<div className='wrapper'>
								<div
									className={
										hover === 'idle' ? 'card-title card-title-top' : 'card-title card-title-center'
									}
								>
									{idles.length} idle users
								</div>
							</div>
							<div className={hover === 'idle' ? 'visible-data' : 'hidden-data'}>
								{idles.map(user => {
									let user_name = user.name
									return (
										<div
											style={{
												margin: '1vh 0',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between'
											}}
										>
											<div style={{ display: 'flex', alignItems: 'center' }}>
												<img
													src={user.avatar}
													style={{ width: '25px', borderRadius: '100%', marginRight: '1vw' }}
												/>
												<a className='open-user' href={`https://3.basecamp.com/4954106/reports/users/progress/${user.user_id}`} target='_blank' rel='noreferrer'>
													<div>{user_name.split(' ')[0]}</div>
												</a>
											</div>
											
											<a className='open-user' href={`https://3.basecamp.com/4954106/reports/users/progress/${user.user_id}`} target='_blank' rel='noreferrer'>
												<div>{user.tasks_count}</div>
											</a>
										</div>
									);
								})}
							</div>
						</div>
					</>
				)}

				{/* absent members */}
				{absent && absent.length !== 0 && (
					<>
						<div
							onMouseEnter={() => setHover('absent')}
							onMouseLeave={() => setHover('')}
							className={
								hover === 'idle' ? 'segment-element poor-card' : 'segment-element poor-card'
							}
						>
							<div className='wrapper'>
								<div
									className={
										hover === 'absent' ? 'card-title card-title-top' : 'card-title card-title-center'
									}
								>
									{absent.length} absent 
								</div>
							</div>
							<div className={hover === 'absent' ? 'visible-data' : 'hidden-data'}>
								{absent.map(user => {
									let user_name = user.name
									return (
										<div
											style={{
												margin: '1vh 0',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between'
											}}
										>
											<div style={{ display: 'flex', alignItems: 'center' }}>
												<img
													src={user.avatar}
													style={{ width: '25px', borderRadius: '100%', marginRight: '1vw' }}
												/>
												<a className='open-user' href={`https://3.basecamp.com/4954106/reports/users/progress/${user.user_id}`} target='_blank' rel='noreferrer'>
													<div>{user_name.split(' ')[0]}</div>
												</a>
											</div>

											<a className='open-user' href={`https://3.basecamp.com/4954106/reports/users/progress/${user.user_id}`} target='_blank' rel='noreferrer'>
												<div>{user.tasks_count}</div>
											</a>
										</div>
									);
								})}
							</div>
						</div>
					</>
				)}

				{/* slowdown members	 */}
				{slowdown && slowdown.length !== 0 && (
					<>
						<div
							onMouseEnter={() => setHover('slowdown')}
							onMouseLeave={() => setHover('')}
							className={
								hover === 'idle' ? 'segment-element yellow-card' : 'segment-element yellow-card'
							}
						>
							<div className='wrapper'>
								<div
									className={
										hover === 'slowdown'
											? 'card-title card-title-top'
											: 'card-title card-title-center'
									}
								>
									{slowdown.length} slowdown members
								</div>
							</div>
							<div className={hover === 'slowdown' ? 'visible-data' : 'hidden-data'}>
								{slowdown.map(user => {
									let user_name = user.name
									return (
										<div
											style={{
												margin: '1vh 0',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between'
											}}
										>
											<div style={{ display: 'flex', alignItems: 'center' }}>
												<img
													src={user.avatar}
													style={{ width: '25px', borderRadius: '100%', marginRight: '1vw' }}
												/>
												<a className='open-user' href={`https://3.basecamp.com/4954106/reports/users/progress/${user.user_id}`} target='_blank' rel='noreferrer'>
													<div>{user_name.split(' ')[0]}</div>
												</a>
											</div>

											<a className='open-user' href={`https://3.basecamp.com/4954106/reports/users/progress/${user.user_id}`} target='_blank' rel='noreferrer'>
												<div>{user.tasks_count}</div>
											</a>
										</div>
									);
								})}
							</div>
						</div>
					</>
				)}

				{/* multi users */}
				{multitasking && multitasking.length !== 0 && (
					<>
						<div
							onMouseEnter={() => setHover('multi')}
							onMouseLeave={() => setHover('')}
							className={
								hover === 'multi' ? 'segment-element yellow-card' : 'segment-element yellow-card'
							}
						>
							<div className='wrapper'>
								<div
									className={
										hover === 'multi' ? 'card-title card-title-top' : 'card-title card-title-center'
									}
								>
									{multitasking.length} multi-taskers
								</div>
							</div>
							<div className={hover === 'multi' ? 'visible-data' : 'hidden-data'}>
								{multitasking.map(user => {
									let user_name = user.name
									return (
										<div
											style={{
												margin: '1vh 0',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between'
											}}
										>
											<div style={{ display: 'flex', alignItems: 'center' }}>
												<img
													src={user.avatar}
													style={{ width: '25px', borderRadius: '100%', marginRight: '1vw' }}
												/>
												<a className='open-user' href={`https://3.basecamp.com/4954106/reports/users/progress/${user.user_id}`} target='_blank' rel='noreferrer'>
													<div>{user_name.split(' ')[0]}</div>
												</a>
											</div>

											<a className='open-user' href={`https://3.basecamp.com/4954106/reports/users/progress/${user.user_id}`} target='_blank' rel='noreferrer'>
												<div>{user.project_ids.length}</div>
											</a>
										</div>
									);
								})}
							</div>
						</div>
					</>
				)}

				{/* high performance */}
				{highPerformance && highPerformance.length !== 0 && (
					<>
						<div
							onMouseEnter={() => setHover('high')}
							onMouseLeave={() => setHover('')}
							className={
								hover === 'multi' ? 'segment-element good-card' : 'segment-element good-card'
							}
						>
							<div className='wrapper'>
								<div
									className={
										hover === 'high' ? 'card-title card-title-top' : 'card-title card-title-center'
									}
								>
									{highPerformance.length} high performance
								</div>
							</div>
							<div className={hover === 'high' ? 'visible-data' : 'hidden-data'}>
								{highPerformance.map(user => {
									let user_name = user.name
									return (
										<div
											style={{
												margin: '1vh 0',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between'
											}}
										>
											<div style={{ display: 'flex', alignItems: 'center' }}>
												<img
													src={user.avatar}
													style={{ width: '25px', borderRadius: '100%', marginRight: '1vw' }}
												/>
												<a className='open-user' href={`https://3.basecamp.com/4954106/reports/users/progress/${user.user_id}`} target='_blank' rel='noreferrer'>
													<div>{user_name.split(' ')[0]}</div>
												</a>
											</div>
											<a className='open-user' href={`https://3.basecamp.com/4954106/reports/users/progress/${user.user_id}`} target='_blank' rel='noreferrer'>
												<div>{user.completed_todo}</div>
											</a>
										</div>
									);
								})}
							</div>
						</div>
					</>
				)}

				{/* lowest 3 performers	 */}
				{lowestPerformers && lowestPerformers.length !== 0 && (
					<>
						<div
							onMouseEnter={() => setHover('lowestPerformers')}
							onMouseLeave={() => setHover('')}
							className={
								hover === 'idle' ? 'segment-element poor-card' : 'segment-element poor-card'
							}
						>
							<div className='wrapper'>
								<div
									className={
										hover === 'lowestPerformers'
											? 'card-title card-title-top'
											: 'card-title card-title-center'
									}
								>
									Lowest 3 Performers
								</div>
							</div>
							<div className={hover === 'lowestPerformers' ? 'visible-data' : 'hidden-data'}>
								{lowestPerformers.map(user => {
									let user_name = user.name
									return (
										<div
											style={{
												margin: '1vh 0',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between'
											}}
										>
											<div style={{ display: 'flex', alignItems: 'center' }}>
												<img
													src={user.avatar}
													style={{ width: '25px', borderRadius: '100%', marginRight: '1vw' }}
												/>
												<a className='open-user' href={`https://3.basecamp.com/4954106/reports/users/progress/${user.user_id}`} target='_blank' rel='noreferrer'>
													<div>{user_name.split(' ')[0]}</div>
												</a>
											</div>

											<a className='open-user' href={`https://3.basecamp.com/4954106/reports/users/progress/${user.user_id}`} target='_blank' rel='noreferrer'>
												<div>{user.weekly_average_per_day}</div>
											</a>
										</div>
									);
								})}
							</div>
						</div>
					</>
				)}

				{/* playground members	 */}
				{/* {
				playground && playground.length !== 0 &&
				<>
				<div onMouseEnter={()=>setHover('playground')} onMouseLeave={()=>setHover('')} className={hover==='idle'? 'segment-element ' : 'segment-element '}>
					<div className={hover==='playground'? 'card-title card-title-top' : 'card-title card-title-center'}>{playground.length} playground members</div>
					<div className={hover==='playground'? 'visible-data' : 'hidden-data'}>
						{
							playground.map(user => {
								return (
									<div style={{margin:'1vh 0',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
										<div style={{display:'flex',alignItems:'center'}}>
											<img src={user.avatar} style={{width:'25px',borderRadius:'100%',marginRight:'1vw'}}  />
											<div>{user.name}</div>
										</div>
			
										<div>
											{user.tasks_count}
										</div>
									</div>
								)
							})
						}
					</div>
				</div>
				</>
			} */}

				

				{/* redwing members	 */}
				{/* {
				redwing && redwing.length !== 0 &&
				<>
				<div onMouseEnter={()=>setHover('redwing')} onMouseLeave={()=>setHover('')} className={hover==='idle'? 'segment-element ' : 'segment-element '}>
					<div className={hover==='redwing'? 'card-title card-title-top' : 'card-title card-title-center'}>{redwing.length} redwing members</div>
					<div className={hover==='redwing'? 'visible-data' : 'hidden-data'}>
						{
							redwing.map(user => {
								return (
									<div style={{margin:'1vh 0',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
										<div style={{display:'flex',alignItems:'center'}}>
											<img src={user.avatar} style={{width:'25px',borderRadius:'100%',marginRight:'1vw'}}  />
											<div>{user.name}</div>
										</div>
			
										<div>
											{user.tasks_count}
										</div>
									</div>
								)
							})
						}
					</div>
				</div>
				</>
			} */}

			

				{/* {ongoing.map(item => {
					let user = item.user;
					let name = item.name;
					return (
						<div
							onMouseEnter={() => setHover(name)}
							onMouseLeave={() => setHover('')}
							key={item.name}
							className={hover === 'idle' ? 'segment-element ' : 'segment-element '}
						>
							<div className='wrapper'>
								<div
									className={
										hover === name ? 'card-title card-title-top' : 'card-title card-title-center'
									}
								>
									{user.length} on {item.name}, {item.task_count} tasks
								</div>
							</div>
							<div className={hover === name ? 'visible-data' : 'hidden-data'}>
								<>
									{user.map(user => {
										let user_name = user.name
										return (
											<div
												style={{
													margin: '1vh 0',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between'
												}}
											>
												<div style={{ display: 'flex', alignItems: 'center' }}>
													<img
														src={user.avatar}
														style={{ width: '25px', borderRadius: '100%', marginRight: '1vw' }}
													/>
													<a className='open-user' href={`https://3.basecamp.com/4954106/reports/users/progress/${user.user_id}`} target='_blank' rel='noreferrer'>
														<div>{user_name.split(' ')[0]}</div>
													</a>
												</div>

												<a className='open-user' href={`https://3.basecamp.com/4954106/reports/users/progress/${user.user_id}`} target='_blank' rel='noreferrer'>
													<div>{user.projects[item.id].count}</div>
												</a>
											</div>
										);
									})}
								</>
							</div>
						</div>
					);
				})} */}


			</Masonry>
		</>
	);
}

export default Segments;
