import Analytics from "@aws-amplify/analytics";
import { last, get } from "lodash";

import awsexport from "../aws-exports";

const env = last(get(awsexport, "aws_content_delivery_bucket", "test-dev").split("-"));

export const recordEvent = (name, attributes, ...args) => {
  const event = {
    name,
    attributes,
    data: { ...attributes, eventType: name },
    streamName: `bigboidefaultkinesis-${env}`,
    ...args,
  };
  try {
    Analytics.record(event);
    Analytics.record(event, "AWSKinesis");
  } catch (err) {
    console.error(err);
  }
};

export default {
  recordEvent,
};
