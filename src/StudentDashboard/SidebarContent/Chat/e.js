import { useEffect, useRef, useState } from "react";
import Img1 from "../../assets/img1.jpg";
import tutorialsdev from "../../assets/tutorialsdev.png";
import Input from "../../components/Input";
import { io } from "socket.io-client";

const Dashboard = () => {

  return (
    <div className="w-screen flex">
      <div className="w-[25%] h-screen bg-secondary overflow-scroll">
        <div className="flex items-center my-8 mx-14">
          <div>

            <img
              src={tutorialsdev}
              width={75}
              height={75}
              className="border border-primary p-[2px] rounded-full"
            />
          </div>
          <div className="ml-8">
            <h3 className="text-2xl">{user?.fullName}</h3>
            <p className="text-lg font-light">My Account</p>
          </div>
        </div>
        <hr />
        <div className="mx-14 mt-10">
          <div className="text-primary text-lg">Messages</div>
          <div>
            {conversations?.length > 0 ? (
              conversations?.map((item, index) => {
                return (
                  <div key={index} className="flex items-center py-8 border-b border-b-gray-300">
                    <div
                      className="cursor-pointer flex items-center"
                      onClick={() => fetchMessages(item)}
                    >
                      <div>
                        <img
                          src={Img1}
                          className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary"
                        />
                      </div>
                      <div className="ml-6">
                        <h3 className="text-lg font-semibold">
                          {user == item.userId._id
                            ? item?.contactId?.email
                            : item?.userId?.email}
                        </h3>
                        <p className="text-sm font-light text-gray-600">
                          {item?.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                No Conversations
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-[50%] h-screen bg-white flex flex-col items-center">
        {/* {messages?.receiver?.fullName && ( */}
        <div className="w-[75%] h-[80px] my-14 rounded-full flex items-center px-14 py-2">
          <div className="cursor-pointer">
            <img src={Img1} width={60} height={60} className="rounded-full" />
          </div>
          <div
            className={`rounded-full ${checkOnline() ? "bg-primary" : "bg-slate-500"
              }  p-2 ms-5 mt-5`}
          ></div>
          <div className=" p-2 ms-5 mt-5">
            {typing.typing &&
              typing.reciverId == user &&
              typing.user == reciverId
              ? "Typing"
              : ""}
          </div>
          <div className="ml-6 mr-auto">
            <h3 className="text-lg">{messages?.receiver?.fullName}</h3>
            <p className="text-sm font-light text-gray-600">
              {messages?.receiver?.email}
            </p>
          </div>
          <div className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-phone-outgoing"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="black"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
              <line x1="15" y1="9" x2="20" y2="4" />
              <polyline points="16 4 20 4 20 8" />
            </svg>
          </div>
        </div>
        {/* )} */}
        <div className="h-[75%] w-full overflow-scroll shadow-sm">
          <div className="p-14">
            {messages?.messages.length > 0 ? (
              messages?.messages?.map((item, index) => {
                return (
                  <div key={index}>
                    <div
                      className={`max-w-[40%] rounded-b-xl p-4 mb-6 ${user === item?.senderId
                        ? "bg-primary text-white rounded-tl-xl ml-auto"
                        : "bg-secondary rounded-tr-xl"
                        } `}
                    >
                      {item.check == 0 ? (
                        item?.message
                      ) : item.check == 1 ? (
                        "File"
                      ) : (
                        <div>
                          File
                          <br /> {item.message}
                        </div>
                      )}
                    </div>
                    <div ref={messageRef}></div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                No Messages or No Conversation Selected
              </div>
            )}
          </div>
        </div>
        <form className="p-14 w-full flex items-center" onSubmit={sendMessage}>
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={handleChange}
            className="w-[75%]"
            inputClassName="p-4 border-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none"
          />
          <button
            className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${message ? "" : !image ? "pointer-events-none" : ""
              } `}
            type="submit"
          // onClick={() => sendMessage()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-send"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#2c3e50"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <line x1="10" y1="14" x2="21" y2="3" />
              <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
            </svg>
          </button>
          <label
            htmlFor="image"
            className={`ml-4 p-2 cursor-pointer bg-light rounded-full`}
            onClick={handleClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-circle-plus"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#2c3e50"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx="12" cy="12" r="9" />
              <line x1="9" y1="12" x2="15" y2="12" />
              <line x1="12" y1="9" x2="12" y2="15" />
            </svg>
            <input
              type="file"
              name="image"
              ref={hiddenFileInput}
              onChange={handleFile}
              id=""
              className="hidden"
            />
          </label>
        </form>
      </div>
      {/* <div className="w-[25%] h-screen bg-light px-8 py-16 overflow-scroll">
        <div className="text-primary text-lg">People</div>
        <div>
          {users?.length > 0 ? (
            users?.map(({ userId, user }) => {
              return (
                <div className="flex items-center py-8 border-b border-b-gray-300">
                  <div
                    className="cursor-pointer flex items-center"
                    onClick={() => fetchMessages("new", user)}
                  >
                    <div>
                      <img
                        src={Img1}
                        className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary"
                      />
                    </div>
                    <div className="ml-6">
                      <h3 className="text-lg font-semibold">
                        {user?.fullName}
                      </h3>
                      <p className="text-sm font-light text-gray-600">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-lg font-semibold mt-24">
              No Conversations
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
