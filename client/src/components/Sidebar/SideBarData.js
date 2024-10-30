import home from '../../assets/home.svg';
import Content from '../../assets/Content.svg';
import Display from '../../assets/Display.svg';
import Location from '../../assets/Location.svg';
import Reports from '../../assets/Reports.svg';
import User from '../../assets/User.svg';
import arrowright from '../../assets/arrowright.svg';

export const sidebarData = [
  {
    title: 'Dashboard',
    icon: home,
    path: '/dashboard',
    arrowright: arrowright,
  },
  {
    title: 'Content Management',
    icon: Content,
    children: [
      { title: 'My Content', path: '/content/my-content', active: true },
      { title: 'Templates', path: '/content/templates' },
      { title: 'Playlist', path: '/content/playlist' },
    ],
    arrowright: arrowright,
  },
  {
    title: 'Store Location',
    icon: Location,
    path: '/store-location',
    arrowright: arrowright,
  },
  {
    title: 'Device Management',
    icon: Display,
    path: '/device-management',
    arrowright: arrowright,
  },
  {
    title: 'Schedule Management',
    icon: Content,
    path: '/schedule-management',
    arrowright: arrowright,
  },

  {
    title: 'Reportss',
    icon: Reports,
    path: '/report',
    arrowright: arrowright,
  },
  {
    title: 'User Management',
    icon: User,
    path: '/user-management',
    arrowright: arrowright,
  },
];
