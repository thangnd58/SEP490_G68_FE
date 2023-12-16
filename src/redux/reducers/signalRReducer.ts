import { HubConnectionBuilder } from '@microsoft/signalr';
import { SERVER_HUB_URL } from '../../utils/Constant';

const connection = new HubConnectionBuilder()
  .withUrl(`${SERVER_HUB_URL}`)
  .withAutomaticReconnect()
  .build();

connection.start()
  .then(() => {
    console.log('SignalR Connected!');
  })
  .catch((error) => {
    console.error('SignalR Connection Error: ', error);
  });

export { connection };
