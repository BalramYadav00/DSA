import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import 'swiper/swiper.min.css';
import TeamWork from 'screens/TeamWork/TeamWork';
import styles from './BigDashboard.module.css';
import { TopStatistics } from './TopStatistics';
import SwitchMode from './SwitchMode';
import ProjectsColumn from './ProjectsColumn';
import ActivitiesColumn from './ActivitiesColumn';
import moment from 'moment';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import { unstable_createMuiStrictModeTheme } from '@material-ui/core';
import Segments from 'screens/Segments/Segments';

import { categoriesForOtherWorks } from '../../initial-data';
const token = localStorage.getItem('red_wing_token');
const token_expiry_date = localStorage.getItem('red_wing_token_expiry_date');

const BigDashboard = ({ globalState, selectedProject, setSelectedProject, timer }) => {
	const navigate = useNavigate();
	const { workList, otherWorks } = globalState;
	const activities = categoriesForOtherWorks.map(cw => {
		let cnt = 0;
		workList.map(({ id, isSelected }) => {
			const work = otherWorks[id];
			if (work.category.text === cw.text && isSelected) {
				cnt++;
			}
		});
		return { category: cw, tasks: cnt };
	});

	useEffect(() => {
		getTeamWorkData();
		setInterval(async () => getTeamWorkData(), 60000);
	}, []);

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

	const redwingProjectId = 23190856;

	const [totalTickets, setTotalTickets] = useState(0);
	const [completedTask, setCompletedTask] = useState(0);
	const [ProjectTabValue, setProjectTabValue] = useState('');

	const [AllTasks, setAllTasks] = useState({});
	const [isFullScreen, setIsFullScreen] = useState('');
	// const [gridValues, setGridValues] = useState('0fr 2fr 1.3fr 1.3fr');
	const [gridValues, setGridValues] = useState('0fr 2fr 0.6fr 0fr');

	const localStorageData = localStorage.getItem('redwing_data');
	const [allusers, setAllUsers] = useState(
		localStorage.getItem('redwing_data') ? JSON.parse(localStorageData) : {}
	);

	const [data, setData] = useState(
		localStorage.getItem('redwing_data') ? JSON.parse(localStorageData) : {}
	);
	const [projectData, setProjectData] = useState(
		localStorage.getItem('redwing_data') ? JSON.parse(localStorageData).projects : []
	);

	const scrollTop = () => {
		window.scrollTo({ top: 0, behaviour: 'smooth' });
	};

	const activeProjects = projectData.filter(project => project.open_task_count !== 0);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (allusers.users) {
			const teamMembers = allusers.users.filter(user => user.user_id !== 33629907);
			const totalTasks = teamMembers.reduce((acc, user) => {
				return acc + user.tasks_count;
			}, 0);
			if (totalTasks !== totalTickets) {
				setTotalTickets(totalTasks);
				setTopStatisticsCount(prev => {
					return {
						...prev,
						teamLoad: totalTasks
					};
				});
			}
		}
	}, [allusers]);

	useEffect(() => {
		const tasksDataJson = localStorage.getItem('data');
		const tasks = JSON.parse(tasksDataJson)?.tasks;
		setAllTasks(globalState.tasks);
	});

	useEffect(() => {
		if (allusers.users) {
			const teamMembers = allusers.users.filter(
				user =>
					user.user_id !== 33629907 &&
					(!user.project_ids.includes(redwingProjectId) || user.project_ids.length > 1)
			);
			const totalCompleteTask = teamMembers.reduce((acc, user) => {
				return acc + user.completed_todo;
			}, 0);
			if (totalCompleteTask !== completedTask) {
				setCompletedTask(totalCompleteTask);
				setTopStatisticsCount(prev => {
					return {
						...prev,
						taskCompleted: completedTask
					};
				});
			}
		}
	}, [allusers]);

	//console.log({projectData},{allusers})

	const getTeamWorkData = () => {
		setLoading(true);
		axios
			.get(`${process.env.REACT_APP_API_URL}/pages/team_work.php`, {
				headers: {
					// Authorization: `Bearer ${token}`,
					'Access-Control-Allow-Origin': '*'
				}
			})
			.then(res => {
				localStorage.setItem('redwing_data', JSON.stringify(res.data));
				setData(res.data);
				setAllUsers(res.data);
				setProjectData(res.data.projects);
				localStorage.setItem('redwing_data', JSON.stringify(res.data));
				setLoading(false);
			})
			.catch(error => {
				console.error(error);
				setLoading(false);
			});
	};

	useEffect(() => {
		setTopStatisticsCount(() => {
			return {
				...topStatisticsCount,
				tasksToday: data.tickets_created_today
			};
		});
	}, [data]);

	console.log({ activities });

	const checkVisibilityColumnOne = () => {
		console.log({ activities });

		// if(activities.map(item => item.tasks!==0)){
		// 	console.log('yes')
		// 	return true
		// }

		const yes = activities.map(item => item.tasks === 0);
		const final = yes.every(value => value === true);
		const result = !final;
		//return !(final)

		const keys = Object.keys(AllTasks).map(each => AllTasks[each].activityList);
		const activityArray = keys.map(project =>
			project.every(element => element.isSelected === false)
		);
		const visiblity = activityArray.every(value => value === true);
		const result2 = !visiblity;
		//return !(visiblity);

		if (result || result2) {
			return true;
		} else {
			return false;
		}
	};

	const [isColumn, setIsColumn] = React.useState('');

	// const defaultGridValues = checkVisibilityColumnOne() ? '1.3fr 2.2fr 1.3fr 1.3fr' : '0fr 2fr 1.3fr 1.3fr';
	const defaultGridValues = checkVisibilityColumnOne()
		? '1.3fr 2.2fr 0.6fr 0fr'
		: '0fr 2fr 0.6fr 0fr';

	useEffect(() => {
		if (checkVisibilityColumnOne()) {
			setGridValues('1.3fr 2.2fr 0.6fr 0fr');
			setIsColumn('');
		} else {
			setIsColumn('available');
			setGridValues(gridValues);
		}
	}, [AllTasks]);

	const [topStatisticsCount, setTopStatisticsCount] = useState({
		hoursOfWeek: 0,
		completion: 0,
		worthOrders: '$0',
		tasksToday: data.tickets_created_today,
		teamLoad: totalTickets,
		taskCompleted: completedTask
	});

	useEffect(() => {
		// console.log(timer);
		setTopStatisticsCount(prev => {
			return {
				...prev,
				hoursOfWeek: timer.day,
				completion: moment().add(timer.day, 'hours').format('hh:mm')
			};
		});
	}, [timer]);
	useEffect(() => {}, [ProjectTabValue]);

	const toggleFullScreen = value => {
		if (isFullScreen === value) {
			setIsFullScreen('');
			setGridValues(defaultGridValues);
		} else {
			setIsFullScreen(value);
			switch (value) {
				case 'activity':
					setGridValues('1fr 0fr 0fr 0fr');
					break;
				case 'project':
					setGridValues('0fr 0fr 0fr 1fr');
					break;
				case 'teamWork':
					setGridValues('0fr 1fr 0fr 0fr');
					break;
				case 'subTab':
					setGridValues('0fr 0fr 1fr 0fr');
					break;
				default:
					setGridValues(defaultGridValues);
					break;
			}
		}
	};
	// if(isColumn !== )

	// useEffect(()=>{

	// },[gridValues])

	return (
		<div className={styles.global}>
			<Helmet>
				<meta name='apple-mobile-web-app-capable' content='yes' />
			</Helmet>
			<div
				className={styles.bigdashboard}
				style={{
					gridTemplateColumns: gridValues
					// animation: 'resize 2s ease',
					// willChange:'gridTemplateColumns'
					//transition: 'gridTemplateColumns 1s linear'
				}}
				id={styles.responsive1}
			>
				{/* {isColumn === 'available' ? ( */}

				{checkVisibilityColumnOne && (!isFullScreen || isFullScreen === 'activity') && (
					<div className={styles.activity}>
						<div className={styles.outertopStatisticsBar}>
							<div className={styles.topStatisticsBar}>
								<TopStatistics text={'Hours of work'} count={topStatisticsCount.hoursOfWeek} />
								<TopStatistics text={'Completion'} count={topStatisticsCount.completion} />
							</div>

							<div style={{ display: 'flex', alignItems: 'center'}}>
								<div
									onClick={() =>
										navigate({
											pathname: '/rapid-estimation',
											search: `${createSearchParams({ tab: 'Projects' })}`
										})
									}
									style={{ cursor: 'pointer', color: 'white', marginRight: '1rem' }}
								>
									Rapid estimation
								</div>

								<SwitchMode
									toggleFullScreen={toggleFullScreen}
									sectionName='activity'
									isFullScreen={isFullScreen}
								/>
							</div>
						</div>
						<div className={styles.alignActivitiesContent}>
							<ActivitiesColumn
								setTopStatisticsCount={setTopStatisticsCount}
								setSelectedProject={setSelectedProject}
								selectedProject={selectedProject}
							/>
						</div>
					</div>
				)}

				{/* column 3 big dashboard */}
				{/* {(!isFullScreen || isFullScreen === 'project') && (
					<div className={styles.project}>
						<div className={styles.outertopStatisticsBar}>
							<div className={styles.topStatisticsBar}>
								<TopStatistics text={'Worth Orders'} count={topStatisticsCount.worthOrders} />
							</div>
							<SwitchMode
								toggleFullScreen={toggleFullScreen}
								sectionName='project'
								isFullScreen={isFullScreen}
							/>
						</div>
						<div className={styles.alignProjectsContent}>
							<ProjectsColumn setTopStatisticsCount={setTopStatisticsCount} />
						</div>
					</div>
				)} */}

				{/* column 1 big dashboard*/}
				{(!isFullScreen || isFullScreen === 'teamWork') && (
					<div className={styles.teamWork}>
						<div className={styles.outertopStatisticsBar}>
							<div className={styles.topStatisticsBar}>
								<TopStatistics text={'Tasks Today'} count={topStatisticsCount.tasksToday} />
								<TopStatistics text={'Team Load'} count={totalTickets} />
								<TopStatistics text={'Completions'} count={completedTask} />
								<TopStatistics
									text={'Sleeping'}
									count={data.sleeping_tasks}
									link={'https://redwing.puneetpugalia.com/pages/sleeping_task.php'}
								/>
							</div>

							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div
									onClick={() =>
										navigate({
											pathname: '/rapid-estimation',
											search: `${createSearchParams({ tab: 'Projects' })}`
										})
									}
									style={{ cursor: 'pointer', color: 'white', marginRight: '1rem' }}
								>
									Rapid estimation
								</div>

								<SwitchMode
									toggleFullScreen={toggleFullScreen}
									sectionName='teamWork'
									isFullScreen={isFullScreen}
								/>
							</div>
						</div>
						<div className={styles.alignTeamContent}>
							<TeamWork
								isInverted={false}
								screenIndex={2}
								showTeamTabTop={false}
								showTabComponent={false}
								showActionButtons={false}
								data1={data}
								loading1={loading}
								setLoading1={setLoading}
							/>
						</div>
					</div>
				)}

				{/* column 2 big dashboard */}
				{/* {(!isFullScreen || isFullScreen === 'subTab') && (
					<div className={styles.projects_subtab}>
						<div className={styles.outertopStatisticsBar}>
							<div className={styles.topStatisticsBar}>
								<TopStatistics text={'Active Projects'} count={activeProjects.length} />
							</div>
							<SwitchMode
								toggleFullScreen={toggleFullScreen}
								sectionName='subTab'
								isFullScreen={isFullScreen}
							/>
						</div>
						<div className={styles.alignProjectsContent} style={{marginTop: 26}}>
							<table>
								<thead></thead>
								<tbody>
									<td className={styles.project_tab_heading}>Project Name</td>
									<td className={styles.project_tab_heading}>Total</td>
									<td className={styles.project_tab_heading}>Today</td>
									{projectData ? (
										projectData.map((project, key) => {
											let project_id = project.project_id
											if (project.open_task_count !== 0) {
												return (
													<tr>
														<td>
															<div>
																<div className={styles.project_tab_project_name}>{project.name}</div>
																<div>
																	{
																		allusers.users.map(user => {
																			let arr = []
																			let project_ids = user.project_ids
																			project_ids.forEach(id => {
																				if (id === project_id) {
																					arr.push(user)
																				}
																			})

																			return (
																				<>
																					{
																						arr.map(user => {
																							return (
																								<img src={user.avatar} width="25px" style={{ borderRadius: '100%', marginRight: '5px' }} />
																							)
																						})
																					}
																				</>
																			)

																		})
																	}
																</div>
															</div>
														</td>
														<td className={styles.project_tab_total}>{project.open_task_count}</td>
														<td className={styles.project_tab_today}>{project.todos_created_today_count}</td>
													</tr>
												);
											}
										})
									) : (
										<></>
									)}
								</tbody>
							</table>
						</div>
					</div>
				)} */}

				{(!isFullScreen || isFullScreen === 'subTab') && (
					<div className={styles.projects_subtab}>
						{/* <div className={styles.outertopStatisticsBar}>
							<div className={styles.topStatisticsBar}>
								<TopStatistics text={'Active Projects'} count={activeProjects.length} />
							</div>
							<SwitchMode
								toggleFullScreen={toggleFullScreen}
								sectionName='subTab'
								isFullScreen={isFullScreen}
							/>
						</div> */}
						<Segments homeBreakpoint={1} data={data} />
					</div>
				)}

				{/* <Segments/> */}
			</div>

			<Swiper className={styles.bigdashboard} id={styles.responsive2} slidesPerView={1}>
				{checkVisibilityColumnOne() && (
					<SwiperSlide>
						<div className={styles.activity}>
							<div className={styles.outertopStatisticsBar}>
								<div className={styles.topStatisticsBar}>
									<TopStatistics text={'Hours of work'} count={topStatisticsCount.hoursOfWeek} />
									<TopStatistics text={'Completion'} count={topStatisticsCount.completion} />
								</div>
							</div>
							<SwitchMode
								toggleFullScreen={toggleFullScreen}
								sectionName='teamWork'
								isFullScreen={isFullScreen}
							/>
							<div className={styles.alignActivitiesContent}>
								<ActivitiesColumn
									setTopStatisticsCount={setTopStatisticsCount}
									setSelectedProject={setSelectedProject}
									selectedProject={selectedProject}
								/>
							</div>
						</div>
					</SwiperSlide>
				)}

				<SwiperSlide>
					<div className={styles.teamWork}>
						<div className={styles.outertopStatisticsBar} id={styles.lastColumn}>
							<div className={styles.topStatisticsBar}>
								<TopStatistics text={'Tasks Today'} count={topStatisticsCount.tasksToday} />
								<TopStatistics text={'Team Load'} count={totalTickets} />
								<TopStatistics text={'Completions'} count={completedTask} />
								<TopStatistics
									text={'Sleeping'}
									count={data.sleeping_tasks}
									link={'https://redwing.puneetpugalia.com/pages/sleeping_task.php'}
								/>
							</div>
						</div>
						{/* <SwitchMode
							toggleFullScreen={toggleFullScreen}
							sectionName='teamWork'
							isFullScreen={isFullScreen}
						/> */}
						<div className={styles.alignTeamContent}>
							<TeamWork
								isInverted={false}
								screenIndex={2}
								showTeamTabTop={false}
								showTabComponent={false}
								showActionButtons={false}
								data1={data}
							/>
						</div>
					</div>
				</SwiperSlide>

				<SwiperSlide>
					<div className={styles.project}>
						<div className={styles.outertopStatisticsBar}>
							<div className={styles.topStatisticsBar}>
								<TopStatistics text={'Worth Orders'} count={topStatisticsCount.worthOrders} />
							</div>
						</div>
						<SwitchMode
							toggleFullScreen={toggleFullScreen}
							sectionName='teamWork'
							isFullScreen={isFullScreen}
						/>
						<div className={styles.alignProjectsContent}>
							<ProjectsColumn setTopStatisticsCount={setTopStatisticsCount} />
						</div>
					</div>
				</SwiperSlide>
			</Swiper>

			<div>
				<Link to='/homepage' onClick={scrollTop}>
					Go to Homepage
				</Link>

				{token && token !== 'undefined' && new Date(token_expiry_date) > new Date() && (
					<Link onClick={handleRefreshUserList} style={{ marginLeft: '2rem' }}>
						Refresh User List
					</Link>
				)}
				{(!token || token === 'undefined' || new Date(token_expiry_date) <= new Date()) && (
					<a
						style={{ marginLeft: '2rem' }}
						href='https://launchpad.37signals.com/authorization/new?type=web_server&client_id=7d03697adc886996a673634b89d51d8febb29979&redirect_uri=https://touch-dashborad.herokuapp.com/auth/callback'
					>
						Login to Basecamp
					</a>
				)}

				{/* <Link to='/segments' style={{marginLeft:'2rem'}} onClick={scrollTop}>
					Segments
				</Link> */}
			</div>
		</div>
	);
};

export default BigDashboard;
