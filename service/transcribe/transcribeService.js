import moment from "moment";
import pool from "../../config/db";
import { generateUUID } from "../../utils/generateUUID";
const insertMeetings = async (req) => {
    try {
      const userId = req.user.id;
      const meetingName = 'Meeting'
      if (!userId) {
        return "No user found";
      }
      const id=generateUUID()
      // Generate meeting name like "Meeting 1 current date"
      const currentDate = moment().format('YYYY-MM-DD HH:mm')
      const formattedMeetingName = `${meetingName}`;
      
      const values = [id,userId, formattedMeetingName,currentDate];
      console.log(values)
      const [results] = await pool.execute(
        `INSERT INTO user_meetings(id,user_id,meeting_name,dateTime) VALUES (?,?,?,?)`,
        values
      );
      return id;
    } catch (error) {
      console.log(error.message);
      throw new Error("Internal error");
    }
};
const insertTranscribe = async (id, transcribe) => {
  try {
    const meetingId = id
    const mainId=generateUUID()
    const values = [mainId,meetingId, transcribe];
    console.log(values)
    const [results] = await pool.execute(
      `INSERT INTO transcribe_data (id,meeting_id,transcribe) VALUES (?,?,?)`,
      values
    );
    return {
    success:true,
    message:'Transcribe inserted successfully',
    data:results.insertId
    }
  } catch (error) {
    console.log(error.message);
    throw new Error("Internal error");
  }
};
const insertNotes = async (id, notes) => {
  try {
    // Check if the meeting ID already exists in the notes_data table
    const [existingNote] = await pool.query('SELECT * FROM notes_data WHERE meeting_id = ?', [id]);
    
    if (existingNote.length > 0) {
      // If the meeting ID exists, update the notes field
      const [results] = await pool.execute(
        `UPDATE notes_data SET notes = ? WHERE meeting_id = ?`,
        [notes, id]
      );
      return results;
    } else {
      // If the meeting ID does not exist, insert new notes
      const mainId = generateUUID();
      const values = [mainId, id, notes];
      const [results] = await pool.execute(
        `INSERT INTO notes_data (id, meeting_id, notes) VALUES (?, ?, ?)`,
        values
      );
      return results;
    }
  } catch (error) {
    console.log(error.message);
    throw new Error("Internal error");
  }
};
const insertSummary = async (id, summary) => {
  try {
    const [existingSummary] = await pool.query('SELECT * FROM summary_data WHERE meeting_id = ?', [id]);

    if (existingSummary.length > 0) {
      // If the meeting ID exists, update the notes field
      const [results] = await pool.execute(
        `UPDATE summary_data SET summary = ? WHERE meeting_id = ?`,
        [summary, id]
      );
      return results;
    }else{
    const mainId = generateUUID()
    const userId = id;
    const values = [mainId,userId, summary];
    const [results] = await pool.execute(
      `INSERT INTO summary_data (id,meeting_id,summary) VALUES (?,?,?)`,
      values
    );
    return results;
  }
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};
const getAllData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Retrieve user meetings for the specific user
    const [userMeetingsRows] = await pool.query('SELECT * FROM user_meetings WHERE user_id = ? ORDER BY uid DESC', [userId]);

   const result = userMeetingsRows.map((meetings)=>{
    return{
      id:meetings.id,
      meetingName:meetings.meeting_name,
      dateTime:meetings.dateTime
    }
   })
   return result;
  } catch (error) {

   throw new Error ("Internal server error");
  }
};
const getSingleData = async (req, id) => {
  try {
    const userId = req.user.id;

    // Retrieve the specific user meeting based on the provided id
    const [userMeetingRow] = await pool.query('SELECT * FROM user_meetings WHERE id = ? AND user_id = ?', [id, userId]);
    if (!userMeetingRow.length) {
      throw new Error("User meeting not found");
    }
    // Retrieve corresponding transcribe, summary, and notes data for the user meeting
    const [transcribeDataRows] = await pool.query('SELECT * FROM transcribe_data WHERE meeting_id = ? ORDER BY uid ASC', [id]);
    const [summaryDataRows] = await pool.query('SELECT * FROM summary_data WHERE meeting_id = ? ORDER BY uid ASC', [id]);
    const [notesDataRows] = await pool.query('SELECT * FROM notes_data WHERE meeting_id = ? ORDER BY uid ASC', [id]);

    // Replace \n characters with <br> tags in the notes data
    const formattedNotesDataRows = notesDataRows.map(row => {
      return {
        ...row,
        notes: JSON.parse(row.notes.replace(/\n/g, '<br>'))
      };
    });
    const formattedSummaryDataRows = summaryDataRows.map(row => {
      return {
        ...row,
        summary: JSON.parse(row.summary.replace(/\n/g, '<br>'))
      };
    });

    // Construct the result object
    const userData = {
      meetingName: userMeetingRow[0].meeting_name,
      transcribeData: transcribeDataRows,
      summaryData: formattedSummaryDataRows,
      notesData: formattedNotesDataRows
    };

    return userData;
  } catch (error) {
    console.error("Error retrieving data:", error);
    throw new Error(error.message);
  }
};
const updateMeetingName = async (meetingId, newMeetingName,req) => {
  try {
    const userId= req.user.id
    // Update the meeting name in the user_meetings table
    const [results] = await pool.execute(
      `UPDATE user_meetings SET meeting_name = ? WHERE id = ? AND user_id = ?`,
      [newMeetingName, meetingId,userId]
    );
    return results;
  } catch (error) {
    console.log(error.message);
    throw new Error("Internal server error");
  }
};
const deleteMeetingAndRelatedData = async (meetingId, userId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Delete data from transcribe_data table
    await pool.query('DELETE FROM transcribe_data WHERE meeting_id = ?', [meetingId]);

    // Delete data from summary_data table
    await pool.query('DELETE FROM summary_data WHERE meeting_id = ?', [meetingId]);

    // Delete data from notes_data table
    await pool.query('DELETE FROM notes_data WHERE meeting_id = ?', [meetingId]);

    // Delete meeting from user_meetings table
    const [meetingDeleteResult] = await pool.query('DELETE FROM user_meetings WHERE id = ? AND user_id = ?', [meetingId, userId]);

    // Commit the transaction if all deletions were successful
    await connection.commit();

    return meetingDeleteResult;
  } catch (error) {
    // Rollback the transaction if any error occurs
    await connection.rollback();
    console.error("Error deleting meeting and related data:", error);
    throw new Error("Internal server error");
  }
};
export const transcribeService = {
  insertTranscribe,
  insertNotes,
  insertSummary,
  getAllData,
  insertMeetings ,
  getSingleData,
  updateMeetingName,
  deleteMeetingAndRelatedData
};
