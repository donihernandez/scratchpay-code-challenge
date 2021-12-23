const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const {
  default: axios
} = require('axios');

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});


app.post('/searchClinic', async (req, res) => {
  try {
    const {
      name,
      clinicName,
      availability,
      opening,
      stateName,
      stateCode
    } = req.body;
    let clinics = [];

    let dentalClinics = await axios.get('https://storage.googleapis.com/scratchpay-code-challenge/dental-clinics.json').catch(err => console.log(err));;
    let vetClinics = await axios.get('https://storage.googleapis.com/scratchpay-code-challenge/vet-clinics.json').catch(err => console.log(err));


    if (name || availability || stateName) {
      dentalClinics = dentalClinics.data.filter(clinic => {
        let results = [];
        if ((name && clinic.name.toLowerCase().includes(name.toLowerCase())) ||
          (availability && clinic.availability === availability) ||
          (stateName && clinic.stateName.toLowerCase().includes(stateName.toLowerCase()))) {
          results.push(clinic);
        }
        return results;
      });
    }
    if (clinicName || opening || stateCode) {
      vetClinics = vetClinics.data.filter(clinic => {
        let results = [];
        if ((clinicName && clinic.clinicName.toLowerCase().includes(clinicName.toLowerCase())) ||
          (opening && clinic.opening === opening) ||
          (stateCode && clinic.stateCode === stateCode)) {
          results.push(clinic);
        }
        return results;
      });
    }

    clinics = [...dentalClinics.data, ...vetClinics.data];

    res.status(200).send(clinics);
  } catch (error) {
    res.status(500).send(error);
  }
});


app.listen(3000, () => console.log('Server started on port 3000'));