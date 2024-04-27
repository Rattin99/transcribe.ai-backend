import moment from "moment";
import pool from "../../config/db";
import { generateUUID } from "../../utils/generateUUID";
const insertMeetings = async (req) => {
    try {
      const userId = req.user.id;
      const meetingName = 'Meeting'
      const transcribe='Hello this is our first meeting.Hope all are you doing good.'
      const summary='Hello this is summary of the meeting'
      const notes='Here are the notes for the meeting'
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
      await insertNotes('017c1e2a1cc9451694e916724347a8f4',notes)
      await insertSummary('017c1e2a1cc9451694e916724347a8f4',summary)
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
// const getAllData = async (req) => {
//     try {
//         const userId=req.user.id;
//         // Array to store the result from each query
//         const userData = [];

//         // Retrieve data from transcribe_data table
//         const transcribeQuery = `
//             SELECT transcribe_data.*, user.id
//             FROM transcribe_data
//             JOIN user ON transcribe_data.user_id = user.id
//             WHERE user.id = ?
//         `;
//         const transcribeData = await pool.query(transcribeQuery, [userId]);
//         userData.push(transcribeData[0]);

//         // Retrieve data from summary_data table
//         const summaryQuery = `
//             SELECT summary_data.*, user.id
//             FROM summary_data
//             JOIN user ON summary_data.user_id = user.id
//             WHERE user.id = ?
//         `;
//         const summaryResult = await pool.query(summaryQuery, [userId]);
//         userData.push({ summaryData: summaryResult[0] });

//         // Retrieve data from notes_data table
//         const notesQuery = `
//             SELECT notes_data.*, user.id
//             FROM notes_data
//             JOIN user ON notes_data.user_id = user.id
//             WHERE user.id = ?
//         `;
//         const notesResult = await pool.query(notesQuery, [userId]);
//         userData.push({ notesData: notesResult[0]});
//         return userData;
//     } catch (error) {
//         throw new Error("Error retrieving user data: " + error.message);
//     }
// }

const getAllData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Retrieve user meetings for the specific user
    const [userMeetingsRows] = await pool.query('SELECT * FROM user_meetings WHERE user_id = ?', [userId]);

    // Array to store the result
    const result = [];

    // Iterate over each user meeting
    for (const userMeeting of userMeetingsRows) {
      const userData = {
        meetingName: userMeeting.meeting_name,
        transcribeData: [],
        summaryData:[],
        notesData:[]
      };

      // Retrieve corresponding transcribe data for the user meeting
      const [transcribeDataRows] = await pool.query('SELECT * FROM transcribe_data WHERE meeting_id = ?', [userMeeting.id]);
      const [summaryDataRows] = await pool.query('SELECT * FROM summary_data WHERE meeting_id = ?', [userMeeting.id]);
      const [notesDataRows] = await pool.query('SELECT * FROM notes_data WHERE meeting_id = ?', [userMeeting.id]);
      // Add transcribe data to userData
      userData.transcribeData = transcribeDataRows;
      userData.summaryData = summaryDataRows;
      userData.notesData = notesDataRows;

      // Push userData to result array
      result.push(userData);
    }

   return result
  } catch (error) {
    console.log("Error retrieving data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const transcribeService = {
  insertTranscribe,
  insertNotes,
  insertSummary,
  getAllData,
  insertMeetings 
};
