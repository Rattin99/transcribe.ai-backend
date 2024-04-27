import moment from "moment";
import pool from "../../config/db";
import { generateUUID } from "../../utils/generateUUID";
const insertMeetings = async (req) => {
    try {
      const userId = req.user.id;
      const meetingName = 'Meeting'
      const transcribe='Hello this is our first meeting.Hope all are you doing good.'
      if (!userId) {
        return "No user found";
      }
      const id=generateUUID()
      // Generate meeting name like "Meeting 1 current date"
      const currentDate = moment().format('YYYY-MM-DD HH:mm:ss')
      const formattedMeetingName = `${meetingName} ${currentDate}`;
  
      const values = [id,userId, formattedMeetingName];
      const [results] = await pool.execute(
        `INSERT INTO user_meetings(id,user_id, meeting_name) VALUES (?,?,?)`,
        values
      );
      await insertTranscribe(id,transcribe)
      return id;
    } catch (error) {
      console.log(error.message);
      throw new Error("Internal error");
    }
  };
  
const insertTranscribe = async (id, transcribe) => {
  try {
    const userId = id
    const mainId=generateUUID()
    const values = [mainId,userId, transcribe];
    const [results] = await pool.execute(
      `INSERT INTO transcribe_data (id,meeting_id,transcribe) VALUES (?,?,?)`,
      values
    );
    return results;
  } catch (error) {
    console.log(error.message);
    throw new Error("Internal error");
  }
};
const insertNotes = async (req, notes) => {
  try {
    const userId = req.user.id;
    const values = [userId, notes];
    const [results] = await pool.execute(
      `INSERT INTO notes_data (user_id,notes) VALUES (?,?)`,
      values
    );
    return results;
  } catch (error) {
    console.log(error.message);
    throw new Error("Internal error");
  }
};
const insertSummary = async (req, summary) => {
  try {
    const userId = req.user.id;
    const values = [userId, summary];
    const [results] = await pool.execute(
      `INSERT INTO summary_data (user_id,summary) VALUES (?,?)`,
      values
    );
    return results;
  } catch (error) {
    console.log(error.message);
    throw new Error("Internal error");
  }
};
//get all data 
const getAllData = async (req) => {
    try {
        const userId=req.user.id;
        console.log(userId)
        // Array to store the result from each query
        const userData = [];

        // Retrieve data from transcribe_data table
        const transcribeQuery = `
            SELECT transcribe_data.*, user.id
            FROM transcribe_data
            JOIN user ON transcribe_data.user_id = user.id
            WHERE user.id = ?
        `;
        const transcribeResult = await pool.query(transcribeQuery, [userId]);
        userData.push({ transcribeData: transcribeResult[0] });

        // Retrieve data from summary_data table
        const summaryQuery = `
            SELECT summary_data.*, user.id
            FROM summary_data
            JOIN user ON summary_data.user_id = user.id
            WHERE user.id = ?
        `;
        const summaryResult = await pool.query(summaryQuery, [userId]);
        userData.push({ summaryData: summaryResult[0] });

        // Retrieve data from notes_data table
        const notesQuery = `
            SELECT notes_data.*, user.id
            FROM notes_data
            JOIN user ON notes_data.user_id = user.id
            WHERE user.id = ?
        `;
        const notesResult = await pool.query(notesQuery, [userId]);
        userData.push({ notesData: notesResult[0]});
        return userData;
    } catch (error) {
        throw new Error("Error retrieving user data: " + error.message);
    }
}
export const transcribeService = {
  insertTranscribe,
  insertNotes,
  insertSummary,
  getAllData,
  insertMeetings 
};
