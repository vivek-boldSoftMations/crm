import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
  },
  section: {
    marginBottom: 10,
    borderBottomWidth: 1, // Add a border at the bottom
    borderBottomColor: "black", // Border color (you can change it)
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subheading: {
    fontSize: 16, // Adjust the font size here
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  underline: {
    textDecoration: "underline",
  },
  keyValueContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginRight: 20,
  },
  keyValueText: {
    fontSize: 12,
    marginBottom: 5,
  },

  // Style for the container of the data entry
  dataEntryContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Keep this if you still want wrapping for very long content
    alignItems: "flex-start", // Align items to the start of the container
    marginBottom: 5,
  },

  // Use a monospace font for the invoice numbers
  dataEntryText: {
    fontFamily: "Courier", // This is an example, use a monospace font available in your app
    fontSize: 12,
    marginBottom: 3,
    marginRight: 5, // Add some right margin to each invoice number
  },

  entryContainer: {
    flexDirection: "row",
    marginBottom: 3,
  },
  // Style for the key label text
  textKey: {
    color: "#666666", // Lighter text color for keys
    fontWeight: "bold", // if you want the keys to be bold
    fontSize: 12,
  },
  // Style for the value text
  textValue: {
    color: "#000000", // Darker text color for values
    fontSize: 12,
  },
  // Separate style for the colon to manually add space
  colonStyle: {
    fontSize: 12,
    marginRight: 2, // Space after the colon
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20, // Add space above the signature section
  },
  signatureBlock: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginRight: 10, // Space between the signature blocks
    alignItems: "center", // Align items in the center horizontally
    justifyContent: "center", // Align items in the center vertically
  },
  signatureText: {
    fontSize: 12,
    marginTop: 5, // Space above the email text
    marginBottom: 5, // Space below the email text
    alignSelf: "center", // Center the text element within the block
  },
  emailText: {
    alignSelf: "center", // This ensures the email is centered within the block
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  tableCell: {
    minWidth: 100, // adjust the width as necessary
    maxWidth: 100, // adjust the width as necessary
  },
  tableCellKey: {
    fontSize: 12,
    fontWeight: "bold",
  },
  tableCellValue: {
    fontSize: 12,
    flexWrap: "wrap", // or change to 'nowrap' to prevent wrapping
    marginRight: 2, // spacing between cells
  },
});

const KeyValueText = ({ label, value }) => (
  <View style={styles.keyValueContainer}>
    <Text style={styles.keyValueText}>
      {label}: {value}
    </Text>
  </View>
);

const DataEntry = ({ entries }) => (
  <View style={styles.dataEntryContainer}>
    {entries.map((entry, index) => (
      <View key={index} style={styles.entryContainer}>
        <Text style={styles.textKey}>{entry.key}</Text>
        <Text style={styles.colonStyle}>:</Text>
        {/* Check if entry.value is an array before joining, if not render as is */}
        <Text style={styles.textValue}>
          {Array.isArray(entry.value) ? entry.value.join(", ") : entry.value}
        </Text>
        {index < entries.length - 1 && <Text> </Text>}
      </View>
    ))}
  </View>
);

