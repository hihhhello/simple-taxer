'use client';

import { useQuery } from '@tanstack/react-query';

import { apiJsonPlaceholder } from '@/shared/api';
import { User } from '@/shared/types';

type UsersTableProps = {
  users: User[];
};

export const UsersTable = ({ users: initialUsers }: UsersTableProps) => {
  const { data: users } = useQuery({
    queryKey: ['get-users'],
    queryFn: apiJsonPlaceholder.users.getUsers,
    initialData: initialUsers,
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Users
          </h1>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Id
                  </th>

                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Username
                  </th>

                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Username
                  </th>

                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 pr-4 sm:pr-0"
                  >
                    Email
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {users?.map(({ id, name, username, email }) => (
                  <tr key={id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {username}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 pr-4 sm:pr-0">
                      {email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
