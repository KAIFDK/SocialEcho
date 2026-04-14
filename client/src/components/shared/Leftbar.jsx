import { useMemo, useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getJoinedCommunitiesAction } from "../../redux/actions/communityActions";
import {
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineRectangleStack,
  HiOutlineTag,
} from "react-icons/hi2";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { GiTeamIdea } from "react-icons/gi";
import CreateCommunityModal from "../modals/CreateCommunityModal";

const Leftbar = ({ showLeftbar }) => {
  const dispatch = useDispatch();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const toggleCreateModal = () => setShowCreateModal(!showCreateModal);

  const user = useSelector((state) => state.auth?.userData);
  const joinedCommunities = useSelector(
    (state) => state.community?.joinedCommunities
  );

  useEffect(() => {
    dispatch(getJoinedCommunitiesAction());
  }, [dispatch]);

  const visibleCommunities = useMemo(() => {
    return joinedCommunities?.slice(0, 5);
  }, [joinedCommunities]);

  const communityLinks = useMemo(() => {
    return visibleCommunities?.map((community) => ({
      href: `/community/${community.name}`,
      label: community.name,
    }));
  }, [visibleCommunities]);

  return (
    <div className={`${showLeftbar ? "" : "hidden"} leftbar`}>
      <div className="flex flex-col justify-start items-center">
        <div className="flex flex-col items-start gap-4 w-full p-5">
          <Link
            className="flex items-center gap-2 text-lg font-medium hover:text-primary"
            to="/home"
          >
            <HiOutlineHome className="text-xl" />
            <p>Home</p>
          </Link>
          <Link
            className="flex items-center gap-2 text-lg font-medium hover:text-primary"
            to="/profile"
          >
            <HiOutlineUserCircle className="text-xl" />
            <p>Profile</p>
          </Link>
          <Link
            className="flex items-center gap-2 text-lg font-medium hover:text-primary"
            to="/saved"
          >
            <HiOutlineTag className="text-xl" />
            <p>Saved</p>
          </Link>

          {user && user.role === "general" && (
            <Link
              className="flex items-center gap-2 text-lg font-medium hover:text-primary"
              to="/following"
            >
              <HiOutlineRectangleStack className="text-xl" />
              <p>Following</p>
            </Link>
          )}

          <button
            onClick={toggleCreateModal}
            className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Community
          </button>
          
          <CreateCommunityModal show={showCreateModal} toggle={toggleCreateModal} />

          <hr className="w-full my-4 border-gray-300" />

          {communityLinks && communityLinks.length > 0 ? (
            <div className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex gap-1 font-medium items-center">
                  <HiOutlineUserGroup className="text-xl" />
                  Communities
                </div>

                <Link
                  className="flex relative items-center text-sm font-medium text-primary mr-4"
                  to="/my-communities"
                >
                  See all
                  <p className="absolute -top-2 -right-4 text-white text-xs bg-primary w-4 h-4 rounded-full flex justify-center items-center">
                    {" "}
                    {joinedCommunities.length}
                  </p>
                </Link>
              </div>
              <ul className="w-full mt-3">
                {communityLinks.map((communityLink) => (
                  <li key={communityLink.href}>
                    <Link
                      className="flex items-center hover:text-primary text-gray-600 font-medium gap-2 py-1"
                      to={communityLink.href}
                    >
                      {communityLink.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>No communities found.</div>
          )}
          {user && user.role === "general" && (
            <div className="md:hidden">
              <hr className="w-full my-4 border-gray-300" />
              <div className="flex justify-center gap-1 items-center">
                <GiTeamIdea />
                <Link to="/communities" className="text-primary font-medium">
                  See all communities
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(Leftbar);
