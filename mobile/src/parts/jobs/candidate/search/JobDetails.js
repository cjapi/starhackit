import React from "react";
import { Image, View } from "react-native";
import glamorous from "glamorous-native";
import { observer } from "mobx-react";
import moment from "moment";
import _ from "lodash";
import computeDistance from "./computeDistance";

export default context => {
  const Text = require("components/Text").default(context);
  const ScrollView = glamorous.scrollview({
    backgroundColor: "white"
  });

  const LoadingScreen = require("components/LoadingScreen").default(context);


  const JobDescription = glamorous(Text)({
    fontSize: 16
  });

  const Sector = glamorous(Text)({
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "lightgrey",
    alignSelf: "flex-start",
    borderRadius: 3,
    color: "grey",
    padding: 4
  });

  const Card = glamorous(View)({
    paddingTop: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: "lightgrey"
  });

  const JobStat = glamorous(View)({
    flexDirection: "row"
  });
  const JobViews = glamorous(Text)({
    color: "grey"
  });

  const JobTitle = glamorous(Text)({
    fontSize: 20,
    fontWeight: "bold"
  });

  const PublishedDate = glamorous(Text)({
    fontStyle: "italic",
    color: "grey"
  });

  const Date = glamorous(Text)({
    fontStyle: "italic",
    color: "grey"
  });

  const Location = glamorous(Text)({ color: "grey" });

  const JobInfo = ({ details }) => (
    <Card>
      <JobStat>
        {details.created_at && (
          <PublishedDate>
            Published {moment(details.created_at).fromNow()}
          </PublishedDate>
        )}
        <JobViews>{`\u00b7 ${details.views} views`}</JobViews>
      </JobStat>
      <JobTitle>{details.title}</JobTitle>
      <Sector>{details.sector}</Sector>
      {details.description && (
        <JobDescription>{details.description}</JobDescription>
      )}
      {details.location && (
        <Location>
          {computeDistance(details.geo, context.stores.core.geoLoc)}
          {` \u00b7 `}
          {details.location.description}
        </Location>
      )}
      {details.start_date && (
        <Date>Start {moment(details.start_date).fromNow()}</Date>
      )}
    </Card>
  );

  const CompanyName = glamorous(Text)({
    fontSize: 18,
    fontWeight: "bold"
  });

  const CompanyInfo = glamorous(Text)({
    fontSize: 14
  });

  const BusinessType = glamorous(Text)({
    fontSize: 14,
    color: "grey"
  });

  const Company = ({ details }) => (
    <Card>
      <CompanyName>{details.company_name}</CompanyName>
      <BusinessType>{details.business_type}</BusinessType>
      <CompanyInfo>{details.company_info}</CompanyInfo>
    </Card>
  );

  const HiredBy = glamorous(Text)({
    fontSize: 14,
    color: "grey",
    fontStyle: "italic"
  });

  const Recruiter = ({ recruiter }) => (
    <Card>
      <HiredBy>Hiring by</HiredBy>
      <Text>{recruiter.username}</Text>
    </Card>
  );

  const JobDetails = observer(({ opsGetOne }) => {
    console.log("JobDetails ", opsGetOne.loading);
    if (opsGetOne.loading) return <LoadingScreen label="Loading Jobs..."/>;
    const details = opsGetOne.data || {};
    const { recruiter } = details;
    console.log("recruiter ", recruiter);
    const image64 = _.get(details.picture, "base64");
    return (
      <ScrollView style={{ height: 600 }}>
        {image64 && <Image style={{ height: 200 }} source={{ uri: image64 }} />}

        <View style={{ margin: 16 }}>
          <JobInfo details={details} />
          <Company details={details} />
          {details.recruiter && <Recruiter recruiter={details.recruiter} />}
        </View>
      </ScrollView>
    );
  });
  return JobDetails;
};
