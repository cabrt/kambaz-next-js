export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label><br />
      <input id="wd-name" defaultValue="A1 - ENV + HTML" style={{ width: "100%" }} /><br /><br />
      
      <textarea id="wd-description" rows={10} cols={50} style={{ width: "100%" }}>
        The assignment is available online Submit a link to the landing page of your Web application.
      </textarea>
      <br /><br />
      
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td align="right" valign="top" style={{ width: "200px" }}>
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" defaultValue={100} />
            </td>
          </tr>
          
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-group">Assignment Group</label>
            </td>
            <td>
              <select id="wd-group" defaultValue="ASSIGNMENTS">
                <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                <option value="QUIZZES">QUIZZES</option>
                <option value="EXAMS">EXAMS</option>
                <option value="PROJECT">PROJECT</option>
              </select>
            </td>
          </tr>
          
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-display-grade-as">Display Grade as</label>
            </td>
            <td>
              <select id="wd-display-grade-as" defaultValue="Percentage">
                <option value="Percentage">Percentage</option>
                <option value="Points">Points</option>
                <option value="Letter Grade">Letter Grade</option>
                <option value="GPA Scale">GPA Scale</option>
              </select>
            </td>
          </tr>
          
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-submission-type">Submission Type</label>
            </td>
            <td>
              <select id="wd-submission-type" defaultValue="Online">
                <option value="Online">Online</option>
                <option value="Paper">Paper</option>
                <option value="External Tool">External Tool</option>
              </select>
            </td>
          </tr>
          
          <tr>
            <td></td>
            <td>
              <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                <strong>Online Entry Options</strong><br />
                
                <input type="checkbox" id="wd-text-entry" />
                <label htmlFor="wd-text-entry"> Text Entry</label><br />
                
                <input type="checkbox" id="wd-website-url" />
                <label htmlFor="wd-website-url"> Website URL</label><br />
                
                <input type="checkbox" id="wd-media-recordings" />
                <label htmlFor="wd-media-recordings"> Media Recordings</label><br />
                
                <input type="checkbox" id="wd-student-annotation" />
                <label htmlFor="wd-student-annotation"> Student Annotation</label><br />
                
                <input type="checkbox" id="wd-file-upload" />
                <label htmlFor="wd-file-upload"> File Uploads</label><br />
              </div>
            </td>
          </tr>
          
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-assign-to">Assign Assign to</label>
            </td>
            <td>
              <input id="wd-assign-to" defaultValue="Everyone" style={{ width: "200px" }} />
            </td>
          </tr>
          
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-due-date">Due</label>
            </td>
            <td>
              <input type="date" id="wd-due-date" defaultValue="2024-05-13" />
            </td>
          </tr>
          
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-available-from">Available from</label>
            </td>
            <td>
              <input type="date" id="wd-available-from" defaultValue="2024-05-06" />
            </td>
          </tr>
          
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-available-until">Until</label>
            </td>
            <td>
              <input type="date" id="wd-available-until" defaultValue="2024-05-20" />
            </td>
          </tr>
        </tbody>
      </table>
      
      <hr />
      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button>Cancel</button>
        <button style={{ marginLeft: "10px" }}>Save</button>
      </div>
    </div>
  );
}
