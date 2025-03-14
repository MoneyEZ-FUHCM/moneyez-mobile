import { MaterialIcons } from '@expo/vector-icons';

export const ICON_MAPPING: Record<string, typeof MaterialIcons.prototype.props.name> = {
  GROUP: 'group',
  USER: 'person',
  SYSTEM: 'notifications',
};

export const getNotificationIcon = (type: string): typeof MaterialIcons.prototype.props.name => {
  return ICON_MAPPING[type] || ICON_MAPPING.system;
};

const NOTIFICATION_CONSTANTS = {
  TABS: [
    { label: 'Tất cả', type: 'all' },
    { label: 'Nhóm', type: 'group' },
    { label: 'Cá nhân', type: 'user' },
  ],
  ICONS: ICON_MAPPING,
};

export default NOTIFICATION_CONSTANTS;
