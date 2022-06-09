import React, { useState, useEffect } from "react";
import * as friendService from "../../services/friendService";
import { useLocation, useNavigate } from "react-router-dom";
import toastr from "toastr";
import debug from "sabio-debug";

function NewFriend() {
  const [newFriendData, setNewFriendData] = useState({
    title: "",
    bio: "",
    summary: "",
    headline: "",
    slug: "",
    primaryImage: "",
    skills: [],
  });
  const _logger = debug.extend("NewFriend");

  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (state && state?.type === "FRIEND_VIEW") {
      setNewFriendData(() => {
        let friendData = state.payload;
        let editFriendData = {
          title: friendData.title,
          bio: friendData.bio,
          summary: friendData.summary,
          headline: friendData.headline,
          slug: friendData.slug,
          statusId: friendData.statusId,
          primaryImage: friendData.primaryImage.url,
          skills: friendData.skills?.map((mappedSkills) => {
            return mappedSkills.name;
          }),
        };
        return editFriendData;
      });
    }
  }, []);

  const onSubmitClicked = (e) => {
    e.preventDefault();
    const data = {
      title: newFriendData.title,
      bio: newFriendData.bio,
      summary: newFriendData.summary,
      headline: newFriendData.headline,
      slug: newFriendData.slug,
      statusId: newFriendData.statusId,
      primaryImage: {
        url: newFriendData.primaryImage,
        typeId: 100,
      },
      skills: newFriendData.skills.split(","),
    };

    if (state) {
      _logger(state);
      friendService
        .updateFriend(state.payload.id, data)
        .then(onUpdateFriendSuccess)
        .catch(onUpdateFriendError);
    } else {
      friendService
        .createFriend(data)
        .then(onCreateFriendSuccess)
        .catch(onCreateFriendError);
    }
  };

  // --> Success Handler for createFriends <--
  const onCreateFriendSuccess = (response) => {
    _logger("AppOnCreateFriendSuccess", response);
    toastr.success("New Friend created!", response.title);
    navigate("/Friends");
  };

  // --> Error Handler for createFriends <--
  const onCreateFriendError = (err) => {
    _logger("AppOnCreateFriendError", err);
    toastr.error(err);
  };

  // --> Success Handler for updateFriends <--
  const onUpdateFriendSuccess = (response) => {
    _logger("AppOnUpdateFriendSuccess", response);
    toastr.success("Friend is now updated!", response.title);
    navigate("/Friends");
  };

  // --> Error Handler for createFriends <--
  const onUpdateFriendError = (err) => {
    _logger("AppOnUpdateFriendError", err);
    toastr.error(err);
  };

  const onFormFieldChange = (event) => {
    const target = event.target;
    const newFriendValue = target.value;
    const nameOfField = target.name;

    setNewFriendData((prevState) => {
      const newFriendObject = {
        ...prevState,
      };
      newFriendObject[nameOfField] = newFriendValue;
      return newFriendObject;
    });
  };

  return (
    <React.Fragment>
      <h1>Add New Friend</h1>
      <div className="container d-flex justify-content-center">
        <div className="d-flex justify-content-center card cardCustom">
          <form>
            <div className="col-md-12">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Title
              </label>
              <input
                name="title"
                placeholder="Enter Title Here"
                type="lastName"
                className="form-control"
                id="exampleInputFirstName1"
                value={newFriendData.title}
                onChange={onFormFieldChange}
              />
            </div>
            <div className="mb-3 col-md-12">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Bio
              </label>
              <input
                name="bio"
                placeholder="Enter Your Bio"
                type="lastName"
                className="form-control"
                id="exampleInputLastName1"
                value={newFriendData.bio}
                onChange={onFormFieldChange}
              />
            </div>
            <div className="mb-3 col-md-12">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Summary
              </label>
              <input
                name="summary"
                placeholder="Enter a Summary"
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                value={newFriendData.summary}
                onChange={onFormFieldChange}
              />
            </div>
            <div className="mb-3 col-md-12">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Headline
              </label>
              <input
                name="headline"
                placeholder="Enter a Headline"
                type="headline"
                className="form-control"
                id="exampleInputPassword1"
                value={newFriendData.headline}
                onChange={onFormFieldChange}
              />
            </div>
            <div className="mb-3 col-md-12">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Slug
              </label>
              <input
                name="slug"
                placeholder="Unique Slug"
                type="slug"
                className="form-control"
                id="exampleInputConfirmPassword1"
                value={newFriendData.slug}
                onChange={onFormFieldChange}
              />
            </div>
            {/* <div className="mb-3 col-md-12">
              <label htmlFor="exampleInputPassword1" className="form-label">
                StatusId
              </label>
              <input
                name="statusId"
                placeholder="Provide A StatusId"
                type="avatarUrl"
                className="form-control"
                id="exampleInputAvatarUrl1"
                value={newFriendData.statusId}
                onChange={onFormFieldChange}
              />
            </div> */}
            <div className="mb-3 col-md-12">
              <label htmlFor="exampleInputPassword1" className="form-label">
                PrimaryImage
              </label>
              <input
                name="primaryImage"
                placeholder="Provide an imageUrl"
                type="avatarUrl"
                className="form-control"
                id="exampleInputAvatarUrl1"
                value={newFriendData.primaryImage}
                onChange={onFormFieldChange}
              />
            </div>
            <div className="mb-3 col-md-12">
              <label htmlFor="exampleInputSkills1" className="form-label">
                Skills
              </label>
              <input
                name="skills"
                placeholder="Skills"
                type="skills"
                className="form-control"
                id="exampleInputSkills1"
                value={newFriendData.skills}
                onChange={onFormFieldChange}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary registerBtn"
              id="registerButton"
              onClick={onSubmitClicked}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}

export default NewFriend;
