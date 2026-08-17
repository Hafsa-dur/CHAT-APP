export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const updateObject = (state, changes) => ({
  ...state,
  ...changes,
});

export const mockUsers = [
  { id: '1', name: 'Alison Martin', status: 'online', avatar: '/src/assets/avatar1.png' },
  { id: '2', name: 'Martin Johnson', status: 'online', avatar: '/src/assets/avatar2.png' },
  { id: '3', name: 'Enrique Martinez', status: 'offline', avatar: '/src/assets/avatar3.png' },
  { id: '4', name: 'Marco Jones', status: 'offline', avatar: '/src/assets/avatar4.png' },
];

export const mockMessages = [
  {
    id: 'm1',
    author: 'Martin Johnson',
    direction: 'received',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    time: '15:53',
  },
  {
    id: 'm2',
    author: 'You',
    direction: 'sent',
    body: 'Phasellus commodo purus vitae feugiat scelerisque.',
    time: '15:55',
  },
  {
    id: 'm3',
    author: 'Martin Johnson',
    direction: 'received',
    body: 'Curabitur a nisi in est consequat mattis.',
    time: '15:56',
  },
];
