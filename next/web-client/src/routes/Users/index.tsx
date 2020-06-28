import React from 'react';
import { Button } from 'antd';
import MetaTags from 'react-meta-tags';
import { UserDeleteOutlined } from '@ant-design/icons';
import Localization, { l, useI18n } from '@rockpack/localazer';
import useStyles from 'isomorphic-style-loader/useStyles';
import { useUsers, useUsersApi } from '../../features/Users';
import { Access, NotOwner } from '../../features/User';
import { Roles } from '../../types/User';

import styles from './style.modules.scss';

const Users = (): JSX.Element => {
  useStyles(styles);
  const i18n = useI18n();
  const users = useUsers();
  const usersApi = useUsersApi();
  const hasUsers = Array.isArray(users) && users.length > 0;

  return (
    <>
      <MetaTags>
        <title>{l('Users')(i18n)}</title>
        <meta name="description" content={l('Users list')(i18n)} />
      </MetaTags>
      <div className={styles.users}>
        {hasUsers && <h1><Localization>{l('Users')}</Localization></h1>}
        {hasUsers && (
          <ul className={styles['user-list']}>
            {users.map((user): JSX.Element => (
              <li key={user.id}>
                {user.email}
                <Access forRoles={[Roles.admin]}>
                  <NotOwner forUser={user.email}>
                    <Button onClick={(): void => usersApi.deleteUser(user.id)}>
                      <UserDeleteOutlined />
                    </Button>
                  </NotOwner>
                </Access>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Users;