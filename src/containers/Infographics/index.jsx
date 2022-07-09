import { get, groupBy, parseInt, sortBy, uniq } from "lodash";
import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import ReactWordcloud from "react-wordcloud";
import { Col, Grid, Row } from "rsuite";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  VictoryPie,
  VictoryTooltip,
  VictoryScatter,
  VictoryChart,
  VictoryAxis,
} from "victory";
import Gradient from "javascript-color-gradient";
import Currency from "currency.js";

import { fetchFileToJSON } from "../../utils";
import { useGetFile } from "../../utils/awsStorage";

import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const Infographics = () => {
  const { file, loading } = useGetFile("salarydata.json", "");
  const [salaryData, setSalaryData] = useState([]);
  useEffect(() => {
    if (file) {
      fetchFileToJSON(file)
        .then((jsonFile) =>
          setSalaryData(
            jsonFile.map((item) => ({
              ...item,
              "Year of Experiences": item["Year of Experiences"].includes("YOE")
                ? item["Year of Experiences"]
                : `${item["Year of Experiences"]} YOE`,
            }))
          )
        )
        .catch(() => setSalaryData([]));
    }
  }, [file]);

  const wordcloud = useMemo(() => {
    const getGroup = (label) => {
      const groups = groupBy(salaryData, (item) =>
        get(item, label, "").trim().toString()
      );
      return Object.keys(groups).map((item) => ({
        text: item,
        value: groups[item].length,
      }));
    };

    const result = {
      city: { title: "Cities", data: getGroup("City") },
      company: { title: "Companies", data: getGroup("Company Name") },
      roles: { title: "Focuses", data: getGroup("Focus") },
    };
    return result;
  }, [salaryData]);

  const pieCharts = useMemo(() => {
    const getData = (label) => {
      const groups = groupBy(salaryData, (item) =>
        get(item, label, "").trim().toString()
      );
      const data = sortBy(
        Object.keys(groups).map((item, index) => ({
          x: index + 1,
          y: groups[item].length,
          label: `${item} - ${(
            (groups[item].length * 100) /
            salaryData.length
          ).toFixed(2)}% (${groups[item].length} Count)`,
        })),
        "label"
      );

      const gradientArray = new Gradient()
        .setColorGradient("#005DE3", "#66FFCC", "#05162C")
        .setMidpoint(data.length)
        .getColors();

      return {
        data,
        colorScale: gradientArray,
        animate: true,
        padAngle: 3,
        innerRadius: 50,
        labelPosition: "centroid",
        labelComponent: <VictoryTooltip />,
        style: {
          data: {
            fillOpacity: 0.9,
            stroke: "#fafafa",
            strokeWidth: 2,
          },
          labels: {
            fontSize: 12,
          },
        },
      };
    };

    const result = {
      country: { title: "Country", data: getData("Country") },
      experiences: {
        title: "Year of Experiences",
        data: getData("Year of Experiences"),
      },
      level: {
        title: "Levels",
        data: getData("Level"),
      },
    };
    return result;
  }, [salaryData]);

  const scatterData = useMemo(() => {
    const result = salaryData.map((item) => ({
      x: Currency(item["TC in USD"], {}).value,
      y: item["Country"],
      amount: parseInt(item["Year of Experiences"].split("-")[1].split(" ")[0]),
      label: `
      Company: ${item["Company Name"]}
      TC: ${item["TC in USD"]}
      YOE: ${item["Year of Experiences"]}
      City: ${item["City"]}
      `,
    }));
    return result;
  }, [salaryData]);

  if (loading) {
    return null;
  }

  return (
    <div
      className="h-full w-screen p-5 text-center pt-16 relative bg-black"
      style={{ minHeight: "100vh" }}
    >
      <h1 className="text-6xl my-8 text-white">Infographics</h1>
      <h2 className="text-xl my-8 text-white">
        ...Over {salaryData.length} people and growing
      </h2>
      <Grid className="my-4" style={{ minHeight: 500 }}>
        <Row>
          {Object.values(pieCharts).map(({ title, data }) => (
            <Col xs={24} sm={24} md={12} lg={8} xl={8} key={title}>
              <h3 className="text-2xl text-white mb-4">{title}</h3>
              <VictoryPie {...data} />
            </Col>
          ))}
          {Object.values(wordcloud).map(({ title, data }) => (
            <Col xs={24} sm={24} md={24} lg={24} xl={12} key={title}>
              <h3 className="text-2xl text-white mb-4">{title}</h3>
              <ReactWordcloud
                words={data}
                options={{
                  rotations: 0,
                  padding: 2,
                  fontSizes: [12, 75],
                  colors: ["#005DE3", "#66FFCC", "#FAFAFA"],
                }}
              />
            </Col>
          ))}
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <h3 className="text-2xl text-white mb-4">
              Compensation By Countries
            </h3>
            <VictoryChart
              height={1000}
              width={window.innerWidth}
              style={{
                labels: {
                  fontSize: 12,
                  color: "#fafafa",
                },
              }}
            >
              <VictoryAxis
                crossAxis
                label="TC in USD"
                domain={[
                  -50000,
                  Math.max(...scatterData.map((item) => item.x)),
                ]}
                offsetX={150}
                style={{
                  axis: { stroke: "#fafafa" },
                  axisLabel: { fontSize: 20, fill: "#fafafa" },
                  ticks: { stroke: "#fafafa", size: 5 },
                  tickLabels: { fontSize: 15, padding: 5, fill: "#fafafa" },
                }}
              />
              <VictoryAxis
                dependentAxis
                height={1000}
                standalone={false}
                padding={{ top: 300, bottom: 300 }}
                domainPadding={{ y: [150, 50] }}
                style={{
                  axis: { stroke: "#fafafa" },
                  axisLabel: { fontSize: 20, fill: "#fafafa" },
                  ticks: { stroke: "#fafafa", size: 5 },
                  tickLabels: { fontSize: 15, fill: "#fafafa" },
                }}
              />
              <VictoryScatter
                data={scatterData}
                labelComponent={<VictoryTooltip />}
                size={8}
                style={{
                  parent: {
                    border: "1px solid #ccc",
                  },
                  data: {
                    fill: ({ datum }) => {
                      const gradientArray = new Gradient()
                        .setColorGradient("#66FFCC", "#005DE3")
                        .setMidpoint(pieCharts.experiences.data.data.length)
                        .getColors();
                      return gradientArray[datum.amount];
                    },
                    stroke: "#fafafa",
                    strokeWidth: 1,
                  },
                }}
              />
            </VictoryChart>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

export default Infographics;
