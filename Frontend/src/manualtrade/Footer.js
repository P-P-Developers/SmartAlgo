import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { NavLink } from 'react-router-dom';
import * as Config from '../common/Config';

function Footer() {

  return (
    <div className="manual-footer">
      <p className="text-dark">Copyright © 2021-2023 Smart Algo .All Rights Reserved.™</p>
    </div>
  );
}

export default Footer;