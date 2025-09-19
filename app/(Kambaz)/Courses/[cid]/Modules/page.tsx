export default function Modules() {
  return (
    <div>
      {/* Module Controls */}
      <div id="wd-modules-controls" style={{ marginBottom: "20px" }}>
        <button id="wd-collapse-all">Collapse All</button>
        <button id="wd-view-progress" style={{ marginLeft: "10px" }}>View Progress</button>
        <select id="wd-publish-all" style={{ marginLeft: "10px" }}>
          <option>Publish All</option>
          <option>Publish all modules and items</option>
          <option>Publish modules only</option>
          <option>Unpublish all modules and items</option>
        </select>
        <button id="wd-add-module" style={{ marginLeft: "10px" }}>+ Module</button>
      </div>
      <ul id="wd-modules">
        <li className="wd-module">
          <div className="wd-title">Week 1</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to the course</li>
                <li className="wd-content-item">Learn what is Web Development</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">READING</span>
              <ul className="wd-content">
                <li className="wd-content-item">blah blah</li>
                <li className="wd-content-item">blah blah</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">SLIDES</span>
              <ul className="wd-content">
                <li className="wd-content-item">blah blah</li>
                <li className="wd-content-item">blah blah</li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="wd-module">
          <div className="wd-title">Week 2</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">blah blah</li>
                <li className="wd-content-item">blah blah</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">READING</span>
              <ul className="wd-content">
                <li className="wd-content-item">blah blah</li>
                <li className="wd-content-item">blah blah</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">SLIDES</span>
              <ul className="wd-content">
                <li className="wd-content-item">blah blah</li>
                <li className="wd-content-item">blah blah</li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="wd-module">
          <div className="wd-title">Week 3</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">blah blah</li>
                <li className="wd-content-item">blah blah</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">READING</span>
              <ul className="wd-content">
                <li className="wd-content-item">blah blah</li>
                <li className="wd-content-item">blah blah</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">SLIDES</span>
              <ul className="wd-content">
                <li className="wd-content-item">blah blah</li>
                <li className="wd-content-item">blah blah</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
