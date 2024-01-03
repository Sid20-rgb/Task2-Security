// import axios from "axios";
// import React, { useContext, useEffect, useState } from "react";
// import { UserContext } from "../context/UserContext";
// import Explorer from "./Explorer";

// const ExplorersList = ({ showUserProfile, userInfo, fetchUserInfo }) => {
//   const { user } = useContext(UserContext);
//   const [blogs, setExplorers] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:3001/blogs", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       })
//       .then((response) => setExplorers(response.data.data))
//       .catch((error) => console.log(error));
//   }, []);

//   console.log(blogs);

//   // Filter blogs array to show only posts of other people
//   // const filteredExplorers = blogs.filter((blog) => blog.user._id !== user._id);

//   return (
//     <div
//       className={`${
//         showUserProfile ? "hidden lg:grid" : "block"
//       } grid grid-cols-2 items-stretch gap-4 mt-[180px] px-4 pb-14 lg:pb-0 `}
//     >
//       {blogs.length === 0 ? (
//         <div>
//           <p className="font-medium">
//             No <span className="text-purple-lighter">books</span> available. 😟
//           </p>
//         </div>
//       ) : (
//         blogs.map((blog, index) => (
//           <Explorer
//             blog={blog}
//             key={index}
//             userInfo={userInfo}
//             fetchUserInfo={fetchUserInfo}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default ExplorersList;
