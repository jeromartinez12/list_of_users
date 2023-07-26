import { Inter } from "next/font/google";
import { useEffect, useMemo, useRef, useState } from "react";
import { SortBy, type User } from "./types.d";
import UserList from "./components/UserList";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  const originalUsers = useRef<User[]>([]);

  const toogleColors = () => {
    setShowColors(!showColors);
  };

  const toogleSortByCountry = () => {
    const newSortingValue =
      sorting == SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE;
    setSorting(newSortingValue);
  };

  const handleDelete = (uuid: string) => {
    const filteredUsers = users.filter((user) => user.login.uuid !== uuid);
    setUsers(filteredUsers);
  };

  const handleReset = () => {
    setUsers(originalUsers.current);
  };

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  useEffect(() => {
    fetch("https://randomuser.me/api?results=100")
      .then(async (res) => await res.json())
      .then((res) => {
        setUsers(res.results);
        originalUsers.current = res.results;
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredUsers = useMemo(() => {
    return typeof filterCountry === "string" && filterCountry.length > 0
      ? users.filter((user) => {
          return user.location.country
            .toLowerCase()
            .includes(filterCountry.toLowerCase());
        })
      : users;
  }, [filterCountry, users]);

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredUsers;

    const comparePropierties: Record<string, (user: User) => any> = {
      [SortBy.NAME]: (user) => user.name.first,
      [SortBy.LAST]: (user) => user.name.last,
      [SortBy.COUNTRY]: (user) => user.location.country,
      [SortBy.EMAIL]: (user) => user.email,
    };

    return filteredUsers.toSorted((a, b) => {
      const extractPropiertie = comparePropierties[sorting];
      return extractPropiertie(a).localeCompare(extractPropiertie(b));
    });
  }, [filteredUsers, sorting]);

  return (
    <>
      <header className="flex flex-col justify-center items-center p-12">
        <h1 className="text-4xl font-bold">Lista de usuarios</h1>
        <div className="flex justify-center items-center p-4">
          <button className="p-4" onClick={toogleColors}>
            Colorear
          </button>
          <button className="p-4" onClick={toogleSortByCountry}>
            {sorting === SortBy.COUNTRY
              ? "No ordenar por país"
              : "Ordenar por país"}
          </button>
          <button className="p-4" onClick={handleReset}>
            Reset
          </button>
          <input
            className="p-4"
            placeholder="Filtrar por país"
            onChange={(e) => {
              setFilterCountry(e.target.value);
            }}
          />
        </div>
      </header>

      <main className={`flex flex-col items-center justify-center p-12 ${inter.className}`}>
      {users ? (
        <UserList
        changeSorting={handleChangeSort}
        deleteUser={handleDelete}
        showColors={showColors}
        users={sortedUsers}
        />
      ) : (
        <div>Cargando usuarios...</div>
      )}
    </main>

    </>
  );
}
