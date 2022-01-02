import { get } from "lodash";
import React, { useMemo } from "react";
import { Table, Column, Cell, HeaderCell } from "rsuite-table";
import { useAuthenticatedUser } from "../../../components/withCustomAWSAuthenticator";
import { useAdminQueriesAPI } from "../../../utils/awsAPI";

import aws_config from "../../../aws-exports";
import { Loader } from "rsuite";

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
      <button className="text-red-500">Delete</button>
    </span>
  );
};

const AdminsControlCenter = () => {
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
        <Column width={120} fixed="right">
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
        </Column>
      </Table>
    </div>
  );
};

export default AdminsControlCenter;
