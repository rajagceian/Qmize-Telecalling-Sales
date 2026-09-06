const { Candidate } = require("../models/candidate");
const { ApiError } = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { uploadOnCloudnary } = require("../utils/cloudinary");

async function candidateDetails(req, res) {
  try {
    const {
      name,
      email,
      phoneNumber,
      whatsappNumber,
      collegeName,
      registrationNumber,
      qualification,
      passoutYear,
      experience,
      hindiCommunication,
    } = req.body;

    const isExist = await Candidate.findOne({ registrationNumber });

    if (isExist) {
      throw new ApiError(400, "You have already filled the form");
    }

    const fixedSize = 5 * 1024 * 1024; // max 5MB

    // const photoLocalPath = req.files?.photo[0]?.path;
    const resumeLocalPath = req.files?.resume[0]?.path;

    // if (!photoLocalPath) {
    //   throw new ApiError(400, "Photo is required");
    // }

    if (!resumeLocalPath) {
      throw new ApiError(400, "Resume is required");
    }

    if (req.files?.resume[0].size > fixedSize) {
      throw new ApiError(400, "File size should be less than 5MB");
    }

    //------ upload on cloudinary ----------
    // const photo = await uploadOnCloudnary(photoLocalPath);
    const resume = await uploadOnCloudnary(resumeLocalPath);

    // if (!photo) {
    //   throw new ApiError(400, "Photo is required");
    // }

    if (!resume) {
      throw new ApiError(400, "Resume is required");
    }

    const candidate = await Candidate.create({
      name,
      email,
      phoneNumber,
      whatsappNumber,
      collegeName,
      registrationNumber,
      qualification,
      passoutYear,
      experience,
      hindiCommunication,
      resume: resume.url,
    });

    return res.status(201).json({
      message: "Information collected successfully",
      applicationId: candidate._id,
    });
  } catch (err) {
    console.log("Error in controller : ", err.message);

    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message =
      err instanceof ApiError ? err.message : "Internal Server Problem";

    return res.status(statusCode).json({
      message,
    });
  }
}

module.exports = { candidateDetails };
