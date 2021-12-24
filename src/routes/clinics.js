const express = require("express");
const router = express.Router();
const axios = require('axios');

router.post("/search", async (req, res) => {
  try {
    const {
      name,
      clinicName,
      availability,
      opening,
      stateName,
      stateCode
    } =
    req.body;
    let isVetSelected = false;
    let isDentalSelected = false;
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

    dentalClinics = dentalClinics.data;
    vetClinics = vetClinics.data;

    if (name || availability || stateName) {
      isDentalSelected = true;
      dentalClinics = dentalClinics.filter((clinic) => {
        if (
          (name && clinic.name.toLowerCase() === name.toLowerCase()) ||
          (availability && (clinic.availability.from === availability.from || clinic.availability.to === availability.to)) ||
          (stateName &&
            clinic.stateName.toLowerCase() === stateName.toLowerCase())
        ) {
          return clinic;
        }
      });
    }
    if (clinicName || opening || stateCode) {
      isVetSelected = true;
      vetClinics = vetClinics.filter((clinic) => {
        if (
          (clinicName &&
            clinic.clinicName
            .toLowerCase()
             === clinicName.toLowerCase()) ||
          (opening && (clinic.opening.from === opening.from ||
            clinic.opening.to === opening.to)) ||
          (stateCode && clinic.stateCode === stateCode)
        ) {
          return clinic;
        }
      });
    }

    if (isDentalSelected && !isVetSelected) {
      clinics = [...dentalClinics]
    } else if (!isDentalSelected && isVetSelected) {
      clinics = [...vetClinics];
    } else {
      clinics = [...dentalClinics, ...vetClinics];
    }

    return res.status(200).send({
      clinics
    });

  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
