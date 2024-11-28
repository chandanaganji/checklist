const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.static('public'));

const port = 3000;
const input_api="http://qa-gb.api.dynamatix.com:3100/api/applications/getApplicationById/67339ae56d5231c1a2c63639"
// List of checklist rules
const checklistRules = [
  {
    name: "Valuation Fee Paid",
    evaluate: (data) => data.isValuationFeePaid === true,
  },
  {
    name: "UK Resident",
    evaluate: (data) => data.isUkResident === true,
  },
  {
    name: "Risk Rating Medium",
    evaluate: (data) => data.riskRating === "Medium",
  },
  {
    name: "LTV Below 60%",
    evaluate: (data) => {
      const ltv = (data.loanRequired / data.purchasePrice) * 100;
      return ltv < 60;
    },
    
  },
  /*{
    name: "Credit Score Above 700",
    evaluate: (data) => data.creditScore > 700
  },
  new rules should be attach here  */
  
];

// fetching the  application data
const fetchApplicationData = async () => {
  try {
    const response = await axios.get(input_api);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// evaluating the checklist
const evaluateChecklist = (data) => {
  return checklistRules.map(rule => {
    const result = rule.evaluate(data);
    return {
      rule: rule.name,
      status: result ? 'Passed' : 'Failed'
    };
  });
};

// evaluation results route
app.get('/dashboard', async (req, res) => {
  try {
    const data = await fetchApplicationData();
    const evaluationResults = evaluateChecklist(data);
    res.json(evaluationResults); 
  } catch (error) {
    res.status(500).send('Error occurred while fetching application data.');
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});