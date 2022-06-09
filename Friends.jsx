import React, { useState, useEffect, useCallback } from "react";
import * as friendService from "../../services/friendService";
import FriendCard from "./FriendCard";
import toastr from "toastr";
import { Link } from "react-router-dom";
import Pagination from "rc-pagination";
import locale from "rc-pagination/lib/locale/en_US";
import "rc-pagination/assets/index.css";

function Friends() {
  const [pageData, setPageData] = useState({
    arrayOfPeople: [],
    peopleComponents: [],
  });

  const [toggle, setToggle] = useState(true);

  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    total: 0,
    pageSize: 3,
  });

  const [searchFormData, setSearchFormData] = useState({ search: "" });

  const onPageChange = (page) => {
    console.log(page);
    setPaginationData((prevState) => {
      const pd = { ...prevState };
      pd.currentPage = page;
      return pd;
    });
  };

  // --> useEffect function <--
  useEffect(() => {
    console.log("useEffect firing");
    let pageIndex = paginationData.currentPage - 1;
    if (!searchFormData.search) {
      friendService
        .paginateFriends(pageIndex, paginationData.pageSize)
        .then(onPaginateFriendsSuccess)
        .catch(onPaginateFriendsError);
    } else {
      friendService
        .getFriendsSearch(
          pageIndex,
          paginationData.pageSize,
          searchFormData.search
        )
        .then(onSearchSuccess)
        .catch(onSearchError);
    }
  }, [paginationData.currentPage]);

  // --> Get Pagination Success <--
  const onPaginateFriendsSuccess = (response) => {
    console.log("onPaginateFriendsSuccess ---> ", response);
    let newFriendsArray = response.data.item.pagedItems;
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.arrayOfPeople = newFriendsArray;
      pd.peopleComponents = newFriendsArray.map(mapFriend);
      return pd;
    });

    setPaginationData((prevState) => {
      const pd = { ...prevState };
      pd.total = response.data.item.totalCount;
      return pd;
    });
  };

  // --> Get Pagination Error <--
  const onPaginateFriendsError = (err) => {
    console.log("error", err);
  };

  // --> Error Handler for getFriends <--
  const onSearchError = (err) => {
    console.error(err);
    // toastr["error"]("get call failed!", "error!");
  };

  const mapFriend = (aFriend) => {
    return (
      <FriendCard
        person={aFriend}
        key={`listA - ${aFriend.id}`}
        onPersonClicked={onHandleDelete}
      />
    );
  };

  const onHandleDelete = useCallback((myFriend, eObj) => {
    console.log("id --->", myFriend.id, { myFriend, eObj });
    const handler = getDeleteSuccessHandler(myFriend.id);
    friendService
      .deleteFriend(myFriend.id)
      .then(handler)
      .catch(onDeleteFriendError);
  }, []);

  const getDeleteSuccessHandler = (idToBeDeleted) => {
    console.log("getDeleteSuccessHandler is firing --->", idToBeDeleted);
    return () => {
      console.log("OnDeleteSuccess", idToBeDeleted);

      setPageData((prevState) => {
        const pd = { ...prevState };
        const peopleArray = [...pd.arrayOfPeople];

        const idxOf = peopleArray.findIndex((person) => {
          let result = false;

          if (person.id === idToBeDeleted) {
            result = true;
          }

          return result;
        });
        console.log(idxOf);
        if (idxOf >= 0) {
          peopleArray.splice(idxOf, 1);
          const updatedComponents = peopleArray.map(mapFriend);
          console.log(pd.peopleComponents);
          pd.arrayOfPeople = peopleArray;
          pd.peopleComponents = updatedComponents;
        }
        return pd;
      });
    };
  };

  // // --> Error Handler for deleteFriend <--
  const onDeleteFriendError = (err) => {
    console.error(err);
    toastr["error"]("failed to delete!", "error!");
  };

  // --> Toggle Friends clickHandler <--
  const onToggleFriends = () => {
    console.log("Toggle is firing --->");
    setToggle(!toggle);
  };

  // --> Search Friend clickHandler <--
  const onSearchClicked = (e) => {
    e.preventDefault();
    console.log("onSearch firing --->");

    let pageIndex = paginationData.currentPage - 1;
    let pageSize = paginationData.pageSize;
    let query = searchFormData.search;

    if (!query) {
      friendService
        .paginateFriends(pageIndex, pageSize)
        .then(onPaginateFriendsSuccess)
        .catch(onPaginateFriendsError);
    } else {
      friendService
        .getFriendsSearch(pageIndex, pageSize, query)
        .then(onSearchSuccess)
        .catch(onSearchError);
    }
  };

  const searchData = (event) => {
    const target = event.target;
    const newFormValue = target.value;
    const nameOfField = target.name;
    setSearchFormData((prevState) => {
      const newFormObject = {
        ...prevState,
      };
      newFormObject[nameOfField] = newFormValue;
      return newFormObject;
    });
  };

  // --> Success Handler for getFriends <--
  const onSearchSuccess = (response) => {
    let arrayOfFriends = response.data.item.pagedItems;

    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.arrayOfPeople = arrayOfFriends;
      pd.peopleComponents = arrayOfFriends.map(mapFriend);
      return pd;
    });
    setPaginationData((prevState) => {
      const pd = { ...prevState };
      pd.total = response.data.item.totalCount;
      return pd;
    });
  };

  return (
    <React.Fragment>
      <>
        <div className="container">
          <h1>Friends</h1>
          <form>
            <input
              name="search"
              placeholder="Search Friend"
              type="search"
              className="form-control"
              id="exampleInputSearch1"
              value={paginationData.search}
              onChange={searchData}
            />
            <button
              type="button"
              className="btn bg-success text-white"
              onClick={onSearchClicked}
            >
              Search
            </button>
            <Pagination
              onChange={onPageChange}
              current={paginationData.currentPage}
              total={paginationData.total}
              defaultPageSize={paginationData.pageSize}
              locale={locale}
            />
          </form>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onToggleFriends}
          >
            {!toggle ? "Show" : "Hide"}
          </button>
          <Link to="/Friends/New" className="btn btn-info" type="button">
            Add New Friend
          </Link>
          <div className="row">
            {toggle && pageData.arrayOfPeople.map(mapFriend)}
          </div>
          {/* <div className="row">{toggle && pageData.peopleComponents}</div> */}
        </div>
      </>
    </React.Fragment>
  );
}

export default Friends;
