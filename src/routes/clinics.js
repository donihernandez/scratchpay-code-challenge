const express = require("express");
const router = express.Router();

router.post("/search", async (req, res) => {
  try {
    const { name, clinicName, availability, opening, stateName, stateCode } =
      req.body;
    let clinics = [];

    let dentalClinics = await axios
      .get(
        "https://storage.googleapis.com/scratchpay-code-challenge/dental-clinics.json"
      )
      .catch((err) => {
        return res.status(500).send(err);
      });
    let vetClinics = await axios
      .get(
        "https://storage.googleapis.com/scratchpay-code-challenge/vet-clinics.json"
      )
      .catch((err) => {
        return res.status(500).send(err);
      });

    if (name || availability || stateName) {
      dentalClinics = dentalClinics.data.filter((clinic) => {
        let results = [];
        if (
          (name && clinic.name.toLowerCase().includes(name.toLowerCase())) ||
          (availability && (clinic.availability.from === opening.from || clinic.availability.to === opening.to)) ||
          (stateName &&
            clinic.stateName.toLowerCase().includes(stateName.toLowerCase()))
        ) {
          results.push(clinic);
        }
        return results;
      });
    }
    if (clinicName || opening || stateCode) {
      vetClinics = vetClinics.data.filter((clinic) => {
        let results = [];
        if (
          (clinicName &&
            clinic.clinicName
              .toLowerCase()
              .includes(clinicName.toLowerCase())) ||
          (opening && (clinic.opening.from === opening.from 
            || clinic.opening.to === opening.to)) ||
          (stateCode && clinic.stateCode === stateCode)
        ) {
          results.push(clinic);
        }
        return results;
      });
    }

    clinics = [...dentalClinics.data, ...vetClinics.data];

    res.status(200).json({
        clinics
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
