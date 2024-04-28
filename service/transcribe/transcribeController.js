import httpStatus from "http-status";
import { transcribeService } from "./transCribeService";


const getAllData = async (req, res) => {
  try {
    const result = await transcribeService.getAllData(req);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Retireve all data successfully.",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const getSingleDataController = async (req, res) => {
  try {
    const id=req.params.id;
    const result = await transcribeService.getSingleData(req,id);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Retireve single data successfully.",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const updateUserMeetingController = async (req, res) => {
  try {
    const id=req.params.id;
    const meetingName = req.body.meetingName;
    const result = await transcribeService.updateMeetingName(
      id,meetingName,req
    );
    res.status(httpStatus.OK).json({
      success: true,
      message: "User meeting name updated successfully.",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
export const transcribeController = {
  getAllData,
  getSingleDataController,
  updateUserMeetingController
};
