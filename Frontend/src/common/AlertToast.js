import React from 'react';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";


const Alert = React.forwardRef(function Alert(props, ref) {
  // console.log("props", props);
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function AlertToast({
  hideAlert,
  showAlert,
  message,
  alertColor
}) {
// console.log("alertColor",alertColor)
  return (
    <div>
      <Snackbar
        style={{ height: "30%" }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={showAlert}
        autoHideDuration={6000}
        onClose={hideAlert}
      >
        <Alert
          onClose={hideAlert}
          severity={alertColor}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}
