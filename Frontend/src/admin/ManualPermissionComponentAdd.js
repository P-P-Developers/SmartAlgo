import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ManualPermissionComponentAdd = ({row}) => {

  console.log("row", row);
  // console.log("clientId", clientId);

  const [showOnManual, setShowOnManual] = useState("")
  const [showOnOptionChain, setShowOnOptionChain] = useState("")

  const [showManualPermission, setShowManualPermission] = useState(false);

  const handleCloseManualPermission = () => {setShowManualPermission(false)}
  const handleShowManualPermission = () => {setShowManualPermission(true)}

  // console.log("showOnManual", showOnManual);
  // console.log("showOnOptionChain", showOnOptionChain);

  return (
    <>
      <i
        className="fa-brands fa-pagelines"
        variant="primary"
        data-toggle="tooltip"
        data-placement="top"
        title="Edit Client"
        style={{ fontSize: '24px' }}
        onClick={handleShowManualPermission}
      ></i>

      <Modal show={showManualPermission} onHide={handleCloseManualPermission}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseManualPermission}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseManualPermission}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ManualPermissionComponentAdd

{/* <div>
        <label>Manual Execution</label><br />

        <input
          type="checkbox"
          name="makecall"
          onChange={(e) => { setShowOnManual(e.target.checked) }}
        />
        <label>Make Call</label><br />

        {(showOnManual == "" || showOnManual == false) ? "" :
          <div>
            <label for="cars">Segment</label>
            <select name="cars" id="cars" form="carform">
              <option value="">No Selected</option>
              <option value="volvo">C</option>
              <option value="saab">F</option>
              <option value="opel">O</option>
              <option value="audi">M</option>
            </select>
          </div>}

        <input
          type="checkbox"
          name="optionchain"
          onChange={(e) => { setShowOnOptionChain(e.target.checked) }}
        />
        <label>Option Chain</label><br />

        {(showOnOptionChain == "" || showOnOptionChain == false) ? "" :
          <div>
            <input
              type="checkbox"
              name="vehicle3"
            />
            <label>Stocks</label><br />

            <input
              type="checkbox"
              name="vehicle3"
            />
            <label>Index</label><br />
          </div>}

      </div> */}