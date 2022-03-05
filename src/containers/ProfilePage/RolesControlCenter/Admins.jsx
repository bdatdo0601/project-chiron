import { get } from "lodash";
import React, { useMemo } from "react";
import { Table, Column, Cell, HeaderCell } from "rsuite-table";
import { useAuthenticatedUser } from "../../../components/withCustomAWSAuthenticator";
import { useAdminQueriesAPI } from "../../../utils/awsAPI";
import Loader from "rsuite/Loader";
import Checkbox from "rsuite/Checkbox";

import aws_config from "../../../aws-exports";
import { useCallback } from "react";

const ListUsersConfig = {
  responseMapper: (data) =>
    get(data, "Users", []).map((item) => ({
      ...item,
      ...get(item, "Attributes", []).reduce(
        (acc, currentAttr) => ({
          ...acc,
          [currentAttr.Name]: currentAttr.Value,
        }),
        {}
      ),
    })),
  fetchAll: true,
};

const ListGroupsConfig = {
  responseMapper: (data) =>
    get(data, "Groups", []).filter(
      (item) =>
        !get(item, "GroupName").includes(get(aws_config, "aws_user_pools_id"))
    ),
  fetchAll: true,
};

const CheckCell = ({
  rowData,
  onChange,
  checkedKeys,
  dataKey,
  currentUser,
  ...props
}) => (
  <Cell {...props} style={{ padding: 0 }}>
    <div style={{ lineHeight: "46px" }}>
      <Checkbox
        value={rowData[dataKey]}
        inline
        onChange={onChange}
        checked={checkedKeys.some((item) => item === rowData[dataKey])}
        disabled={get(currentUser, dataKey) === get(rowData, dataKey)}
      />
    </div>
  </Cell>
);

const GroupCellRenderer = ({ userInfo }) => {
  const ListGroupsInUserRequestData = useMemo(
    () => ({
      queryStringParameters: {
        limit: 60,
        username: get(userInfo, "Username"),
      },
    }),
    [userInfo]
  );

  const [groupsOfUser, loading, listGroupsErrors] = useAdminQueriesAPI(
    "get",
    "/listGroupsForUser",
    ListGroupsInUserRequestData,
    ListGroupsConfig
  );
  if (listGroupsErrors) {
    return <span className="text-red-800">Unable to fetch group</span>;
  }
  if (loading) {
    return <Loader />;
  }
  return (
    <span>
      {groupsOfUser.length > 0
        ? groupsOfUser.map((item) => get(item, "GroupName")).join(", ")
        : "N/A"}
    </span>
  );
};

const ActionCellRenderer = ({ userInfo, currentUser }) => {
  const isDisabled = useMemo(
    () =>
      get(currentUser, "email") &&
      get(currentUser, "email") === get(userInfo, "email"),
    [currentUser, userInfo]
  );

  if (isDisabled) {
    return <span>Self (No Action)</span>;
  }
  return (
    <span>
      <button className="text-blue-500">Update Role(s)</button>
    </span>
  );
};

const AdminsControlCenter = () => {
  const [checkedItems, setCheckedItems] = React.useState([]);
  const { ...user } = useAuthenticatedUser();
  const [data, loading, listErrors] = useAdminQueriesAPI(
    "get",
    "/listUsers",
    null,
    ListUsersConfig
  );
  const [groups, groupLoading, listGroupErrors] = useAdminQueriesAPI(
    "get",
    "/listGroups",
    null,
    ListGroupsConfig
  );
  const isAllChecked = useMemo(() => {
    if (checkedItems.length === data.length - 1) {
      return true;
    }
    return false;
  }, [checkedItems, data]);

  const isAllCheckIndeterminate = useMemo(() => {
    if (
      !isAllChecked &&
      checkedItems.length > 0 &&
      checkedItems.length < data.length - 1
    ) {
      return true;
    }
    return false;
  }, [checkedItems, data, isAllChecked]);

  const handleCheckAll = useCallback(
    (_, checked) => {
      const keys = checked
        ? data
            .map((item) => get(item, "Username"))
            .filter((item) => item !== get(user, "Username"))
        : [];
      setCheckedItems(keys);
    },
    [data, user]
  );
  const handleCheck = useCallback((value, checked) => {
    setCheckedItems((currentCheckedItems) => {
      const keys = checked
        ? [...currentCheckedItems, value]
        : currentCheckedItems.filter((item) => item !== value);
      return keys;
    });
  }, []);

  if (listErrors || listGroupErrors) {
    return (
      <div className="text-red-500">
        {JSON.stringify(listErrors || listGroupErrors, null, 4)}
      </div>
    );
  }

  return (
    <div className="">
      <Table loading={loading || groupLoading} virtualized data={data}>
        <Column width={50} align="center">
          <HeaderCell style={{ padding: 0 }}>
            <div style={{ lineHeight: "40px" }}>
              <Checkbox
                inline
                checked={isAllChecked}
                indeterminate={isAllCheckIndeterminate}
                onChange={handleCheckAll}
              />
            </div>
          </HeaderCell>
          <CheckCell
            dataKey="Username"
            checkedKeys={checkedItems}
            onChange={handleCheck}
            currentUser={user}
          />
        </Column>
        <Column width={200} align="left" resizable>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column>
        <Column width={300} align="left" resizable>
          <HeaderCell>Username</HeaderCell>
          <Cell dataKey="Username" />
        </Column>
        <Column width={300}>
          <HeaderCell>Groups</HeaderCell>

          <Cell>
            {(rowData) => (
              <GroupCellRenderer
                userInfo={rowData}
                currentUser={user}
                groups={groups}
              />
            )}
          </Cell>
        </Column>
        {/* <Column width={120} fixed="right">
          <HeaderCell>Action</HeaderCell>

          <Cell>
            {(rowData) => (
              <ActionCellRenderer
                userInfo={rowData}
                currentUser={user}
                groups={groups}
              />
            )}
          </Cell>
        </Column> */}
      </Table>
    </div>
  );
};

export default AdminsControlCenter;
