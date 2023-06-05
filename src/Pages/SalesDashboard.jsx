import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { Grid, Box, Typography, Paper, CircularProgress } from "@mui/material";
import { experimentalStyled as styled } from "@mui/material/styles";
import PropTypes from "prop-types";

export const SalesDashboard = (props) => {
  const {
    barChartData,
    pieChartData,
    newCustomerData,
    pendingTask,
    pendingFollowup,
    pendingDescription,
    monthlyStatus,
    weeklyStatus,
    dailyStatus,
    handleSegmentHover,
    total,
    handlePieChartClick,
    handlePendingFollowup,
    piData,
    funnelData,
    hoveredSegment,
    handleRowClick,
  } = props;

  const paletteColors = [
    "#f14c14",
    "#f39c35",
    "#68BC00",
    "#1d7b63",
    "#4e97a8",
    "#4466a3",
  ];

  const COLORS = [
    "#8884d8",
    "#83a6ed",
    "#8dd1e1",
    "#82ca9d",
    "#ffbb00",
    "#ff7f50",
    "#ff69b4",
    "#ba55d3",
    "#cd5c5c",
    "#ffa500",
    "#adff2f",
    "#008080",
  ];

  const chartContainerStyle = {
    margin: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    paddingTop: "20px",
    width: "100%",
    minHeight: "300px",
  };

  const textStyle = {
    color: "#fff",
    fontWeight: "bold",
  };

  const funnelStyle = {
    width: "100%",
    minHeight: "1px",
    fontSize: "12px",
    padding: "10px 0",
    margin: "2px 0",
    color: "black",
    clipPath: "polygon(0 0, 100% 0, 60% 78%, 60% 90%, 40% 100%, 40% 78%)",
    WebkitClipPath: "polygon(0 0, 100% 0, 60% 78%, 60% 90%, 40% 100%, 40% 78%)",
    textAlign: "center",
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        margin: "30px",
        padding: "20px",
      }}
    >
      {/* Customer Stats */}
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {pieChartData.map((data, index) => {
          let percentage = 0;
          if (total !== 0) {
            percentage = (data.value / total) * 100;
          }

          return (
            <Grid
              item
              xs={1}
              sm={2}
              md={3}
              lg={3}
              key={index}
              sx={{ marginTop: "20px" }}
            >
              <Box
                sx={{
                  backgroundColor: COLORS[index % COLORS.length],
                  textAlign: "center",
                }}
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-around"
                >
                  <Box sx={{ marginTop: "10px" }}>
                    <CircularProgressWithLabel
                      variant="determinate"
                      value={percentage}
                      // sx={{ backgroundColor: "#ccc" }}
                    />
                  </Box>
                  <Box sx={{ marginTop: "10px" }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      {data.label}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      {data.value}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
      {/* actual vs forecast and new customer bar chart */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ marginTop: "20px" }}>
          <ResponsiveContainer
            width="100%"
            height={400}
            preserveAspectRatio={false}
          >
            <BarChart
              data={barChartData}
              margin={{ bottom: 30, left: 20, right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="combination"
                tick={{ fontSize: 15 }}
                interval={0} // Display all labels without interval
                angle={-45} // Rotate the labels for better visibility
                textAnchor="end" // Align the labels at the end of the tick
                height={80} // Increase the height of the XAxis to provide more space for labels
              />
              <YAxis />
              <Tooltip />
              <Legend style={{ marginTop: 20 }} />
              <Bar
                dataKey="actual"
                name="Actual"
                fill={COLORS[0]}
                barSize={20}
              />
              <Bar
                dataKey="forecast"
                name="Forecast"
                fill={COLORS[1]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ marginTop: "20px" }}>
          <ResponsiveContainer
            width={"100%"}
            height={400}
            preserveAspectRatio={false}
          >
            <LineChart data={newCustomerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="combination"
                tick={{ fontSize: 15 }}
                interval={0} // Display all labels without interval
                angle={-45} // Rotate the labels for better visibility
                textAnchor="end" // Align the labels at the end of the tick
                height={80} // Increase the height of the XAxis to provide more space for labels
              />
              <YAxis />
              <Tooltip />
              <Legend style={{ marginTop: 20 }} />
              <Line
                type="monotone"
                dataKey="count"
                name="New Customer"
                stroke={COLORS[0]}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
      {/* pod vs lr bar chart and Task pie chart   */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ marginTop: "20px" }}>
          <ResponsiveContainer
            width="100%"
            height={400}
            preserveAspectRatio={false}
          >
            <PieChart onClick={handlePieChartClick}>
              <Pie
                data={pendingTask}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={120} // Increase the outerRadius for a larger pie chart
                fill="#8884d8"
                labelLine={false} // Disable the default label line
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius =
                    innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#fff"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {`${pendingTask[index].value}`}
                    </text>
                  );
                }}
              >
                {pendingTask.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
              <text
                x="50%"
                y={20}
                textAnchor="middle"
                dominantBaseline="middle"
                className="chart-title"
              >
                Pending Tasks
              </text>
            </PieChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ marginTop: "20px" }}>
          <ResponsiveContainer
            width="100%"
            height={400}
            preserveAspectRatio={false}
          >
            <PieChart onClick={handlePendingFollowup}>
              <Pie
                data={pendingFollowup}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={120} // Increase the outerRadius for a larger pie chart
                fill="#8884d8"
                labelLine={false} // Disable the default label line
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius =
                    innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#fff"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={12} // Adjust the font size as needed
                    >
                      {`${pendingFollowup[index].value}`}
                    </text>
                  );
                }}
              >
                {pendingFollowup.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
              <text
                x="50%"
                y={20}
                textAnchor="middle"
                dominantBaseline="middle"
                className="chart-title"
              >
                Pending FollowUp
              </text>
            </PieChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
      {/* Pending follwup and pi data pie chart */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ marginTop: "20px" }}>
          <ResponsiveContainer
            width="100%"
            height={400}
            preserveAspectRatio={false}
          >
            <PieChart>
              <Pie
                data={piData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={120} // Increase the outerRadius for a larger pie chart
                fill="#8884d8"
                labelLine={false} // Disable the default label line
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius =
                    innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#fff"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {`${piData[index].value}`}
                    </text>
                  );
                }}
              >
                {piData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]} // Set color based on index
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
              <text
                x="50%"
                y={20}
                textAnchor="middle"
                dominantBaseline="middle"
                className="chart-title"
              >
                PI Data
              </text>
            </PieChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ marginTop: "20px" }}>
          <div className="funnelChart" style={funnelStyle}>
            <h2 style={{ textAlign: "center", color: "#333" }}>Sales Funnel</h2>
            {funnelData.map((data, index) => (
              <div
                key={index}
                className="chartSegment"
                style={{
                  backgroundColor: paletteColors[index % paletteColors.length],
                  opacity: hoveredSegment === data ? 0.7 : 1,
                }}
                onMouseEnter={() => handleSegmentHover(data)}
                // onMouseLeave={handleSegmentLeave}
                onClick={() => handleRowClick(data)}
              >
                <div
                // className="segmentTitle"
                >
                  <span style={textStyle}>{data.label}</span>&nbsp;
                  <span style={textStyle}>{data.value}</span>
                </div>
              </div>
            ))}
          </div>
        </Grid>
      </Grid>
      {/* sales funnel */}
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ marginTop: "20px" }}>
          <ResponsiveContainer
            width="100%"
            height={400}
            preserveAspectRatio={false}
          >
            <BarChart
              data={monthlyStatus}
              margin={{ bottom: 30, left: 20, right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="combination"
                tick={{ fontSize: 15 }}
                interval={0} // Display all labels without interval
                angle={-45} // Rotate the labels for better visibility
                textAnchor="end" // Align the labels at the end of the tick
                height={80} // Increase the height of the XAxis to provide more space for labels
              />
              <YAxis />
              <Tooltip />
              <Legend style={{ marginTop: 20 }} />
              <Bar
                dataKey="existing_lead"
                name="Existing Lead"
                fill={COLORS[0]}
                barSize={20}
              />
              <Bar
                dataKey="new_lead"
                name="New Lead"
                fill={COLORS[1]}
                barSize={20}
              />
              <Bar
                dataKey="customer"
                name="Customer"
                fill={COLORS[2]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ marginTop: "20px" }}>
          <ResponsiveContainer
            width="100%"
            height={400}
            preserveAspectRatio={false}
          >
            <BarChart
              data={weeklyStatus}
              margin={{ bottom: 30, left: 20, right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="combination"
                tick={{ fontSize: 15 }}
                interval={0} // Display all labels without interval
                angle={-45} // Rotate the labels for better visibility
                textAnchor="end" // Align the labels at the end of the tick
                height={80} // Increase the height of the XAxis to provide more space for labels
              />
              <YAxis />
              <Tooltip />
              <Legend style={{ marginTop: 20 }} />
              <Bar
                dataKey="existing_lead"
                name="Existing Lead"
                fill={COLORS[0]}
                barSize={20}
              />
              <Bar
                dataKey="new_lead"
                name="New Lead"
                fill={COLORS[1]}
                barSize={20}
              />
              <Bar
                dataKey="customer"
                name="Customer"
                fill={COLORS[2]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ marginTop: "20px" }}>
          <ResponsiveContainer
            width="100%"
            height={400}
            preserveAspectRatio={false}
          >
            <BarChart
              data={dailyStatus}
              margin={{ bottom: 30, left: 20, right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="combination"
                tick={{ fontSize: 15 }}
                interval={0} // Display all labels without interval
                angle={-45} // Rotate the labels for better visibility
                textAnchor="end" // Align the labels at the end of the tick
                height={80} // Increase the height of the XAxis to provide more space for labels
              />
              <YAxis />
              <Tooltip />
              <Legend style={{ marginTop: 20 }} />
              <Bar
                dataKey="existing_lead"
                name="Existing Lead"
                fill={COLORS[0]}
                barSize={20}
              />
              <Bar
                dataKey="new_lead"
                name="New Lead"
                fill={COLORS[1]}
                barSize={20}
              />
              <Bar
                dataKey="customer"
                name="Customer"
                fill={COLORS[2]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ marginTop: "20px" }}>
          <ResponsiveContainer
            width="100%"
            height={400}
            preserveAspectRatio={false}
          >
            <BarChart
              width={600}
              height={300}
              data={pendingDescription}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" width={300} />
              <YAxis
                dataKey="name"
                type="category"
                // angle={-45}
                textAnchor="end"
                interval={0}
                width={300}
                tick={{ fontSize: 15 }} // Adjust font size of tick labels
                tickLine={false} // Disable tick lines
                tickMargin={10} // Add margin to tick labels
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={COLORS[0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="indeterminate" {...props} size={60} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="#ffffff">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};