export const DailySalesReviewPDF = ({ recordForEdit, reviewData }) => {
  const {
    call_performance,
    existing_customer,
    followup_summary,
    pi_summary,
    sales_summary,
    new_customer_summary,
    no_order_customer,
    conversion_ratio,
    pending_payments,
    top_customer,
    top_forecast_customer,
    today_missed_lead_order,
    customer_estimated_order,
    today_lead_estimate_order,
    today_missed_customer_order,
  } = reviewData;

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header Section */}
        <View style={styles.section}>
          <Text style={styles.heading}>Sales Review</Text>
        </View>

        {/* Call Performance Section  */}
        <View style={styles.section}>
          <Text style={styles.subheading}>Call Performance</Text>
          <View style={styles.keyValueContainer}>
            <KeyValueText label="New Leads          " />
            <KeyValueText
              label="1) Month "
              value={call_performance ? call_performance.new_leads.month : 0}
            />
            <KeyValueText
              label="2) Today "
              value={call_performance ? call_performance.new_leads.today : 0}
            />
            <KeyValueText
              label="3) Last 7 Days "
              value={
                call_performance ? call_performance.new_leads.last_7_days : 0
              }
            />
          </View>
          <View style={styles.keyValueContainer}>
            <KeyValueText label="Existing Leads     " />
            <KeyValueText
              label="1) Month "
              value={
                call_performance ? call_performance.existing_leads.month : 0
              }
            />
            <KeyValueText
              label="2) Today "
              value={
                call_performance ? call_performance.existing_leads.today : 0
              }
            />
            <KeyValueText
              label="3) Last 7 Days "
              value={
                call_performance
                  ? call_performance.existing_leads.last_7_days
                  : 0
              }
            />
          </View>
          <View style={styles.keyValueContainer}>
            <KeyValueText label="Existing Customer " />
            <KeyValueText
              label="1) Month "
              value={
                call_performance ? call_performance.existing_customer.month : 0
              }
            />
            <KeyValueText
              label="2) Today "
              value={
                call_performance ? call_performance.existing_customer.today : 0
              }
            />
            <KeyValueText
              label="3) Last 7 Days "
              value={
                call_performance
                  ? call_performance.existing_customer.last_7_days
                  : 0
              }
            />
          </View>
        </View>

        {/* Existing Customer Section */}
        <View style={styles.section}>
          <Text style={styles.subheading}>Existing Customer</Text>
          <View style={styles.keyValueContainer}>
            <KeyValueText
              label="1) Pending Kyc"
              value={existing_customer ? existing_customer.pending_kyc : 0}
            />
            <KeyValueText
              label="2) Dead Customer"
              value={existing_customer ? existing_customer.dead_customer : 0}
            />
            <KeyValueText
              label="3) Billed Customer"
              value={existing_customer ? existing_customer.billed_customer : 0}
            />
            <KeyValueText
              label="4) Assigned Customer"
              value={
                existing_customer ? existing_customer.assigned_customer : 0
              }
            />
          </View>
          <View style={styles.keyValueContainer}>
            <KeyValueText
              label="5) Pending Potential"
              value={
                existing_customer ? existing_customer.pending_potential : 0
              }
            />
            <KeyValueText
              label="6) Connected Customer"
              value={
                existing_customer ? existing_customer.connected_customer : 0
              }
            />
            <KeyValueText
              label="7) Not Billed Customer"
              value={
                existing_customer ? existing_customer.not_billed_customer : 0
              }
            />
          </View>
        </View>

        {/* followup summary Section */}
        <View style={styles.section}>
          <Text style={styles.subheading}>Follow-up Summary</Text>
          <View style={styles.keyValueContainer}>
            <KeyValueText label="Today" value={followup_summary.today} />
            <KeyValueText
              label="Overdue Task"
              value={followup_summary.overdue_task}
            />
            <KeyValueText
              label="Today Hot Lead"
              value={followup_summary.today_hot_lead}
            />
          </View>
          <View style={styles.keyValueContainer}>
            <KeyValueText
              label="Overdue Follow-up"
              value={followup_summary.overdue_followup}
            />
            <KeyValueText
              label="Today Missed Follow-up"
              value={followup_summary.today_missed_followup}
            />
          </View>
        </View>

        {/* PI Summary Section */}
        <View style={styles.section}>
          <Text style={styles.subheading}>Pi Summary</Text>
          <View style={styles.keyValueContainer}>
            <KeyValueText label="1) drop" value={pi_summary.drop} />
            <KeyValueText label="2) raised" value={pi_summary.raised} />
            <KeyValueText label="3) month_drop" value={pi_summary.month_drop} />
          </View>
        </View>

        {/* Sales Summary Section */}
        <View style={styles.section}>
          <Text style={styles.subheading}>Sales Summary</Text>
          {sales_summary.map((summary, index) => (
            <DataEntry
              key={index}
              entries={[
                { key: "Description", value: summary.description },
                {
                  key: "Forecast Quantity",
                  value: summary.forecast_quantity.toString(),
                },
                { key: "Unit", value: summary.unit },
                {
                  key: "Sales Quantity",
                  value: summary.sales_quantity.toString(),
                },
                { key: "Daily Target", value: summary.daily_target.toString() },
                {
                  key: "Month Sales Invoice",
                  value: summary.monthly_sales_invoice.join(", "),
                },
                {
                  key: "Today Sales Invoice",
                  value: summary.today_sales_invoice.join(", "),
                },
              ]}
            />
          ))}
        </View>

        {/* New Customer Summary Section */}
        <View style={styles.section}>
          <Text style={styles.subheading}>New Customer Summary</Text>
          <View style={styles.keyValueContainer}>
            <KeyValueText
              label="1) Month"
              value={new_customer_summary ? new_customer_summary.month : 0}
            />
            <KeyValueText
              label="2) Last Month"
              value={new_customer_summary ? new_customer_summary.last_month : 0}
            />
            <KeyValueText
              label="3) Sales Invoice"
              value={
                new_customer_summary ? new_customer_summary.sales_invoice : 0
              }
            />
          </View>
        </View>

        {/* No Order Customer Section */}
        <View style={styles.section}>
          <Text style={styles.subheading}>No Order Customer</Text>
          <View style={styles.keyValueContainer}>
            <KeyValueText
              label="0-30 days"
              value={no_order_customer["0-30_days"]}
            />
            <KeyValueText
              label="30-59 days"
              value={no_order_customer["30-59_days"]}
            />
            <KeyValueText
              label="60-89 days"
              value={no_order_customer["60-89_days"]}
            />
          </View>

          <View style={styles.keyValueContainer}>
            <KeyValueText
              label="90-119 days"
              value={no_order_customer["90-119_days"]}
            />
            <KeyValueText
              label="Over 120 days"
              value={no_order_customer["over_120_days"]}
            />
          </View>
        </View>

        {/* Conversion Ratio Section */}
        <View style={styles.section}>
          <Text style={styles.subheading}>Conversion Ratio</Text>
          <View style={styles.keyValueContainer}>
            <KeyValueText
              label="Lead Count"
              value={conversion_ratio ? conversion_ratio.lead_count : 0}
            />
            <KeyValueText
              label="New Customer"
              value={conversion_ratio ? conversion_ratio.new_customer : 0}
            />
            <KeyValueText
              label="Conversion Ratio"
              value={conversion_ratio ? conversion_ratio.conversion_ratio : 0}
            />
          </View>
        </View>

        {/* Pending Payment Section */}
        <View style={styles.section}>
          <Text style={styles.subheading}>Pending Payment</Text>
          {pending_payments.map((summary, index) => (
            <DataEntry
              key={index}
              entries={[
                { key: "PI Number", value: summary.pi_number },
                {
                  key: "Customer",
                  value: summary.customer ? summary.customer : "NA",
                },
                { key: "Date", value: summary.date },
                {
                  key: "Amount",
                  value: summary.amount.toString(),
                },
                { key: "Status", value: summary.status },
              ]}
            />
          ))}
        </View>

        {/* Top Customer Section */}
        <View style={styles.section}>
          <Text style={styles.subheading}>Top Customer</Text>
          {top_customer.map((customer, index) => (
            <DataEntry
              key={index}
              entries={[
                { key: `Customer ${index + 1}`, value: customer.customer },
                { key: "Amount", value: customer.amount.toString() },
                {
                  key: "Billed this Month",
                  value: customer.billedThisMonth ? "Yes" : "No",
                },
              ]}
            />
          ))}
        </View>

        {/* Top Forecast Customer */}
        <View style={styles.section}>
          <Text style={styles.subheading}>Top Forecast Customer</Text>
          {top_forecast_customer.map((customer, index) => (
            <DataEntry
              key={index}
              entries={[
                { key: `Customer ${index + 1}`, value: customer.customer },
                { key: "Amount", value: customer.amount.toString() },
                {
                  key: "Billed this Month",
                  value: customer.billedThisMonth ? "Yes" : "No",
                },
              ]}
            />
          ))}
        </View>

        {/* Today Missed Lead Order */}
        <View style={styles.section}>
          <Text style={styles.subheading}>Today Missed Lead Order</Text>
          {today_missed_lead_order.map((order, index) => (
            <DataEntry
              key={index}
              entries={[
                { key: "Product", value: order.product },
                {
                  key: "Customer",
                  value: order.customer ? order.customer : "NA",
                },
                { key: "Forecast", value: order.forecast },
                {
                  key: "Description",
                  value: order.description,
                },
                { key: "Estimated Date", value: order.estimated_date },
              ]}
            />
          ))}
        </View>

        {/* Customer Estimated Order */}
        <View style={styles.section}>
          <Text style={styles.subheading}>Customer Estimated Order</Text>
          {customer_estimated_order.map((order, index) => (
            <DataEntry
              key={index}
              entries={[
                {
                  key: "Customer",
                  value: order.customer ? order.customer : "NA",
                },
                { key: "Quantity", value: order.quantity },
                {
                  key: "Description",
                  value: order.description,
                },
                { key: "Estimated Date", value: order.estimated_date },
              ]}
            />
          ))}
        </View>

        {/* Today Lead Estimate Order */}
        <View style={styles.section}>
          <Text style={styles.subheading}>Today Lead Estimate Order</Text>
          {today_lead_estimate_order.map((order, index) => (
            <DataEntry
              key={index}
              entries={[
                { key: "Product", value: order.product },
                {
                  key: "Customer",
                  value: order.customer ? order.customer : "NA",
                },
                { key: "Forecast", value: order.forecast },
                {
                  key: "Description",
                  value: order.description,
                },
                { key: "Estimated Date", value: order.estimated_date },
              ]}
            />
          ))}
        </View>

        {/* Today Missed Customer Order */}
        <View style={styles.section}>
          <Text style={styles.subheading}>Today Missed Customer Order</Text>
          {today_missed_customer_order.map((order, index) => (
            <DataEntry
              key={index}
              entries={[
                { key: "Product", value: order.product },
                {
                  key: "Customer",
                  value: order.customer ? order.customer : "NA",
                },
                { key: "Forecast", value: order.forecast },
                {
                  key: "Description",
                  value: order.description,
                },
                { key: "Estimated Date", value: order.estimated_date },
              ]}
            />
          ))}
        </View>

        {/* Signature section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureText}>Sales Person</Text>
            <Text style={[styles.signatureText, styles.emailText]}>
              {recordForEdit.sales_person}
            </Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureText}>Reviewer</Text>
            <Text style={[styles.signatureText, styles.emailText]}>
              {recordForEdit.reviewer}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
