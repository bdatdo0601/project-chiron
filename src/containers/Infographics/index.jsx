import { groupBy } from "lodash";
import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import ReactWordcloud from 'react-wordcloud';
import { fetchFileToJSON } from "../../utils";
import { useGetFile } from "../../utils/awsStorage";


const Infographics = () => {
  const { file, loading } = useGetFile("salarydata.json", "");
  const [salaryData, setSalaryData] = useState([]);
  useEffect(() => {
    if (file) {
      fetchFileToJSON(file)
        .then(jsonFile => setSalaryData(jsonFile))
        .catch(() => setSalaryData([]));
    }
  }, [file]);

  const companyWordCloud = useMemo(() => {
    const groupByCompany = groupBy(salaryData, "Company Name");

    return Object.keys(groupByCompany).map(item => ({ text: item, value: groupByCompany[item].length }));
  }, [salaryData])

  if (loading) {
    return null;
  }
  
  return (
    <div className="h-screen w-screen p-5 text-center pt-16 relative bg-black">
      <h2 className="text-4xl my-8 text-white">
        Infographics
      </h2>
      <div className="my-4" style={{ minHeight: 500 }}>
        <h3 className="text-2xl text-white">Company</h3>
        <ReactWordcloud words={companyWordCloud}
        options={{
          rotations: 0,
          padding: 2,
          fontSizes: [8, 80]
        }} />
      </div>
    </div>
  );
};

export default Infographics;

