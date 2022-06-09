import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import debug from "sabio-debug";
// useEffect

function FriendCard(props) {
  const _logger = debug.extend("FriendCard");
  _logger("FriendCard");

  const navigate = useNavigate();

  const aPerson = props.person;

  const onLocalDeleteClicked = (evt) => {
    evt.preventDefault();
    props.onPersonClicked(aPerson, evt);
  };

  // <------------------------------------------------------>

  const navigateOnEditFriendClick = () => {
    const state = { type: "FRIEND_VIEW", payload: aPerson };
    navigate(`/Friends/New/${aPerson.id}`, { state });
  };

  return (
    <div className="col-md-3">
      <div className="card">
        <img
          src={aPerson.primaryImage.url}
          className="card-img-top"
          alt={aPerson.headline}
        />
        <div className="card-body">
          <h5 className="card-title">{aPerson.title}</h5>
          <p className="card-text">{aPerson.bio}</p>
          <button
            className="btn btn-primary"
            type="button"
            onClick={navigateOnEditFriendClick}
          >
            Edit
          </button>
          <button className="btn btn-danger" onClick={onLocalDeleteClicked}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

FriendCard.propTypes = {
  person: PropTypes.shape({
    primaryImage: PropTypes.shape({
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
      typeId: PropTypes.number.isRequired,
    }).isRequired,
    title: PropTypes.string.isRequired,
    headline: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
  }),
};

export default React.memo(FriendCard);
