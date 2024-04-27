import httpStatus from "http-status";
import { transcribeService } from "./transCribeService";

const userMeetingInsertController = async (req, res) => {
  try {
    const result = await transcribeService.insertMeetings(
      req
    );
    res.status(httpStatus.OK).json({
      success: true,
      message: "User meeting name inserted successfully.",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const transcribeDataInsertController = async (req, res) => {
  try {
    const id=req.params.id;
    const transcribeData = req.body.transcribeData;
    const result = await transcribeService.insertTranscribe(
      id,
      transcribeData
    );
    res.status(httpStatus.OK).json({
      success: true,
      message: "Transcribe data inserted successfully.",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const notesDataInsertController = async (req, res) => {
  try {
    const transcribeData = req.body.notes;
    const result = await transcribeService.insertNotes(req, transcribeData);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Notes data inserted successfully.",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const summaryDataInsertController = async (req, res) => {
  try {
    const transcribeData = req.body.summary;
    const result = await transcribeService.insertSummary(req, transcribeData);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Summary data inserted successfully.",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

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

export const transcribeController = {
  transcribeDataInsertController,
  notesDataInsertController,
  summaryDataInsertController,
  getAllData,
  userMeetingInsertController
};
