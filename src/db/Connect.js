import * as Realm from 'realm-web';
import { useEffect, useState } from 'react';


// const app = new Realm.App({ id: 'redwing-bwvdh' });

// const LeaveForm = () => {
// 	useEffect(() => {
// 		async function getData() {
// 			const user = await app.logIn(Realm.Credentials.anonymous());
// 			return user.toArray();
// 		}
// 		getData();
// 	}, []);
// };

// constants sotring server config and collection
// const client = app.currentUser.mongoClient('mongodb-atlas');
// const collection = client.db('task').collection('tasks');

// function to get data from db
const GetData = () => {
	const app = new Realm.App({ id: 'redwing-bwvdh' });
	const [client, setClient] = useState(null);
	const [data, setData] = useState([]);

	useEffect(() => {
		async function getData() {
			const user = await app.logIn(Realm.Credentials.anonymous());
			let client1 = app.currentUser.mongoClient('mongodb-atlas');
			setClient(client1);
		}

		getData();
	}, []);

	useEffect(() => {
		async function getData() {
			const collection = client.db('task').collection('task');
			setData(await collection.find({}));
		}

		if (client) {
			getData();
		}
	}, [client]);
	return data;
};

// hook to save data to mongo
const HandleSave = async (Data) => {
	const app = new Realm.App({ id: 'redwing-bwvdh' });
	const user = await app.logIn(Realm.Credentials.anonymous());
	let client1 = app.currentUser.mongoClient('mongodb-atlas');
	const collection = client1.db('task').collection('task');
	delete Data._id;
	await collection.findOneAndReplace({},Data).then(result => console.log("update result",result))
};

export { GetData, HandleSave };
