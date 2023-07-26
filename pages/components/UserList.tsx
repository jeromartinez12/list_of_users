import { type User, SortBy } from "../types.d";

interface UserListProps {
  users: User[];
  showColors: boolean;
  deleteUser: (uuid: string) => void;
  changeSorting: (sort: SortBy) => void;
}

export default function UserList({
  users,
  showColors,
  deleteUser,
  changeSorting,
}: UserListProps) {

  if (!Array.isArray(users)) {
    return <div>Cargando...</div>;
  }

  return (
    <table className="divide-y divide-gray-800 text-center max-w-7xl">
      <thead>
        <tr className="leading-6 text-gray-900">
          <th>Foto</th>
          <th className="cursor-pointer" onClick={()=>changeSorting(SortBy.NAME)}>Nombre</th>
          <th className="cursor-pointer" onClick={()=>changeSorting(SortBy.LAST)}>Apellido</th>
          <th className="cursor-pointer" onClick={()=>changeSorting(SortBy.EMAIL)}>Correo</th>
          <th className="cursor-pointer" onClick={()=>changeSorting(SortBy.COUNTRY)}>País</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-500 ">
   
        {users.map((user, index) => {
          const backgroundColor = index % 2 === 0 ? "#888" : "#999";
          const color = showColors ? backgroundColor : "transparent";

          
          return (
            <tr
              key={user.login.uuid}
              className="min-w-0 flex-auto"
              style={{ backgroundColor: color }}
            >
              <td>
                <img
                  className="h-12 w-12 flex-none rounded-full bg-gray-50 m-3"
                  src={user.picture.thumbnail}
                ></img>
              </td>
              <td className="text-sm font-semibold leading-6 text-gray-900 p-5">
                {user.name.first}
              </td>
              <td className="text-sm font-semibold leading-6 text-gray-900 p-5">
                {user.name.last}
              </td>
              <td className="text-sm font-semibold leading-6 text-gray-900 p-5">
                {user.email}
              </td>
              <td className="text-sm font-semibold leading-6 text-gray-900 p-5">
                {user.location.country}
              </td>
              <td>
                <button
                  onClick={() => {
                    deleteUser(user.login.uuid);
                  }}
                  className="m-3"
                >
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="red"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
