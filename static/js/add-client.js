import PocketBase from 'pocketbase';

const pb = new PocketBase('https://127.0.0.1:8090/');


// example create data
const data = {
    "clientName": "test",
    "clientEmail": "test@example.com",
    "contactNumber": 123,
    "companyName": "test",
    "password": "test"
};

const record = await pb.collection('clients').create(data);