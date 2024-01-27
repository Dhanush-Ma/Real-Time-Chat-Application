import React from "react";
import { Oval } from "react-loader-spinner";
import { useQuery } from "react-query";
import { FaUserCircle } from "react-icons/fa";

const fetchUsers = async () => {
  const res = await fetch("http://127.0.0.1:8000/users");
  return res.json();
};

const Users = ({ setFocuedChatWindowUserId, focuedChatWindowUserId }) => {
  const { data, isLoading } = useQuery("users", fetchUsers);

  const currentUser = JSON.parse(localStorage.getItem("CURRENT_USER") || "");

  return (
    <div className="w-[30%] text-white">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Oval color="#FFF" secondaryColor="#FFF" width={20} />
        </div>
      ) : (
        <div className="py-3">
          <h1 className="text-center mb-2">All Users</h1>
          {data.users
            ?.filter((user) => user.id != currentUser.id)
            .map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  setFocuedChatWindowUserId(user);
                }}
                style={{
                  background:
                    focuedChatWindowUserId.id === user.id
                      ? "#2B2D31"
                      : "transparent",
                }}
                className="flex bg-slate-200 px-3 py-3 cursor-pointer justify-start items-center gap-x-2 flex-1 hover:bg-accentColor1 mx-2 rounded-md"
              >
                <FaUserCircle size={30} color="#FFF" />

                <p className="text-white font-bold">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Users;
