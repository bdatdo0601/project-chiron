import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faSignOutAlt,
  faBars,
  faArrowDown,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router";
import { get } from "lodash";
import { useNot } from "react-hooks-helper";
import Button from "rsuite/Button";
import IconButton from "rsuite/IconButton";
import ButtonGroup from "rsuite/ButtonGroup";
import Whisper from "rsuite/Whisper";
import Popover from "rsuite/Popover";
import Dropdown from "rsuite/Dropdown";

import { WEBSITE_TITLE } from "../../utils/constants";
import { useAuthenticatedUser } from "../../components/withCustomAWSAuthenticator";
import MenuDrawer from "./MenuDrawer";

const Navbar = ({ toggleDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, ...user } = useAuthenticatedUser();

  const decoratedHeader = "bg-blue-900 shadow-lg";

  if (["/signin", "/signout"].includes(get(location, "pathname", "/"))) {
    return null;
  }

  return (
    <div
      className={`fixed w-screen z-10 flex ${
        ["/"].includes(get(location, "pathname", "/")) ? "" : decoratedHeader
      } `}
    >
      <div className="p-4 text-left">
        <button className="text-3xl ml-4 text-white" onClick={toggleDrawer}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      <div className="p-4 text-right flex-1">
        {isAuthenticated && (
          <ButtonGroup>
            <Button
              appearance="primary"
              onClick={() => {
                navigate("/profile");
              }}
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />{" "}
              {get(user, "email")}
            </Button>
            <Whisper
              placement="bottomEnd"
              trigger="click"
              speaker={({ onClose, left, top, className }, ref) => {
                const handleSelect = () => {
                  onClose();
                };
                return (
                  <Popover
                    ref={ref}
                    className={className}
                    style={{ left, top }}
                    full
                  >
                    <Dropdown.Menu onSelect={handleSelect}>
                      <Dropdown.Item>
                        <button
                          className="w-100 bg-red-600 py-2 px-8 rounded-lg text-white"
                          onClick={() => {
                            navigate("/signout");
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faSignOutAlt}
                            className="mr-2"
                          />{" "}
                          Sign Out
                        </button>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Popover>
                );
              }}
            >
              <IconButton
                appearance="primary"
                icon={<FontAwesomeIcon icon={faArrowDown} className="mr-2" />}
              />
            </Whisper>
          </ButtonGroup>
        )}
        {!isAuthenticated && (
          <button
            className="w-100 bg-blue-600 py-2 px-8 rounded-lg text-white"
            onClick={() => {
              navigate("/signin");
            }}
          >
            <FontAwesomeIcon icon={faSignInAlt} className="mr-2" /> Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default function MainLayout({ children }) {
  const [isDrawerOpen, toggleDrawer] = useNot(false);
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{WEBSITE_TITLE}</title>
        <link rel="canonical" href={`${window.location.href}`} />
        <meta
          name="description"
          content="Helping you to build your portfolio"
        />
      </Helmet>
      <MenuDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} width="20vw" />
      <Navbar toggleDrawer={toggleDrawer} />
      <main>{children}</main>
    </>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

MainLayout.defaultProps = {};
