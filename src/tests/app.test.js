const request = require("supertest");
const app = require("../app");

describe("Server Running", () => {
  it("should respond with a 200 status code", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });

  it("should retrieve a Welcome Text", async () => {
    const response = await request(app).get("/");
    expect(response.text).toBe("Welcome to the API");
  });
});

describe("POST /clinics/search/", () => {
  it("shold return status code 500 if connection is sucessfull", async () => {
    const response = await request(app).post("/clinics/search").send({});
    expect(response.statusCode).toBe(500);
  });

  it("should return all clinics if search filters are not received.", async () => {
    const dentalClinics = require("../mock_data/dental-clinics.json");
    const vetClinics = require("../mock_data/vet-clinics.json");

    const clinics = [...dentalClinics, ...vetClinics];

    const response = await request(app).post("/clinics/search");
    expect(response.statusCode).toBe(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(response.body).toHaveProperty("clinics");
    expect(response.body.clinics).toEqual(clinics);
  });

  it("should return only dental clinics filtered by name", async () => {
    const dentalClinic = {
      name: "Good Health Home",
      stateName: "Alaska",
      availability: {
        from: "10:00",
        to: "19:30",
      },
    };

    const response = await request(app).post("/clinics/search").send({
      name: "Good Health Home",
    });
    expect(response.statusCode).toBe(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(response.body).toHaveProperty("clinics");
    expect(response.body.clinics[0]).toEqual(dentalClinic);
  });

  it("should return clinics filtered by multiple parameters", async () => {
    const vetClinics = [
      {
        name: "Good Health Home",
        stateName: "Alaska",
        availability: {
          from: "10:00",
          to: "19:30",
        },
      },
      {
        name: "Tufts Medical Center",
        stateName: "Kansas",
        availability: {
          from: "10:00",
          to: "23:00",
        },
      },
    ];
    const response = await request(app)
      .post("/clinics/search")
      .send({
        name: "Good Health Home",
        availability: {
          from: "10:00",
          to: "23:00",
        },
      });

    expect(response.statusCode).toBe(200);
    expect(res.type).toEqual(expect.stringContaining("json"));
    expect(response.body).toHaveProperty("clinics");
    expect(response.body.clinics).toEqual(vetClinics);
  });
});
